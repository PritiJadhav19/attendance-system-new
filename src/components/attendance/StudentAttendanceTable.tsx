
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { UserCheck, UserX, CheckCircle2, XCircle, Users } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface StudentAttendanceTableProps {
  students: any[];
  attendance: Record<string, boolean>;
  handleAttendanceToggle: (studentId: string, isPresent: boolean) => void;
  markAllPresent: () => void;
  markAllAbsent: () => void;
  presentCount: number;
  absentCount: number;
  submitAttendance: () => void;
  disabled?: boolean;
}

const StudentAttendanceTable: React.FC<StudentAttendanceTableProps> = ({
  students,
  attendance,
  handleAttendanceToggle,
  markAllPresent,
  markAllAbsent,
  presentCount,
  absentCount,
  submitAttendance,
  disabled = false,
}) => {
  // State for per-student remarks
  const [remarks, setRemarks] = useState<Record<string, string>>({});
  // State to track which student's remark field is expanded
  const [openRemarkStudentId, setOpenRemarkStudentId] = useState<string | null>(null);

  // Handler: open/close remark area for a student
  const toggleRemarkField = (studentId: string) => {
    setOpenRemarkStudentId((current) => (current === studentId ? null : studentId));
  };

  // Handler: update remark for a student
  const handleRemarkChange = (studentId: string, value: string) => {
    setRemarks((prev) => ({
      ...prev,
      [studentId]: value,
    }));
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-xl font-semibold">
            <Users className="h-5 w-5" />
            Student Attendance ({students.length} students)
          </div>
          <div className="text-muted-foreground mb-2">
            Mark attendance for each student
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Present: {presentCount}
          </Badge>
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <XCircle className="h-3 w-3 mr-1" />
            Absent: {absentCount}
          </Badge>
        </div>
      </div>
      <div className="flex gap-4 my-4">
        <Button
          onClick={markAllPresent}
          variant="outline"
          className="bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
          disabled={disabled}
        >
          <UserCheck className="h-4 w-4 mr-2" />
          All Present
        </Button>
        <Button
          onClick={markAllAbsent}
          variant="outline"
          className="bg-red-50 hover:bg-red-100 text-red-700 border-red-200"
          disabled={disabled}
        >
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
              const isRemarkOpen = openRemarkStudentId === student.id;
              return (
                <React.Fragment key={student.id}>
                  <TableRow className="hover:bg-muted/50">
                    <TableCell>
                      <div
                        className="flex items-center gap-3 cursor-pointer select-none"
                        onClick={() => !disabled && toggleRemarkField(student.id)}
                        tabIndex={0}
                        onKeyDown={e => {
                          if (!disabled && (e.key === "Enter" || e.key === " ")) toggleRemarkField(student.id);
                        }}
                        aria-expanded={isRemarkOpen}
                        role="button"
                        style={disabled ? { pointerEvents: "none", opacity: 0.6 } : {}}
                      >
                        <Avatar>
                          <AvatarImage src="/placeholder.svg" />
                          <AvatarFallback>
                            {student.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="font-medium text-foreground">
                          {student.name}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{student.regNo}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center">
                        <div className="flex items-center gap-4 bg-muted rounded-full p-1">
                          <span className={`text-sm font-medium transition-colors duration-200 ${
                              isPresent
                                ? "text-green-700"
                                : "text-muted-foreground"
                            }`}>
                            Present
                          </span>
                          <Switch
                            checked={isPresent || false}
                            onCheckedChange={(checked) => handleAttendanceToggle(student.id, checked)}
                            disabled={disabled}
                          />
                          <span className={`text-sm font-medium transition-colors duration-200 ${
                              hasAttendance && !isPresent
                                ? "text-red-700"
                                : "text-muted-foreground"
                            }`}>
                            Absent
                          </span>
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
                  {isRemarkOpen && (
                    <TableRow>
                      <TableCell colSpan={4} className="bg-muted">
                        <div className="space-y-2 py-2">
                          <Label htmlFor={`remark-${student.id}`}>Remark for {student.name} (Optional)</Label>
                          <Textarea
                            id={`remark-${student.id}`}
                            placeholder={`Add a remark for ${student.name}...`}
                            value={remarks[student.id] || ""}
                            onChange={e => handleRemarkChange(student.id, e.target.value)}
                            rows={2}
                            disabled={disabled}
                            className="bg-background border border-education-100 rounded-md shadow-sm p-2 focus-visible:ring-2 focus-visible:ring-education-300 transition resize-none"
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              );
            })}
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-end mt-6">
        <Button
          onClick={submitAttendance}
          size="lg"
          disabled={disabled}
        >
          Submit Attendance
        </Button>
      </div>
    </div>
  );
};

export default StudentAttendanceTable;

// NOTE: This file is now quite long (>200 lines).
// Consider asking Lovable to further refactor this file into smaller components for maintainability.
