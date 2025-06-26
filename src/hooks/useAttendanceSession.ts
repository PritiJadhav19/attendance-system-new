import { useUser } from "@/contexts/UserContext";
import { useState, useMemo } from "react";
import { filterFacultyTimeslots } from "@/utils/attendanceUtils";

export function useAttendanceSession() {
  const { user, classes, subjects, practicals, getStudentsForClass, timeSlots } = useUser();

  const [selectedClass, setSelectedClass] = useState("");
  const [selectedDivision, setSelectedDivision] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedTimeslot, setSelectedTimeslot] = useState("");

  // Deduplicate classes by name for the Class dropdown
  const myClasses = useMemo(() => {
    const uniqueClassMap = new Map<string, any>();
    classes.forEach(cls => {
      if (!uniqueClassMap.has(cls.name)) {
        uniqueClassMap.set(cls.name, cls);
      }
    });
    return Array.from(uniqueClassMap.values());
  }, [classes]);

  // Find the selected class object by id
  const selectedClassObj = useMemo(
    () => classes.find(cls => cls.id === selectedClass),
    [classes, selectedClass]
  );

  // When a class is selected, use the name to get ALL related classes (with different divisions)
  const selectedClassName = selectedClassObj ? selectedClassObj.name : "";
  const allClassesWithSelectedName = useMemo(
    () => classes.filter(cls => cls.name === selectedClassName),
    [classes, selectedClassName]
  );

  // Collect all unique divisions for the selected class name (deduplicate by id)
  const divisions = useMemo(() => {
    const divisionsMap = new Map<string, any>();
    allClassesWithSelectedName.forEach(cls => {
      (cls.divisions || []).forEach((division: any) => {
        if (!divisionsMap.has(division.id)) {
          divisionsMap.set(division.id, division);
        }
      });
    });
    return Array.from(divisionsMap.values());
  }, [allClassesWithSelectedName]);

  // To find the correct classId to use when both class and division are selected,
  // find the class whose name matches and which has the division.
  let activeClassId: string | null = null;
  if (selectedClassName && selectedDivision) {
    const classWithDivision = allClassesWithSelectedName.find(cls =>
      (cls.divisions || []).some((div: any) => div.id === selectedDivision)
    );
    activeClassId = classWithDivision ? classWithDivision.id : null;
  }

  // LOGGING: Show all theory subjects and practicals for debugging
  if (typeof window !== "undefined") {
    console.log("All subjects (theory & practical):", subjects, practicals);
    console.log("Active class:", activeClassId, "Selected division:", selectedDivision);
  }

  // Filter: Only show theory subjects assigned to current faculty for this class/division
  const theorySubjects = useMemo(() =>
    subjects.filter(subject =>
      activeClassId &&
      subject.classId === activeClassId &&
      subject.facultyEmail === user?.email &&
      (
        subject.divisionId === "default-division" ||
        (selectedDivision && subject.divisionId === selectedDivision)
      )
    ), [subjects, activeClassId, user, selectedDivision]
  );

  // Filter: Only show practicals assigned to the current faculty for this class/division
  // Note: "practicals" struct: id, name, classId, teacherEmail
  const practicalSubjects = useMemo(() => {
    if (!activeClassId || !selectedDivision) return [];
    // Only include practicals for this class and teacher,
    // If division exists on class, practicals should match division
    // However, legacy practicals may not have divisionId, so we only require classId and teacherEmail
    return practicals
      .filter(practical =>
        practical.classId === activeClassId &&
        practical.teacherEmail === user?.email
      )
      // Return shape matching the dropdown (id, name, type)
      .map(practical => ({
        ...practical,
        facultyEmail: practical.teacherEmail, // For consistency if future filtering is needed
        type: "practical",
        // Add divisionId if available in practical, otherwise rely on class/teacher only
      }));
  }, [practicals, activeClassId, selectedDivision, user]);

  // Combine both for the dropdown; dropdown should show both theory and practicals
  const classSubjects = useMemo(() => {
    // Add a "type" property to each
    const theory = theorySubjects.map(subject => ({
      ...subject,
      type: "theory"
    }));
    return [
      ...theory,
      ...practicalSubjects
    ];
  }, [theorySubjects, practicalSubjects]);

  // Get students for active class/division
  const students = useMemo(
    () =>
      activeClassId && selectedDivision
        ? getStudentsForClass(activeClassId, selectedDivision).sort((a, b) =>
            a.name.localeCompare(b.name),
          )
        : [],
    [activeClassId, selectedDivision, getStudentsForClass]
  );

  // Timeslot filtering — refactored
  const myTimeslots = useMemo(
    () =>
      filterFacultyTimeslots({
        timeSlots,
        activeClassId,
        selectedDivision,
        selectedSubject,
        userEmail: user?.email,
        classSubjects,
      }),
    [timeSlots, activeClassId, selectedDivision, selectedSubject, user, classSubjects]
  );

  return {
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
  };
}
