
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Edit, Trash, Plus } from "lucide-react";
import { useUser } from "@/contexts/UserContext";

interface SubjectsTabProps {
  classId: string;
}

const SubjectsTab = ({ classId }: SubjectsTabProps) => {
  const [newSubjectName, setNewSubjectName] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState<string>("");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<{
    id: string;
    name: string;
    facultyEmail?: string;
  } | null>(null);
  
  const { toast } = useToast();
  const { 
    addSubject, 
    getSubjectsForClass, 
    deleteSubject, 
    assignTeacherToSubject,
    updateSubject,
    existingUsers,
    getClassNameById,
    getUserDepartment,
  } = useUser();

  const subjects = getSubjectsForClass(classId);
  const currentDepartment = getUserDepartment();
  
  // Show only faculty members and HOD from the current department
  const facultyList = existingUsers.filter(user => 
    (user.role === "faculty" || user.role === "hod") && 
    user.department === currentDepartment && 
    !user.isBlocked
  );
  
  const className = getClassNameById(classId);

  const handleAddSubject = () => {
    if (!newSubjectName.trim()) {
      toast({
        title: "Error",
        description: "Subject name cannot be empty",
        variant: "destructive",
      });
      return;
    }

    // Check if subject already exists for this class
    if (subjects.some(subject => subject.name.toLowerCase() === newSubjectName.toLowerCase())) {
      toast({
        title: "Error",
        description: "This subject already exists for this class",
        variant: "destructive",
      });
      return;
    }

    // Add the subject
    const subjectId = addSubject({
      name: newSubjectName,
      code: `${newSubjectName.substring(0, 3).toUpperCase()}101`,
      classId,
      divisionId: "default-division",
      facultyEmail: selectedTeacher === "none" ? undefined : selectedTeacher || undefined,
      type: "theory"
    });

    if (subjectId) {
      toast({
        title: "Success",
        description: "Subject added successfully",
      });
      setNewSubjectName("");
      setSelectedTeacher("");
    }
  };

  const handleDeleteSubject = (subjectId: string) => {
    const success = deleteSubject(subjectId);

    if (success) {
      toast({
        title: "Subject Deleted",
        description: "The subject has been removed successfully",
        variant: "destructive",
      });
    }
  };

  const handleEditSubject = () => {
    if (!editingSubject) return;
    
    if (!editingSubject.name.trim()) {
      toast({
        title: "Error",
        description: "Subject name cannot be empty",
        variant: "destructive",
      });
      return;
    }

    // Update subject name
    const success = updateSubject(editingSubject.id, {
      name: editingSubject.name,
      facultyEmail: editingSubject.facultyEmail === "none" ? undefined : editingSubject.facultyEmail
    });

    if (success) {
      toast({
        title: "Subject Updated",
        description: "Subject has been updated successfully",
      });
      setIsEditDialogOpen(false);
      setEditingSubject(null);
    }
  };

  const openEditDialog = (subject: {
    id: string;
    name: string;
    facultyEmail?: string;
  }) => {
    setEditingSubject({
      id: subject.id,
      name: subject.name,
      facultyEmail: subject.facultyEmail || "none"
    });
    setIsEditDialogOpen(true);
  };

  const getTeacherName = (email?: string) => {
    if (!email) return "Not assigned";
    const teacher = existingUsers.find(user => user.email === email);
    return teacher ? teacher.name : "Unknown";
  };

  const getTeacherDisplayName = (teacher: any) => {
    if (teacher.role === "hod") {
      return `${teacher.name} (HOD)`;
    }
    return teacher.name;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Subjects for {className}</h2>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Subject
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Subject</DialogTitle>
              <DialogDescription>
                Enter the details of the new subject.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="name" className="text-right">
                  Subject Name
                </label>
                <Input 
                  id="name" 
                  className="col-span-3" 
                  value={newSubjectName}
                  onChange={(e) => setNewSubjectName(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="teacher" className="text-right">
                  Assigned Teacher
                </label>
                <Select value={selectedTeacher} onValueChange={setSelectedTeacher}>
                  <SelectTrigger id="teacher" className="col-span-3">
                    <SelectValue placeholder="Select a teacher" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {facultyList.map((faculty) => (
                      <SelectItem key={faculty.email} value={faculty.email}>
                        {getTeacherDisplayName(faculty)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setNewSubjectName("");
                setSelectedTeacher("");
              }}>
                Cancel
              </Button>
              <Button onClick={handleAddSubject}>Add Subject</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Subject Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Subject</DialogTitle>
            <DialogDescription>
              Modify the subject details
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="edit-name" className="text-right">
                Subject Name
              </label>
              <Input 
                id="edit-name" 
                className="col-span-3" 
                value={editingSubject?.name || ""}
                onChange={(e) => setEditingSubject(prev => prev ? {...prev, name: e.target.value} : null)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="edit-teacher" className="text-right">
                Assigned Teacher
              </label>
              <Select 
                value={editingSubject?.facultyEmail || "none"} 
                onValueChange={(value) => setEditingSubject(prev => prev ? {...prev, facultyEmail: value} : null)}
              >
                <SelectTrigger id="edit-teacher" className="col-span-3">
                  <SelectValue placeholder="Select a teacher" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {facultyList.map((faculty) => (
                    <SelectItem key={faculty.email} value={faculty.email}>
                      {getTeacherDisplayName(faculty)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleEditSubject}>Update Subject</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {subjects.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Subject Name</TableHead>
              <TableHead>Assigned Teacher</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subjects.map((subject) => (
              <TableRow key={subject.id}>
                <TableCell>{subject.name}</TableCell>
                <TableCell>{getTeacherName(subject.facultyEmail)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-blue-500 hover:text-blue-700"
                      onClick={() => openEditDialog(subject)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDeleteSubject(subject.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="text-center py-8 bg-muted/40 rounded-lg">
          <p className="text-muted-foreground">No subjects found for this class.</p>
          <p className="text-sm text-muted-foreground mt-1">Add subjects using the "Add Subject" button.</p>
        </div>
      )}
    </div>
  );
};

export default SubjectsTab;
