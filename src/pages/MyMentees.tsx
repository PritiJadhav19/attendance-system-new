
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from "@/contexts/UserContext";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Users, Mail, Phone } from "lucide-react";

const MyMentees = () => {
  const { user, students, classes } = useUser();

  if (!user) {
    return (
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-4">My Mentees</h1>
        <p>Please log in to view your mentees.</p>
      </div>
    );
  }

  // Get students who have the current user as their mentor
  const myMentees = students.filter(student => student.mentorEmail === user.email);

  if (myMentees.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">My Mentees</h1>
          <p className="text-muted-foreground">
            Students under your mentorship
          </p>
        </div>
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg font-medium">No Mentees Assigned</p>
              <p className="text-sm text-muted-foreground mt-2">
                You haven't been assigned as a mentor to any students yet.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Mentees</h1>
        <p className="text-muted-foreground">
          Students under your mentorship
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            My Mentees ({myMentees.length})
          </CardTitle>
          <CardDescription>
            Students you are mentoring and their academic progress
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg overflow-hidden border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Registration No.</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Division</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead className="text-right">Attendance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {myMentees.map((student) => {
                  const studentClass = classes.find(cls => cls.id === student.classId);
                  const division = studentClass?.divisions.find(div => div.id === student.divisionId);
                  
                  // Calculate attendance percentage
                  const attendancePercentage = student.attendance || 0;
                  let badgeVariant: "default" | "destructive" | "outline" = "outline";
                  if (attendancePercentage >= 75) {
                    badgeVariant = "default";
                  } else if (attendancePercentage < 75) {
                    badgeVariant = "destructive";
                  }
                  
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
                      <TableCell>{studentClass?.name || "N/A"}</TableCell>
                      <TableCell>{division?.name || "N/A"}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="h-3 w-3 text-muted-foreground" />
                            {student.email}
                          </div>
                          {student.mobile && (
                            <div className="flex items-center gap-2 text-sm">
                              <Phone className="h-3 w-3 text-muted-foreground" />
                              {student.mobile}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant={badgeVariant}>
                          {student.attendanceSessions || 0} / {student.totalSessions || 0}
                          {' '}
                          ({attendancePercentage}%)
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MyMentees;
