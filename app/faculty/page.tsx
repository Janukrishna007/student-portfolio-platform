"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { FacultyDashboard } from "@/components/dashboard/faculty-dashboard";

export default function FacultyPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    } else if (!loading && user && user.role !== "faculty") {
      // Redirect to appropriate role-based page
      switch (user.role) {
        case "student":
          router.push("/student");
          break;
        case "admin":
          router.push("/admin");
          break;
        default:
          router.push("/");
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading faculty dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== "faculty") {
    return null;
  }

  return (
    <div className="min-h-screen">
      <FacultyDashboard />
    </div>
  );
}
