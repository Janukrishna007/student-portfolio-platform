"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMockAuth } from "@/lib/mock-auth";
import { Loader2 } from "lucide-react";

export function AuthRedirect() {
  const { user, loading, userRole } = useMockAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user && userRole) {
      const roleRoutes = {
        admin: "/admin",
        faculty: "/faculty",
        student: "/student",
      };

      const redirectPath =
        roleRoutes[userRole as keyof typeof roleRoutes] || "/student";
      router.replace(redirectPath);
    } else if (!loading && !user) {
      router.replace("/");
    }
  }, [user, loading, userRole, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-50">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 mx-auto mb-6">
          <div className="w-full h-full bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-xl">SP</span>
          </div>
        </div>
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-purple-600" />
        <h2 className="text-xl font-semibold text-gray-900">
          Setting up your dashboard...
        </h2>
        <p className="text-gray-600">
          Please wait while we prepare your personalized experience.
        </p>
      </div>
    </div>
  );
}
