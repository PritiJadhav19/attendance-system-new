
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

/**
 * @param students - The current students list to be marked for attendance.
 */
export function useAttendanceMarking(students: any[]) {
  const { toast } = useToast();
  const [attendance, setAttendance] = useState<Record<string, boolean>>({});
  const [remarks, setRemarks] = useState("");

  const handleAttendanceToggle = (studentId: string, isPresent: boolean) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: isPresent
    }));
  };

  const markAllPresent = () => {
    const allPresentAttendance: Record<string, boolean> = {};
    students.forEach(student => {
      allPresentAttendance[student.id] = true;
    });
    setAttendance(allPresentAttendance);
    toast({
      title: "All Present",
      description: "Marked all students as present",
    });
  };

  const markAllAbsent = () => {
    const allAbsentAttendance: Record<string, boolean> = {};
    students.forEach(student => {
      allAbsentAttendance[student.id] = false;
    });
    setAttendance(allAbsentAttendance);
    toast({
      title: "All Absent",
      description: "Marked all students as absent",
    });
  };

  const getPresentCount = () => Object.values(attendance).filter(Boolean).length;
  const getAbsentCount = () => Object.values(attendance).filter(present => !present).length;

  const resetAttendance = () => {
    setAttendance({});
    setRemarks("");
  };

  return {
    attendance,
    setAttendance,
    handleAttendanceToggle,
    markAllPresent,
    markAllAbsent,
    remarks,
    setRemarks,
    getPresentCount,
    getAbsentCount,
    resetAttendance,
  };
}
