
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from "@/contexts/UserContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { CalendarDays, Users, CheckCircle2, XCircle, UserCheck, UserX } from "lucide-react";

const AttendanceMarking = () => {
  const { user, classes, subjects, getStudentsForClass } = useUser();
  const { toast } = useToast();
  
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedDivision, setSelectedDivision] = useState("");
  const [attendance, setAttendance] = useState<Record<string, boolean>>({});
  const [remarks, setRemarks] = useState("");

  // Get classes where the user is a teacher
  const myClasses = classes.filter(cls => 
    cls.classTeacher === user?.email || cls.yearCoordinator === user?.email
  );

  // Get subjects for the selected class where user is assigned as faculty
  const classSubjects = subjects.filter(subject => 
    subject.classId === selectedClass && subject.facultyEmail === user?.email
  );

  // Get current class data
  const currentClass = classes.find(cls => cls.id === selectedClass);
  const divisions = currentClass?.divisions || [];

  // Get students for the selected class and division
  const students = selectedClass && selectedDivision 
    ? getStudentsForClass(selectedClass, selectedDivision).sort((a, b) => a.name.localeCompare(b.name))
    : [];

  const handleAttendanceToggle = (studentId: string, isPresent: boolean) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: isPresent
    }));
  };

  const markAllPresent = () => {
    const allPresentAttendance: Record<string, boolean> = {};
    students.forEach(student => {
      allPresentAttendance[student.id] = true;
    });
    setAttendance(allPresentAttendance);
    toast({
      title: "All Present",
      description: "Marked all students as present",
    });
  };

  const markAllAbsent = () => {
    const allAbsentAttendance: Record<string, boolean> = {};
    students.forEach(student => {
      allAbsentAttendance[student.id] = false;
    });
    setAttendance(allAbsentAttendance);
    toast({
      title: "All Absent",
      description: "Marked all students as absent",
    });
  };

  const submitAttendance = () => {
    if (!selectedClass || !selectedSubject || !selectedDivision) {
      toast({
        title: "Missing Information",
        description: "Please select class, subject, and division",
        variant: "destructive"
      });
      return;
    }

    if (Object.keys(attendance).length === 0) {
      toast({
        title: "No Attendance Marked",
        description: "Please mark attendance for at least one student",
        variant: "destructive"
      });
      return;
    }

    // Here you would typically save the attendance data
    const presentCount = Object.values(attendance).filter(Boolean).length;
    const totalCount = students.length;

    toast({
      title: "Attendance Submitted",
      description: `Submitted attendance for ${totalCount} students (${presentCount} present, ${totalCount - presentCount} absent)`,
    });

    // Reset form
    setAttendance({});
    setRemarks("");
  };

  const getPresentCount = () => Object.values(attendance).filter(Boolean).length;
  const getAbsentCount = () => Object.values(attendance).filter(present => !present).length;

  if (!user) {
    return (
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-4">Mark Attendance</h1>
        <p>Please log in to mark attendance.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Mark Attendance</h1>
        <p className="text-muted-foreground">
          Record student attendance for your classes
        </p>
      </div>

      {/* Selection Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5" />
            Session Details
          </CardTitle>
          <CardDescription>
            Select the class, subject, and division for attendance marking
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Class</Label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger>
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  {myClasses.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id}>
                      {cls.name}
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
                  {divisions.map((division) => (
                    <SelectItem key={division.id} value={division.id}>
                      {division.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Subject</Label>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {classSubjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attendance Marking */}
      {students.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Student Attendance ({students.length} students)
                </CardTitle>
                <CardDescription>
                  Mark attendance for each student
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Present: {getPresentCount()}
                </Badge>
                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                  <XCircle className="h-3 w-3 mr-1" />
                  Absent: {getAbsentCount()}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <Button onClick={markAllPresent} variant="outline" className="bg-green-50 hover:bg-green-100 text-green-700 border-green-200">
                <UserCheck className="h-4 w-4 mr-2" />
                All Present
              </Button>
              <Button onClick={markAllAbsent} variant="outline" className="bg-red-50 hover:bg-red-100 text-red-700 border-red-200">
                <UserX className="h-4 w-4 mr-2" />
                All Absent
              </Button>
            </div>

            <div className="rounded-lg overflow-hidden border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Registration No.</TableHead>
                    <TableHead className="text-center">Attendance</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student) => {
                    const isPresent = attendance[student.id];
                    const hasAttendance = student.id in attendance;
                    
                    return (
                      <TableRow key={student.id} className="hover:bg-muted/50">
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
                            <div className="font-medium">{student.name}</div>
                          </div>
                        </TableCell>
                        <TableCell>{student.regNo}</TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center">
                            <div className="flex items-center gap-3 bg-muted rounded-full p-1">
                              <div className="flex items-center gap-2">
                                <span className={`text-sm ${isPresent ? 'text-green-700 font-medium' : 'text-muted-foreground'}`}>
                                  Present
                                </span>
                                <Switch
                                  checked={isPresent || false}
                                  onCheckedChange={(checked) => handleAttendanceToggle(student.id, checked)}
                                  className={`
                                    data-[state=checked]:bg-green-600 
                                    data-[state=unchecked]:bg-red-600
                                  `}
                                />
                                <span className={`text-sm ${!isPresent && hasAttendance ? 'text-red-700 font-medium' : 'text-muted-foreground'}`}>
                                  Absent
                                </span>
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          {hasAttendance ? (
                            <Badge 
                              variant={isPresent ? "default" : "destructive"}
                              className={
                                isPresent 
                                  ? "bg-green-100 text-green-800 hover:bg-green-100" 
                                  : "bg-red-100 text-red-800 hover:bg-red-100"
                              }
                            >
                              {isPresent ? "Present" : "Absent"}
                            </Badge>
                          ) : (
                            <Badge variant="outline">Not Marked</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            <div className="space-y-2">
              <Label htmlFor="remarks">Remarks (Optional)</Label>
              <Textarea
                id="remarks"
                placeholder="Add any remarks about today's class or attendance..."
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                rows={3}
              />
            </div>

            <div className="flex justify-end">
              <Button onClick={submitAttendance} size="lg">
                Submit Attendance
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {selectedClass && selectedDivision && students.length === 0 && (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg font-medium">No Students Found</p>
              <p className="text-sm text-muted-foreground mt-2">
                No students are enrolled in the selected class and division.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AttendanceMarking;
