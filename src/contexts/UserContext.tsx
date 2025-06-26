import React, { createContext, useContext, useState, ReactNode } from "react";

type UserRole = "hod" | "faculty" | null;
type Department = "Computer Science" | "Electrical" | "Mechanical" | "Civil" | "Chemical" | "AI" | null;

// Class and Division types
interface Division {
  id: string;
  name: string;
}

// Subject and Practical types
interface Subject {
  id: string;
  name: string;
  code: string;
  classId: string;
  divisionId: string;
  facultyEmail?: string; // Email of the assigned teacher
  type: "theory" | "practical";
  isPractical?: boolean; // Whether this is a practical subject
}

interface Practical {
  id: string;
  name: string;
  classId: string;
  teacherEmail?: string; // Email of the assigned teacher
}

interface Class {
  id: string;
  name: string;
  department: Department;
  divisions: Division[];
  classTeacher?: string; // Email of the class teacher
  yearCoordinator?: string; // Email of the year coordinator
  subjects?: Subject[]; // List of subjects for this class
  practicals?: Practical[]; // List of practicals for this class
}

// Student type - now with attendance tracking properties
interface Student {
  id: string;
  name: string;
  email: string;
  mobile: string;
  regNo: string;
  rollNumber?: string;
  year: number;
  attendance: number;
  attendanceSessions?: number; // Number of sessions attended
  totalSessions?: number; // Total number of sessions
  classId: string;
  divisionId: string;
  mentorEmail?: string; // Email of assigned mentor
  mentorSessionsAttended?: number; // Number of mentor sessions attended
  totalMentorSessions?: number; // Total mentor sessions
  mentorSessionAttendance?: number; // Percentage of mentor session attendance
}

interface User {
  name: string;
  email: string;
  role: UserRole;
  department: Department;
  isBlocked?: boolean; // New field to track blocked faculty
  isHOD?: boolean; // Explicitly indicate if user is HOD
}

// Extended interface that includes password for registration
interface UserWithPassword extends User {
  password: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  subjectId: string;
  subjectType: "theory" | "practical";
  classId: string;
  divisionId: string;
  date: string;
  period: string;
  status: "present" | "absent";
  remarks?: string;
  markedBy: string;
  markedAt: string;
}

// Create a map for mentor session attendance tracking
type MentorSession = {
  studentId: string;
  date: Date;
  isPresent: boolean;
};

// Time slot interface for timetable
interface TimeSlot {
  id: string;
  classId: string;
  divisionId: string;
  day: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday";
  startTime: string; // Format: "HH:MM"
  endTime: string; // Format: "HH:MM"
  subjectId?: string;
  teacherEmail?: string;
  subjectType: "theory" | "practical";
}

