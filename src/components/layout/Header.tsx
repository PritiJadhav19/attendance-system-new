
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, LogOut, Menu, Settings, User } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { toast } from "sonner";
import { useUser } from "@/contexts/UserContext";

const Header = () => {
  const navigate = useNavigate();
  const { user, setUser, isHOD } = useUser();

  const handleLogout = () => {
    // Handle logout logic here
    setUser(null);
    toast.success("Logged out successfully");
    navigate("/login");
  };

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <header className="border-b bg-white px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <SidebarTrigger>
          <Button variant="ghost" size="icon">
            <Menu className="h-5 w-5" />
          </Button>
        </SidebarTrigger>
        <h1 className="text-lg font-semibold sm:text-xl">
          Engineering Attendance System
        </h1>
      </div>
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="rounded-full">
          <Bell className="h-5 w-5" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg" alt="User avatar" />
                <AvatarFallback>{user?.name ? getInitials(user.name) : "U"}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.name || "Guest User"}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email || "guest@example.com"}
                </p>
                {user?.role && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    <p className="text-xs inline-flex items-center bg-primary/10 text-primary rounded-full px-2 py-0.5">
                      {isHOD() ? "Head of Department" : "Faculty"}
                    </p>
                    {user?.department && (
                      <p className="text-xs inline-flex items-center bg-amber-100 text-amber-800 rounded-full px-2 py-0.5">
                        {user.department}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/settings/profile")}>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/settings")}>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
