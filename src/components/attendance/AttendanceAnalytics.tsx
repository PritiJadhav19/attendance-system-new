
import React, { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Calendar, Users, BookOpen, Clock, TrendingDown, AlertTriangle, Filter, Search, CheckCircle } from "lucide-react";
import { useUser } from "@/contexts/UserContext";

interface AttendanceRecord {
  id: string;
  studentId: string;
  subjectId: string;
  subjectType: string;
  classId: string;
  divisionId: string;
  date: string;
  period: string;
  status: "present" | "absent";
  remarks: string;
  markedBy: string;
}

const AttendanceAnalytics = () => {
  const { 
    user, 
    students, 
    subjects, 
    practicals, 
    classes,
    getClassesForDepartment
  } = useUser();

  // Mock attendance data - replace with actual data from context when available
  const attendanceRecords: AttendanceRecord[] = [];

  const [selectedClass, setSelectedClass] = useState<string>("");
  const [selectedDivision, setSelectedDivision] = useState<string>("");
  const [selectedStudent, setSelectedStudent] = useState<string>("");
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [dateRange, setDateRange] = useState<string>("month");
  const [searchTerm, setSearchTerm] = useState<string>("");

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

  const getDateRange = () => {
    const now = new Date();
    const endDate = now.toISOString().split('T')[0];
    let startDate = "";
    
    switch (dateRange) {
      case "week":
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        startDate = weekAgo.toISOString().split('T')[0];
        break;
      case "month":
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        startDate = monthAgo.toISOString().split('T')[0];
        break;
      case "semester":
        const semesterAgo = new Date(now.getTime() - 120 * 24 * 60 * 60 * 1000);
        startDate = semesterAgo.toISOString().split('T')[0];
        break;
      default:
        startDate = "2024-01-01";
    }
    
    return { startDate, endDate };
  };

  // Calculate attendance statistics
  const calculateAttendanceStats = (studentId: string) => {
    const { startDate, endDate } = getDateRange();
    
    const studentRecords = attendanceRecords.filter(record => 
      record.studentId === studentId &&
      record.date >= startDate &&
      record.date <= endDate &&
      (!selectedSubject || record.subjectId === selectedSubject)
    );

    const totalSessions = studentRecords.length;
    const presentSessions = studentRecords.filter(r => r.status === "present").length;
    const absentSessions = totalSessions - presentSessions;
    const percentage = totalSessions > 0 ? Math.round((presentSessions / totalSessions) * 100) : 0;

    return {
      totalSessions,
      presentSessions,
      absentSessions,
      percentage,
      records: studentRecords
    };
  };

  // Get subject-wise breakdown for a student
  const getSubjectWiseAttendance = (studentId: string) => {
    const { startDate, endDate } = getDateRange();
    
    const studentRecords = attendanceRecords.filter(record => 
      record.studentId === studentId &&
      record.date >= startDate &&
      record.date <= endDate
    );

    const subjectMap = new Map();
    
    studentRecords.forEach(record => {
      const subjectName = getSubjectName(record.subjectId, record.subjectType);
      const key = `${record.subjectId}-${record.subjectType}`;
      
      if (!subjectMap.has(key)) {
        subjectMap.set(key, {
          subjectName,
          subjectType: record.subjectType,
          total: 0,
          present: 0,
          absent: 0,
          percentage: 0
        });
      }
      
      const subject = subjectMap.get(key);
      subject.total++;
      if (record.status === "present") {
        subject.present++;
      } else {
        subject.absent++;
      }
      subject.percentage = Math.round((subject.present / subject.total) * 100);
    });

    return Array.from(subjectMap.values());
  };

  // Get class overview statistics
  const getClassOverview = () => {
    if (!selectedClass || !selectedDivision) return null;

    const classStudents = filteredStudents;
    const totalStudents = classStudents.length;
    
    if (totalStudents === 0) return null;

    let totalPercentage = 0;
    let studentsWithLowAttendance = 0;
    
    classStudents.forEach(student => {
      const stats = calculateAttendanceStats(student.id);
      totalPercentage += stats.percentage;
      if (stats.percentage < 75) {
        studentsWithLowAttendance++;
      }
    });

    const averageAttendance = Math.round(totalPercentage / totalStudents);

    return {
      totalStudents,
      averageAttendance,
      studentsWithLowAttendance,
      studentsWithGoodAttendance: totalStudents - studentsWithLowAttendance
    };
  };

  const classOverview = getClassOverview();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Attendance Analytics</h2>
          <p className="text-gray-600">Comprehensive attendance tracking and analysis</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-lg">
          <Users className="h-4 w-4" />
          <span>Faculty Dashboard</span>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Options
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="space-y-2">
              <Label>Class</Label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger>
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
              <Label>Division</Label>
              <Select 
                value={selectedDivision} 
                onValueChange={setSelectedDivision}
                disabled={!selectedClass}
              >
                <SelectTrigger>
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
              <Label>Subject (Optional)</Label>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger>
                  <SelectValue placeholder="All subjects" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Subjects</SelectItem>
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
              <Label>Time Period</Label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
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
              <Label>Search Student</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedClass && selectedDivision && (
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Class Overview</TabsTrigger>
            <TabsTrigger value="students">Student Summary</TabsTrigger>
            <TabsTrigger value="individual">Individual Analysis</TabsTrigger>
            <TabsTrigger value="alerts">Alerts & Warnings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {classOverview && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Students</p>
                        <p className="text-3xl font-bold text-blue-600">{classOverview.totalStudents}</p>
                      </div>
                      <Users className="h-8 w-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Average Attendance</p>
                        <p className="text-3xl font-bold text-green-600">{classOverview.averageAttendance}%</p>
                      </div>
                      <Calendar className="h-8 w-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Good Attendance</p>
                        <p className="text-3xl font-bold text-green-600">{classOverview.studentsWithGoodAttendance}</p>
                        <p className="text-xs text-gray-500">≥75% attendance</p>
                      </div>
                      <TrendingDown className="h-8 w-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Low Attendance</p>
                        <p className="text-3xl font-bold text-red-600">{classOverview.studentsWithLowAttendance}</p>
                        <p className="text-xs text-gray-500">&lt;75% attendance</p>
                      </div>
                      <AlertTriangle className="h-8 w-8 text-red-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          <TabsContent value="students" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Student Attendance Summary</CardTitle>
                <CardDescription>
                  Overview of all students' attendance for the selected period
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredStudents.map((student) => {
                    const stats = calculateAttendanceStats(student.id);
                    const badgeVariant = stats.percentage >= 75 ? "default" : "destructive";
                    
                    return (
                      <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src="/placeholder.svg" />
                            <AvatarFallback>
                              {student.name.split(" ").map(n => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-medium">{student.name}</h3>
                            <p className="text-sm text-gray-500">Roll: {student.rollNumber || student.regNo}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <div className="text-center">
                            <p className="text-sm font-medium">{stats.presentSessions}/{stats.totalSessions}</p>
                            <p className="text-xs text-gray-500">Sessions</p>
                          </div>
                          <div className="w-24">
                            <Progress value={stats.percentage} className="h-2" />
                            <p className="text-xs text-center mt-1">{stats.percentage}%</p>
                          </div>
                          <Badge variant={badgeVariant}>
                            {stats.percentage}%
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="individual" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle>Select Student</CardTitle>
                </CardHeader>
                <CardContent>
                  <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a student" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredStudents.map((student) => (
                        <SelectItem key={student.id} value={student.id}>
                          {student.name}
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
                    </CardHeader>
                    <CardContent>
                      {(() => {
                        const stats = calculateAttendanceStats(selectedStudent);
                        const subjectStats = getSubjectWiseAttendance(selectedStudent);
                        
                        return (
                          <div className="space-y-6">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              <div className="text-center p-4 bg-blue-50 rounded-lg">
                                <p className="text-2xl font-bold text-blue-600">{stats.totalSessions}</p>
                                <p className="text-sm text-gray-600">Total Sessions</p>
                              </div>
                              <div className="text-center p-4 bg-green-50 rounded-lg">
                                <p className="text-2xl font-bold text-green-600">{stats.presentSessions}</p>
                                <p className="text-sm text-gray-600">Present</p>
                              </div>
                              <div className="text-center p-4 bg-red-50 rounded-lg">
                                <p className="text-2xl font-bold text-red-600">{stats.absentSessions}</p>
                                <p className="text-sm text-gray-600">Absent</p>
                              </div>
                              <div className="text-center p-4 bg-gray-50 rounded-lg">
                                <p className="text-2xl font-bold text-gray-900">{stats.percentage}%</p>
                                <p className="text-sm text-gray-600">Attendance</p>
                              </div>
                            </div>

                            <div>
                              <h4 className="font-medium mb-4">Subject-wise Breakdown</h4>
                              <div className="space-y-3">
                                {subjectStats.map((subject, index) => (
                                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                                    <div>
                                      <p className="font-medium">{subject.subjectName}</p>
                                      <p className="text-sm text-gray-500 capitalize">{subject.subjectType}</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                      <span className="text-sm">{subject.present}/{subject.total}</span>
                                      <Badge variant={subject.percentage >= 75 ? "default" : "destructive"}>
                                        {subject.percentage}%
                                      </Badge>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div>
                              <h4 className="font-medium mb-4">Recent Attendance Records</h4>
                              <div className="space-y-2 max-h-60 overflow-y-auto">
                                {stats.records
                                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                                  .slice(0, 10)
                                  .map((record, index) => (
                                    <div key={index} className="flex items-center justify-between p-2 border rounded text-sm">
                                      <div>
                                        <span className="font-medium">{new Date(record.date).toLocaleDateString()}</span>
                                        <span className="ml-2 text-gray-500">
                                          {getSubjectName(record.subjectId, record.subjectType)}
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <Badge variant={record.status === "present" ? "default" : "destructive"}>
                                          {record.status}
                                        </Badge>
                                        {record.remarks && (
                                          <span className="text-xs text-gray-500 max-w-24 truncate">
                                            {record.remarks}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  ))}
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
                  Attendance Alerts & Warnings
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
                      stats: calculateAttendanceStats(student.id)
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
                  
                  {filteredStudents.filter(student => calculateAttendanceStats(student.id).percentage < 75).length === 0 && (
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
      )}

      {(!selectedClass || !selectedDivision) && (
        <Card>
          <CardContent className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">Select a class and division to view attendance analytics</p>
            <p className="text-gray-500 text-sm mt-1">Use the filters above to get started</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AttendanceAnalytics;
