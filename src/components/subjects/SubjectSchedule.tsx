
import React from 'react';
import { Calendar, Clock } from 'lucide-react';

interface TimeSlot {
  day: string;
  startTime: string;
  endTime: string;
}

interface SubjectScheduleProps {
  lectureSlots: TimeSlot[];
}

const formatTime = (time: string) => {
  if (!time) return '';
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  return `${displayHour}:${minutes} ${ampm}`;
};

export const SubjectSchedule: React.FC<SubjectScheduleProps> = ({ lectureSlots }) => {
  return (
    <div className="px-4 py-3 bg-muted/20 border-t">
      <h4 className="font-medium mb-2 flex items-center gap-2">
        <Calendar className="h-4 w-4" />
        Weekly Lecture Slots
      </h4>
      {lectureSlots.length === 0 ? (
        <div className="text-center py-4">
          <Calendar className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-muted-foreground">No lectures assigned yet</p>
        </div>
      ) : (
        <div className="grid gap-2">
          {lectureSlots.map((slot, index) => (
            <div 
              key={index} 
              className="flex items-center justify-between p-2 bg-background rounded border"
            >
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{slot.day}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
