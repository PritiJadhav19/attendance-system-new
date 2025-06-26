
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";
import { Edit, UserCheck } from "lucide-react";

interface MenteesTabProps {
  classId: string;
}

const MenteesTab = ({ classId }: MenteesTabProps) => {
  const { toast } = useToast();
  const { 
    getStudentsForClass, 
    existingUsers,
    assignMentorToStudent,
    getStudentMentor,
    getClassNameById,
    getUserDepartment
  } = useUser();
  
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [selectedMentor, setSelectedMentor] = useState<string>("");
  
  const currentClass = getClassNameById(classId);
  const currentDepartment = getUserDepartment();
  
  // Get all students for this class, no need to specify division
  const students = getStudentsForClass(classId);
  
  // Filter faculty users (including HOD) for potential mentors from the current department only
  const mentors = existingUsers.filter(user => 
    (user.role === "faculty" || user.role === "hod") && 
    user.department === currentDepartment &&
    !user.isBlocked
  );
  
  const handleOpenAssignDialog = (studentId: string) => {
    setSelectedStudent(studentId);
    const currentMentor = getStudentMentor(studentId);
    setSelectedMentor(currentMentor || "");
    setIsAssignDialogOpen(true);
  };
  
  const handleAssignMentor = () => {
    if (!selectedStudent) return;
    
    const success = assignMentorToStudent(
      selectedStudent, 
      selectedMentor === "none" ? null : selectedMentor
    );
    
    if (success) {
      toast({
        title: "Mentor Assigned",
        description: "The mentor has been successfully assigned to the student."
      });
      setIsAssignDialogOpen(false);
    } else {
      toast({
        title: "Error",
        description: "Failed to assign mentor. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const getStudentMentorName = (studentId: string) => {
    const mentorEmail = getStudentMentor(studentId);
    if (!mentorEmail) return "Not assigned";
    
    const mentor = existingUsers.find(user => user.email === mentorEmail);
    if (!mentor) return "Unknown";
    
    return mentor.role === "hod" ? `${mentor.name} (HOD)` : mentor.name;
  };

  const hasAssignedMentor = (studentId: string) => {
    return !!getStudentMentor(studentId);
  };

  const getMentorDisplayName = (mentor: any) => {
    if (mentor.role === "hod") {
      return `${mentor.name} (HOD)`;
    }
    return mentor.name;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Mentor-Mentee Assignments for {currentClass}</h2>
      </div>

      {students.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Registration No</TableHead>
              <TableHead>Current Mentor</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student.id}>
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
                <TableCell>
                  {hasAssignedMentor(student.id) ? (
                    <Badge variant="outline" className="text-green-500 border-green-500">
                      {getStudentMentorName(student.id)}
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-amber-500 border-amber-500">
                      Not Assigned
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenAssignDialog(student.id)}
                    className="gap-1.5"
                  >
                    {hasAssignedMentor(student.id) ? (
                      <>
                        <Edit className="h-4 w-4" />
                        Edit Mentor
                      </>
                    ) : (
                      <>
                        <UserCheck className="h-4 w-4" />
                        Assign Mentor
                      </>
                    )}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="text-center py-8 bg-muted/40 rounded-lg">
          <p className="text-muted-foreground">No students found in this class.</p>
          <p className="text-sm text-muted-foreground mt-1">
            Add students in the Students tab before assigning mentors.
          </p>
        </div>
      )}

      {/* Assign Mentor Dialog */}
      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {getStudentMentor(selectedStudent || "") ? "Edit Mentor Assignment" : "Assign Mentor"}
            </DialogTitle>
            <DialogDescription>
              {getStudentMentor(selectedStudent || "")
                ? "Change the mentor for this student"
                : "Select a mentor for this student"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="mentor" className="text-right">
                Mentor
              </label>
              <Select value={selectedMentor} onValueChange={setSelectedMentor}>
                <SelectTrigger id="mentor" className="col-span-3">
                  <SelectValue placeholder="Select a mentor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {mentors.map((mentor) => (
                    <SelectItem key={mentor.email} value={mentor.email}>
                      {getMentorDisplayName(mentor)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAssignDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAssignMentor}>
              {getStudentMentor(selectedStudent || "") ? "Update Assignment" : "Assign Mentor"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MenteesTab;
