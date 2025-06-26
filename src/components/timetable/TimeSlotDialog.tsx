
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import TimeSelect from "@/components/timetable/TimeSelect";

interface TimeSlotDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingTimeSlot: any;
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
  getTeacherForSubject: (subjectId: string, subjectType: string) => string | undefined;
  handleSubmit: () => void;
}

const TimeSlotDialog: React.FC<TimeSlotDialogProps> = ({
  open, onOpenChange, editingTimeSlot, days, formData, setFormData,
  classSubjects, classPracticals, getTeacherName, getTeacherForSubject, handleSubmit
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          {editingTimeSlot ? "Edit Time Slot" : "Add Time Slot"}
        </DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <div>
          <Label>Day</Label>
          <Select value={formData.day} onValueChange={(value) => setFormData({...formData, day: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Select day" />
            </SelectTrigger>
            <SelectContent>
              {days.map((day) => (
                <SelectItem key={day} value={day}>{day}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Start Time</Label>
            <TimeSelect
              value={formData.startTime}
              onValueChange={(value) => setFormData({...formData, startTime: value})}
              placeholder="Start time"
            />
          </div>
          <div>
            <Label>End Time</Label>
            <TimeSelect
              value={formData.endTime}
              onValueChange={(value) => setFormData({...formData, endTime: value})}
              placeholder="End time"
            />
          </div>
        </div>
        <div>
          <Label>Subject Type</Label>
          <Select value={formData.subjectType} onValueChange={(value: "theory" | "practical") => setFormData({...formData, subjectType: value, subjectId: ""})}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="theory">Theory</SelectItem>
              <SelectItem value="practical">Practical</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Subject/Practical</Label>
          <Select value={formData.subjectId} onValueChange={(value) => setFormData({...formData, subjectId: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Select subject/practical" />
            </SelectTrigger>
            <SelectContent>
              {formData.subjectType === "theory"
                ? classSubjects.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name} {s.facultyEmail && `(${getTeacherName(s.facultyEmail)})`}
                    </SelectItem>
                  ))
                : classPracticals.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name} {p.teacherEmail && `(${getTeacherName(p.teacherEmail)})`}
                    </SelectItem>
                  ))
              }
            </SelectContent>
          </Select>
        </div>
        {formData.subjectId && (
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-blue-700">
              <strong>Assigned Teacher:</strong> {getTeacherName(getTeacherForSubject(formData.subjectId, formData.subjectType) || "")}
            </p>
          </div>
        )}
        <Button onClick={handleSubmit} className="w-full">
          {editingTimeSlot ? "Update" : "Add"} Time Slot
        </Button>
      </div>
    </DialogContent>
  </Dialog>
);

export default TimeSlotDialog;
