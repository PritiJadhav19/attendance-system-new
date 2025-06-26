
import React, { useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { BookOpen, Users, AlertTriangle } from "lucide-react";
import { useUser } from "@/contexts/UserContext";

// Helper: returns date strings for the last N days (YYYY-MM-DD)
const getLastNDates = (n: number) => {
  const dates = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dates.push(d.toISOString().slice(0, 10));
  }
  return dates;
};

const Dashboard = () => {
  const { user, students, classes, subjects } = useUser();

  // Find classes assigned to this teacher (by facultyEmail/teacherEmail)
  const myClasses = useMemo(() => {
    // Handles 'facultyEmail' for theory and 'teacherEmail' for practicals
    const myClassIds = new Set<string>();
    subjects.forEach((sub: any) => {
      if (
        (sub.facultyEmail && sub.facultyEmail === user?.email) ||
        (sub.teacherEmail && sub.teacherEmail === user?.email)
      ) {
        myClassIds.add(sub.classId);
      }
    });
    // Filter only classes assigned to this teacher
    return classes.filter((cls) => myClassIds.has(cls.id));
  }, [user, subjects, classes]);

  // All students in teacher's classes
  const myStudents = useMemo(
    () =>
      students.filter((s) => myClasses.some((cls) => cls.id === s.classId)),
    [students, myClasses]
  );

  // All unique subjects assigned to this teacher (across their classes)
  const mySubjects = useMemo(() => {
    const subs = subjects.filter(
      (sub: any) =>
        (sub.facultyEmail && sub.facultyEmail === user?.email) ||
        (sub.teacherEmail && sub.teacherEmail === user?.email)
    );
    // Deduplicate by id
    const map = new Map();
    subs.forEach((s: any) => map.set(s.id, s));
    return Array.from(map.values());
  }, [subjects, user]);

  // Low attendance (<75%) among my students
  const lowAttendanceCount = myStudents.filter((s: any) => s.attendance < 75).length;

  // ------------ Attendance Analytics (Local/Memory Only) --------------
  // Use window.attendanceStore if available (mimics mark attendance page logic)
  const attendanceStore =
    typeof window !== "undefined" && (window as any).attendanceStore
      ? (window as any).attendanceStore
      : {};

  // Get attendance of my students from attendanceStore
  const studentAttendanceRecords = useMemo(() => {
    const map: { [studentId: string]: any[] } = {};
    myStudents.forEach((student) => {
      map[student.id] = (attendanceStore[student.id] || []) as any[];
    });
    return map;
  }, [myStudents, attendanceStore]);

  // Build last 7 days attendance graph (Bar: per day present/absent counts)
  const last7Dates = getLastNDates(7);
  const barAttendanceData = useMemo(() => {
    return last7Dates.map((dateStr) => {
      let present = 0,
        absent = 0;
      myStudents.forEach((student) => {
        const recForDay = (studentAttendanceRecords[student.id] || []).find(
          (rec) => rec.date === dateStr
        );
        // If record exists, use .present, otherwise skip (no data)
        if (recForDay) {
          if (recForDay.present === true) present++;
          else absent++;
        }
      });
      return { date: dateStr, Present: present, Absent: absent };
    });
  }, [myStudents, studentAttendanceRecords, last7Dates]);

  // Build pie chart data: total present/absent records in last 30 days (or all)
  const pieAttendanceData = useMemo(() => {
    let totalPresent = 0,
      totalAbsent = 0;
    myStudents.forEach((student) => {
      (studentAttendanceRecords[student.id] || []).forEach((rec) => {
        if (rec.present === true) totalPresent++;
        else if (rec.present === false) totalAbsent++;
      });
    });
    return [
      { name: "Present", value: totalPresent },
      { name: "Absent", value: totalAbsent },
    ];
  }, [myStudents, studentAttendanceRecords]);

  const COLORS = ["#0ea5e9", "#f87171"];

  // CARD DATA
  const statCards = [
    {
      title: "Total Students",
      value: myStudents.length.toString(),
      description: "Assigned to your classes",
      icon: Users,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      title: "Total Subjects",
      value: mySubjects.length.toString(),
      description: "You are assigned to",
      icon: BookOpen,
      color: "text-orange-500",
      bgColor: "bg-orange-50",
    },
    {
      title: "Low Attendance",
      value: lowAttendanceCount.toString(),
      description: "Below 75% (your classes)",
      icon: AlertTriangle,
      color: "text-red-500",
      bgColor: "bg-red-50",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Overview of your class attendance statistics and key metrics
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {statCards.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between space-y-0">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-full ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Attendance Bar Chart (last 7 days, only this teacher's classes) */}
        <Card>
          <CardHeader>
            <CardTitle>Last 7 Days Attendance</CardTitle>
            <CardDescription>
              Daily present/absent count (your students only)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={barAttendanceData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 30 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" angle={-45} textAnchor="end" height={70} />
                  <YAxis allowDecimals={false} />
                  <Tooltip formatter={(value) => [value, ""]} />
                  <Bar dataKey="Present" fill={COLORS[0]} />
                  <Bar dataKey="Absent" fill={COLORS[1]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Pie chart */}
        <Card>
          <CardHeader>
            <CardTitle>Overall Attendance</CardTitle>
            <CardDescription>
              Aggregate attendance across your students
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieAttendanceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={120}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {pieAttendanceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [value, ""]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
