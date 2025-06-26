
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, BookOpen, Download } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

const Students = () => {
  const { 
    getAllStudentsForDepartment, 
    getUserDepartment, 
    getClassNameById, 
    getDivisionNameById, 
    getUniqueClassNames,
    getDivisionsForClassName 
  } = useUser();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [classFilter, setClassFilter] = useState<string | null>(null);
  const [divisionFilter, setDivisionFilter] = useState<string | null>(null);
  
  // Get all students for current department
  const allStudents = getAllStudentsForDepartment();
  const department = getUserDepartment();
  
  // Get unique class names for filtering (instead of showing duplicates)
  const uniqueClasses = getUniqueClassNames();
  
  // Get divisions for selected class name
  const selectedClassDivisions = classFilter 
    ? getDivisionsForClassName(getClassNameById(classFilter))
    : [];
  
  // Filter students based on search query and selected class/division
  const filteredStudents = allStudents.filter(student => {
    const matchesSearch = 
      searchQuery === "" || 
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.regNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (student.mobile && student.mobile.includes(searchQuery));
      
    // Check if class matches by ID or name matches the selected class name
    const selectedClassName = classFilter ? getClassNameById(classFilter) : null;
    const studentClassName = getClassNameById(student.classId);
    
    const matchesClass = !classFilter || 
                        (selectedClassName && studentClassName === selectedClassName);
                        
    const matchesDivision = !divisionFilter || student.divisionId === divisionFilter;
    
    return matchesSearch && matchesClass && matchesDivision;
  });
  
  // Handle class selection
  const handleClassChange = (value: string) => {
    setClassFilter(value === "all" ? null : value);
    setDivisionFilter(null); // Reset division filter when class changes
  };
  
  // Handle division selection
  const handleDivisionChange = (value: string) => {
    setDivisionFilter(value === "all" ? null : value);
  };
  
  // Reset filters
  const resetFilters = () => {
    setClassFilter(null);
    setDivisionFilter(null);
    setSearchQuery("");
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Students</h2>
        <p className="text-muted-foreground">
          View and manage all students in your department
        </p>
      </div>
      
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col sm:flex-row items-start gap-4 mb-2">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search students by name, email, registration number or mobile"
              className="pl-8 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button 
              variant="outline" 
              className="text-xs h-9 px-2" 
              onClick={resetFilters}
            >
              Clear Filters
            </Button>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="w-full sm:w-1/3">
            <Select 
              value={classFilter || "all"} 
              onValueChange={handleClassChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by Class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                {uniqueClasses.map(cls => (
                  <SelectItem key={cls.id} value={cls.id}>
                    {cls.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="w-full sm:w-1/3">
            <Select 
              value={divisionFilter || "all"} 
              onValueChange={handleDivisionChange}
              disabled={!classFilter || selectedClassDivisions.length === 0}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by Division" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Divisions</SelectItem>
                {selectedClassDivisions.map(div => (
                  <SelectItem key={div.id} value={div.id}>
                    {div.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>All Students</CardTitle>
          <CardDescription>
            {filteredStudents.length} students in {department || "your department"}
            {classFilter && ` - ${getClassNameById(classFilter)}`}
            {divisionFilter && ` (${getDivisionNameById(classFilter || "", divisionFilter)})`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[60vh] w-full">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Registration No.</TableHead>
                  <TableHead className="hidden md:table-cell">Email</TableHead>
                  <TableHead className="hidden md:table-cell">Mobile</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Division</TableHead>
                  <TableHead className="text-right">Attendance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => {
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
                        <TableCell className="hidden md:table-cell">{student.email}</TableCell>
                        <TableCell className="hidden md:table-cell">{student.mobile || "N/A"}</TableCell>
                        <TableCell>{getClassNameById(student.classId)}</TableCell>
                        <TableCell>{getDivisionNameById(student.classId, student.divisionId)}</TableCell>
                        <TableCell className="text-right">
                          <Badge variant={badgeVariant}>
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
                    <TableCell colSpan={7} className="text-center h-32">
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <BookOpen className="h-8 w-8 mb-2" />
                        <h3 className="font-medium text-lg">No students found</h3>
                        <p>Try adjusting your search terms or filters</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default Students;