// Define UserContextType interface
interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  existingUsers: User[];
  addUser: (newUser: UserWithPassword) => boolean;
  validateCredentials: (email: string, password: string) => User | null;
  isHOD: () => boolean;
  isClassTeacher: (classId: string) => boolean;
  isYearCoordinator: (classId: string) => boolean;
  hasClassAccess: (classId: string) => boolean;
  getUserDepartment: () => Department;
  getDepartmentalUsers: () => User[];
  classes: Class[];
  addClass: (newClass: Omit<Class, "id">) => string | null;
  updateClass: (classId: string, updatedClass: Partial<Omit<Class, "id">>) => boolean;
  deleteClass: (classId: string) => boolean;
  getClassesForDepartment: () => Class[];
  setClassTeacher: (classId: string, teacherEmail: string) => boolean;
  setYearCoordinator: (classId: string, coordinatorEmail: string) => boolean;
  getDepartmentalFaculty: () => User[];
  students: Student[];
  addStudent: (student: Omit<Student, "id">) => string;
  updateStudent: (studentId: string, updatedStudent: Partial<Omit<Student, "id">>) => boolean;
  deleteStudent: (studentId: string) => boolean;
  getStudentsForClass: (classId: string, divisionId?: string) => Student[];
  updateStudentAttendance: (studentId: string, attended: boolean) => boolean;
  getAllStudentsForDepartment: () => Student[];
  getClassNameById: (classId: string) => string;
  getDivisionNameById: (classId: string, divisionId: string) => string;
  checkStudentDuplicates: (student: Partial<Student>, studentId?: string) => string | null;
  blockFaculty: (email: string) => boolean;
  unblockFaculty: (email: string) => boolean;
  isFacultyBlocked: (email: string) => boolean;
  deleteFaculty: (email: string) => boolean;
  isDuplicateClassDivision: (className: string, divisionName: string) => boolean;
  getUniqueClassNames: () => { id: string, name: string }[];
  getDivisionsForClassName: (className: string | null) => Division[];
  subjects: Subject[];
  addSubject: (subject: Omit<Subject, "id">) => string;
  updateSubject: (subjectId: string, updatedSubject: Partial<Omit<Subject, "id">>) => boolean;
  deleteSubject: (subjectId: string) => boolean;
  getSubjectsForClass: (classId: string) => Subject[];
  assignTeacherToSubject: (subjectId: string, teacherEmail: string) => boolean;
  practicals: Practical[];
  addPractical: (practical: Omit<Practical, "id">) => string;
  updatePractical: (practicalId: string, updatedPractical: Partial<Omit<Practical, "id">>) => boolean;
  deletePractical: (practicalId: string) => boolean;
  getPracticalsForClass: (classId: string) => Practical[];
  assignTeacherToPractical: (practicalId: string, teacherEmail: string) => boolean;
  assignMentorToStudent: (studentId: string, mentorEmail: string | null) => boolean;
  getStudentMentor: (studentId: string) => string | null;
  getMenteesForMentor: (mentorEmail: string) => Student[];
  markMenteeAttendance: (menteeId: string, date: Date, isPresent: boolean) => boolean;
  hasMentees: boolean;
  getAllSubjectsForTeacher: (teacherEmail: string) => Subject[];
  getAllPracticalsForTeacher: (teacherEmail: string) => Practical[];
  timeSlots: TimeSlot[];
  addTimeSlot: (newTimeSlot: Omit<TimeSlot, "id">) => string | null;
  updateTimeSlot: (timeSlotId: string, updatedTimeSlot: Partial<Omit<TimeSlot, "id">>) => boolean;
  deleteTimeSlot: (timeSlotId: string) => boolean;
  getTimeSlotsForClass: (classId: string, divisionId?: string) => TimeSlot[];
  getTimeSlotsForTeacher: (teacherEmail: string) => TimeSlot[];
  attendanceRecords: AttendanceRecord[];
  addAttendanceRecord: (record: Omit<AttendanceRecord, 'id' | 'markedAt'>) => boolean;
  getAttendanceRecord: (date: string, period: string, subjectId: string, subjectType: string) => AttendanceRecord | null;
  getAttendanceForStudent: (studentId: string, subjectId: string) => AttendanceRecord[];
  getTimeSlotsForSubject: (subjectId: string, subjectType: "theory" | "practical") => TimeSlot[];
}

