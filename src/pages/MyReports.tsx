
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { DownloadCloud, Filter } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const MyReports = () => {
  // Mock data for reports
  const courseAttendanceData = [
    { name: "Week 1", present: 92, absent: 8 },
    { name: "Week 2", present: 88, absent: 12 },
    { name: "Week 3", present: 85, absent: 15 },
    { name: "Week 4", present: 90, absent: 10 },
    { name: "Week 5", present: 82, absent: 18 },
    { name: "Week 6", present: 78, absent: 22 },
    { name: "Week 7", present: 85, absent: 15 },
    { name: "Week 8", present: 88, absent: 12 },
  ];

  const courseTrendData = [
    { name: "Jan", "CS101": 88, "CS201": 91, "CS301": 84 },
    { name: "Feb", "CS101": 85, "CS201": 88, "CS301": 82 },
    { name: "Mar", "CS101": 90, "CS201": 85, "CS301": 88 },
    { name: "Apr", "CS101": 87, "CS201": 90, "CS301": 86 },
    { name: "May", "CS101": 91, "CS201": 92, "CS301": 90 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">My Reports</h2>
          <p className="text-muted-foreground">
            View attendance statistics for your courses
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue="current">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current">Current Semester</SelectItem>
              <SelectItem value="last">Last Semester</SelectItem>
              <SelectItem value="year">Academic Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <DownloadCloud className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="course">Course-wise</TabsTrigger>
          <TabsTrigger value="student">Student-wise</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">42</div>
                <p className="text-xs text-muted-foreground">
                  in current semester
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Average Attendance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">87%</div>
                <p className="text-xs text-muted-foreground">
                  across all courses
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Students at Risk</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-amber-600">12</div>
                <p className="text-xs text-muted-foreground">
                  below 75% attendance
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">3</div>
                <p className="text-xs text-muted-foreground">
                  attendance to be marked
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Attendance Trends</CardTitle>
              <CardDescription>
                Weekly attendance across all courses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={courseTrendData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 30 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis unit="%" />
                    <Tooltip formatter={(value) => [`${value}%`, ""]} />
                    <Line dataKey="CS101" stroke="#0ea5e9" name="CS101" />
                    <Line dataKey="CS201" stroke="#8b5cf6" name="CS201" />
                    <Line dataKey="CS301" stroke="#22c55e" name="CS301" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="course" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>CS101: Introduction to Programming</CardTitle>
              <CardDescription>
                Attendance statistics for current semester
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={courseAttendanceData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 30 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis unit="%" />
                    <Tooltip formatter={(value) => [`${value}%`, ""]} />
                    <Bar dataKey="present" fill="#0ea5e9" name="Present" />
                    <Bar dataKey="absent" fill="#f87171" name="Absent" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="student" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Student Attendance</CardTitle>
              <CardDescription>
                View attendance reports by student
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-6 text-muted-foreground">
                Select a course to view student-wise attendance reports.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MyReports;
