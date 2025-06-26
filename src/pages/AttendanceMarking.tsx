import React, { useState, useEffect } from "react";
import { useAttendanceSession } from "@/hooks/useAttendanceSession";
import { useAttendanceMarking } from "@/hooks/useAttendanceMarking";
import { useToast } from "@/hooks/use-toast";
import SessionDetails from "@/components/attendance/SessionDetails";
import StudentAttendanceTable from "@/components/attendance/StudentAttendanceTable";
import AttendanceEmptyState from "@/components/attendance/AttendanceEmptyState";
import AttendanceSessionInfo from "@/components/attendance/AttendanceSessionInfo";
import { CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";

// Helper to uniquely identify a session locally
const getSessionKey = (cls, div, subj, timeslot, dateStr) =>
  [cls, div, subj, timeslot, dateStr].join("|");

const AttendanceMarking = () => {
  const {
    user,
    myClasses,
    selectedClass,
    setSelectedClass,
    divisions,
    selectedDivision,
    setSelectedDivision,
    classSubjects,
    selectedSubject,
    setSelectedSubject,
    selectedTimeslot,
    setSelectedTimeslot,
    students,
    myTimeslots
  } = useAttendanceSession();

  const {
    attendance,
    handleAttendanceToggle,
    markAllPresent,
    markAllAbsent,
    remarks,
    setRemarks,
    getPresentCount,
    getAbsentCount,
    resetAttendance,
  } = useAttendanceMarking(students);

  const { toast } = useToast();

  // Date setup for session key
  const today = new Date();
  const dateString = today.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
  const dayString = today.toLocaleDateString(undefined, { weekday: "long" });

  // Local state: was attendance marked?
  const [attendanceMarked, setAttendanceMarked] = useState(false);

  // Map session to lock using localStorage, so refresh keeps lock this browser
  useEffect(() => {
    // Check on session change or refresh
    if (selectedClass && selectedDivision && selectedSubject && selectedTimeslot) {
      const sessionKey = getSessionKey(selectedClass, selectedDivision, selectedSubject, selectedTimeslot, dateString);
      setAttendanceMarked(localStorage.getItem("attendance:marked:" + sessionKey) === "yes");
    } else {
      setAttendanceMarked(false);
    }
    // Reset when filters change
    resetAttendance();
    // eslint-disable-next-line
  }, [selectedClass, selectedDivision, selectedSubject, selectedTimeslot]);

  // --- NEW: Reset session filter helpers ---
  // simple helper to reset all filter dropdowns
  const resetSessionFilters = () => {
    setSelectedClass("");
    setSelectedDivision("");
    setSelectedSubject("");
    setSelectedTimeslot("");
  };

  const submitAttendance = () => {
    if (!selectedClass || !selectedSubject || !selectedDivision || !selectedTimeslot) {
      toast({
        title: "Missing Information",
        description: "Please select class, subject, division, and timeslot",
        variant: "destructive"
      });
      return;
    }
    if (Object.keys(attendance).length === 0) {
      toast({
        title: "No Attendance Marked",
        description: "Please mark attendance for at least one student",
        variant: "destructive"
      });
      return;
    }
    const presentCount = getPresentCount();
    const totalCount = students.length;

    // Store session as marked locally
    const sessionKey = getSessionKey(selectedClass, selectedDivision, selectedSubject, selectedTimeslot, dateString);
    localStorage.setItem("attendance:marked:" + sessionKey, "yes");
    setAttendanceMarked(true);

    toast({
      title: "Attendance Submitted",
      description: `Submitted attendance for ${totalCount} students (${presentCount} present, ${totalCount - presentCount} absent)`,
    });

    // Reset everything AFTER a tiny delay so the success animation/panel renders smoothly
    setTimeout(() => {
      resetAttendance();
      resetSessionFilters();
    }, 400);
  };

  if (!user) {
    return (
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-4">Mark Attendance</h1>
        <p>Please log in to mark attendance.</p>
      </div>
    );
  }

  // Only show student list if ALL dropdowns are filled
  const allFiltersFilled = !!(selectedClass && selectedDivision && selectedSubject && selectedTimeslot);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Mark Attendance</h1>
        <p className="text-muted-foreground">
          Record student attendance for your classes
        </p>
      </div>
      <SessionDetails
        myClasses={myClasses}
        selectedClass={selectedClass}
        setSelectedClass={setSelectedClass}
        divisions={divisions}
        selectedDivision={selectedDivision}
        setSelectedDivision={setSelectedDivision}
        classSubjects={classSubjects}
        selectedSubject={selectedSubject}
        setSelectedSubject={setSelectedSubject}
        selectedTimeslot={selectedTimeslot}
        setSelectedTimeslot={setSelectedTimeslot}
        myTimeslots={myTimeslots}
      />
      {allFiltersFilled && students.length > 0 ? (
        attendanceMarked ? (
          <div className="flex flex-col items-center justify-center mt-10">
            <Card className="flex flex-col items-center px-8 py-12 max-w-lg">
              <CheckCircle2 className="h-14 w-14 text-green-600 mb-4" />
              <h2 className="text-2xl font-bold mb-2 text-green-700 text-center">Attendance Marked Successfully</h2>
              <p className="text-muted-foreground text-center">
                Attendance has been submitted for the selected session.<br />
                Further changes are disabled.
              </p>
            </Card>
          </div>
        ) : (
          <>
            <AttendanceSessionInfo
              teacherName={user?.name || ""}
              date={dateString}
              day={dayString}
            />
            <StudentAttendanceTable
              students={students}
              attendance={attendance}
              handleAttendanceToggle={handleAttendanceToggle}
              markAllPresent={markAllPresent}
              markAllAbsent={markAllAbsent}
              presentCount={getPresentCount()}
              absentCount={getAbsentCount()}
              submitAttendance={submitAttendance}
              disabled={attendanceMarked}
            />
          </>
        )
      ) : (
        allFiltersFilled && <AttendanceEmptyState />
      )}
    </div>
  );
};

export default AttendanceMarking;
