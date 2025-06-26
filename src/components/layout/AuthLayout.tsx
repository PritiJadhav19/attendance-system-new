
import React, { useEffect } from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { toast } from "sonner";

const AuthLayout = () => {
  const { user } = useUser();
  const location = useLocation();

  useEffect(() => {
    // If accessing auth pages after already being logged in, show a message
    if (user) {
      toast.info("You are already logged in.");
    }
  }, [user, location.pathname]);

  // If the user is already logged in, redirect them to the dashboard
  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1">
        <div className="flex flex-col flex-1 overflow-hidden">
          <main className="flex-1">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
