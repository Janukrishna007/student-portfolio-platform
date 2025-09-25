"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import {
  Upload,
  User,
  Mail,
  Phone,
  Building,
  Calendar,
  GraduationCap,
} from "lucide-react";
import { Student, Faculty, User as UserType } from "@/lib/types";

// Validation schemas
const studentProfileSchema = z.object({
  first_name: z.string().min(2, "First name must be at least 2 characters"),
  last_name: z.string().min(2, "Last name must be at least 2 characters"),
  student_id: z.string().min(3, "Student ID must be at least 3 characters"),
  department: z.string().min(2, "Department is required"),
  year: z.number().min(1).max(4),
  semester: z.number().min(1).max(8),
  cgpa: z.number().min(0).max(10).optional(),
  phone: z.string().optional(),
});

const facultyProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  employee_id: z.string().min(3, "Employee ID must be at least 3 characters"),
  department: z.string().min(2, "Department is required"),
  designation: z.string().min(2, "Designation is required"),
  phone: z.string().optional(),
});

interface ProfileEditFormProps {
  user: UserType;
  profile: Student | Faculty | null;
  onProfileUpdate?: () => void;
}

export function ProfileEditForm({
  user,
  profile,
  onProfileUpdate,
}: ProfileEditFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const { toast } = useToast();

  // Determine if user is student or faculty
  const isStudent = user.role === "student";
  const schema = isStudent ? studentProfileSchema : facultyProfileSchema;

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: isStudent
      ? {
          first_name: (profile as Student)?.first_name || "",
          last_name: (profile as Student)?.last_name || "",
          student_id: (profile as Student)?.student_id || "",
          department: profile?.department || "",
          year: (profile as Student)?.year || 1,
          semester: (profile as Student)?.semester || 1,
          cgpa: (profile as Student)?.cgpa || undefined,
          phone: profile?.phone || "",
        }
      : {
          name: (profile as Faculty)?.name || "",
          employee_id: (profile as Faculty)?.employee_id || "",
          department: profile?.department || "",
          designation: (profile as Faculty)?.designation || "",
          phone: profile?.phone || "",
        },
  });

  useEffect(() => {
    if (profile) {
      const imageUrl = isStudent
        ? (profile as Student).profile_image
        : (profile as Faculty).avatar_url;

      if (imageUrl) {
        setAvatarUrl(imageUrl);
      }
    }
  }, [profile, isStudent]);

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.");
      }

      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(filePath);

      setAvatarUrl(publicUrl);

      // Update profile with new avatar URL
      const tableName = isStudent ? "students" : "faculty";
      const columnName = isStudent ? "profile_image" : "avatar_url";

      const { error: updateError } = await supabase
        .from(tableName)
        .update({ [columnName]: publicUrl })
        .eq("user_id", user.id);

      if (updateError) throw updateError;

      toast({
        title: "Success",
        description: "Profile picture updated successfully!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (values: z.infer<typeof schema>) => {
    try {
      setIsLoading(true);

      const tableName = isStudent ? "students" : "faculty";

      if (profile) {
        // Update existing profile
        const { error } = await supabase
          .from(tableName)
          .update({
            ...values,
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", user.id);

        if (error) throw error;
      } else {
        // Create new profile
        const { error } = await supabase.from(tableName).insert({
          user_id: user.id,
          ...values,
        });

        if (error) throw error;
      }

      toast({
        title: "Success",
        description: "Profile updated successfully!",
      });

      onProfileUpdate?.();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const displayName = isStudent
    ? `${(profile as Student)?.first_name || ""} ${
        (profile as Student)?.last_name || ""
      }`.trim()
    : (profile as Faculty)?.name || "";

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Edit Profile
        </CardTitle>
        <CardDescription>
          Update your profile information to keep it current and accurate.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Avatar Section */}
        <div className="flex flex-col items-center space-y-4">
          <Avatar className="h-24 w-24">
            <AvatarImage src={avatarUrl} alt="Profile picture" />
            <AvatarFallback className="text-lg">
              {displayName ? getInitials(displayName) : getInitials(user.email)}
            </AvatarFallback>
          </Avatar>

          <div className="flex items-center space-x-2">
            <Input
              id="avatar"
              type="file"
              accept="image/*"
              onChange={uploadAvatar}
              disabled={uploading}
              className="hidden"
            />
            <Label
              htmlFor="avatar"
              className="cursor-pointer flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              <Upload className="h-4 w-4" />
              <span>{uploading ? "Uploading..." : "Change Photo"}</span>
            </Label>
          </div>
        </div>

        {/* Profile Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {isStudent ? (
              <>
                {/* Student Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="first_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter first name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="last_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter last name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="student_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Student ID</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter student ID" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Computer Science">
                            Computer Science
                          </SelectItem>
                          <SelectItem value="Information Technology">
                            Information Technology
                          </SelectItem>
                          <SelectItem value="Electronics">
                            Electronics
                          </SelectItem>
                          <SelectItem value="Mechanical">Mechanical</SelectItem>
                          <SelectItem value="Civil">Civil</SelectItem>
                          <SelectItem value="Chemical">Chemical</SelectItem>
                          <SelectItem value="Biotechnology">
                            Biotechnology
                          </SelectItem>
                          <SelectItem value="Mathematics">
                            Mathematics
                          </SelectItem>
                          <SelectItem value="Physics">Physics</SelectItem>
                          <SelectItem value="Chemistry">Chemistry</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="year"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Year</FormLabel>
                        <Select
                          onValueChange={(value) =>
                            field.onChange(parseInt(value))
                          }
                          defaultValue={field.value?.toString()}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select year" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="1">1st Year</SelectItem>
                            <SelectItem value="2">2nd Year</SelectItem>
                            <SelectItem value="3">3rd Year</SelectItem>
                            <SelectItem value="4">4th Year</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="semester"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Semester</FormLabel>
                        <Select
                          onValueChange={(value) =>
                            field.onChange(parseInt(value))
                          }
                          defaultValue={field.value?.toString()}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select semester" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                              <SelectItem key={sem} value={sem.toString()}>
                                Semester {sem}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="cgpa"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CGPA (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          max="10"
                          placeholder="Enter CGPA (0-10)"
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value
                                ? parseFloat(e.target.value)
                                : undefined
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            ) : (
              <>
                {/* Faculty Fields */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="employee_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Employee ID</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter employee ID" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Computer Science">
                            Computer Science
                          </SelectItem>
                          <SelectItem value="Information Technology">
                            Information Technology
                          </SelectItem>
                          <SelectItem value="Electronics">
                            Electronics
                          </SelectItem>
                          <SelectItem value="Mechanical">Mechanical</SelectItem>
                          <SelectItem value="Civil">Civil</SelectItem>
                          <SelectItem value="Chemical">Chemical</SelectItem>
                          <SelectItem value="Biotechnology">
                            Biotechnology
                          </SelectItem>
                          <SelectItem value="Mathematics">
                            Mathematics
                          </SelectItem>
                          <SelectItem value="Physics">Physics</SelectItem>
                          <SelectItem value="Chemistry">Chemistry</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="designation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Designation</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select designation" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Professor">Professor</SelectItem>
                          <SelectItem value="Associate Professor">
                            Associate Professor
                          </SelectItem>
                          <SelectItem value="Assistant Professor">
                            Assistant Professor
                          </SelectItem>
                          <SelectItem value="Lecturer">Lecturer</SelectItem>
                          <SelectItem value="Senior Lecturer">
                            Senior Lecturer
                          </SelectItem>
                          <SelectItem value="Head of Department">
                            Head of Department
                          </SelectItem>
                          <SelectItem value="Dean">Dean</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {/* Common Fields */}
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
