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
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          role?: "student" | "faculty" | "admin";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          role?: "student" | "faculty" | "admin";
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
    };
  };
}
