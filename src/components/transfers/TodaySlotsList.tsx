
import React from "react";
import { Button } from "@/components/ui/button";

interface TodaySlotsListProps {
  user: any;
  slots: any[];
  onTransfer: (slot: any) => void;
}

const TodaySlotsList: React.FC<TodaySlotsListProps> = ({ user, slots, onTransfer }) => {
  if (!slots || slots.length === 0) {
    return <p className="text-muted-foreground">No lectures assigned to you for today.</p>;
  }
  return (
    <ul className="space-y-4">
      {slots.map(slot => (
        <li
          key={slot.id}
          className="flex flex-col md:flex-row md:items-center justify-between border rounded-lg p-3 bg-white shadow-xs"
        >
          <div>
            <div className="font-medium">{slot.startTime} - {slot.endTime}</div>
            <div className="text-sm text-gray-700">{slot.subject} · {slot.className}</div>
          </div>
          <div className="mt-2 md:mt-0">
            <Button size="sm" onClick={() => onTransfer(slot)}>
              Transfer
            </Button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default TodaySlotsList;
