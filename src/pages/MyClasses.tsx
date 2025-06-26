
import React, { useState } from "react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useUser } from "@/contexts/UserContext";
import SubjectsTab from "@/components/classes/SubjectsTab";
import PracticalsTab from "@/components/classes/PracticalsTab";
import MenteesTab from "@/components/classes/MenteesTab";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserPlus, Edit, Trash2 } from "lucide-react";

const MyClasses = () => {
  const { 
    user,
    classes,
    isClassTeacher,
    isYearCoordinator,
    getStudentsForClass,
    addStudent,
    updateStudent,
    deleteStudent
  } = useUser();
  
  // Filter classes where the current user is either a class teacher or year coordinator
  const myClasses = classes.filter(cls => 
    cls.classTeacher === user?.email || cls.yearCoordinator === user?.email
  );

  const [selectedClass, setSelectedClass] = useState(myClasses.length > 0 ? myClasses[0].id : "");
  const [activeTab, setActiveTab] = useState("students");
  
  // States for add student dialog
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [newStudent, setNewStudent] = useState({
    name: "",
    email: "",
    regNo: "",
    mobile: ""
  });
  
  // States for edit student dialog
  const [isEditStudentOpen, setIsEditStudentOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<any>(null);
  
  const { toast } = useToast();

  if (!user) {
    return (
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-4">My Classes</h1>
        <p>Please log in to view your classes.</p>
      </div>
    );
  }

  if (myClasses.length === 0) {
    return (
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-4">My Classes</h1>
        <Card>
          <CardContent className="py-6">
            <div className="text-center">
              <p className="text-lg">No Classes Assigned</p>
              <p className="text-sm text-muted-foreground mt-2">
                You haven't been assigned as a class teacher or year coordinator for any classes yet.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentClass = myClasses.find(cls => cls.id === selectedClass);
  const studentsRaw = currentClass ? getStudentsForClass(selectedClass, currentClass.divisions[0]?.id) : [];
  
  // Sort students alphabetically by name
  const students = studentsRaw.sort((a, b) => a.name.localeCompare(b.name));
  
  const handleAddStudent = () => {
    if (!currentClass) return;
    
    // Validate form
    if (!newStudent.name || !newStudent.email || !newStudent.regNo) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields (Name, Email, Registration Number)",
        variant: "destructive"
      });
      return;
    }
    
    // Add student with year and attendance properties
    const success = addStudent({
      name: newStudent.name,
      email: newStudent.email,
      regNo: newStudent.regNo,
      mobile: newStudent.mobile,
      classId: selectedClass,
      divisionId: currentClass.divisions[0]?.id,
      year: parseInt(currentClass.name.split(' ')[0]) || 1, // Extract year from class name or default to 1
      attendance: 0 // Set default attendance to 0
    });
    
    if (success) {
      toast({
        title: "Student Added",
        description: `${newStudent.name} has been added to ${currentClass.name} successfully.`
      });
      
      // Reset form and close dialog
      setNewStudent({
        name: "",
        email: "",
        regNo: "",
        mobile: ""
      });
      setIsAddStudentOpen(false);
    } else {
      toast({
        title: "Error",
        description: "Failed to add student. The student may already exist.",
        variant: "destructive"
      });
    }
  };

  const handleEditStudent = (student: any) => {
    setEditingStudent(student);
    setIsEditStudentOpen(true);
  };

  const handleUpdateStudent = () => {
    if (!editingStudent) return;
    
    // Validate form
    if (!editingStudent.name || !editingStudent.email || !editingStudent.regNo) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields (Name, Email, Registration Number)",
        variant: "destructive"
      });
      return;
    }
    
    const success = updateStudent(editingStudent.id, {
      name: editingStudent.name,
      email: editingStudent.email,
      regNo: editingStudent.regNo,
      mobile: editingStudent.mobile
    });
    
    if (success) {
      toast({
        title: "Student Updated",
        description: `${editingStudent.name} has been updated successfully.`
      });
      setIsEditStudentOpen(false);
      setEditingStudent(null);
    } else {
      toast({
        title: "Error",
        description: "Failed to update student.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteStudent = (studentId: string, studentName: string) => {
    if (window.confirm(`Are you sure you want to delete ${studentName}? This action cannot be undone.`)) {
      const success = deleteStudent(studentId);
      
      if (success) {
        toast({
          title: "Student Deleted",
          description: `${studentName} has been removed from the class.`,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to delete student.",
          variant: "destructive"
        });
      }
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Classes</h1>
        <p className="text-muted-foreground">
          Manage your assigned classes and students
        </p>
      </div>

      <div className="flex-1">
        <Card>
          <CardContent className="pt-6">
            {/* Display current class name and division in the header */}
            <div className="mb-4 pb-2 border-b">
              <h2 className="text-xl font-semibold">{currentClass?.name} • {currentClass?.divisions[0]?.name}</h2>
            </div>
            
            <Tabs defaultValue="students" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="students">Students</TabsTrigger>
                <TabsTrigger value="subjects">Theory</TabsTrigger>
                <TabsTrigger value="practicals">Practicals</TabsTrigger>
                <TabsTrigger value="mentees">Mentees</TabsTrigger>
              </TabsList>
              <TabsContent value="students">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">{currentClass?.name} Student List</h3>
                    <Dialog open={isAddStudentOpen} onOpenChange={setIsAddStudentOpen}>
                      <DialogTrigger asChild>
                        <Button size="sm">
                          <UserPlus className="h-4 w-4 mr-2" />
                          Add Student
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add New Student</DialogTitle>
                          <DialogDescription>
                            Add a new student to {currentClass?.name} {currentClass?.divisions[0]?.name}.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                              Name *
                            </Label>
                            <Input 
                              id="name" 
                              className="col-span-3" 
                              value={newStudent.name}
                              onChange={(e) => setNewStudent({...newStudent, name: e.target.value})}
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="email" className="text-right">
                              Email *
                            </Label>
                            <Input 
                              id="email"
                              type="email" 
                              className="col-span-3"
                              value={newStudent.email}
                              onChange={(e) => setNewStudent({...newStudent, email: e.target.value})}
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="regNo" className="text-right">
                              Reg Number *
                            </Label>
                            <Input 
                              id="regNo" 
                              className="col-span-3"
                              value={newStudent.regNo}
                              onChange={(e) => setNewStudent({...newStudent, regNo: e.target.value})}
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="mobile" className="text-right">
                              Mobile
                            </Label>
                            <Input 
                              id="mobile" 
                              className="col-span-3"
                              value={newStudent.mobile}
                              onChange={(e) => setNewStudent({...newStudent, mobile: e.target.value})}
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button type="button" onClick={handleAddStudent}>Add Student</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                  
                  {/* Edit Student Dialog */}
                  <Dialog open={isEditStudentOpen} onOpenChange={setIsEditStudentOpen}>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Student</DialogTitle>
                        <DialogDescription>
                          Update student information for {editingStudent?.name}.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="edit-name" className="text-right">
                            Name *
                          </Label>
                          <Input 
                            id="edit-name" 
                            className="col-span-3" 
                            value={editingStudent?.name || ""}
                            onChange={(e) => setEditingStudent({...editingStudent, name: e.target.value})}
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="edit-email" className="text-right">
                            Email *
                          </Label>
                          <Input 
                            id="edit-email"
                            type="email" 
                            className="col-span-3"
                            value={editingStudent?.email || ""}
                            onChange={(e) => setEditingStudent({...editingStudent, email: e.target.value})}
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="edit-regNo" className="text-right">
                            Reg Number *
                          </Label>
                          <Input 
                            id="edit-regNo" 
                            className="col-span-3"
                            value={editingStudent?.regNo || ""}
                            onChange={(e) => setEditingStudent({...editingStudent, regNo: e.target.value})}
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="edit-mobile" className="text-right">
                            Mobile
                          </Label>
                          <Input 
                            id="edit-mobile" 
                            className="col-span-3"
                            value={editingStudent?.mobile || ""}
                            onChange={(e) => setEditingStudent({...editingStudent, mobile: e.target.value})}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditStudentOpen(false)}>Cancel</Button>
                        <Button type="button" onClick={handleUpdateStudent}>Update Student</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  
                  {students.length > 0 ? (
                    <div className="rounded-lg overflow-hidden border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Student</TableHead>
                            <TableHead>Registration No.</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Mobile</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {students.map((student) => (
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
                              <TableCell>{student.email}</TableCell>
                              <TableCell>{student.mobile || "N/A"}</TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleEditStudent(student)}
                                  >
                                    <Edit className="h-4 w-4 mr-1" />
                                    Edit
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDeleteStudent(student.id, student.name)}
                                  >
                                    <Trash2 className="h-4 w-4 mr-1" />
                                    Delete
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-muted/50 rounded-lg border">
                      <p className="text-muted-foreground">No students found in this class.</p>
                      <p className="text-sm text-muted-foreground mt-1">Add students using the "Add Student" button.</p>
                    </div>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="subjects">
                <SubjectsTab classId={selectedClass} />
              </TabsContent>
              <TabsContent value="practicals">
                <PracticalsTab classId={selectedClass} />
              </TabsContent>
              <TabsContent value="mentees">
                <MenteesTab classId={selectedClass} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MyClasses;
