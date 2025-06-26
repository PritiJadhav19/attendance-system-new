
import React from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";

const StudentAttendanceModal = ({
  student,
  onClose,
}: {
  student: any;
  onClose: () => void;
}) => {
  const attendances = Array.isArray(student.attendance)
    ? student.attendance
    : [];

  const todayStr = new Date().toISOString().slice(0, 10);
  const today = attendances.filter((a) => a.date === todayStr);
  const monthStr = todayStr.slice(0, 7);
  const thisMonth = attendances.filter((a) => a.date.startsWith(monthStr));
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  const weekStrs = [...Array(7)].map((_, i) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    return d.toISOString().slice(0, 10);
  });
  const thisWeek = attendances.filter((a) => weekStrs.includes(a.date));

  const subjects: Record<string, any[]> = {};
  attendances.forEach((rec) => {
    const subj = rec.subjectId || "Unknown";
    if (!subjects[subj]) subjects[subj] = [];
    subjects[subj].push(rec);
  });

  const renderRows = (rows: any[]) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Lecture</TableHead>
          <TableHead>Subject</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Remark</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((a, i) => (
          <TableRow key={i}>
            <TableCell>{a.date}</TableCell>
            <TableCell>{a.timeslotId || "-"}</TableCell>
            <TableCell>{a.subjectId || "-"}</TableCell>
            <TableCell>
              {a.present ? (
                <span className="text-emerald-700 font-medium">Present</span>
              ) : (
                <span className="text-rose-700 font-medium">Absent</span>
              )}
            </TableCell>
            <TableCell>{a.remark || "-"}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  return (
    <div className="fixed inset-0 z-40 bg-black/40 flex items-center justify-center">
      <div className="bg-white w-full max-w-2xl rounded-lg shadow-2xl p-6 relative animate-scale-in">
        <button
          onClick={onClose}
          className="absolute right-3 top-3 text-lg font-bold text-gray-400 hover:text-gray-600"
        >
          ×
        </button>
        <h3 className="font-bold text-xl mb-4">{student.name}'s Attendance Details</h3>
        <div className="max-h-96 overflow-y-auto space-y-6 pr-2">
          <section>
            <div className="font-semibold text-sm mb-2">Today</div>
            {today.length > 0 ? renderRows(today) : <div className="mb-2 text-muted-foreground">No records today</div>}
          </section>
          <section>
            <div className="font-semibold text-sm mb-2">This Week</div>
            {thisWeek.length > 0 ? renderRows(thisWeek) : <div className="mb-2 text-muted-foreground">No records this week</div>}
          </section>
          <section>
            <div className="font-semibold text-sm mb-2">This Month</div>
            {thisMonth.length > 0 ? renderRows(thisMonth) : <div className="mb-2 text-muted-foreground">No records this month</div>}
          </section>
          <section>
            <div className="font-semibold text-sm mb-2">By Subject</div>
            {Object.entries(subjects).map(([subject, list]) => (
              <div key={subject} className="mb-4">
                <div className="text-xs font-semibold mb-1">{subject}</div>
                {renderRows(list)}
              </div>
            ))}
          </section>
        </div>
      </div>
    </div>
  );
};

export default StudentAttendanceModal;
