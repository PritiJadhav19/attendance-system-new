import React, { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  Users, 
  BookOpen, 
  Clock, 
  TrendingDown, 
  AlertTriangle, 
  Filter, 
  Search, 
  CheckCircle,
  BarChart3,
  PieChart,
  Activity,
  User,
  Download,
  Eye
} from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const AttendanceView = () => {
  const { 
    user, 
    students, 
    subjects, 
    practicals, 
    classes,
    getClassesForDepartment
  } = useUser();

  // Mock attendance data - replace with actual data from context when available
  const attendanceRecords: any[] = [];

  const [selectedClass, setSelectedClass] = useState<string>("");
  const [selectedDivision, setSelectedDivision] = useState<string>("");
  const [selectedStudent, setSelectedStudent] = useState<string>("");
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [dateRange, setDateRange] = useState<string>("month");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [viewMode, setViewMode] = useState<string>("overview");

  // Get unique classes for dropdown
  const departmentClasses = getClassesForDepartment();
  const uniqueClasses = Array.from(
    new Map(departmentClasses.map(cls => [cls.name, cls])).values()
  );

  // Get divisions for selected class
  const classDivisions = selectedClass ? 
    Array.from(new Set(
      departmentClasses
        .filter(c => c.name === classes.find(cls => cls.id === selectedClass)?.name)
        .flatMap(c => c.divisions?.map(div => ({ id: div.id, name: div.name, classId: c.id })) || [])
    )) : [];

  // Get students for selected class and division
  const filteredStudents = useMemo(() => {
    if (!selectedClass || !selectedDivision) return [];
    
    const selectedClassName = classes.find(c => c.id === selectedClass)?.name;
    return students.filter(s => {
      const studentClass = classes.find(c => c.id === s.classId);
      const matchesClass = studentClass?.name === selectedClassName && s.divisionId === selectedDivision;
      const matchesSearch = searchTerm === "" || s.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesClass && matchesSearch;
    });
  }, [selectedClass, selectedDivision, students, classes, searchTerm]);

  // Helper functions
  const getSubjectName = (subjectId: string, subjectType: string) => {
    if (subjectType === "practical") {
      const practical = practicals.find(p => p.id === subjectId);
      return practical ? practical.name : "Unknown Practical";
    } else {
      const subject = subjects.find(s => s.id === subjectId);
      return subject ? subject.name : "Unknown Subject";
    }
  };

  // Mock student attendance data for demonstration
  const getStudentAttendanceStats = (studentId: string) => {
    // Mock data - replace with actual calculation
    const totalSessions = Math.floor(Math.random() * 50) + 20;
    const presentSessions = Math.floor(totalSessions * (0.6 + Math.random() * 0.35));
    const absentSessions = totalSessions - presentSessions;
    const percentage = Math.round((presentSessions / totalSessions) * 100);

    return {
      totalSessions,
      presentSessions,
      absentSessions,
      percentage,
      weeklyAttendance: [85, 90, 75, 80, 95],
      monthlyTrend: [78, 82, 85, 88, 92]
    };
  };

  // Get subject-wise breakdown for a student
  const getSubjectWiseAttendance = (studentId: string) => {
    // Mock data for demonstration
    const subjectData = [
      { name: "Mathematics", type: "subject", total: 15, present: 12, percentage: 80 },
      { name: "Physics", type: "subject", total: 12, present: 10, percentage: 83 },
      { name: "Chemistry", type: "subject", total: 10, present: 8, percentage: 80 },
      { name: "Physics Lab", type: "practical", total: 8, present: 7, percentage: 88 },
      { name: "Chemistry Lab", type: "practical", total: 6, present: 5, percentage: 83 }
    ];
    return subjectData;
  };

  // Get class overview statistics
  const getClassOverview = () => {
    if (!selectedClass || !selectedDivision) return null;

    const classStudents = filteredStudents;
    const totalStudents = classStudents.length;
    
    if (totalStudents === 0) return null;

    // Mock calculations
    const averageAttendance = 85;
    const studentsWithLowAttendance = Math.floor(totalStudents * 0.15);
    const studentsWithGoodAttendance = totalStudents - studentsWithLowAttendance;

    return {
      totalStudents,
      averageAttendance,
      studentsWithLowAttendance,
      studentsWithGoodAttendance,
      todayPresent: Math.floor(totalStudents * 0.9),
      thisWeekAverage: 87,
      thisMonthAverage: 85
    };
  };

  const classOverview = getClassOverview();

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Attendance Analytics</h1>
          <p className="text-gray-600 mt-1">Comprehensive attendance tracking and student performance analysis</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-lg">
          <BarChart3 className="h-4 w-4" />
          <span>Faculty Dashboard</span>
        </div>
      </div>

      {/* Filters */}
      <Card className="shadow-sm border-gray-200">
        <CardHeader className="bg-gray-50 border-b border-gray-200">
          <CardTitle className="flex items-center gap-2 text-gray-800">
            <Filter className="h-5 w-5 text-blue-600" />
            Filters & Selection
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Class</Label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  {uniqueClasses.map((classItem) => (
                    <SelectItem key={classItem.id} value={classItem.id}>
                      {classItem.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Division</Label>
              <Select 
                value={selectedDivision} 
                onValueChange={setSelectedDivision}
                disabled={!selectedClass}
              >
                <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                  <SelectValue placeholder="Select division" />
                </SelectTrigger>
                <SelectContent>
                  {classDivisions.map((division) => (
                    <SelectItem key={division.id} value={division.id}>
                      {division.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Subject (Optional)</Label>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                  <SelectValue placeholder="All subjects" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-subjects">All Subjects</SelectItem>
                  {subjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.name}
                    </SelectItem>
                  ))}
                  {practicals.map((practical) => (
                    <SelectItem key={practical.id} value={practical.id}>
                      {practical.name} (Practical)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Time Period</Label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Last Week</SelectItem>
                  <SelectItem value="month">Last Month</SelectItem>
                  <SelectItem value="semester">This Semester</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Search Student</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedClass && selectedDivision && (
        <>
          {/* Class Overview Cards */}
          {classOverview && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-700">Total Students</p>
                      <p className="text-3xl font-bold text-blue-900">{classOverview.totalStudents}</p>
                      <p className="text-xs text-blue-600 mt-1">Active in class</p>
                    </div>
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-700">Average Attendance</p>
                      <p className="text-3xl font-bold text-green-900">{classOverview.averageAttendance}%</p>
                      <p className="text-xs text-green-600 mt-1">Class performance</p>
                    </div>
                    <Activity className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-emerald-50 to-emerald-100 border-emerald-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-emerald-700">Good Attendance</p>
                      <p className="text-3xl font-bold text-emerald-900">{classOverview.studentsWithGoodAttendance}</p>
                      <p className="text-xs text-emerald-600 mt-1">≥75% attendance</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-emerald-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-red-50 to-red-100 border-red-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-red-700">Low Attendance</p>
                      <p className="text-3xl font-bold text-red-900">{classOverview.studentsWithLowAttendance}</p>
                      <p className="text-xs text-red-600 mt-1">&lt;75% attendance</p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-red-600" />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <Tabs value={viewMode} onValueChange={setViewMode} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-gray-100">
              <TabsTrigger value="overview" className="data-[state=active]:bg-white">Class Overview</TabsTrigger>
              <TabsTrigger value="students" className="data-[state=active]:bg-white">Student List</TabsTrigger>
              <TabsTrigger value="individual" className="data-[state=active]:bg-white">Individual Analysis</TabsTrigger>
              <TabsTrigger value="alerts" className="data-[state=active]:bg-white">Alerts & Reports</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PieChart className="h-5 w-5 text-blue-600" />
                      Attendance Distribution
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Excellent (90-100%)</span>
                        <span className="text-sm text-gray-600">{Math.floor(filteredStudents.length * 0.3)} students</span>
                      </div>
                      <Progress value={30} className="h-2" />
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Good (75-89%)</span>
                        <span className="text-sm text-gray-600">{Math.floor(filteredStudents.length * 0.45)} students</span>
                      </div>
                      <Progress value={45} className="h-2" />
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Average (60-74%)</span>
                        <span className="text-sm text-gray-600">{Math.floor(filteredStudents.length * 0.15)} students</span>
                      </div>
                      <Progress value={15} className="h-2" />
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Poor (&lt;60%)</span>
                        <span className="text-sm text-gray-600">{Math.floor(filteredStudents.length * 0.1)} students</span>
                      </div>
                      <Progress value={10} className="h-2" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-blue-600" />
                      Weekly Trends
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day, index) => {
                        const attendance = [88, 92, 85, 90, 87][index];
                        return (
                          <div key={day} className="flex items-center justify-between">
                            <span className="text-sm font-medium w-20">{day}</span>
                            <div className="flex-1 mx-4">
                              <Progress value={attendance} className="h-2" />
                            </div>
                            <span className="text-sm text-gray-600 w-12 text-right">{attendance}%</span>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="students" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Student Attendance Summary</CardTitle>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                  <CardDescription>
                    Overview of all students' attendance for the selected period
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student</TableHead>
                        <TableHead>Roll No.</TableHead>
                        <TableHead className="text-center">Sessions</TableHead>
                        <TableHead className="text-center">Attendance</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredStudents.map((student) => {
                        const stats = getStudentAttendanceStats(student.id);
                        const badgeVariant = stats.percentage >= 75 ? "default" : "destructive";
                        
                        return (
                          <TableRow key={student.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar>
                                  <AvatarImage src="/placeholder.svg" />
                                  <AvatarFallback>
                                    {student.name.split(" ").map(n => n[0]).join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">{student.name}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{student.rollNumber || student.regNo}</TableCell>
                            <TableCell className="text-center">
                              {stats.presentSessions}/{stats.totalSessions}
                            </TableCell>
                            <TableCell className="text-center">
                              <div className="flex items-center gap-2 justify-center">
                                <Progress value={stats.percentage} className="w-16 h-2" />
                                <Badge variant={badgeVariant}>
                                  {stats.percentage}%
                                </Badge>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => setSelectedStudent(student.id)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="individual" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5 text-blue-600" />
                      Select Student
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                      <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                        <SelectValue placeholder="Choose a student" />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredStudents.map((student) => (
                          <SelectItem key={student.id} value={student.id}>
                            {student.name} ({student.rollNumber || student.regNo})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </CardContent>
                </Card>

                {selectedStudent && (
                  <div className="lg:col-span-2 space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>
                          {filteredStudents.find(s => s.id === selectedStudent)?.name} - Detailed Analysis
                        </CardTitle>
                        <CardDescription>
                          Comprehensive attendance breakdown and performance metrics
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {(() => {
                          const stats = getStudentAttendanceStats(selectedStudent);
                          const subjectStats = getSubjectWiseAttendance(selectedStudent);
                          
                          return (
                            <div className="space-y-6">
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                                  <p className="text-2xl font-bold text-blue-600">{stats.totalSessions}</p>
                                  <p className="text-sm text-blue-700">Total Sessions</p>
                                </div>
                                <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                                  <p className="text-2xl font-bold text-green-600">{stats.presentSessions}</p>
                                  <p className="text-sm text-green-700">Present</p>
                                </div>
                                <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
                                  <p className="text-2xl font-bold text-red-600">{stats.absentSessions}</p>
                                  <p className="text-sm text-red-700">Absent</p>
                                </div>
                                <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                                  <p className="text-2xl font-bold text-gray-900">{stats.percentage}%</p>
                                  <p className="text-sm text-gray-700">Attendance</p>
                                </div>
                              </div>

                              <div>
                                <h4 className="font-medium mb-4 text-gray-900">Subject-wise Breakdown</h4>
                                <div className="space-y-3">
                                  {subjectStats.map((subject, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-gray-50">
                                      <div>
                                        <p className="font-medium text-gray-900">{subject.name}</p>
                                        <p className="text-sm text-gray-600 capitalize">{subject.type}</p>
                                      </div>
                                      <div className="flex items-center gap-4">
                                        <span className="text-sm text-gray-700">{subject.present}/{subject.total}</span>
                                        <div className="w-20">
                                          <Progress value={subject.percentage} className="h-2" />
                                        </div>
                                        <Badge variant={subject.percentage >= 75 ? "default" : "destructive"}>
                                          {subject.percentage}%
                                        </Badge>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              <div>
                                <h4 className="font-medium mb-4 text-gray-900">Weekly Performance Trend</h4>
                                <div className="space-y-2">
                                  {['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'].map((week, index) => {
                                    const attendance = stats.weeklyAttendance[index];
                                    return (
                                      <div key={week} className="flex items-center justify-between">
                                        <span className="text-sm font-medium w-16">{week}</span>
                                        <div className="flex-1 mx-4">
                                          <Progress value={attendance} className="h-2" />
                                        </div>
                                        <span className="text-sm text-gray-600 w-12 text-right">{attendance}%</span>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                          );
                        })()}
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="alerts" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    Attendance Alerts & Critical Reports
                  </CardTitle>
                  <CardDescription>
                    Students requiring immediate attention due to low attendance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredStudents
                      .map(student => ({
                        student,
                        stats: getStudentAttendanceStats(student.id)
                      }))
                      .filter(({ stats }) => stats.percentage < 75)
                      .sort((a, b) => a.stats.percentage - b.stats.percentage)
                      .map(({ student, stats }) => (
                        <div key={student.id} className="flex items-center justify-between p-4 border border-red-200 bg-red-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <AlertTriangle className="h-5 w-5 text-red-600" />
                            <div>
                              <h3 className="font-medium text-red-900">{student.name}</h3>
                              <p className="text-sm text-red-700">
                                Roll: {student.rollNumber || student.regNo} • 
                                {stats.presentSessions}/{stats.totalSessions} sessions attended
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge variant="destructive" className="mb-2">
                              {stats.percentage}% Attendance
                            </Badge>
                            <p className="text-xs text-red-600">
                              {75 - stats.percentage}% below requirement
                            </p>
                          </div>
                        </div>
                      ))}
                    
                    {filteredStudents.filter(student => getStudentAttendanceStats(student.id).percentage < 75).length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                        <p className="text-lg font-medium">All Students Have Good Attendance!</p>
                        <p className="text-sm">No students are below the 75% attendance threshold.</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}

      {(!selectedClass || !selectedDivision) && (
        <Card className="shadow-sm border-gray-200">
          <CardContent className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">Select a class and division to view attendance analytics</p>
            <p className="text-gray-500 text-sm mt-1">Use the filters above to get started with comprehensive attendance tracking</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AttendanceView;
