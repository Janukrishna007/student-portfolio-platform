import { supabase } from "@/lib/supabase";
import { Student, Faculty, User } from "@/lib/types";

export class ProfileService {
  /**
   * Get user profile (student or faculty)
   */
  static async getUserProfile(userId: string, userRole: string) {
    try {
      if (userRole === "student") {
        const { data, error } = await supabase
          .from("students")
          .select("*")
          .eq("user_id", userId)
          .single();

        if (error && error.code !== "PGRST116") {
          // PGRST116 = no rows returned
          throw error;
        }

        return { data, error: null };
      } else if (userRole === "faculty") {
        const { data, error } = await supabase
          .from("faculty")
          .select("*")
          .eq("user_id", userId)
          .single();

        if (error && error.code !== "PGRST116") {
          throw error;
        }

        return { data, error: null };
      }

      return { data: null, error: new Error("Invalid user role") };
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return { data: null, error };
    }
  }

  /**
   * Get current user from auth
   */
  static async getCurrentUser() {
    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        return { user: null, profile: null, error: authError };
      }

      // Get user details from users table
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();

      if (userError) {
        return { user: null, profile: null, error: userError };
      }

      // Get profile based on user role
      const { data: profile } = await this.getUserProfile(
        user.id,
        userData.role
      );

      return {
        user: userData as User,
        profile: profile as Student | Faculty | null,
        error: null,
      };
    } catch (error) {
      console.error("Error getting current user:", error);
      return { user: null, profile: null, error };
    }
  }

  /**
   * Update student profile
   */
  static async updateStudentProfile(
    userId: string,
    profileData: Partial<Student>
  ) {
    try {
      const { data, error } = await supabase
        .from("students")
        .upsert({
          user_id: userId,
          ...profileData,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      return { data, error };
    } catch (error) {
      console.error("Error updating student profile:", error);
      return { data: null, error };
    }
  }

  /**
   * Update faculty profile
   */
  static async updateFacultyProfile(
    userId: string,
    profileData: Partial<Faculty>
  ) {
    try {
      const { data, error } = await supabase
        .from("faculty")
        .upsert({
          user_id: userId,
          ...profileData,
        })
        .select()
        .single();

      return { data, error };
    } catch (error) {
      console.error("Error updating faculty profile:", error);
      return { data: null, error };
    }
  }

  /**
   * Upload profile image
   */
  static async uploadProfileImage(
    userId: string,
    file: File,
    userRole: string
  ) {
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${userId}-${Math.random()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(filePath);

      // Update profile with new image URL
      const tableName = userRole === "student" ? "students" : "faculty";
      const columnName =
        userRole === "student" ? "profile_image" : "avatar_url";

      const { error: updateError } = await supabase
        .from(tableName)
        .update({ [columnName]: publicUrl })
        .eq("user_id", userId);

      if (updateError) {
        throw updateError;
      }

      return { url: publicUrl, error: null };
    } catch (error) {
      console.error("Error uploading profile image:", error);
      return { url: null, error };
    }
  }

  /**
   * Get student statistics for profile display
   */
  static async getStudentStats(studentId: string) {
    try {
      // Get certificate counts
      const { data: certificates, error: certError } = await supabase
        .from("certificates")
        .select("category, status")
        .eq("student_id", studentId);

      if (certError) throw certError;

      // Get skills count
      const { data: skills, error: skillsError } = await supabase
        .from("skills")
        .select("category")
        .eq("student_id", studentId);

      if (skillsError) throw skillsError;

      // Calculate stats
      const stats = {
        totalCertificates: certificates?.length || 0,
        verifiedCertificates:
          certificates?.filter((c) => c.status === "verified").length || 0,
        pendingCertificates:
          certificates?.filter((c) => c.status === "pending").length || 0,
        totalSkills: skills?.length || 0,
        technicalSkills:
          skills?.filter((s) => s.category === "technical").length || 0,
        softSkills: skills?.filter((s) => s.category === "soft").length || 0,
        domainSkills:
          skills?.filter((s) => s.category === "domain").length || 0,
      };

      return { stats, error: null };
    } catch (error) {
      console.error("Error getting student stats:", error);
      return { stats: null, error };
    }
  }

  /**
   * Get faculty statistics for profile display
   */
  static async getFacultyStats(facultyId: string) {
    try {
      // Get review counts
      const { data: reviews, error: reviewError } = await supabase
        .from("reviews")
        .select("status")
        .eq("faculty_id", facultyId);

      if (reviewError) throw reviewError;

      // Get students under supervision (based on reviews)
      const { data: students, error: studentsError } = await supabase
        .from("reviews")
        .select(
          `
          certificates!inner(student_id)
        `
        )
        .eq("faculty_id", facultyId);

      if (studentsError) throw studentsError;

      const uniqueStudents = new Set(
        students?.map((r: any) => r.certificates.student_id).filter(Boolean) ||
          []
      );

      const stats = {
        totalReviews: reviews?.length || 0,
        approvedReviews:
          reviews?.filter((r) => r.status === "approved").length || 0,
        pendingReviews:
          reviews?.filter((r) => r.status === "pending").length || 0,
        studentsSupervised: uniqueStudents.size,
      };

      return { stats, error: null };
    } catch (error) {
      console.error("Error getting faculty stats:", error);
      return { stats: null, error };
    }
  }
}
