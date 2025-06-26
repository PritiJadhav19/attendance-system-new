
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TimeSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
}

const TimeSelect: React.FC<TimeSelectProps> = ({ value, onValueChange, placeholder = "Select time" }) => {
  // Generate time slots from 8:00 AM to 6:00 PM with 15-minute intervals
  const timeSlots = [];
  for (let hour = 8; hour <= 18; hour++) {
    const time12 = hour > 12 ? hour - 12 : hour;
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 12 ? 12 : time12;
    
    // Add 4 time slots per hour: :00, :15, :30, :45
    const minutes = ['00', '15', '30', '45'];
    
    minutes.forEach(minute => {
      timeSlots.push({
        value: `${hour.toString().padStart(2, '0')}:${minute}`,
        display: `${displayHour}:${minute} ${ampm}`
      });
    });
  }

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {timeSlots.map((slot) => (
          <SelectItem key={slot.value} value={slot.value}>
            {slot.display}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default TimeSelect;
