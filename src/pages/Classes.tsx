import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import {
  BookmarkPlus,
  Edit,
  MoreHorizontal,
  Plus,
  Trash,
  UserCheck,
  Users,
  Award,
  Search,
  ShieldAlert,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@/contexts/UserContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

// Form schema for adding a new class
const classFormSchema = z.object({
  name: z.string().min(1, "Class name is required"),
  divisionName: z.string().min(1, "Division name is required"),
});

type ClassFormValues = z.infer<typeof classFormSchema>;

// Form schema for assigning a class teacher or year coordinator
const assignTeacherSchema = z.object({
  teacherEmail: z.string().email("Invalid email address"),
});

type AssignTeacherFormValues = z.infer<typeof assignTeacherSchema>;

// Extended form schema for editing class details
const editClassFormSchema = z.object({
  name: z.string().min(1, "Class name is required"),
  divisionName: z.string().min(1, "Division name is required"),
  classTeacher: z.string().optional(),
  yearCoordinator: z.string().optional()
});

type EditClassFormValues = z.infer<typeof editClassFormSchema>;

const Classes = () => {
  const { toast } = useToast();
  const {
    getClassesForDepartment,
    addClass,
    updateClass,
    deleteClass,
    setClassTeacher,
    setYearCoordinator,
    getDepartmentalFaculty,
    existingUsers,
    getUserDepartment,
    getStudentsForClass,
    getAllStudentsForDepartment,
    isDuplicateClassDivision
  } = useUser();
  
  // Get classes for the current department
  const classes = getClassesForDepartment();
  const facultyMembers = getDepartmentalFaculty();
  const department = getUserDepartment();
  
  // State for the currently selected class (for assign teacher/coordinator dialog)
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [selectedDivision, setSelectedDivision] = useState<string | null>(null);
  const [assignMode, setAssignMode] = useState<'teacher' | 'coordinator'>('teacher');
  
  // State for dialogs
  const [showTeacherDialog, setShowTeacherDialog] = useState(false);
  const [showCoordinatorDialog, setShowCoordinatorDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showStudentsDialog, setShowStudentsDialog] = useState(false);
  
  // Form for adding a new class
  const classForm = useForm<ClassFormValues>({
    resolver: zodResolver(classFormSchema),
    defaultValues: {
      name: "",
      divisionName: "",
    },
  });
  
  // Form for assigning a class teacher or year coordinator
  const teacherForm = useForm<AssignTeacherFormValues>({
    resolver: zodResolver(assignTeacherSchema),
    defaultValues: {
      teacherEmail: "",
    },
  });
  
  // Form for editing class details
  const editClassForm = useForm<EditClassFormValues>({
    resolver: zodResolver(editClassFormSchema),
    defaultValues: {
      name: "",
      divisionName: "",
      classTeacher: "",
      yearCoordinator: "",
    },
  });
  
  // Function to check if a faculty is already assigned as a class teacher
  const isAlreadyClassTeacher = (email: string, currentClassId?: string) => {
    return classes.some(cls => 
      cls.classTeacher === email && 
      (currentClassId ? cls.id !== currentClassId : true)
    );
  };
  
  // Handle adding a new class
  const handleAddClass = (data: ClassFormValues) => {
    const isDuplicate = isDuplicateClassDivision(data.name, data.divisionName);
    
    if (isDuplicate) {
      toast({
        title: "Error",
        description: `A class named "${data.name}" with division "${data.divisionName}" already exists.`,
        variant: "destructive",
      });
      return;
    }
    
    const id = addClass({
      name: data.name,
      department: department || "Computer Science", // Fallback to a default
      divisions: [{
        id: `DIV-${Math.floor(Math.random() * 10000)}`,
        name: data.divisionName,
      }],
    });
    
    if (id) {
      toast({
        title: "Class Added",
        description: `Class ${data.name} has been added successfully`,
      });
      
      // Reset form
      classForm.reset();
    } else {
      toast({
        title: "Error",
        description: "Failed to add class. A class with the same name and division might already exist.",
        variant: "destructive",
      });
    }
  };
  
  // Handle assigning a class teacher
  const handleAssignTeacher = (data: AssignTeacherFormValues) => {
    if (!selectedClass) {
      toast({
        title: "Error",
        description: "No class selected",
        variant: "destructive",
      });
      return;
    }
    
    let success = false;
    
    if (assignMode === 'teacher') {
      // Check if the faculty is already a class teacher for another class
      if (isAlreadyClassTeacher(data.teacherEmail, selectedClass)) {
        toast({
          title: "Warning",
          description: "This faculty is already assigned as a class teacher for another class.",
          variant: "destructive",
        });
        return;
      }
      
      // For class teachers, just update the specific class
      success = setClassTeacher(selectedClass, data.teacherEmail);
      if (success) {
        setShowTeacherDialog(false);
        toast({
          title: "Teacher Assigned",
          description: "Class teacher has been assigned successfully",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to assign class teacher",
          variant: "destructive",
        });
      }
    } else {
      // For year coordinator, find all classes with the same name and update them
      const classToUpdate = classes.find(c => c.id === selectedClass);
      if (!classToUpdate) {
        toast({
          title: "Error",
          description: "Class not found",
          variant: "destructive",
        });
        return;
      }
      
      // Find all classes with the same name
      const sameNameClasses = classes.filter(c => c.name === classToUpdate.name);
      let allSuccess = true;
      
      // Update year coordinator for all classes with the same name
      for (const cls of sameNameClasses) {
        const updateSuccess = setYearCoordinator(cls.id, data.teacherEmail);
        if (!updateSuccess) {
          allSuccess = false;
        }
      }
      
      if (allSuccess) {
        setShowCoordinatorDialog(false);
        toast({
          title: "Year Coordinator Assigned",
          description: "Year coordinator has been assigned to all related classes successfully",
        });
      } else {
        toast({
          title: "Warning",
          description: "Some classes could not be updated with the new year coordinator",
          variant: "destructive",
        });
      }
    }
    
    // Reset form
    teacherForm.reset();
    setSelectedClass(null);
  };
  
  // Handle updating class details (name, division, teacher, and coordinator)
  const handleUpdateClassDetails = (classId: string) => {
    const classItem = classes.find(c => c.id === classId);
    if (!classItem) return;
    
    // Get the first division (we'll allow editing this)
    const division = classItem.divisions.length > 0 ? classItem.divisions[0] : null;
    
    // Populate the form with current values
    editClassForm.reset({
      name: classItem.name,
      divisionName: division ? division.name : "",
      classTeacher: classItem.classTeacher || "",
      yearCoordinator: classItem.yearCoordinator || "",
    });
    
    setSelectedClass(classId);
    setShowEditDialog(true);
  };
  
  // Handle saving edited class details
  const handleSaveEditedClass = (data: EditClassFormValues) => {
    if (!selectedClass) return;
    
    const classToEdit = classes.find(c => c.id === selectedClass);
    if (!classToEdit) return;
    
    // Check if we're changing division name
    const currentDivisionName = classToEdit.divisions[0]?.name;
    if (currentDivisionName !== data.divisionName) {
      // Check for duplicates only if the division name is changing
      const isDuplicate = isDuplicateClassDivision(data.name, data.divisionName);
      if (isDuplicate) {
        toast({
          title: "Error",
          description: `A class named "${data.name}" with division "${data.divisionName}" already exists.`,
          variant: "destructive",
        });
        return;
      }
    }
    
    // Check if the class teacher is being changed and if the new teacher is already assigned to another class
    if (data.classTeacher && 
        data.classTeacher !== classToEdit.classTeacher && 
        data.classTeacher !== "none" &&
        isAlreadyClassTeacher(data.classTeacher, selectedClass)) {
      toast({
        title: "Warning",
        description: "This faculty is already assigned as a class teacher for another class.",
        variant: "destructive",
      });
      return;
    }
    
    // Update class name and division
    const firstDivisionId = classToEdit.divisions.length > 0 ? classToEdit.divisions[0].id : `DIV-${Math.floor(Math.random() * 10000)}`;
    const updatedDivisions = [{
      id: firstDivisionId,
      name: data.divisionName
    }];
    
    // Update the class with new name and division
    const classUpdateSuccess = updateClass(selectedClass, { 
      name: data.name,
      divisions: updatedDivisions
    });
    
    let successTeacher = true;
    let successCoordinator = true;
    
    // Update class teacher for the specific class only
    if (data.classTeacher !== classToEdit.classTeacher) {
      successTeacher = setClassTeacher(selectedClass, data.classTeacher || "none");
    }
    
    // Update year coordinator for all classes with the new name
    if (data.yearCoordinator !== classToEdit.yearCoordinator) {
      // Find all classes with the same name (after update)
      const sameNameClasses = classes.filter(c => c.name === data.name);
      
      for (const cls of sameNameClasses) {
        const updateSuccess = setYearCoordinator(cls.id, data.yearCoordinator || "none");
        if (!updateSuccess) {
          successCoordinator = false;
        }
      }
    }
    
    if (classUpdateSuccess && successTeacher && successCoordinator) {
      toast({
        title: "Class Updated",
        description: "Class details have been updated successfully",
      });
      setShowEditDialog(false);
    } else {
      toast({
        title: "Error",
        description: "Failed to update some class details",
        variant: "destructive",
      });
    }
  };
  
  // Handle deleting a class
  const handleDeleteClass = (id: string) => {
    const success = deleteClass(id);
    
    if (success) {
      toast({
        title: "Class Deleted",
        description: `Class has been removed from the system`,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to delete class",
        variant: "destructive",
      });
    }
  };

  // Get teacher or coordinator name from email
  const getFacultyName = (email: string | undefined) => {
    if (!email) return "Not assigned";
    const faculty = existingUsers.find(user => user.email === email);
    return faculty ? faculty.name : "Unknown faculty";
  };

  // Handle viewing students for a specific class and division
  const handleViewStudents = (classId: string, divisionId: string) => {
    setSelectedClass(classId);
    setSelectedDivision(divisionId);
    setShowStudentsDialog(true);
  };

  // Get students for the selected class and division
  const currentStudents = selectedClass && selectedDivision 
    ? getStudentsForClass(selectedClass, selectedDivision)
    : [];

  // Get class and division names for the current selection
  const getCurrentClassInfo = () => {
    if (!selectedClass || !selectedDivision) return { className: "", divisionName: "" };
    
    const classInfo = classes.find(c => c.id === selectedClass);
    if (!classInfo) return { className: "", divisionName: "" };
    
    const divisionInfo = classInfo.divisions.find(d => d.id === selectedDivision);
    
    return {
      className: classInfo.name,
      divisionName: divisionInfo ? divisionInfo.name : ""
    };
  };

  const { className, divisionName } = getCurrentClassInfo();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Classes</h2>
          <p className="text-muted-foreground">
            Manage classes and divisions for your department
          </p>
        </div>
        
        {/* Add Class Dialog */}
        <Dialog>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <BookmarkPlus className="h-4 w-4" />
              Add Class
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Class</DialogTitle>
              <DialogDescription>
                Create a new class with a division.
              </DialogDescription>
            </DialogHeader>
            
            <Form {...classForm}>
              <form onSubmit={classForm.handleSubmit(handleAddClass)} className="space-y-4">
                <FormField
                  control={classForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Class Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., First Year CSE" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="space-y-2">
                  <FormField
                    control={classForm.control}
                    name="divisionName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Division Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Division name (e.g., A, B, C)" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <DialogFooter>
                  <Button type="submit">Add Class</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {classes.map((classItem) => {
          const hasTeacher = !!classItem.classTeacher;
          const hasCoordinator = !!classItem.yearCoordinator;
          
          return (
            <Card key={classItem.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg font-bold">
                      {classItem.name}
                    </CardTitle>
                    <CardDescription>{classItem.id}</CardDescription>
                  </div>
                  <Badge variant="outline" className="bg-education-50 text-education-700">
                    {classItem.department}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <UserCheck className="h-4 w-4 text-muted-foreground" />
                    <span>
                      Class Teacher: {getFacultyName(classItem.classTeacher)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Award className="h-4 w-4 text-muted-foreground" />
                    <span>
                      Year Coordinator: {getFacultyName(classItem.yearCoordinator)}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-sm font-medium">Divisions:</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {classItem.divisions.map((division) => (
                        <Badge key={division.id} variant="secondary">
                          {division.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-wrap justify-between border-t bg-muted/10 p-3 gap-2">
                {!hasTeacher && (
                  <Dialog open={showTeacherDialog && selectedClass === classItem.id} onOpenChange={(open) => {
                    if (!open) {
                      teacherForm.reset();
                      setSelectedClass(null);
                    }
                    setShowTeacherDialog(open);
                  }}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="gap-1"
                        onClick={() => {
                          setSelectedClass(classItem.id);
                          setAssignMode('teacher');
                        }}
                      >
                        <UserCheck className="h-4 w-4" />
                        Assign Teacher
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Assign Class Teacher</DialogTitle>
                        <DialogDescription>
                          Select a faculty member to be the class teacher for {classItem.name}.
                        </DialogDescription>
                      </DialogHeader>
                      
                      <Form {...teacherForm}>
                        <form onSubmit={teacherForm.handleSubmit(handleAssignTeacher)} className="space-y-4">
                          <FormField
                            control={teacherForm.control}
                            name="teacherEmail"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Faculty Member</FormLabel>
                                <Select 
                                  onValueChange={field.onChange} 
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select a faculty member" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {facultyMembers.map((faculty) => {
                                      const isTeacherForAnotherClass = isAlreadyClassTeacher(faculty.email);
                                      return (
                                        <SelectItem 
                                          key={faculty.email} 
                                          value={faculty.email}
                                          disabled={isTeacherForAnotherClass}
                                        >
                                          {faculty.name} ({faculty.email})
                                          {isTeacherForAnotherClass && (
                                            <span className="ml-2 text-red-500">(Already a class teacher)</span>
                                          )}
                                        </SelectItem>
                                      );
                                    })}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <DialogFooter>
                            <DialogClose asChild>
                              <Button type="button" variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button type="submit">Assign Teacher</Button>
                          </DialogFooter>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                )}
                
                {!hasCoordinator && (
                  <Dialog open={showCoordinatorDialog && selectedClass === classItem.id} onOpenChange={(open) => {
                    if (!open) {
                      teacherForm.reset();
                      setSelectedClass(null);
                    }
                    setShowCoordinatorDialog(open);
                  }}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="gap-1"
                        onClick={() => {
                          setSelectedClass(classItem.id);
                          setAssignMode('coordinator');
                        }}
                      >
                        <Award className="h-4 w-4" />
                        Assign Coordinator
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Assign Year Coordinator</DialogTitle>
                        <DialogDescription>
                          Select a faculty member to be the year coordinator for {classItem.name}.
                        </DialogDescription>
                      </DialogHeader>
                      
                      <Form {...teacherForm}>
                        <form onSubmit={teacherForm.handleSubmit(handleAssignTeacher)} className="space-y-4">
                          <FormField
                            control={teacherForm.control}
                            name="teacherEmail"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Faculty Member</FormLabel>
                                <Select 
                                  onValueChange={field.onChange} 
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select a faculty member" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {facultyMembers.map((faculty) => (
                                      <SelectItem key={faculty.email} value={faculty.email}>
                                        {faculty.name} ({faculty.email})
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <DialogFooter>
                            <DialogClose asChild>
                              <Button type="button" variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button type="submit">Assign Coordinator</Button>
                          </DialogFooter>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                )}
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleUpdateClassDetails(classItem.id)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Details
                    </DropdownMenuItem>
                    {classItem.divisions.length > 0 && (
                      <DropdownMenuItem onClick={() => handleViewStudents(classItem.id, classItem.divisions[0].id)}>
                        <Users className="mr-2 h-4 w-4" />
                        View Students
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteClass(classItem.id)}>
                      <Trash className="mr-2 h-4 w-4" />
                      Delete Class
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardFooter>
            </Card>
          );
        })}
      </div>
      
      {/* Edit Class Dialog */}
      <Dialog open={showEditDialog} onOpenChange={(open) => {
        if (!open) {
          editClassForm.reset();
          setSelectedClass(null);
        }
        setShowEditDialog(open);
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Class Details</DialogTitle>
            <DialogDescription>
              Update class information and teacher assignments
            </DialogDescription>
          </DialogHeader>
          
          <Form {...editClassForm}>
            <form onSubmit={editClassForm.handleSubmit(handleSaveEditedClass)} className="space-y-4">
              <FormField
                control={editClassForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Class Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={editClassForm.control}
                name="divisionName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Division Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={editClassForm.control}
                name="classTeacher"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Class Teacher</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a class teacher" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        {facultyMembers.map((faculty) => {
                          // Check if this faculty is already a class teacher for another class
                          const isTeacherForAnotherClass = selectedClass 
                            ? isAlreadyClassTeacher(faculty.email, selectedClass)
                            : isAlreadyClassTeacher(faculty.email);
                            
                          // If this is the current teacher of the selected class, don't disable
                          const isCurrentTeacher = editClassForm.getValues().classTeacher === faculty.email;
                          const shouldDisable = isTeacherForAnotherClass && !isCurrentTeacher;
                          
                          return (
                            <SelectItem 
                              key={faculty.email} 
                              value={faculty.email}
                              disabled={shouldDisable}
                            >
                              {faculty.name} ({faculty.email})
                              {shouldDisable && (
                                <span className="ml-2 text-red-500">(Already a class teacher)</span>
                              )}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={editClassForm.control}
                name="yearCoordinator"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Year Coordinator</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a year coordinator" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        {facultyMembers.map((faculty) => (
                          <SelectItem key={faculty.email} value={faculty.email}>
                            {faculty.name} ({faculty.email})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setShowEditDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Save Changes
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* View Students Dialog */}
      <Dialog open={showStudentsDialog} onOpenChange={(open) => {
        if (!open) {
          setSelectedClass(null);
          setSelectedDivision(null);
        }
        setShowStudentsDialog(open);
      }}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Students - {className} ({divisionName})</DialogTitle>
            <DialogDescription>
              View students and attendance details
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="h-[400px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Registration No.</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Mobile</TableHead>
                  <TableHead className="text-right">Attendance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentStudents.length > 0 ? (
                  currentStudents.map((student) => {
                    // Calculate attendance status
                    const attendancePercentage = student.attendance || 0;
                    let badgeVariant: "default" | "destructive" | "outline" = "outline";
                    if (attendancePercentage >= 75) {
                      badgeVariant = "default";
                    } else if (attendancePercentage < 75) {
                      badgeVariant = "destructive";
                    }
                    
                    return (
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
                            <div>{student.name}</div>
                          </div>
                        </TableCell>
                        <TableCell>{student.regNo}</TableCell>
                        <TableCell>{student.email}</TableCell>
                        <TableCell>{student.mobile || "N/A"}</TableCell>
                        <TableCell className="text-right">
                          <Badge variant={badgeVariant} className="whitespace-nowrap">
                            {student.attendanceSessions || 0} / {student.totalSessions || 0}
                            {' '}
                            ({attendancePercentage}%)
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center p-4 text-muted-foreground">
                      No students found in this class division.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </ScrollArea>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowStudentsDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Empty state */}
      {classes.length === 0 && (
        <Card className="p-8 text-center">
          <div className="flex flex-col items-center gap-2">
            <BookmarkPlus className="h-10 w-10 text-muted-foreground" />
            <h3 className="text-lg font-medium">No Classes Found</h3>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Class
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Class</DialogTitle>
                  <DialogDescription>
                    Create a new class with a division.
                  </DialogDescription>
                </DialogHeader>
                
                <Form {...classForm}>
                  <form onSubmit={classForm.handleSubmit(handleAddClass)} className="space-y-4">
                    <FormField
                      control={classForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Class Name</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., First Year CSE" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="space-y-2">
                      <FormField
                        control={classForm.control}
                        name="divisionName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Division Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Division name (e.g., A, B, C)" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <DialogFooter>
                      <Button type="submit">Add Class</Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Classes;
