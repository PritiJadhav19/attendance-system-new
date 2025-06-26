
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Users } from "lucide-react";

const AttendanceEmptyState: React.FC = () => (
  <Card>
    <CardContent className="py-12">
      <div className="text-center">
        <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <p className="text-lg font-medium">No Students Found</p>
        <p className="text-sm text-muted-foreground mt-2">
          No students are enrolled in the selected class and division.
        </p>
      </div>
    </CardContent>
  </Card>
);

export default AttendanceEmptyState;
