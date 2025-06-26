import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from "@/contexts/UserContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, FlaskConical } from "lucide-react";
import { SubjectList } from "@/components/subjects/SubjectList";
import { EmptyMessage } from "@/components/subjects/EmptyMessage";

const MySubjects = () => {
  const { user, subjects, practicals } = useUser();

  if (!user) {
    return (
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-4">My Subjects</h1>
        <p>Please log in to view your subjects.</p>
      </div>
    );
  }

  // Get subjects assigned to the current user, separated by type
  const myTheorySubjects = subjects.filter(subject => subject.facultyEmail === user.email && subject.type === 'theory');
  const myPracticalSubjects = subjects.filter(subject => subject.facultyEmail === user.email && subject.type === 'practical');
  
  // Get practicals assigned to the current user (from the separate 'practicals' list)
  const myLegacyPracticals = practicals.filter(practical => practical.teacherEmail === user.email);

  // Combine all practicals into one list for the "Practicals" tab
  const allMyPracticals = [...myPracticalSubjects, ...myLegacyPracticals];

  if (myTheorySubjects.length === 0 && allMyPracticals.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">My Subjects</h1>
          <p className="text-muted-foreground">
            View and manage your assigned subjects and practicals
          </p>
        </div>
        <Card>
          <CardContent className="py-12">
            <EmptyMessage 
              icon={BookOpen}
              title="No Subjects Assigned"
              description="You haven't been assigned to teach any subjects or practicals yet."
              isPageLevel
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Subjects</h1>
        <p className="text-muted-foreground">
          View and manage your assigned subjects and practicals
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Assigned Subjects & Practicals</CardTitle>
          <CardDescription>
            Subjects and practicals you are currently teaching
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="theory" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="theory" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Theory ({myTheorySubjects.length})
              </TabsTrigger>
              <TabsTrigger value="practicals" className="flex items-center gap-2">
                <FlaskConical className="h-4 w-4" />
                Practicals ({allMyPracticals.length})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="theory" className="mt-6">
              <SubjectList subjects={myTheorySubjects} type="theory" />
            </TabsContent>
            
            <TabsContent value="practicals" className="mt-6">
              <SubjectList subjects={allMyPracticals} type="practical" />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default MySubjects;
