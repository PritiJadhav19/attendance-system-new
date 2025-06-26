
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, FlaskConical, BookOpen } from "lucide-react";

interface TimetableGridProps {
  days: string[];
  currentTimeSlots: any[];
  getSubjectName: (subId: string, subjectType: string) => string;
  getTeacherName: (email: string) => string;
  todayDayName: string;
  canEditTimetable: boolean;
  handleEdit: (slot: any) => void;
  handleDelete: (slotId: string) => void;
  user: any;
}

const TimetableGrid: React.FC<TimetableGridProps> = ({
  days, currentTimeSlots, getSubjectName, getTeacherName, todayDayName,
  canEditTimetable, handleEdit, handleDelete, user
}) => {
  const isToday = (day: string) => day === todayDayName;

  return (
    <div className="grid grid-cols-1 gap-4">
      {days.map((day) => {
        const daySlots = currentTimeSlots
          .filter(slot => slot.day === day)
          .sort((a, b) => a.startTime.localeCompare(b.startTime));
        return (
          <Card key={day}>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{day}</CardTitle>
            </CardHeader>
            <CardContent>
              {daySlots.length === 0 ? (
                <p className="text-muted-foreground">No classes scheduled</p>
              ) : (
                <div className="space-y-2">
                  {daySlots.map((slot) => {
                    return (
                      <div key={slot.id} className="flex items-center justify-between p-3 border rounded-lg bg-white relative">
                        <div>
                          <div className="font-medium">
                            {slot.startTime} - {slot.endTime}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            {slot.subjectType === "practical" ? (
                              <FlaskConical className="h-4 w-4 text-orange-500" />
                            ) : (
                              <BookOpen className="h-4 w-4 text-blue-500" />
                            )}
                            <span className="capitalize font-medium">
                              {slot.subjectType === "practical" ? "Practical" : "Theory"}:
                            </span>
                            <span>
                              {slot.subjectId ? getSubjectName(slot.subjectId, slot.subjectType) : "No Subject"}
                            </span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Teacher:{" "}
                            {slot.teacherEmail
                              ? getTeacherName(slot.teacherEmail)
                              : "Unassigned"}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {canEditTimetable && (
                            <>
                              <Button variant="outline" size="sm" onClick={() => handleEdit(slot)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => handleDelete(slot.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default TimetableGrid;
