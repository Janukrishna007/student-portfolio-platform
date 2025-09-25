import { supabase } from "./supabase";
import type { Database } from "./supabase";

// Type aliases for easier use
type User = Database["public"]["Tables"]["users"]["Row"];
type Student = Database["public"]["Tables"]["students"]["Row"];
type Certificate = Database["public"]["Tables"]["certificates"]["Row"];

// User operations
export const userOperations = {
  // Create a new user
  async createUser(userData: Database["public"]["Tables"]["users"]["Insert"]) {
    const { data, error } = await supabase
      .from("users")
      .insert(userData)
      .select()
      .single();

    return { data, error };
  },

  // Get user by ID
  async getUserById(id: string) {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .single();

    return { data, error };
  },

  // Get user by email
  async getUserByEmail(email: string) {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    return { data, error };
  },

  // Update user
  async updateUser(
    id: string,
    updates: Database["public"]["Tables"]["users"]["Update"]
  ) {
    const { data, error } = await supabase
      .from("users")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    return { data, error };
  },
};

// Student operations
export const studentOperations = {
  // Create student profile
  async createStudent(
    studentData: Database["public"]["Tables"]["students"]["Insert"]
  ) {
    const { data, error } = await supabase
      .from("students")
      .insert(studentData)
      .select()
      .single();

    return { data, error };
  },

  // Get student by user ID
  async getStudentByUserId(userId: string) {
    const { data, error } = await supabase
      .from("students")
      .select("*")
      .eq("user_id", userId)
      .single();

    return { data, error };
  },

  // Get student by student ID
  async getStudentByStudentId(studentId: string) {
    const { data, error } = await supabase
      .from("students")
      .select("*")
      .eq("student_id", studentId)
      .single();

    return { data, error };
  },

  // Update student
  async updateStudent(
    id: string,
    updates: Database["public"]["Tables"]["students"]["Update"]
  ) {
    const { data, error } = await supabase
      .from("students")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    return { data, error };
  },

  // Get all students (for admin/faculty)
  async getAllStudents() {
    const { data, error } = await supabase
      .from("students")
      .select(
        `
        *,
        users!inner(email, role)
      `
      )
      .order("created_at", { ascending: false });

    return { data, error };
  },
};

// Certificate operations
export const certificateOperations = {
  // Create certificate
  async createCertificate(
    certificateData: Database["public"]["Tables"]["certificates"]["Insert"]
  ) {
    const { data, error } = await supabase
      .from("certificates")
      .insert(certificateData)
      .select()
      .single();

    return { data, error };
  },

  // Get certificates by student ID
  async getCertificatesByStudentId(studentId: string) {
    const { data, error } = await supabase
      .from("certificates")
      .select("*")
      .eq("student_id", studentId)
      .order("created_at", { ascending: false });

    return { data, error };
  },

  // Update certificate
  async updateCertificate(
    id: string,
    updates: Database["public"]["Tables"]["certificates"]["Update"]
  ) {
    const { data, error } = await supabase
      .from("certificates")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    return { data, error };
  },

  // Delete certificate
  async deleteCertificate(id: string) {
    const { data, error } = await supabase
      .from("certificates")
      .delete()
      .eq("id", id);

    return { data, error };
  },

  // Get all pending certificates (for faculty/admin)
  async getPendingCertificates() {
    const { data, error } = await supabase
      .from("certificates")
      .select(
        `
        *,
        students!inner(
          student_id,
          first_name,
          last_name,
          department
        )
      `
      )
      .eq("status", "pending")
      .order("created_at", { ascending: false });

    return { data, error };
  },

  // Get all certificates (for admin)
  async getAllCertificates() {
    const { data, error } = await supabase
      .from("certificates")
      .select(
        `
        *,
        students!inner(
          student_id,
          first_name,
          last_name,
          department
        )
      `
      )
      .order("created_at", { ascending: false });

    return { data, error };
  },
};

// File upload operations
export const fileOperations = {
  // Upload certificate file
  async uploadCertificate(file: File, fileName: string) {
    const { data, error } = await supabase.storage
      .from("certificates")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

    return { data, error };
  },

  // Get certificate URL
  async getCertificateUrl(fileName: string) {
    const { data } = supabase.storage
      .from("certificates")
      .getPublicUrl(fileName);

    return data.publicUrl;
  },

  // Delete certificate file
  async deleteCertificateFile(fileName: string) {
    const { data, error } = await supabase.storage
      .from("certificates")
      .remove([fileName]);

    return { data, error };
  },
};

// Analytics operations (for admin dashboard)
export const analyticsOperations = {
  // Get certificate statistics
  async getCertificateStats() {
    const { data, error } = await supabase
      .from("certificates")
      .select("status, category, created_at");

    if (error) return { data: null, error };

    const stats = {
      total: data.length,
      pending: data.filter((cert) => cert.status === "pending").length,
      verified: data.filter((cert) => cert.status === "verified").length,
      rejected: data.filter((cert) => cert.status === "rejected").length,
      byCategory: {
        academic: data.filter((cert) => cert.category === "academic").length,
        professional: data.filter((cert) => cert.category === "professional")
          .length,
        skill: data.filter((cert) => cert.category === "skill").length,
        achievement: data.filter((cert) => cert.category === "achievement")
          .length,
      },
    };

    return { data: stats, error: null };
  },

  // Get student statistics
  async getStudentStats() {
    const { data, error } = await supabase
      .from("students")
      .select("department, year, created_at");

    if (error) return { data: null, error };

    const stats = {
      total: data.length,
      byDepartment: data.reduce((acc: Record<string, number>, student) => {
        acc[student.department] = (acc[student.department] || 0) + 1;
        return acc;
      }, {}),
      byYear: data.reduce((acc: Record<number, number>, student) => {
        acc[student.year] = (acc[student.year] || 0) + 1;
        return acc;
      }, {}),
    };

    return { data: stats, error: null };
  },
};
