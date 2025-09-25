"use client";

import { useState, useEffect } from "react";
import { useMockAuth } from "@/lib/mock-auth";
import { facultyService } from "@/lib/faculty-service";
import type { Database } from "@/lib/supabase";

type Faculty = Database["public"]["Tables"]["faculty"]["Row"];

interface UseFacultyResult {
  faculty: Faculty | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useFaculty(): UseFacultyResult {
  const { user } = useMockAuth();
  const [faculty, setFaculty] = useState<Faculty | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFaculty = async () => {
    if (!user) {
      setFaculty(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Only fetch if user is faculty
      if (user.role === "faculty") {
        const facultyData = await facultyService.getFacultyByUserId(user.id);

        if (facultyData) {
          setFaculty(facultyData);
        } else {
          setError("Faculty profile not found");
        }
      } else {
        setFaculty(null);
      }
    } catch (err) {
      console.error("Error in useFaculty:", err);
      setError("Failed to load faculty profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaculty();
  }, [user]);

  const refetch = () => {
    fetchFaculty();
  };

  return {
    faculty,
    loading,
    error,
    refetch,
  };
}
