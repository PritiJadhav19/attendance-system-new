import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import NotFound from "./pages/NotFound";
import AppLayout from "./components/layout/AppLayout";
import AuthLayout from "./components/layout/AuthLayout";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import Faculty from "./pages/Faculty";
import Courses from "./pages/Courses";
import Attendance from "./pages/Attendance"; // ✅ Attendance page
import AttendanceMarking from "./pages/AttendanceMarking"; // ✅ AttendanceMarking page
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import { UserProvider, useUser } from "./contexts/UserContext";
import MyClasses from "./pages/MyClasses";
import MyReports from "./pages/MyReports";
import Classes from "./pages/Classes";
import MySubjects from "./pages/MySubjects";
import MyMentees from "./pages/MyMentees";
import Timetable from "./pages/Timetable";
import MyTransfers from "./pages/MyTransfers";

const queryClient = new QueryClient();

const ProtectedRoute = ({
  children,
  requiredRole,
}: {
  children: React.ReactNode;
  requiredRole?: "hod" | "faculty" | null;
}) => {
  const { user, isHOD } = useUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole === "hod" && !isHOD()) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Auth routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Route>

      {/* Protected app routes */}
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Dashboard />} />

        {/* ✅ Both attendance routes */}
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/attendance-marking" element={<AttendanceMarking />} />

        {/* HOD-only routes */}
        <Route
          path="/students"
          element={
            <ProtectedRoute requiredRole="hod">
              <Students />
            </ProtectedRoute>
          }
        />
        <Route
          path="/faculty"
          element={
            <ProtectedRoute requiredRole="hod">
              <Faculty />
            </ProtectedRoute>
          }
        />
        <Route
          path="/classes"
          element={
            <ProtectedRoute requiredRole="hod">
              <Classes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <ProtectedRoute requiredRole="hod">
              <Reports />
            </ProtectedRoute>
          }
        />

        {/* Faculty-specific routes */}
        <Route path="/my-classes" element={<MyClasses />} />
        <Route path="/my-reports" element={<MyReports />} />
        <Route path="/my-subjects" element={<MySubjects />} />
        <Route path="/my-mentees" element={<MyMentees />} />

        {/* Common routes */}
        <Route path="/courses" element={<Courses />} />
        <Route path="/timetable" element={<Timetable />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/my-transfers" element={<MyTransfers />} />
      </Route>

      {/* 404 fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </UserProvider>
    </QueryClientProvider>
  );
};

export default App;
