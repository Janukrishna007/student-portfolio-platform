import { createClient } from "@supabase/supabase-js";

// These will be replaced with your actual Supabase project credentials
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types (these will match your Supabase tables)
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          role: "student" | "faculty" | "admin";
          name?: string;
          avatar_url?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          role?: "student" | "faculty" | "admin";
          name?: string;
          avatar_url?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          role?: "student" | "faculty" | "admin";
          name?: string;
          avatar_url?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      students: {
        Row: {
          id: string;
          user_id: string;
          student_id: string;
          first_name: string;
          last_name: string;
          department: string;
          year: number;
          semester: number;
          cgpa: number | null;
          profile_image: string | null;
          phone: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          student_id: string;
          first_name: string;
          last_name: string;
          department: string;
          year: number;
          semester: number;
          cgpa?: number | null;
          profile_image?: string | null;
          phone?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          student_id?: string;
          first_name?: string;
          last_name?: string;
          department?: string;
          year?: number;
          semester?: number;
          cgpa?: number | null;
          profile_image?: string | null;
          phone?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      faculty: {
        Row: {
          id: string;
          user_id: string;
          employee_id: string;
          name: string;
          department: string;
          designation: string;
          avatar_url: string | null;
          phone: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          employee_id: string;
          name: string;
          department: string;
          designation: string;
          avatar_url?: string | null;
          phone?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          employee_id?: string;
          name?: string;
          department?: string;
          designation?: string;
          avatar_url?: string | null;
          phone?: string | null;
          created_at?: string;
        };
      };
      certificates: {
        Row: {
          id: string;
          student_id: string;
          title: string;
          issuer: string;
          issue_date: string;
          certificate_url: string | null;
          category: "academic" | "professional" | "skill" | "achievement";
          status: "pending" | "verified" | "rejected";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          title: string;
          issuer: string;
          issue_date: string;
          certificate_url?: string | null;
          category: "academic" | "professional" | "skill" | "achievement";
          status?: "pending" | "verified" | "rejected";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          student_id?: string;
          title?: string;
          issuer?: string;
          issue_date?: string;
          certificate_url?: string | null;
          category?: "academic" | "professional" | "skill" | "achievement";
          status?: "pending" | "verified" | "rejected";
          created_at?: string;
          updated_at?: string;
        };
      };
      skills: {
        Row: {
          id: string;
          student_id: string;
          skill_name: string;
          category: "technical" | "soft" | "domain";
          proficiency_level: "beginner" | "intermediate" | "advanced";
          source_certificate_id: string | null;
          ai_confidence: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          skill_name: string;
          category: "technical" | "soft" | "domain";
          proficiency_level?: "beginner" | "intermediate" | "advanced";
          source_certificate_id?: string | null;
          ai_confidence?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          student_id?: string;
          skill_name?: string;
          category?: "technical" | "soft" | "domain";
          proficiency_level?: "beginner" | "intermediate" | "advanced";
          source_certificate_id?: string | null;
          ai_confidence?: number | null;
          created_at?: string;
        };
      };
      portfolios: {
        Row: {
          id: string;
          student_id: string;
          title: string;
          description: string | null;
          portfolio_url: string | null;
          qr_code_url: string | null;
          is_public: boolean;
          last_generated_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          title: string;
          description?: string | null;
          portfolio_url?: string | null;
          qr_code_url?: string | null;
          is_public?: boolean;
          last_generated_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          student_id?: string;
          title?: string;
          description?: string | null;
          portfolio_url?: string | null;
          qr_code_url?: string | null;
          is_public?: boolean;
          last_generated_at?: string;
          created_at?: string;
        };
      };
      reviews: {
        Row: {
          id: string;
          certificate_id: string;
          faculty_id: string;
          status: "approved" | "rejected" | "needs_revision";
          feedback: string | null;
          reviewed_at: string;
        };
        Insert: {
          id?: string;
          certificate_id: string;
          faculty_id: string;
          status: "approved" | "rejected" | "needs_revision";
          feedback?: string | null;
          reviewed_at?: string;
        };
        Update: {
          id?: string;
          certificate_id?: string;
          faculty_id?: string;
          status?: "approved" | "rejected" | "needs_revision";
          feedback?: string | null;
          reviewed_at?: string;
        };
      };
      recommendations: {
        Row: {
          id: string;
          student_id: string;
          type: "job" | "internship" | "course" | "skill";
          title: string;
          description: string | null;
          company_name: string | null;
          relevance_score: number | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          type: "job" | "internship" | "course" | "skill";
          title: string;
          description?: string | null;
          company_name?: string | null;
          relevance_score?: number | null;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          student_id?: string;
          type?: "job" | "internship" | "course" | "skill";
          title?: string;
          description?: string | null;
          company_name?: string | null;
          relevance_score?: number | null;
          is_active?: boolean;
          created_at?: string;
        };
      };
      analytics: {
        Row: {
          id: string;
          report_type: "naac" | "nirf" | "department" | "student_progress";
          data: any;
          generated_by: string;
          period_start: string | null;
          period_end: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          report_type: "naac" | "nirf" | "department" | "student_progress";
          data: any;
          generated_by: string;
          period_start?: string | null;
          period_end?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          report_type?: "naac" | "nirf" | "department" | "student_progress";
          data?: any;
          generated_by?: string;
          period_start?: string | null;
          period_end?: string | null;
          created_at?: string;
        };
      };
    };
  };
}
