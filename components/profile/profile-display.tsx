"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ProfileEditForm } from "./profile-edit-form";
import { ProfileService } from "@/lib/profile-service";
import {
  User,
  Mail,
  Phone,
  Building,
  Calendar,
  GraduationCap,
  Edit,
  Award,
  BookOpen,
  TrendingUp,
  Users,
  CheckCircle,
  Clock,
  Star,
} from "lucide-react";
import { Student, Faculty, User as UserType } from "@/lib/types";

interface ProfileDisplayProps {
  user: UserType;
  profile: Student | Faculty | null;
  onEdit?: () => void;
}

export function ProfileDisplay({ user, profile, onEdit }: ProfileDisplayProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const isStudent = user.role === "student";

  useEffect(() => {
    if (profile) {
      loadStats();
    }
  }, [profile]);

  const loadStats = async () => {
    if (!profile) return;

    setLoading(true);
    try {
      if (isStudent) {
        const { stats } = await ProfileService.getStudentStats(profile.id);
        setStats(stats);
      } else {
        const { stats } = await ProfileService.getFacultyStats(profile.id);
        setStats(stats);
      }
    } catch (error) {
      console.error("Error loading stats:", error);
    } finally {
      setLoading(false);
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

  const avatarUrl = isStudent
    ? (profile as Student)?.profile_image
    : (profile as Faculty)?.avatar_url;

  if (isEditing) {
    return (
      <ProfileEditForm
        user={user}
        profile={profile}
        onProfileUpdate={() => {
          setIsEditing(false);
          loadStats();
          onEdit?.();
        }}
      />
    );
  }

  if (!profile) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Complete Your Profile</CardTitle>
          <CardDescription>
            Please complete your profile to get started.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => setIsEditing(true)} className="w-full">
            <Edit className="h-4 w-4 mr-2" />
            Create Profile
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Main Profile Card */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={avatarUrl || ""} alt="Profile picture" />
                <AvatarFallback className="text-xl">
                  {displayName
                    ? getInitials(displayName)
                    : getInitials(user.email)}
                </AvatarFallback>
              </Avatar>

              <div className="space-y-1">
                <h2 className="text-2xl font-bold">{displayName}</h2>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="capitalize">
                    {user.role}
                  </Badge>
                  <Badge variant="outline">{profile.department}</Badge>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Mail className="h-4 w-4 mr-1" />
                  {user.email}
                </div>
              </div>
            </div>

            <Button onClick={() => setIsEditing(true)} variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <Separator />

          {/* Profile Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {isStudent ? (
              <>
                <div className="flex items-center space-x-2">
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    Student ID: {(profile as Student).student_id}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    Year {(profile as Student).year}, Semester{" "}
                    {(profile as Student).semester}
                  </span>
                </div>

                {(profile as Student).cgpa && (
                  <div className="flex items-center space-x-2">
                    <Star className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      CGPA: {(profile as Student).cgpa}/10
                    </span>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    Employee ID: {(profile as Faculty).employee_id}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {(profile as Faculty).designation}
                  </span>
                </div>
              </>
            )}

            {profile.phone && (
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{profile.phone}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {isStudent ? (
            <>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <Award className="h-8 w-8 text-blue-500" />
                    <div>
                      <p className="text-2xl font-bold">
                        {stats.totalCertificates}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Total Certificates
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-8 w-8 text-green-500" />
                    <div>
                      <p className="text-2xl font-bold">
                        {stats.verifiedCertificates}
                      </p>
                      <p className="text-sm text-muted-foreground">Verified</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-8 w-8 text-orange-500" />
                    <div>
                      <p className="text-2xl font-bold">
                        {stats.pendingCertificates}
                      </p>
                      <p className="text-sm text-muted-foreground">Pending</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-8 w-8 text-purple-500" />
                    <div>
                      <p className="text-2xl font-bold">{stats.totalSkills}</p>
                      <p className="text-sm text-muted-foreground">
                        Skills Identified
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="h-8 w-8 text-blue-500" />
                    <div>
                      <p className="text-2xl font-bold">{stats.totalReviews}</p>
                      <p className="text-sm text-muted-foreground">
                        Total Reviews
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-8 w-8 text-green-500" />
                    <div>
                      <p className="text-2xl font-bold">
                        {stats.approvedReviews}
                      </p>
                      <p className="text-sm text-muted-foreground">Approved</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-8 w-8 text-orange-500" />
                    <div>
                      <p className="text-2xl font-bold">
                        {stats.pendingReviews}
                      </p>
                      <p className="text-sm text-muted-foreground">Pending</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <Users className="h-8 w-8 text-purple-500" />
                    <div>
                      <p className="text-2xl font-bold">
                        {stats.studentsSupervised}
                      </p>
                      <p className="text-sm text-muted-foreground">Students</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      )}

      {/* Skills Section for Students */}
      {isStudent && stats && (
        <Card>
          <CardHeader>
            <CardTitle>Skills Overview</CardTitle>
            <CardDescription>
              Skills identified from your certificates and achievements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-500">
                  {stats.technicalSkills}
                </div>
                <div className="text-sm text-muted-foreground">
                  Technical Skills
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-500">
                  {stats.softSkills}
                </div>
                <div className="text-sm text-muted-foreground">Soft Skills</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-500">
                  {stats.domainSkills}
                </div>
                <div className="text-sm text-muted-foreground">
                  Domain Skills
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
