import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
} from "@/components/ui/sidebar";
import {
  BarChart3,
  CalendarClock,
  GraduationCap,
  Home,
  Settings,
  UserSquare2,
  Users,
  ClipboardList,
  BookmarkIcon,
  UserCheck,
  Award,
  Book,
  Calendar,
  Share,
} from "lucide-react";
import { useUser } from "@/contexts/UserContext";

// Define a type for menu items with optional highlight property
interface MenuItem {
  title: string;
  icon: React.FC<any>;
  path: string;
  highlight?: boolean;
  badge?: string;
}

const Sidebar = () => {
  const { isHOD, getUserDepartment, user, classes, hasMentees } = useUser();
  const department = getUserDepartment();
  
  const isClassTeacher = user && classes.some(cls => cls.classTeacher === user.email);
  const isYearCoordinator = user && classes.some(cls => cls.yearCoordinator === user.email);
  
  const getClassesMenuConfig = () => {
    if (isClassTeacher && isYearCoordinator) {
      return { 
        icon: Award, 
        highlight: false,
        badge: "Multiple Roles" 
      };
    } else if (isClassTeacher) {
      return { 
        icon: UserCheck, 
        highlight: false,
        badge: "Teacher" 
      };
    } else if (isYearCoordinator) {
      return { 
        icon: Award, 
        highlight: false,
        badge: "Coordinator" 
      };
    }
    return { 
      icon: ClipboardList, 
      highlight: false,
      badge: undefined 
    };
  };
  
  const classesMenuConfig = getClassesMenuConfig();
  
  const commonMenuItems: MenuItem[] = [
    {
      title: "Dashboard",
      icon: Home,
      path: "/",
    },
    {
      title: "Attendance",
      icon: CalendarClock,
      path: "/attendance", // <--- points to new AttendanceDashboard page
    },
    {
      title: "Mark Attendance",
      icon: UserCheck,
      path: "/attendance-marking",
      highlight: false,
    },
    {
      title: "Lecture Transfer", // changed from "My Transfers"
      icon: Share,
      path: "/my-transfers",
      highlight: false,
    },
    {
      title: "Timetable",
      icon: Calendar,
      path: "/timetable",
    },
    {
      title: "My Subjects",
      icon: Book,
      path: "/my-subjects",
      highlight: false,
    },
  ];

  const hodMenuItems: MenuItem[] = [
    {
      title: "Students",
      icon: Users,
      path: "/students",
    },
    {
      title: "Faculty",
      icon: UserSquare2,
      path: "/faculty",
    },
    {
      title: "Classes",
      icon: BookmarkIcon,
      path: "/classes",
    },
    {
      title: "My Mentees",
      icon: UserCheck,
      path: "/my-mentees",
      highlight: hasMentees,
      badge: hasMentees ? "Mentor" : undefined,
    },
    {
      title: "Reports",
      icon: BarChart3,
      path: "/reports",
    },
  ];

  const facultyMenuItems: MenuItem[] = [
    {
      title: "My Classes",
      icon: classesMenuConfig.icon,
      path: "/my-classes",
      highlight: classesMenuConfig.highlight,
      badge: classesMenuConfig.badge,
    },
    {
      title: "My Mentees",
      icon: UserCheck,
      path: "/my-mentees",
      highlight: hasMentees,
      badge: hasMentees ? "Mentor" : undefined,
    },
  ];

  const settingsMenuItem: MenuItem = {
    title: "Settings",
    icon: Settings,
    path: "/settings",
  };

  const menuItems = [
    ...commonMenuItems,
    ...(isHOD() ? hodMenuItems : facultyMenuItems),
    settingsMenuItem,
  ];

  return (
    <ShadcnSidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <GraduationCap className="h-8 w-8 text-education-600" />
          <div className="flex flex-col">
            <span className="text-xl font-bold">AttendEng</span>
            {department && (
              <span className="text-xs text-muted-foreground">{department}</span>
            )}
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild className="w-full">
                    <NavLink
                      to={item.path}
                      className={({ isActive: navLinkIsActive }) =>
                        `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                          navLinkIsActive
                            ? "bg-education-100 text-black font-medium" // Changed text-education-700 to text-black
                            : "text-black hover:bg-gray-100"
                        }`
                      }
                    >
                      {({ isActive: navLinkIsActive }) => (
                        <>
                          <item.icon
                            className={`h-5 w-5 ${
                              navLinkIsActive ? "text-black" : "text-black" // Changed active icon color to text-black
                            }`}
                          />
                          <span
                            className={`${
                              navLinkIsActive
                                ? "text-black font-medium" // Changed text-education-700 to text-black
                                : "text-black"
                            }`}
                          >
                            {item.title}
                          </span>
                          {item.badge && (
                            <span
                              className={`ml-auto text-xs px-2 py-1 rounded-full ${
                                navLinkIsActive
                                  ? "bg-education-100 text-black" // Changed active badge text to text-black
                                  : "bg-gray-200 text-gray-700"
                              }`}
                            >
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </ShadcnSidebar>
  );
};

export default Sidebar;
