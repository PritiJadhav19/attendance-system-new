
export function filterFacultyTimeslots({
  timeSlots,
  activeClassId,
  selectedDivision,
  selectedSubject,
  userEmail,
  classSubjects,
}: {
  timeSlots: any[] | undefined,
  activeClassId: string | null,
  selectedDivision: string,
  selectedSubject: string,
  userEmail: string | undefined,
  classSubjects: any[]
}) {
  if (!activeClassId || !selectedDivision || !selectedSubject) return [];

  // Find subject type for this subjectId in classSubjects
  const subjObj = classSubjects.find((s) => s.id === selectedSubject);
  const subjectType = subjObj && "type" in subjObj ? subjObj.type : "theory";

  // Get today's day as string, e.g., "Monday"
  const daysOfWeek = [
    "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
  ];
  const todayIndex = typeof window !== "undefined" ? new Date().getDay() : 0;
  const todayDay = daysOfWeek[todayIndex];

  // For debugging
  if (typeof window !== "undefined") {
    console.log("DEBUG-myTimeslots input>>", {
      userEmail,
      timeSlots,
      activeClassId,
      selectedDivision,
      selectedSubject,
      subjectType,
    });
    const withUser = (timeSlots || []).filter(ts => ts.teacherEmail === userEmail);
    console.log("DEBUG-timeslots assigned to this teacher:", withUser);
    const withClass = (timeSlots || []).filter(ts => ts.classId === activeClassId);
    console.log("DEBUG-timeslots assigned to this class:", withClass);
    const withDiv = (timeSlots || []).filter(ts => ts.divisionId === selectedDivision);
    console.log("DEBUG-timeslots assigned to this division:", withDiv);
    const withSub = (timeSlots || []).filter(ts => ts.subjectId === selectedSubject);
    console.log("DEBUG-timeslots assigned to this subject:", withSub);
    const withType = (timeSlots || []).filter(ts => ts.subjectType === subjectType);
    console.log("DEBUG-timeslots assigned to this type:", withType);
    const withToday = (timeSlots || []).filter(ts => ts.day === todayDay);
    console.log("DEBUG-timeslots assigned to today:", withToday);
  }

  return (timeSlots || [])
    .filter(
      (slot) =>
        slot.classId === activeClassId &&
        slot.divisionId === selectedDivision &&
        slot.subjectId === selectedSubject &&
        slot.teacherEmail === userEmail &&
        slot.subjectType === subjectType &&
        slot.day === todayDay
    )
    .sort((a, b) => (a.startTime || "").localeCompare(b.startTime || ""));
}
