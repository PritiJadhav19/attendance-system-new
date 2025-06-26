import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, Plus } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import TimeSlotDialog from "@/components/timetable/TimeSlotDialog";
import TimetableGrid from "@/components/timetable/TimetableGrid";
import ClassDivisionSelector from "@/components/timetable/ClassDivisionSelector";
import TimetableActions from "@/components/timetable/TimetableActions";

const Timetable = () => {
  const { 
    user, 
    isHOD, 
    classes, 
    subjects, 
    practicals, 
    existingUsers,
    timeSlots,
    addTimeSlot,
    updateTimeSlot,
    deleteTimeSlot,
    getTimeSlotsForClass,
    getTimeSlotsForTeacher,
    getClassesForDepartment
  } = useUser();

  // Determine user permissions
  const isClassTeacher = user && classes.some(cls => cls.classTeacher === user.email);
  // HOD can now edit timetable for any class, so "canEditTimetable" is true for HOD if class and division are selected
  // For others, it's as before
  // We'll calculate it differently for HOD below
  const [selectedClassName, setSelectedClassName] = useState<string>(
    isHOD() && getClassesForDepartment().length > 0
      ? [...new Set(getClassesForDepartment().map(cls => cls.name))][0]
      : ""
  );

  // Dedupe classes for HOD
  const uniqueClassNameList = useMemo(() => {
    const seen = new Set();
    const list: { name: string }[] = [];
    getClassesForDepartment().forEach(cls => {
      if (!seen.has(cls.name)) {
        seen.add(cls.name);
        list.push({ name: cls.name });
      }
    });
    return list;
  }, [classes]);

  // List all divisions available for the selected class name
  const availableDivisions = useMemo(() => {
    // Find all class objects with the same class name
    const relevantClasses = getClassesForDepartment().filter(cls => cls.name === selectedClassName);
    const divMap = new Map<string, any>();
    relevantClasses.forEach(cls => {
      (cls.divisions || []).forEach((div: any) => {
        if (!divMap.has(div.id)) {
          divMap.set(div.id, div);
        }
      });
    });
    return Array.from(divMap.values());
  }, [selectedClassName, classes]);

  // Store selected division, default to first available
  const [selectedDivision, setSelectedDivision] = useState<string>(
    isHOD() && availableDivisions.length > 0 ? availableDivisions[0].id : ""
  );

  React.useEffect(() => {
    // If the selectedDivision is no longer in the availableDivisions, set to first or empty
    if (isHOD()) {
      if (!availableDivisions.some(div => div.id === selectedDivision)) {
        setSelectedDivision(availableDivisions.length > 0 ? availableDivisions[0].id : "");
      }
    }
    // eslint-disable-next-line
  }, [selectedClassName, availableDivisions]);

  // For class teachers, use original logic (classId, divisionId)
  const [selectedClass, setSelectedClass] = useState<string>(
    isClassTeacher && classes.some(cls => cls.classTeacher === user?.email)
      ? classes.find(cls => cls.classTeacher === user?.email)?.id ?? ""
      : ""
  );

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTimeSlot, setEditingTimeSlot] = useState<any>(null);

  const [formData, setFormData] = useState({
    day: "",
    startTime: "",
    endTime: "",
    subjectId: "",
    subjectType: "theory" as "theory" | "practical"
  });

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  
  // Get classes based on user role
  const availableClasses = isHOD() 
    ? getClassesForDepartment() 
    : classes.filter(cls => cls.classTeacher === user?.email);

  // HOD: find the proper class object from selected name/division
  const selectedClassData = React.useMemo(() => {
    if (isHOD() && selectedClassName && selectedDivision) {
      // Find class object where name matches and division list contains selected division id
      return getClassesForDepartment().find(
        cls => cls.name === selectedClassName && (cls.divisions || []).some((div: any) => div.id === selectedDivision)
      );
    }
    // For non-HOD flow, use selectedClass as before
    return classes.find(c => c.id === selectedClass);
  }, [isHOD, selectedClassName, selectedDivision, selectedClass, classes, getClassesForDepartment]);

  // Permission logic update: allow HOD to edit timetable for any class/division, and class teacher as before
  const canEditTimetable = Boolean(
    (isHOD() && selectedClassData && selectedDivision) ||
    (isClassTeacher && !isHOD())
  );

  // Get subjects and practicals for selected class
  const classSubjects = subjects.filter(s => selectedClassData && s.classId === selectedClassData.id);
  const classPracticals = practicals.filter(p => selectedClassData && p.classId === selectedClassData.id);

  const departmentFaculty = existingUsers.filter(u => 
    (u.role === "faculty" || u.role === "hod") && 
    u.department === user?.department &&
    !u.isBlocked
  );

  const getTeacherForSubject = (subjectId: string, subjectType: string) => {
    if (subjectType === "practical") {
      const practical = classPracticals.find(p => p.id === subjectId);
      return practical?.teacherEmail;
    } else {
      const subject = classSubjects.find(s => s.id === subjectId);
      return subject?.facultyEmail;
    }
  };

  const handleSubmit = () => {
    if ((isHOD() && (!selectedClassData || !selectedDivision || !formData.subjectId))
      || (!isHOD() && (!selectedClass || !selectedDivision || !formData.subjectId))) return;
    
    const teacherEmail = getTeacherForSubject(formData.subjectId, formData.subjectType);
    const classIdForSave = isHOD() ? (selectedClassData ? selectedClassData.id : "") : selectedClass;

    const timeSlotData = {
      classId: classIdForSave,
      divisionId: selectedDivision,
      day: formData.day as any,
      startTime: formData.startTime,
      endTime: formData.endTime,
      subjectId: formData.subjectId,
      teacherEmail: teacherEmail || undefined,
      subjectType: formData.subjectType
    };

    let success = false;
    if (editingTimeSlot) {
      success = updateTimeSlot(editingTimeSlot.id, timeSlotData);
    } else {
      success = !!addTimeSlot(timeSlotData);
    }

    if (success) {
      setIsDialogOpen(false);
      setEditingTimeSlot(null);
      setFormData({
        day: "",
        startTime: "",
        endTime: "",
        subjectId: "",
        subjectType: "theory"
      });
    } else {
      alert("Time slot conflicts with existing schedule!");
    }
  };

  const handleEdit = (timeSlot: any) => {
    setEditingTimeSlot(timeSlot);
    setFormData({
      day: timeSlot.day,
      startTime: timeSlot.startTime,
      endTime: timeSlot.endTime,
      subjectId: timeSlot.subjectId || "",
      subjectType: timeSlot.subjectType
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (timeSlotId: string) => {
    if (window.confirm("Are you sure you want to delete this time slot?")) {
      deleteTimeSlot(timeSlotId);
    }
  };

  // Get current timetable data
  const currentTimeSlots = React.useMemo(() => {
    // HOD: use selectedClassData and selectedDivision,
    // ClassTeacher: use selectedClass and selectedDivision,
    // Teacher: personal view
    if (isHOD() && selectedClassData && selectedDivision) {
      return getTimeSlotsForClass(selectedClassData.id, selectedDivision);
    }
    if (isClassTeacher && selectedClass && selectedDivision) {
      return getTimeSlotsForClass(selectedClass, selectedDivision);
    }
    if (user) {
      return getTimeSlotsForTeacher(user.email);
    }
    return [];
  }, [isHOD, selectedClassData, selectedDivision, isClassTeacher, selectedClass, user, getTimeSlotsForClass, getTimeSlotsForTeacher]);

  const getSubjectName = (subjectId: string, subjectType: string) => {
    if (subjectType === "practical") {
      const practical = classPracticals.find(p => p.id === subjectId);
      return practical ? practical.name : "Unknown Practical";
    } else {
      const subject = classSubjects.find(s => s.id === subjectId);
      return subject ? subject.name : "Unknown Subject";
    }
  };

  const getTeacherName = (email: string) => {
    const teacher = departmentFaculty.find(f => f.email === email);
    if (!teacher) return "Unassigned";
    return teacher.role === "hod" ? `${teacher.name} (HOD)` : teacher.name;
  };

  const todayDayName = days[new Date().getDay() - 1];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Timetable Management</h1>
      </div>

      {/* Only show class/division selection for HOD */}
      {isHOD() && (
        <ClassDivisionSelector
          classNames={uniqueClassNameList}
          selectedClassName={selectedClassName}
          setSelectedClassName={setSelectedClassName}
          divisions={availableDivisions}
          selectedDivision={selectedDivision}
          setSelectedDivision={setSelectedDivision}
        />
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              {isHOD()
                ? "Class Timetable"
                : isClassTeacher
                ? `Timetable for ${
                    classes.find((cls) => cls.classTeacher === user?.email)
                      ?.name
                  }`
                : "My Weekly Schedule"}
            </CardTitle>
            {Boolean(canEditTimetable && selectedClassData && selectedDivision) && (
              <TimetableActions
                isDialogOpen={isDialogOpen}
                setIsDialogOpen={setIsDialogOpen}
                editingTimeSlot={editingTimeSlot}
                setEditingTimeSlot={setEditingTimeSlot}
                days={days}
                formData={formData}
                setFormData={setFormData}
                classSubjects={classSubjects}
                classPracticals={classPracticals}
                getTeacherName={getTeacherName}
                getTeacherForSubject={getTeacherForSubject}
                handleSubmit={handleSubmit}
              />
            )}
          </div>
        </CardHeader>
        <CardContent>
          {((isHOD() && selectedClassData && selectedDivision) ||
            (isClassTeacher && selectedDivision) ||
            (!isHOD() && !isClassTeacher)) ? (
            <TimetableGrid
              days={days}
              currentTimeSlots={currentTimeSlots}
              getSubjectName={getSubjectName}
              getTeacherName={getTeacherName}
              todayDayName={todayDayName}
              canEditTimetable={Boolean(
                canEditTimetable && selectedClassData && selectedDivision
              )}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
              user={user}
            />
          ) : (
            <div className="text-center py-8">
              {isHOD() ? (
                <p className="text-muted-foreground">
                  Please select a class and division to view or edit the
                  timetable.
                </p>
              ) : isClassTeacher ? (
                <p className="text-muted-foreground">
                  Managing timetable for{" "}
                  {
                    classes.find(
                      (cls) => cls.classTeacher === user?.email
                    )?.name
                  }
                  .
                </p>
              ) : (
                <p className="text-muted-foreground">
                  You don't have permission to manage timetables. Only class
                  teachers and HOD can create and modify timetables.
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Timetable;

// This file is getting a bit long! You should consider asking me to refactor it into smaller, focused components for maintainability.
