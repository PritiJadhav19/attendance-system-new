
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import {
  Download,
  MoreHorizontal,
  Search,
  Trash,
  Shield,
  ShieldOff,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@/contexts/UserContext";

const Faculty = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const { getDepartmentalUsers, isHOD, getUserDepartment, blockFaculty, unblockFaculty, isFacultyBlocked, deleteFaculty } = useUser();

  // Get only faculty users from the current HOD's department
  const departmentUsers = getDepartmentalUsers();
  const departmentalFaculty = departmentUsers.filter(user => user.role === "faculty");
  const department = getUserDepartment();

  const filteredFaculty = departmentalFaculty.filter(
    (faculty) =>
      faculty.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faculty.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteFaculty = (email: string) => {
    const success = deleteFaculty(email);
    if (success) {
      toast({
        title: "Faculty Deleted",
        description: `Faculty with email ${email} has been removed from the system.`,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to delete faculty member.",
        variant: "destructive",
      });
    }
  };
  
  const handleBlockFaculty = (email: string, currentlyBlocked: boolean) => {
    if (currentlyBlocked) {
      // Unblock faculty
      const success = unblockFaculty(email);
      if (success) {
        toast({
          title: "Faculty Unblocked",
          description: `Faculty with email ${email} has been unblocked and can now login.`,
        });
      }
    } else {
      // Block faculty
      const success = blockFaculty(email);
      if (success) {
        toast({
          title: "Faculty Blocked",
          description: `Faculty with email ${email} has been blocked from logging in.`,
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Faculty</h2>
          <p className="text-muted-foreground">
            Manage faculty members information for {department} department
          </p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Faculty List</CardTitle>
              <CardDescription>
                View and manage {department} department faculty members
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search faculty..."
                  className="w-64 pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredFaculty.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Faculty Member</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFaculty.map((faculty) => {
                  const isBlocked = isFacultyBlocked(faculty.email);
                  
                  return (
                    <TableRow key={faculty.email}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src="/placeholder.svg" />
                            <AvatarFallback>
                              {faculty.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-semibold">{faculty.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {faculty.email}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{faculty.email}</TableCell>
                      <TableCell>{faculty.department}</TableCell>
                      <TableCell>
                        {isBlocked ? (
                          <Badge variant="destructive" className="gap-1">
                            <ShieldOff className="h-3 w-3" />
                            Blocked
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="gap-1">
                            <Shield className="h-3 w-3" />
                            Active
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            
                            <DropdownMenuItem onClick={() => handleBlockFaculty(faculty.email, isBlocked)}>
                              {isBlocked ? (
                                <>
                                  <Shield className="mr-2 h-4 w-4" />
                                  Unblock Faculty
                                </>
                              ) : (
                                <>
                                  <ShieldOff className="mr-2 h-4 w-4" />
                                  Block Faculty
                                </>
                              )}
                            </DropdownMenuItem>
                            
                            <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteFaculty(faculty.email)}>
                              <Trash className="mr-2 h-4 w-4" />
                              Delete Faculty
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No faculty members found in your department.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Faculty;
