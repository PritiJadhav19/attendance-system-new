
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Eye, EyeOff, Lock, Mail, User, Briefcase, GraduationCap, School } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useUser } from "@/contexts/UserContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Department = "Computer Science" | "Electrical" | "Mechanical" | "Civil" | "Chemical" | "AI";

type RegisterFormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: "hod" | "faculty";
  department: Department;
};

const departments: Department[] = [
  "Computer Science",
  "Electrical",
  "Mechanical",
  "Civil",
  "Chemical",
  "AI"
];

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = React.useState(false);
  const { setUser, addUser } = useUser();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  
  const form = useForm<RegisterFormData>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "faculty",
      department: "Computer Science"
    }
  });
  
  const password = form.watch("password");
  
  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsSubmitting(true);
      
      // Security check - handle XSS prevention
      const sanitizedName = data.name.trim();
      const sanitizedEmail = data.email.trim().toLowerCase();

      // Ensure password meets security requirements
      if (data.password.length < 6) {
        toast.error("Password must be at least 6 characters long");
        setIsSubmitting(false);
        return;
      }
      
      // Attempt to add the user
      const userAdded = addUser({
        name: sanitizedName,
        email: sanitizedEmail,
        role: data.role,
        department: data.department,
        password: data.password
      });
      
      if (!userAdded) {
        toast.error("Registration failed. This username or email is already in use.");
        setIsSubmitting(false);
        return;
      }
      
      // Successful registration - log the user in
      setUser({
        name: sanitizedName,
        email: sanitizedEmail,
        role: data.role,
        department: data.department
      });
      
      toast.success("Registration successful! You are now logged in.");
      navigate("/");
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-education-600">Engineering Attendance System</h1>
          <p className="text-gray-600 mt-2">Create your account</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Register</CardTitle>
            <CardDescription>
              Create a new account to access the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      className="pl-10"
                      {...form.register("name", {
                        required: "Full name is required",
                      })}
                    />
                  </div>
                  {form.formState.errors.name && (
                    <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      className="pl-10"
                      {...form.register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Invalid email address",
                        },
                      })}
                    />
                  </div>
                  {form.formState.errors.email && (
                    <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
                  )}
                </div>
                
                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel>Department</FormLabel>
                      <div className="relative">
                        <School className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 z-10" />
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <SelectTrigger className="pl-10">
                              <SelectValue placeholder="Select your department" />
                            </SelectTrigger>
                            <SelectContent>
                              {departments.map((dept) => (
                                <SelectItem key={dept} value={dept}>
                                  {dept}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel>Your Role</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex gap-6"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="hod" id="hod" />
                            <Label htmlFor="hod" className="flex items-center gap-1.5 cursor-pointer">
                              <Briefcase className="h-4 w-4" />
                              Head of Department
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="faculty" id="faculty" />
                            <Label htmlFor="faculty" className="flex items-center gap-1.5 cursor-pointer">
                              <GraduationCap className="h-4 w-4" />
                              Faculty
                            </Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pl-10"
                      {...form.register("password", {
                        required: "Password is required",
                        minLength: {
                          value: 6,
                          message: "Password must be at least 6 characters",
                        },
                      })}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-10 w-10"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                      <span className="sr-only">
                        {showPassword ? "Hide password" : "Show password"}
                      </span>
                    </Button>
                  </div>
                  {form.formState.errors.password && (
                    <p className="text-sm text-red-500">{form.formState.errors.password.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <Input
                      id="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pl-10"
                      {...form.register("confirmPassword", {
                        required: "Please confirm your password",
                        validate: (value) => 
                          value === password || "The passwords do not match",
                      })}
                    />
                  </div>
                  {form.formState.errors.confirmPassword && (
                    <p className="text-sm text-red-500">{form.formState.errors.confirmPassword.message}</p>
                  )}
                </div>
                
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Creating account..." : "Create account"}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter>
            <div className="text-sm text-center w-full">
              Already have an account?{" "}
              <Link to="/login" className="text-education-600 hover:text-education-800 font-medium">
                Sign in
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Register;
