
import React from "react";
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
import { useToast } from "@/hooks/use-toast";
import {
  BookPlus,
  CalendarClock,
  ExternalLink,
  MoreHorizontal,
  Pencil,
  Plus,
  Trash,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Mock data for courses
const courseData = [
  {
    id: "CS101",
    name: "Introduction to Programming",
    department: "Computer Science",
    faculty: "Dr. Alan Turing",
    students: 45,
    schedule: "Mon, Wed, Fri 10:00 AM",
    semester: "Fall 2023",
  },
  {
    id: "CS201",
    name: "Data Structures",
    department: "Computer Science",
    faculty: "Dr. Grace Hopper",
    students: 38,
    schedule: "Tue, Thu 2:00 PM",
    semester: "Fall 2023",
  },
  {
    id: "EE101",
    name: "Basic Electrical Engineering",
    department: "Electrical",
    faculty: "Dr. Nikola Tesla",
    students: 42,
    schedule: "Mon, Wed 3:00 PM",
    semester: "Fall 2023",
  },
  {
    id: "ME101",
    name: "Engineering Mechanics",
    department: "Mechanical",
    faculty: "Dr. Isaac Newton",
    students: 40,
    schedule: "Tue, Thu 11:00 AM",
    semester: "Fall 2023",
  },
  {
    id: "CE101",
    name: "Structural Analysis",
    department: "Civil",
    faculty: "Dr. Emily Clark",
    students: 35,
    schedule: "Wed, Fri 9:00 AM",
    semester: "Fall 2023",
  },
  {
    id: "CH101",
    name: "Chemical Principles",
    department: "Chemical",
    faculty: "Dr. Marie Curie",
    students: 30,
    schedule: "Mon, Thu 1:00 PM",
    semester: "Fall 2023",
  },
];

// Departments
const departments = [
  "Computer Science",
  "Electrical",
  "Mechanical",
  "Civil",
  "Chemical",
];

const Courses = () => {
  const { toast } = useToast();

  const handleAddCourse = () => {
    toast({
      title: "Course Added",
      description: "New course has been added successfully",
    });
  };

  const handleDeleteCourse = (id: string) => {
    toast({
      title: "Course Deleted",
      description: `Course ${id} has been removed from the system.`,
      variant: "destructive",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Courses</h2>
          <p className="text-muted-foreground">
            Manage course information and schedules
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <BookPlus className="h-4 w-4" />
              Add Course
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Course</DialogTitle>
              <DialogDescription>
                Enter the details of the new course.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="course-id" className="text-right">
                  Course ID
                </label>
                <Input id="course-id" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="course-name" className="text-right">
                  Course Name
                </label>
                <Input id="course-name" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="department" className="text-right">
                  Department
                </label>
                <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="faculty" className="text-right">
                  Faculty
                </label>
                <Input id="faculty" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="schedule" className="text-right">
                  Schedule
                </label>
                <Input id="schedule" className="col-span-3" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline">Cancel</Button>
              <Button onClick={handleAddCourse}>Add Course</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {courseData.map((course) => (
          <Card key={course.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg font-bold">
                    {course.name}
                  </CardTitle>
                  <CardDescription>{course.id}</CardDescription>
                </div>
                <Badge variant="outline" className="bg-education-50 text-education-700">
                  {course.department}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pb-3">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>
                    <span className="font-medium">{course.students}</span>{" "}
                    students enrolled
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CalendarClock className="h-4 w-4 text-muted-foreground" />
                  <span>{course.schedule}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Instructor: {course.faculty}
                </div>
                <div className="text-sm text-muted-foreground">
                  Semester: {course.semester}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t bg-muted/10 p-3">
              <Button variant="ghost" size="sm" className="gap-1">
                <ExternalLink className="h-4 w-4" />
                View Details
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>View Course</DropdownMenuItem>
                  <DropdownMenuItem>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit Details
                  </DropdownMenuItem>
                  <DropdownMenuItem>View Attendance</DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteCourse(course.id)}>
                    <Trash className="mr-2 h-4 w-4" />
                    Delete Course
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Courses;
