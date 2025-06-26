import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar } from "@/components/ui/calendar";
import {
  CalendarIcon,
  Check,
  Clock,
  Download,
  Save,
  X,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import AttendanceView from "@/components/attendance/AttendanceView";

// Mock data for courses
const courses = [
  { id: "CS101", name: "Introduction to Programming", department: "Computer Science" },
  { id: "CS201", name: "Data Structures", department: "Computer Science" },
  { id: "EE101", name: "Basic Electrical Engineering", department: "Electrical" },
  { id: "ME101", name: "Engineering Mechanics", department: "Mechanical" },
  { id: "CE101", name: "Structural Analysis", department: "Civil" },
];

// Mock data for students in a class
const students = [
  {
    id: "S001",
    name: "Alex Johnson",
    regNo: "2021CS001",
    attendance: [
      { date: "2023-11-01", status: "present" },
      { date: "2023-11-03", status: "absent" },
      { date: "2023-11-05", status: "present" },
      { date: "2023-11-07", status: "present" },
    ],
  },
  {
    id: "S002",
    name: "Sarah Williams",
    regNo: "2022EE042",
    attendance: [
      { date: "2023-11-01", status: "present" },
      { date: "2023-11-03", status: "present" },
      { date: "2023-11-05", status: "absent" },
      { date: "2023-11-07", status: "present" },
    ],
  },
  {
    id: "S003",
    name: "Michael Brown",
    regNo: "2020ME105",
    attendance: [
      { date: "2023-11-01", status: "absent" },
      { date: "2023-11-03", status: "present" },
      { date: "2023-11-05", status: "present" },
      { date: "2023-11-07", status: "present" },
    ],
  },
  {
    id: "S004",
    name: "Emma Davis",
    regNo: "2023CE063",
    attendance: [
      { date: "2023-11-01", status: "present" },
      { date: "2023-11-03", status: "present" },
      { date: "2023-11-05", status: "present" },
      { date: "2023-11-07", status: "absent" },
    ],
  },
  {
    id: "S005",
    name: "James Wilson",
    regNo: "2021CH027",
    attendance: [
      { date: "2023-11-01", status: "present" },
      { date: "2023-11-03", status: "absent" },
      { date: "2023-11-05", status: "absent" },
      { date: "2023-11-07", status: "present" },
    ],
  },
];

// Recent attendance sessions
const recentSessions = [
  { id: "S1", course: "CS101", date: "2023-11-07", time: "10:00 AM", presentCount: 42, totalCount: 45 },
  { id: "S2", course: "EE101", date: "2023-11-07", time: "02:00 PM", presentCount: 38, totalCount: 40 },
  { id: "S3", course: "ME101", date: "2023-11-06", time: "11:00 AM", presentCount: 35, totalCount: 38 },
  { id: "S4", course: "CS201", date: "2023-11-06", time: "09:00 AM", presentCount: 28, totalCount: 30 },
];

const Attendance = () => {
  const [selectedCourse, setSelectedCourse] = useState("");
  const [date, setDate] = useState<Date>(new Date());
  const [attendanceData, setAttendanceData] = useState<{ [key: string]: boolean }>({});
  const { toast } = useToast();

  const handleAttendanceChange = (studentId: string, isPresent: boolean) => {
    setAttendanceData({
      ...attendanceData,
      [studentId]: isPresent,
    });
  };

  const handleSaveAttendance = () => {
    toast({
      title: "Attendance Saved",
      description: `Attendance for ${
        courses.find((c) => c.id === selectedCourse)?.name || "selected course"
      } on ${format(date, "PPP")} has been saved successfully.`,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Attendance</h2>
        <p className="text-muted-foreground">
          Manage and record student attendance
        </p>
      </div>

      <Tabs defaultValue="mark">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="mark">Mark Attendance</TabsTrigger>
          <TabsTrigger value="view">View Attendance</TabsTrigger>
          <TabsTrigger value="history">Attendance History</TabsTrigger>
        </TabsList>

        <TabsContent value="mark">
          <Card>
            <CardHeader>
              <CardTitle>Mark Attendance</CardTitle>
              <CardDescription>
                Record attendance for a class session
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col gap-6 md:flex-row md:items-end">
                <div className="w-full md:w-1/3">
                  <label className="text-sm font-medium">Course</label>
                  <Select
                    value={selectedCourse}
                    onValueChange={setSelectedCourse}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select course" />
                    </SelectTrigger>
                    <SelectContent>
                      {courses.map((course) => (
                        <SelectItem key={course.id} value={course.id}>
                          {course.id} - {course.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-full md:w-1/3">
                  <label className="text-sm font-medium">Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(date) => date && setDate(date)}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="w-full md:w-1/3">
                  <Button className="w-full" onClick={handleSaveAttendance}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Attendance
                  </Button>
                </div>
              </div>

              {selectedCourse && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>
                      {courses.find((c) => c.id === selectedCourse)?.name}
                    </CardTitle>
                    <CardDescription>
                      {format(date, "EEEE, MMMM do, yyyy")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[50px]">ID</TableHead>
                          <TableHead>Student</TableHead>
                          <TableHead>Registration No.</TableHead>
                          <TableHead className="text-center">Present</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {students.map((student) => (
                          <TableRow key={student.id}>
                            <TableCell className="font-medium">
                              {student.id}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar>
                                  <AvatarImage src="/placeholder.svg" />
                                  <AvatarFallback>
                                    {student.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <div>{student.name}</div>
                              </div>
                            </TableCell>
                            <TableCell>{student.regNo}</TableCell>
                            <TableCell className="text-center">
                              <Switch
                                checked={attendanceData[student.id] ?? true}
                                onCheckedChange={(checked) =>
                                  handleAttendanceChange(student.id, checked)
                                }
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="view">
          <AttendanceView />
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Attendance Sessions</CardTitle>
                  <CardDescription>
                    View and manage recent attendance records
                  </CardDescription>
                </div>
                <Button variant="outline" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Course</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Attendance</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentSessions.map((session) => (
                    <TableRow key={session.id}>
                      <TableCell className="font-medium">
                        {courses.find((c) => c.id === session.course)?.name || session.course}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span>{session.date}</span>
                          <span className="text-sm text-muted-foreground flex items-center">
                            <Clock className="mr-1 h-3 w-3" />
                            {session.time}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <span className="font-medium text-green-600">
                            {session.presentCount}
                          </span>
                          <span className="mx-1">/</span>
                          <span>{session.totalCount}</span>
                          <span className="ml-2 text-sm text-muted-foreground">
                            ({Math.round((session.presentCount / session.totalCount) * 100)}%)
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Attendance;
