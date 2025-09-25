"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { studentOperations } from "@/lib/database";
import { mockStudents } from "@/lib/mock-data";
import type { Student } from "@/lib/types";

interface UseStudentResult {
  student: Student | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useStudent(): UseStudentResult {
  const { user, supabaseUser } = useAuth();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStudent = async () => {
    if (!user) {
      setStudent(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // If we have a Supabase user, try to fetch from database
      if (supabaseUser && user.role === "student") {
        const { data: studentData, error: studentError } = await studentOperations.getStudentByUserId(user.id);
        
        if (studentError) {
          console.error("Error fetching student from database:", studentError);
        } else if (studentData) {
          setStudent(studentData);
          setLoading(false);
          return;
        }
      }

      // Fallback to mock data for development/demo
      if (user.role === "student") {
        const mockStudent = mockStudents.find(s => s.user_id === user.id);
        if (mockStudent) {
          setStudent(mockStudent);
        } else {
          setError("Student profile not found");
        }
      } else {
        setStudent(null);
      }
    } catch (err) {
      console.error("Error in useStudent:", err);
      setError("Failed to load student profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudent();
  }, [user, supabaseUser]);

  const refetch = () => {
    fetchStudent();
  };

  return {
    student,
    loading,
    error,
    refetch,
  };
}