// Initial empty arrays instead of mock data
const initialUsers: User[] = [];
const userCredentials: UserWithPassword[] = [];
const initialClasses: Class[] = [];
const initialStudents: Student[] = [];
const initialSubjects: Subject[] = [];
const initialPracticals: Practical[] = [];
const initialTimeSlots: TimeSlot[] = [];

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [existingUsers, setExistingUsers] = useState<User[]>(initialUsers);
  const [classes, setClasses] = useState<Class[]>(initialClasses);
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [subjects, setSubjects] = useState<Subject[]>(initialSubjects);
  const [practicals, setPracticals] = useState<Practical[]>(initialPracticals);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>(initialTimeSlots);
  const [mentorSessions, setMentorSessions] = useState<MentorSession[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);

  // Define getMenteesForMentor first since it's used in the hasMentees computed property
  const getMenteesForMentor = (mentorEmail: string): Student[] => {
    return students.filter(student => student.mentorEmail === mentorEmail);
  };
  
  // Now we can use getMenteesForMentor in the computed property
  const hasMentees = !!user && getMenteesForMentor(user.email).length > 0;
  
  // Check if current user is HOD
  const isHOD = () => {
    return user?.role === "hod";
  };
  
  // Check if current user is the class teacher for a specific class
  const isClassTeacher = (classId: string) => {
    if (!user) return false;
    
    const classItem = classes.find(c => c.id === classId);
    return classItem?.classTeacher === user.email;
  };
  
  // Check if current user is the year coordinator for a specific class
  const isYearCoordinator = (classId: string) => {
    if (!user) return false;
    
    const classItem = classes.find(c => c.id === classId);
    return classItem?.yearCoordinator === user.email;
  };
  
  // Check if current user has access to the class as either class teacher or year coordinator
  const hasClassAccess = (classId: string) => {
    return isClassTeacher(classId) || isYearCoordinator(classId) || isHOD();
  };
  
  // Get current user's department
  const getUserDepartment = () => {
    return user?.department || null;
  };
  
  // Get users filtered by current user's department (for HODs)
  const getDepartmentalUsers = () => {
    if (!user) return [];
    
    // If user is HOD, return only users from their department
    if (isHOD()) {
      return existingUsers.filter(existingUser => 
        existingUser.department === user.department
      );
    }
    
    // Otherwise return an empty array (faculty shouldn't access other users)
    return [];
  };
  
  // Get faculty members from the current user's department (including HOD)
  const getDepartmentalFaculty = () => {
    if (!user || !isHOD()) return [];
    
    return existingUsers.filter(existingUser => 
      existingUser.department === user.department && 
      (existingUser.role === "faculty" || existingUser.role === "hod")
    );
  };
  
  // Add a new user to the system
  const addUser = (newUser: UserWithPassword): boolean => {
    // Check if user with the same email already exists
    if (existingUsers.some(existingUser => existingUser.email === newUser.email)) {
      return false;
    }
    
    // Check if user with the same name already exists
    if (existingUsers.some(existingUser => existingUser.name === newUser.name)) {
      return false;
    }
    
    // Add user to the list of existing users
    const userWithoutPassword: User = {
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      department: newUser.department,
      isBlocked: false, // Default to not blocked
      isHOD: false // Default to not HOD
    };
    
    setExistingUsers(prev => [...prev, userWithoutPassword]);
    
    // Store credentials (in a real app, we'd hash the password)
    const newCredential: UserWithPassword = {
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      department: newUser.department,
      password: newUser.password,
      isBlocked: false,
      isHOD: false
    };
    userCredentials.push(newCredential);
    
    return true;
  };
  
  // Validate user credentials
  const validateCredentials = (email: string, password: string): User | null => {
    const foundUser = userCredentials.find(
      cred => cred.email === email && cred.password === password
    );
    
    if (foundUser) {
      // Check if user is blocked
      if (foundUser.isBlocked) {
        return null; // Don't allow blocked users to login
      }
      
      return {
        name: foundUser.name,
        email: foundUser.email,
        role: foundUser.role,
        department: foundUser.department,
        isBlocked: foundUser.isBlocked,
        isHOD: foundUser.isHOD
      };
    }
    
    return null;
  };
  
  // Delete a faculty member and remove any assignments
  const deleteFaculty = (email: string): boolean => {
    // Check if faculty exists
    const facultyExists = existingUsers.some(u => 
      u.email === email && u.role === "faculty"
    );
    
    if (!facultyExists) return false;
    
    // Remove class teacher and year coordinator assignments
    setClasses(prev => 
      prev.map(c => ({
        ...c,
        classTeacher: c.classTeacher === email ? "" : c.classTeacher,
        yearCoordinator: c.yearCoordinator === email ? "" : c.yearCoordinator
      }))
    );
    
    // Remove subject teacher assignments
    setSubjects(prev => 
      prev.map(s => ({
        ...s,
        facultyEmail: s.facultyEmail === email ? undefined : s.facultyEmail
      }))
    );
    
    // Remove practical teacher assignments
    setPracticals(prev => 
      prev.map(p => ({
        ...p,
        teacherEmail: p.teacherEmail === email ? undefined : p.teacherEmail
      }))
    );
    
    // Delete user from existingUsers
    setExistingUsers(prev => prev.filter(u => u.email !== email));
    
    // Delete user from credentials
    const credIndex = userCredentials.findIndex(u => u.email === email);
    if (credIndex !== -1) {
      userCredentials.splice(credIndex, 1);
    }
    
    return true;
  };
  
  // Check if a class with the same name and division already exists
  const isDuplicateClassDivision = (className: string, divisionName: string): boolean => {
    if (!user) return false;
    
    return classes.some(cls => 
      cls.department === user.department &&
      cls.name === className &&
      cls.divisions.some(div => div.name === divisionName)
    );
  };
  
  // Class management functions
  const addClass = (newClass: Omit<Class, "id">): string | null => {
    // Check for duplicate class-division combination
    if (newClass.divisions.length > 0) {
      const divisionName = newClass.divisions[0].name;
      if (isDuplicateClassDivision(newClass.name, divisionName)) {
        return null; // Return null to indicate failure due to duplicate
      }
    }
    
    // Generate a simple ID
    const id = `${newClass.department?.slice(0, 2).toUpperCase() || "XX"}-${newClass.name.replace(/\s+/g, "")}-${Math.floor(Math.random() * 10000)}`;
    
    // Check if there's another class with the same name in the department
    // If yes, copy its year coordinator
    let yearCoordinator = newClass.yearCoordinator;
    
    if (!yearCoordinator) {
      const existingClass = classes.find(c => 
        c.name === newClass.name && 
        c.department === newClass.department && 
        c.yearCoordinator
      );
      
      if (existingClass && existingClass.yearCoordinator) {
        yearCoordinator = existingClass.yearCoordinator;
      }
    }
    
    const classWithId: Class = {
      id,
      ...newClass,
      yearCoordinator,
      subjects: [],
      practicals: []
    };
    
    setClasses(prev => [...prev, classWithId]);
    return id;
  };
  
  const updateClass = (classId: string, updatedClass: Partial<Omit<Class, "id">>): boolean => {
    const classExists = classes.some(c => c.id === classId);
    if (!classExists) return false;
    
    // If updating division, check for duplicates
    if (updatedClass.divisions && updatedClass.divisions.length > 0) {
      const currentClass = classes.find(c => c.id === classId);
      const newClassName = updatedClass.name || currentClass?.name || "";
      const newDivisionName = updatedClass.divisions[0].name;
      
      // Only check if this is a different division name than the current one
      const currentDivisionName = currentClass?.divisions[0]?.name;
      
      if (currentDivisionName !== newDivisionName && isDuplicateClassDivision(newClassName, newDivisionName)) {
        return false; // Reject the update due to duplicate
      }
    }
    
    setClasses(prev => 
      prev.map(c => 
        c.id === classId 
          ? { ...c, ...updatedClass } 
          : c
      )
    );
    
    return true;
  };
  
  const deleteClass = (classId: string): boolean => {
    const classExists = classes.some(c => c.id === classId);
    if (!classExists) return false;
    
    // Also delete all students in this class
    setStudents(prev => prev.filter(s => s.classId !== classId));
    
    setClasses(prev => prev.filter(c => c.id !== classId));
    return true;
  };
  
  const getClassesForDepartment = (): Class[] => {
    if (!user) return [];
    
    return classes.filter(c => c.department === user.department);
  };
  
  const setClassTeacher = (classId: string, teacherEmail: string): boolean => {
    // Verify that the teacher exists and is in the same department
    const teacher = existingUsers.find(u => 
      u.email === teacherEmail && 
      u.role === "faculty" && 
      u.department === user?.department
    );
    
    if (!teacher && teacherEmail !== "none") return false;
    
    // Convert "none" to empty string for storage
    const emailToStore = teacherEmail === "none" ? "" : teacherEmail;
    
    return updateClass(classId, { classTeacher: emailToStore });
  };
  
  // Method to set year coordinator
  const setYearCoordinator = (classId: string, coordinatorEmail: string): boolean => {
    // Verify that the coordinator exists and is in the same department
    const coordinator = existingUsers.find(u => 
      u.email === coordinatorEmail && 
      u.role === "faculty" && 
      u.department === user?.department
    );
    
    if (!coordinator && coordinatorEmail !== "none") return false;
    
    // Convert "none" to empty string for storage
    const emailToStore = coordinatorEmail === "none" ? "" : coordinatorEmail;
    
    // Find the class to get its name
    const classItem = classes.find(c => c.id === classId);
    if (!classItem) return false;
    
    // Get the class name
    const className = classItem.name;
    
    // Update year coordinator for all classes with the same name
    let success = true;
    classes.forEach(c => {
      if (c.name === className && c.department === user?.department) {
        const updated = updateClass(c.id, { yearCoordinator: emailToStore });
        if (!updated) success = false;
      }
    });
    
    return success;
  };
  
  // Subject management functions
  const addSubject = (subject: Omit<Subject, "id">): string => {
    // Generate a simple ID
    const id = `SUB-${Math.floor(Math.random() * 10000)}`;
    
    const subjectWithId: Subject = {
      id,
      ...subject,
    };
    
    setSubjects(prev => [...prev, subjectWithId]);
    return id;
  };
  
  const updateSubject = (subjectId: string, updatedSubject: Partial<Omit<Subject, "id">>): boolean => {
    const subjectExists = subjects.some(s => s.id === subjectId);
    if (!subjectExists) return false;
    
    setSubjects(prev => 
      prev.map(s => 
        s.id === subjectId 
          ? { ...s, ...updatedSubject } 
          : s
      )
    );
    
    return true;
  };
  
  const deleteSubject = (subjectId: string): boolean => {
    const subjectExists = subjects.some(s => s.id === subjectId);
    if (!subjectExists) return false;
    
    setSubjects(prev => prev.filter(s => s.id !== subjectId));
    return true;
  };
  
  const getSubjectsForClass = (classId: string): Subject[] => {
    return subjects.filter(s => s.classId === classId);
  };
  
  const assignTeacherToSubject = (subjectId: string, teacherEmail: string): boolean => {
    // Verify that the teacher exists and is in the same department
    const teacher = existingUsers.find(u => 
      u.email === teacherEmail && 
      u.role === "faculty" && 
      u.department === user?.department &&
      !u.isBlocked
    );
    
    if (!teacher && teacherEmail !== "none") return false;
    
    // Convert "none" to undefined for storage
    const emailToStore = teacherEmail === "none" ? undefined : teacherEmail;
    
    return updateSubject(subjectId, { facultyEmail: emailToStore });
  };
  
  // Practical management functions
  const addPractical = (practical: Omit<Practical, "id">): string => {
    // Generate a simple ID
    const id = `PRAC-${Math.floor(Math.random() * 10000)}`;
    
    const practicalWithId: Practical = {
      id,
      ...practical,
    };
    
    setPracticals(prev => [...prev, practicalWithId]);
    return id;
  };
  
  const updatePractical = (practicalId: string, updatedPractical: Partial<Omit<Practical, "id">>): boolean => {
    const practicalExists = practicals.some(p => p.id === practicalId);
    if (!practicalExists) return false;
    
    setPracticals(prev => 
      prev.map(p => 
        p.id === practicalId 
          ? { ...p, ...updatedPractical } 
          : p
      )
    );
    
    return true;
  };
  
  const deletePractical = (practicalId: string): boolean => {
    const practicalExists = practicals.some(p => p.id === practicalId);
    if (!practicalExists) return false;
    
    setPracticals(prev => prev.filter(p => p.id !== practicalId));
    return true;
  };
  
  const getPracticalsForClass = (classId: string): Practical[] => {
    return practicals.filter(p => p.classId === classId);
  };
  
  const assignTeacherToPractical = (practicalId: string, teacherEmail: string): boolean => {
    // Verify that the teacher exists and is in the same department
    const teacher = existingUsers.find(u => 
      u.email === teacherEmail && 
      u.role === "faculty" && 
      u.department === user?.department &&
      !u.isBlocked
    );
    
    if (!teacher && teacherEmail !== "none") return false;
    
    // Convert "none" to undefined for storage
    const emailToStore = teacherEmail === "none" ? undefined : teacherEmail;
    
    return updatePractical(practicalId, { teacherEmail: emailToStore });
  };
  
  // Check for duplicate student information
  const checkStudentDuplicates = (student: Partial<Student>, studentId?: string): string | null => {
    // Skip checking the current student itself when updating
    const filteredStudents = studentId 
      ? students.filter(s => s.id !== studentId)
      : students;
    
    // Check for duplicate email
    if (student.email && filteredStudents.some(s => s.email === student.email)) {
      return "A student with this email already exists";
    }
    
    // Check for duplicate registration number
    if (student.regNo && filteredStudents.some(s => s.regNo === student.regNo)) {
      return "A student with this registration number already exists";
    }
    
    // Check for duplicate mobile number
    if (student.mobile && filteredStudents.some(s => s.mobile === student.mobile)) {
      return "A student with this mobile number already exists";
    }
    
    return null;
  };
  
  // Student management functions
  const addStudent = (student: Omit<Student, "id">): string => {
    // Check for duplicates
    const duplicateError = checkStudentDuplicates(student);
    if (duplicateError) {
      // Return empty string to indicate failure
      console.error(duplicateError);
      return "";
    }
    
    // Generate a simple ID
    const id = `S${String(students.length + 1).padStart(3, '0')}`;
    
    const studentWithId: Student = {
      id,
      ...student,
      attendance: 0,
      attendanceSessions: 0,
      totalSessions: 0,
    };
    
    setStudents(prev => [...prev, studentWithId]);
    return id;
  };
  
  const updateStudent = (studentId: string, updatedStudent: Partial<Omit<Student, "id">>): boolean => {
    const student = students.find(s => s.id === studentId);
    if (!student) return false;
    
    // Check for duplicates, but exclude the current student
    const duplicateError = checkStudentDuplicates(updatedStudent, studentId);
    if (duplicateError) {
      console.error(duplicateError);
      return false;
    }
    
    setStudents(prev => 
      prev.map(s => 
        s.id === studentId 
          ? { ...s, ...updatedStudent } 
          : s
      )
    );
    
    return true;
  };
  
  const deleteStudent = (studentId: string): boolean => {
    const studentExists = students.some(s => s.id === studentId);
    if (!studentExists) return false;
    
    setStudents(prev => prev.filter(s => s.id !== studentId));
    return true;
  };
  
  // Modify getStudentsForClass to accept an optional divisionId parameter
  const getStudentsForClass = (classId: string, divisionId?: string): Student[] => {
    // If user is not HOD, class teacher, or year coordinator, deny access
    if (!user) return [];
    
    const hasAccess = hasClassAccess(classId);
    
    // Allow access only to HOD, class teacher, or year coordinator
    if (!hasAccess) return [];
    
    // Filter students by class and division if divisionId is provided
    return students.filter(s => 
      s.classId === classId && 
      (divisionId ? s.divisionId === divisionId : true)
    );
  };
  
  // Add a new function to update student attendance
  const updateStudentAttendance = (studentId: string, attended: boolean): boolean => {
    const studentExists = students.some(s => s.id === studentId);
    if (!studentExists) return false;
    
    setStudents(prev => 
      prev.map(s => {
        if (s.id === studentId) {
          const attendanceSessions = (s.attendanceSessions || 0) + (attended ? 1 : 0);
          const totalSessions = (s.totalSessions || 0) + 1;
          const attendancePercentage = totalSessions > 0 ? Math.round((attendanceSessions / totalSessions) * 100) : 0;
          
          return { 
            ...s, 
            attendanceSessions,
            totalSessions,
            attendance: attendancePercentage
          };
        }
        return s;
      })
    );
    
    return true;
  };
  
  // New method to get all students for the current department
  const getAllStudentsForDepartment = (): Student[] => {
    if (!user) return [];
    
    // If user is HOD, return all students in classes from their department
    const departmentClasses = classes.filter(c => c.department === user.department);
    const departmentClassIds = departmentClasses.map(c => c.id);
    
    return students.filter(student => 
      departmentClassIds.includes(student.classId)
    );
  };
  
  // Helper method to get class name by ID
  const getClassNameById = (classId: string): string => {
    const classItem = classes.find(c => c.id === classId);
    return classItem ? classItem.name : "Unknown Class";
  };
  
  // Helper method to get division name by ID
  const getDivisionNameById = (classId: string, divisionId: string): string => {
    const classItem = classes.find(c => c.id === classId);
    if (!classItem) return "Unknown Division";
    
    const division = classItem.divisions.find(d => d.id === divisionId);
    return division ? division.name : "Unknown Division";
  };
  
  // Faculty blocking functionality
  const blockFaculty = (email: string): boolean => {
    // Find faculty in existing users
    const facultyIndex = existingUsers.findIndex(u => u.email === email && u.role === "faculty");
    if (facultyIndex === -1) return false;
    
    // Update the user to be blocked
    setExistingUsers(prev => {
      const updated = [...prev];
      updated[facultyIndex] = { ...updated[facultyIndex], isBlocked: true };
      return updated;
    });
    
    // Also update in credentials store
    const credIndex = userCredentials.findIndex(u => u.email === email);
    if (credIndex !== -1) {
      userCredentials[credIndex].isBlocked = true;
    }
    
    return true;
  };
  
  // Faculty unblocking functionality
  const unblockFaculty = (email: string): boolean => {
    // Find faculty in existing users
    const facultyIndex = existingUsers.findIndex(u => u.email === email && u.role === "faculty");
    if (facultyIndex === -1) return false;
    
    // Update the user to be unblocked
    setExistingUsers(prev => {
      const updated = [...prev];
      updated[facultyIndex] = { ...updated[facultyIndex], isBlocked: false };
      return updated;
    });
    
    // Also update in credentials store
    const credIndex = userCredentials.findIndex(u => u.email === email);
    if (credIndex !== -1) {
      userCredentials[credIndex].isBlocked = false;
    }
    
    return true;
  };
  
  // Check if faculty is blocked
  const isFacultyBlocked = (email: string): boolean => {
    const faculty = existingUsers.find(u => u.email === email);
    return faculty?.isBlocked === true;
  };
  
  // Get unique class names for the department (for Students panel filtering)
  const getUniqueClassNames = (): { id: string, name: string }[] => {
    if (!user) return [];
    
    const departmentClasses = classes.filter(c => c.department === user.department);
    
    // Create a map to store unique class names with their first occurrence ID
    const uniqueClassMap = new Map<string, string>();
    
    departmentClasses.forEach(cls => {
      if (!uniqueClassMap.has(cls.name)) {
        uniqueClassMap.set(cls.name, cls.id);
      }
    });
    
    // Convert the map to array of objects
    return Array.from(uniqueClassMap.entries()).map(([name, id]) => ({
      id,
      name
    }));
  };
  
  // Get all divisions for a class name (regardless of class ID)
  const getDivisionsForClassName = (className: string | null): Division[] => {
    if (!className || !user) return [];
    
    // Find all classes with this name in the department
    const matchingClasses = classes.filter(c => 
      c.department === user.department && c.name === className
    );
    
    // Collect all divisions from these classes
    const allDivisions: Division[] = [];
    matchingClasses.forEach(cls => {
      cls.divisions.forEach(div => {
        allDivisions.push(div);
      });
    });
    
    return allDivisions;
  };
  
  // Mentor-mentee related functions
  const assignMentorToStudent = (studentId: string, mentorEmail: string | null): boolean => {
    // Verify that student exists
    const studentIndex = students.findIndex(s => s.id === studentId);
    if (studentIndex === -1) return false;
    
    // If mentorEmail is provided, verify that the mentor exists
    if (mentorEmail) {
      const mentorExists = existingUsers.some(u => 
        u.email === mentorEmail && 
        (u.role === "faculty" || u.role === "hod") && 
        !u.isBlocked
      );
      if (!mentorExists) return false;
    }
    
    // Update the student with the mentor's email
    setStudents(prev => {
      const updated = [...prev];
      updated[studentIndex] = {
        ...updated[studentIndex],
        mentorEmail: mentorEmail || undefined,
        mentorSessionsAttended: 0,
        totalMentorSessions: 0,
        mentorSessionAttendance: 0
      };
      return updated;
    });
    
    return true;
  };
  
  const getStudentMentor = (studentId: string): string | null => {
    const student = students.find(s => s.id === studentId);
    return student?.mentorEmail || null;
  };
  
  const markMenteeAttendance = (menteeId: string, date: Date, isPresent: boolean): boolean => {
    // Check if student exists
    const student = students.find(s => s.id === menteeId);
    if (!student) return false;
    
    // Check if session already marked
    const sessionDate = new Date(date);
    sessionDate.setHours(0, 0, 0, 0); // Normalize date to start of day
    
    const existingSession = mentorSessions.find(session => 
      session.studentId === menteeId && 
      session.date.getTime() === sessionDate.getTime()
    );
    
    // If session exists, update it, otherwise add new session
    if (existingSession) {
      // Update existing session
      setMentorSessions(prev => 
        prev.map(session => 
          (session.studentId === menteeId && session.date.getTime() === sessionDate.getTime())
            ? { ...session, isPresent }
            : session
        )
      );
    } else {
      // Add new session
      setMentorSessions(prev => [
        ...prev,
        { studentId: menteeId, date: sessionDate, isPresent }
      ]);
    }
    
    // Update student's mentor session attendance statistics
    const studentSessions = [
      ...mentorSessions.filter(s => s.studentId === menteeId),
      { studentId: menteeId, date: sessionDate, isPresent }
    ];
    
    const totalSessions = studentSessions.length;
    const attendedSessions = studentSessions.filter(s => s.isPresent).length;
    const attendancePercentage = totalSessions > 0 
      ? Math.round((attendedSessions / totalSessions) * 100) 
      : 0;
    
    setStudents(prev => 
      prev.map(s => {
        if (s.id === menteeId) {
          return {
            ...s,
            mentorSessionsAttended: attendedSessions,
            totalMentorSessions: totalSessions,
            mentorSessionAttendance: attendancePercentage
          };
        }
        return s;
      })
    );
    
    return true;
  };
  
  // Subject assignment related functions
  const getAllSubjectsForTeacher = (teacherEmail: string): Subject[] => {
    // Get all subjects assigned to this teacher
    const teacherSubjects = subjects.filter(subject => subject.facultyEmail === teacherEmail);
    
    // Enhance each subject with practical flag
    return teacherSubjects.map(subject => ({
      ...subject,
      isPractical: false
    }));
  };
  
  // Add new functions to get all practicals assigned to a teacher
  const getAllPracticalsForTeacher = (teacherEmail: string): Practical[] => {
    return practicals.filter(practical => practical.teacherEmail === teacherEmail);
  };
  
  // Timetable management functions
  const addTimeSlot = (newTimeSlot: Omit<TimeSlot, "id">): string | null => {
    // Check for overlaps
    if (checkTimeSlotOverlap(newTimeSlot)) {
      return null; // Return null to indicate failure due to overlap
    }
    
    // Generate a simple ID
    const id = `TS-${Math.floor(Math.random() * 10000)}`;
    
    const timeSlotWithId: TimeSlot = {
      id,
      ...newTimeSlot,
    };
    
    setTimeSlots(prev => [...prev, timeSlotWithId]);
    return id;
  };
  
  const updateTimeSlot = (timeSlotId: string, updatedTimeSlot: Partial<Omit<TimeSlot, "id">>): boolean => {
    const timeSlotExists = timeSlots.some(ts => ts.id === timeSlotId);
    if (!timeSlotExists) return false;
    
    // Check for overlaps if time or day is being updated
    if (updatedTimeSlot.day || updatedTimeSlot.startTime || updatedTimeSlot.endTime) {
      const currentTimeSlot = timeSlots.find(ts => ts.id === timeSlotId);
      if (currentTimeSlot) {
        const testTimeSlot = { ...currentTimeSlot, ...updatedTimeSlot };
        if (checkTimeSlotOverlap(testTimeSlot, timeSlotId)) {
          return false; // Reject update due to overlap
        }
      }
    }
    
    setTimeSlots(prev => 
      prev.map(ts => 
        ts.id === timeSlotId 
          ? { ...ts, ...updatedTimeSlot } 
          : ts
      )
    );
    
    return true;
  };
  
  const deleteTimeSlot = (timeSlotId: string): boolean => {
    const timeSlotExists = timeSlots.some(ts => ts.id === timeSlotId);
    if (!timeSlotExists) return false;
    
    setTimeSlots(prev => prev.filter(ts => ts.id !== timeSlotId));
    return true;
  };
  
  const getTimeSlotsForClass = (classId: string, divisionId?: string): TimeSlot[] => {
    return timeSlots.filter(ts => 
      ts.classId === classId && 
      (divisionId ? ts.divisionId === divisionId : true)
    );
  };
  
  const getTimeSlotsForTeacher = (teacherEmail: string): TimeSlot[] => {
    return timeSlots.filter(ts => ts.teacherEmail === teacherEmail);
  };
  
  const checkTimeSlotOverlap = (timeSlot: Omit<TimeSlot, "id">, excludeId?: string): boolean => {
    const startTime = timeSlot.startTime;
    const endTime = timeSlot.endTime;
    
    return timeSlots.some(existing => {
      // Skip the excluded time slot (for updates)
      if (excludeId && existing.id === excludeId) return false;
      
      // Check if same class, division, and day
      if (existing.classId === timeSlot.classId && 
          existing.divisionId === timeSlot.divisionId && 
          existing.day === timeSlot.day) {
        
        // Check for time overlap
        return (startTime < existing.endTime && endTime > existing.startTime);
      }
      
      // Check teacher overlap on same day
      if (timeSlot.teacherEmail && 
          existing.teacherEmail === timeSlot.teacherEmail && 
          existing.day === timeSlot.day) {
        
        // Check for time overlap
        return (startTime < existing.endTime && endTime > existing.startTime);
      }
      
      return false;
    });
  };
  
  // Attendance management functions
  const addAttendanceRecord = (record: Omit<AttendanceRecord, 'id' | 'markedAt'>): boolean => {
    // Check for duplicate
    const existingRecord = attendanceRecords.find(r =>
      r.date === record.date &&
      r.period === record.period &&
      r.subjectId === record.subjectId &&
      r.subjectType === record.subjectType
    );

    if (existingRecord) {
      return false; // Duplicate found
    }

    const newRecord: AttendanceRecord = {
      ...record,
      id: Date.now().toString(),
      markedAt: new Date().toISOString()
    };

    setAttendanceRecords(prev => [...prev, newRecord]);
    return true;
  };

  const getAttendanceRecord = (date: string, period: string, subjectId: string, subjectType: string): AttendanceRecord | null => {
    return attendanceRecords.find(r =>
      r.date === date &&
      r.period === period &&
      r.subjectId === subjectId &&
      r.subjectType === subjectType
    ) || null;
  };

  const getAttendanceForStudent = (studentId: string, subjectId: string): AttendanceRecord[] => {
    return attendanceRecords.filter(r => r.studentId === studentId && r.subjectId === subjectId);
  };

  const getTimeSlotsForSubject = (subjectId: string, subjectType: "theory" | "practical"): TimeSlot[] => {
    return timeSlots.filter(ts => {
      if (subjectType === "theory") {
        // For theory subjects, match the subjectId directly
        return ts.subjectId === subjectId && ts.subjectType === "theory";
      } else {
        // For practicals, we also match by subjectId
        return ts.subjectId === subjectId && ts.subjectType === "practical";
      }
    });
  };

  const value: UserContextType = {
    user, 
    setUser, 
    existingUsers, 
    addUser,
    validateCredentials,
    isHOD,
    isClassTeacher,
    isYearCoordinator,
    hasClassAccess, 
    getUserDepartment,
    getDepartmentalUsers,
    classes,
    addClass,
    updateClass,
    deleteClass,
    getClassesForDepartment,
    setClassTeacher,
    setYearCoordinator,
    getDepartmentalFaculty,
    students,
    addStudent,
    updateStudent,
    deleteStudent,
    getStudentsForClass,
    updateStudentAttendance,
    getAllStudentsForDepartment,
    getClassNameById,
    getDivisionNameById,
    checkStudentDuplicates,
    blockFaculty,
    unblockFaculty,
    isFacultyBlocked,
    deleteFaculty,
    isDuplicateClassDivision,
    getUniqueClassNames,
    getDivisionsForClassName,
    // Subject related methods
    subjects,
    addSubject,
    updateSubject,
    deleteSubject,
    getSubjectsForClass,
    assignTeacherToSubject,
    // Practical related methods
    practicals,
    addPractical,
    updatePractical,
    deletePractical,
    getPracticalsForClass,
    assignTeacherToPractical,
    // Mentor-mentee related methods
    assignMentorToStudent,
    getStudentMentor,
    getMenteesForMentor,
    markMenteeAttendance,
    hasMentees,
    getAllSubjectsForTeacher,
    getAllPracticalsForTeacher,
    // Timetable related methods
    timeSlots,
    addTimeSlot,
    updateTimeSlot,
    deleteTimeSlot,
    getTimeSlotsForClass,
    getTimeSlotsForTeacher,
    // Attendance related methods
    attendanceRecords,
    addAttendanceRecord,
    getAttendanceRecord,
    getAttendanceForStudent,
    getTimeSlotsForSubject
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
