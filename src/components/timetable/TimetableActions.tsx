
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import TimeSlotDialog from "@/components/timetable/TimeSlotDialog";

interface TimetableActionsProps {
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  editingTimeSlot: any;
  setEditingTimeSlot: (slot: any) => void;
  days: string[];
  formData: {
    day: string;
    startTime: string;
    endTime: string;
    subjectId: string;
    subjectType: "theory" | "practical";
  };
  setFormData: (data: any) => void;
  classSubjects: any[];
  classPracticals: any[];
  getTeacherName: (email: string) => string;
  getTeacherForSubject: (id: string, type: string) => string | undefined;
  handleSubmit: () => void;
}

const TimetableActions: React.FC<TimetableActionsProps> = ({
  isDialogOpen,
  setIsDialogOpen,
  editingTimeSlot,
  setEditingTimeSlot,
  days,
  formData,
  setFormData,
  classSubjects,
  classPracticals,
  getTeacherName,
  getTeacherForSubject,
  handleSubmit,
}) => (
  <>
    <TimeSlotDialog
      open={isDialogOpen}
      onOpenChange={setIsDialogOpen}
      editingTimeSlot={editingTimeSlot}
      days={days}
      formData={formData}
      setFormData={setFormData}
      classSubjects={classSubjects}
      classPracticals={classPracticals}
      getTeacherName={getTeacherName}
      getTeacherForSubject={getTeacherForSubject}
      handleSubmit={handleSubmit}
    />
    <Button
      onClick={() => {
        setEditingTimeSlot(null);
        setIsDialogOpen(true);
      }}
    >
      <Plus className="h-4 w-4 mr-2" />
      Add Time Slot
    </Button>
  </>
);

export default TimetableActions;
