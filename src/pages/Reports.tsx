
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  LineChart,
  Line,
  Legend,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Download, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUser } from "@/contexts/UserContext";

const Reports = () => {
  const [department, setDepartment] = useState<string>("all");
  const [period, setPeriod] = useState<string>("semester");
  const { students, classes } = useUser();

  const COLORS = ["#0ea5e9", "#f87171"];

  // Calculate attendance statistics from real data
  const calculateDepartmentalData = () => {
    const departments = ["Computer Science", "Electrical", "Mechanical", "Civil", "Chemical"];
    return departments.map(dept => {
      const deptStudents = students.filter(s => {
        const studentClass = classes.find(c => c.id === s.classId);
        return studentClass?.department === dept;
      });
      
      if (deptStudents.length === 0) {
        return { name: dept, present: 0, absent: 0 };
      }
      
      const avgAttendance = deptStudents.reduce((sum, s) => sum + s.attendance, 0) / deptStudents.length;
      return {
        name: dept,
        present: Math.round(avgAttendance),
        absent: Math.round(100 - avgAttendance)
      };
    });
  };

  // Calculate overall attendance for pie chart
  const calculateOverallAttendance = () => {
    if (students.length === 0) {
      return [
        { name: "Present", value: 0 },
        { name: "Absent", value: 0 }
      ];
    }
    
    const avgAttendance = students.reduce((sum, s) => sum + s.attendance, 0) / students.length;
    return [
      { name: "Present", value: Math.round(avgAttendance) },
      { name: "Absent", value: Math.round(100 - avgAttendance) }
    ];
  };

  // Find students with low attendance
  const getLowAttendanceStudents = () => {
    return students
      .filter(student => student.attendance < 75)
      .sort((a, b) => a.attendance - b.attendance)
      .slice(0, 5)
      .map(student => {
        const studentClass = classes.find(c => c.id === student.classId);
        const status = student.attendance < 60 ? "Counseling Required" : 
                       student.attendance < 70 ? "Parent Notified" : "Warning Issued";
        return {
          id: student.id,
          name: student.name,
          regNo: student.regNo,
          department: studentClass?.department || "Unknown",
          attendance: student.attendance,
          status
        };
      });
  };

  // Generate trend data (mock data since we don't have historical data)
  const generateTrendData = () => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    // For empty data, return 0 attendance for all months
    if (students.length === 0) {
      return months.map(month => ({ month, attendance: 0 }));
    }
    
    // Calculate current average attendance
    const currentAvg = students.reduce((sum, s) => sum + s.attendance, 0) / students.length;
    // Use current average to simulate a trend
    return months.map((month, i) => {
      // Create a simulated trend based on current average
      const baseValue = Math.max(50, Math.min(95, currentAvg));
      // Add some variation to create a trend
      const trend = Math.sin((i / 11) * Math.PI) * 10;
      return {
        month,
        attendance: Math.round(baseValue + trend)
      };
    });
  };

  // Generate course attendance data
  const generateCourseData = () => {
    const courseNames = [
      { id: "CS101", name: "Introduction to Programming", department: "Computer Science" },
      { id: "EE101", name: "Basic Electrical Engineering", department: "Electrical" },
      { id: "ME101", name: "Engineering Mechanics", department: "Mechanical" },
      { id: "CE101", name: "Structural Analysis", department: "Civil" },
      { id: "CH101", name: "Chemical Principles", department: "Chemical" }
    ];
    
    return courseNames.map(course => {
      // Find students from this department
      const deptStudents = students.filter(s => {
        const studentClass = classes.find(c => c.id === s.classId);
        return studentClass?.department === course.department;
      });
      
      // Calculate average attendance or use 0 if no students
      const avgAttendance = deptStudents.length > 0 
        ? Math.round(deptStudents.reduce((sum, s) => sum + s.attendance, 0) / deptStudents.length)
        : 0;
        
      return {
        ...course,
        attendance: avgAttendance
      };
    });
  };

  const departmentalData = calculateDepartmentalData();
  const pieData = calculateOverallAttendance();
  const trendData = generateTrendData();
  const lowAttendanceStudents = getLowAttendanceStudents();
  const courseAttendance = generateCourseData();

  const getAttendanceClass = (percentage: number) => {
    if (percentage >= 85) return "bg-green-100 text-green-800";
    if (percentage >= 75) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Reports</h2>
        <p className="text-muted-foreground">
          Attendance analytics and detailed reports
        </p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-end gap-4">
        <div className="w-full sm:w-auto">
          <label className="text-sm font-medium">Department</label>
          <Select defaultValue="all" onValueChange={setDepartment}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Select department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              <SelectItem value="cs">Computer Science</SelectItem>
              <SelectItem value="ee">Electrical</SelectItem>
              <SelectItem value="me">Mechanical</SelectItem>
              <SelectItem value="ce">Civil</SelectItem>
              <SelectItem value="ch">Chemical</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="w-full sm:w-auto">
          <label className="text-sm font-medium">Time Period</label>
          <Select defaultValue="semester" onValueChange={setPeriod}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Last Week</SelectItem>
              <SelectItem value="month">Last Month</SelectItem>
              <SelectItem value="semester">Current Semester</SelectItem>
              <SelectItem value="year">Academic Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button variant="outline" className="gap-2 mt-4 sm:mt-0">
          <Download className="h-4 w-4" />
          Export Reports
        </Button>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="departmental">Departmental</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="at-risk">At-Risk Students</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Overall Attendance</CardTitle>
                <CardDescription>Average attendance across all departments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={120}
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value}%`, ""]} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Course-wise Attendance</CardTitle>
                <CardDescription>Attendance percentage by course</CardDescription>
              </CardHeader>
              <CardContent>
                {courseAttendance.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Course</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead className="text-right">Attendance</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {courseAttendance.map((course) => (
                        <TableRow key={course.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{course.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {course.id}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{course.department}</TableCell>
                          <TableCell className="text-right">
                            <Badge
                              variant="outline"
                              className={cn(getAttendanceClass(course.attendance))}
                            >
                              {course.attendance}%
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="p-8 text-center text-muted-foreground">
                    No course data available
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="departmental">
          <Card>
            <CardHeader>
              <CardTitle>Departmental Attendance Analysis</CardTitle>
              <CardDescription>
                Breakdown of attendance by department
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={departmentalData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis unit="%" />
                    <Tooltip formatter={(value) => [`${value}%`, ""]} />
                    <Legend />
                    <Bar
                      dataKey="present"
                      name="Present"
                      fill="#0ea5e9"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="absent"
                      name="Absent"
                      fill="#f87171"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Trends</CardTitle>
              <CardDescription>
                Monthly trends in attendance percentage
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={trendData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" />
                    <YAxis unit="%" domain={[50, 100]} />
                    <Tooltip formatter={(value) => [`${value}%`, "Attendance"]} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="attendance"
                      stroke="#0ea5e9"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="at-risk">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Students at Risk</CardTitle>
                  <CardDescription>
                    Students with attendance below 75%
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" className="gap-2">
                  <FileText className="h-4 w-4" />
                  Generate Report
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {lowAttendanceStudents.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Registration No.</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Attendance</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {lowAttendanceStudents.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">{student.name}</TableCell>
                        <TableCell>{student.regNo}</TableCell>
                        <TableCell>{student.department}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={cn(getAttendanceClass(student.attendance))}
                          >
                            {student.attendance}%
                          </Badge>
                        </TableCell>
                        <TableCell>{student.status}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="p-8 text-center text-muted-foreground">
                  No students with low attendance found
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;
