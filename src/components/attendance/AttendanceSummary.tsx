
import React from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";

const AttendanceSummary = ({
  stats,
  students,
  onStudentClick,
}: {
  stats: any[];
  students: any[];
  onStudentClick: (student: any) => void;
}) => {
  const presentCount = stats.filter((s) => !s.absentToday).length;
  const absentCount = stats.filter((s) => s.absentToday).length;

  return (
    <div>
      <div className="flex flex-wrap gap-4 mb-5">
        <div className="flex flex-col items-center bg-emerald-100 rounded-md p-4 flex-1 min-w-[130px] shadow-sm">
          <div className="text-xs text-muted-foreground">Present Today</div>
          <div className="font-bold text-2xl text-emerald-700">{presentCount}</div>
        </div>
        <div className="flex flex-col items-center bg-rose-100 rounded-md p-4 flex-1 min-w-[130px] shadow-sm">
          <div className="text-xs text-muted-foreground">Absent Today</div>
          <div className="font-bold text-2xl text-rose-700">{absentCount}</div>
        </div>
      </div>
      <div className="rounded-xl border shadow">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted">
              <TableHead>Roll No.</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Status Today</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stats.map((student) => (
              <TableRow
                key={student.id}
                className="cursor-pointer hover:bg-accent transition"
                onClick={() => onStudentClick(student)}
              >
                <TableCell>{student.rollNo || student.id}</TableCell>
                <TableCell>{student.name}</TableCell>
                <TableCell>
                  {student.absentToday ? (
                    <span className="text-rose-700 font-medium">Absent</span>
                  ) : (
                    <span className="text-emerald-700 font-medium">Present</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AttendanceSummary;
