import React, { useMemo, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import AttendanceSummary from "@/components/attendance/AttendanceSummary";
import StudentAttendanceModal from "@/components/attendance/StudentAttendanceModal";
import { useAttendanceSession } from "@/hooks/useAttendanceSession";

const AttendanceDashboard = () => {
  const {
    user,
    myClasses,
    divisions,
    students,
    classSubjects,
    // For a real multi-class dashboard, we'd refactor, but for demo we use current session
  } = useAttendanceSession();

  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);

  const todayStr = new Date().toISOString().slice(0, 10);

  // attendanceStore is global in-memory, see mark attendance page
  const attendanceStore =
    typeof window !== "undefined" && (window as any).attendanceStore
      ? (window as any).attendanceStore
      : {};

  // We'll filter students to only those belonging to the teacher's class(es)
  // myClasses already only contains classes assigned to this teacher
  // We'll also show the class name in the header for clarity

  // Group students by class for teacher analytics
  const studentsByClass = myClasses.map((cls: any) => {
    const classStudents = students.filter((student: any) => student.classId === cls.id);
    return {
      ...cls,
      students: classStudents,
    };
  });

  return (
    <div className="max-w-5xl mx-auto py-8 space-y-8">
      {studentsByClass.map((cls) => {
        // For each class, compute stats for only that class's students
        const classStats = cls.students.map((student: any) => {
          const studentAttendance = (attendanceStore[student.id] || []) as any[];
          const todaysRecords = studentAttendance.filter(
            (rec) => rec.date === todayStr
          );
          const absentToday = todaysRecords.some((rec) => rec.present === false);
          return {
            ...student,
            absentToday,
            attendance: studentAttendance,
          };
        });
        const todaysAbsentees = classStats.filter((s) => s.absentToday);

        return (
          <div key={cls.id} className="mb-10">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">
                  Attendance Overview: <span className="text-primary">{cls.name}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <AttendanceSummary
                  stats={classStats}
                  students={cls.students}
                  onStudentClick={setSelectedStudent}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Today's Absentees</CardTitle>
              </CardHeader>
              <CardContent>
                {todaysAbsentees.length === 0 ? (
                  <div className="text-emerald-700 text-sm py-2">No students are absent today 🚀</div>
                ) : (
                  <ul className="divide-y bg-white border rounded-md overflow-hidden">
                    {todaysAbsentees.map((student) => (
                      <li
                        key={student.id}
                        className="p-4 cursor-pointer hover:bg-accent transition"
                        onClick={() => setSelectedStudent(student)}
                      >
                        <span className="font-bold">{student.name}</span>
                        <span className="ml-2 text-xs text-muted-foreground">
                          ({student.rollNo || student.id})
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>
        );
      })}

      {selectedStudent && (
        <StudentAttendanceModal
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
        />
      )}

      <div className="text-right mt-4">
        <button
          className="text-xs underline text-muted-foreground"
          onClick={() => window.location.reload()}
        >
          Refresh Dashboard
        </button>
      </div>
    </div>
  );
};

export default AttendanceDashboard;
