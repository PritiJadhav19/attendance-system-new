
import React from "react";
import { CalendarDays, User2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface AttendanceSessionInfoProps {
  teacherName?: string;
  date: string;
  day: string;
}

const AttendanceSessionInfo: React.FC<AttendanceSessionInfoProps> = ({
  teacherName,
  date,
  day,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 py-3 rounded-md mb-3 border bg-card/70 shadow-sm sm:gap-0 gap-2"
      )}
    >
      <div className="flex items-center gap-2 text-[15px] text-muted-foreground">
        <User2 size={18} className="text-primary opacity-80" />
        <span>
          <span className="font-medium text-foreground">Class Teacher:</span>{" "}
          {teacherName || <span className="italic text-muted-foreground">N/A</span>}
        </span>
      </div>
      <div className="flex items-center gap-2 text-[15px] text-muted-foreground">
        <CalendarDays size={18} className="text-primary opacity-80" />
        <span>
          <span className="font-medium text-foreground">Date:</span> {date} &middot; {day}
        </span>
      </div>
    </div>
  );
};

export default AttendanceSessionInfo;
