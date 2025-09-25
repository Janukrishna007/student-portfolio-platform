"use client";

import { useState, useEffect } from "react";
import { ProfileDisplay } from "@/components/profile/profile-display";
import { ProfileService } from "@/lib/profile-service";
import { Student, Faculty, User } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Student | Faculty | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      const {
        user: currentUser,
        profile: userProfile,
        error: profileError,
      } = await ProfileService.getCurrentUser();

      if (profileError) {
        throw profileError;
      }

      if (!currentUser) {
        setError("Please log in to view your profile");
        return;
      }

      setUser(currentUser);
      setProfile(userProfile);
    } catch (err: any) {
      console.error("Error loading profile:", err);
      setError(err.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="w-full max-w-4xl mx-auto space-y-6">
          {/* Profile Card Skeleton */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-20 w-20 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-8 w-48" />
                    <div className="flex space-x-2">
                      <Skeleton className="h-6 w-20" />
                      <Skeleton className="h-6 w-32" />
                    </div>
                    <Skeleton className="h-4 w-56" />
                  </div>
                </div>
                <Skeleton className="h-10 w-32" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Skeleton className="h-px w-full" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-6 w-48" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <Skeleton className="h-8 w-8 rounded" />
                    <div className="space-y-1">
                      <Skeleton className="h-8 w-12" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="w-full max-w-2xl mx-auto">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="w-full max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Access Denied</CardTitle>
              <CardDescription>
                Please log in to view your profile.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">My Profile</h1>
        <p className="text-muted-foreground">
          Manage your profile information and view your statistics
        </p>
      </div>

      <ProfileDisplay user={user} profile={profile} onEdit={loadProfile} />
    </div>
  );
}
