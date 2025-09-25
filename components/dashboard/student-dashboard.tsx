"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth";
import type { Achievement, Student } from "@/lib/types";
import { mockAchievements, mockStudents } from "@/lib/mock-data";
import {
  Search,
  Bell,
  Calendar,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  LogOut,
  BarChart3,
  User,
  BookOpen,
  Trophy,
  Users,
  MessageSquare,
  Briefcase,
  Settings,
} from "lucide-react";
import { StudentPortfolio } from "@/components/portfolio/student-portfolio";

export function StudentDashboard() {
  const { user, logout } = useAuth();
  const [student, setStudent] = useState<Student | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<
    | "dashboard"
    | "portfolio"
    | "academics"
    | "co-curricular"
    | "extra-curricular"
    | "feedback"
    | "career"
    | "settings"
  >("dashboard");

  useEffect(() => {
    // Mock data loading - in real app, this would fetch from Supabase
    const studentData = mockStudents.find((s) => s.user_id === user?.id);
    const studentAchievements = mockAchievements.filter(
      (a) => a.student_id === studentData?.id
    );

    setStudent(studentData || null);
    setAchievements(studentAchievements);
    setLoading(false);
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">Loading...</div>
    );
  }

  if (!student) {
    return (
      <div className="text-center text-red-500">Student profile not found</div>
    );
  }

  const totalPoints = achievements.reduce(
    (sum, achievement) => sum + achievement.points,
    0
  );
  const approvedAchievements = achievements.filter(
    (a) => a.verification_status === "approved"
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Left Sidebar */}
        <div className="w-64 bg-gradient-to-b from-purple-600 to-purple-700 min-h-screen p-6 flex flex-col">
          <div className="mb-8">
            <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mb-6 p-3">
              <Image
                src="/images/logo.png"
                alt="Logo"
                width={40}
                height={40}
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 space-y-1">
            <div
              className={`flex items-center text-sm font-medium py-3 px-4 rounded-lg transition-colors cursor-pointer ${
                activeView === "dashboard"
                  ? "text-white bg-white/20"
                  : "text-white/70 hover:bg-white/10"
              }`}
              onClick={() => setActiveView("dashboard")}
            >
              <BarChart3 className="w-4 h-4 mr-3" />
              Dashboard
            </div>
            <div
              className={`flex items-center text-sm py-3 px-4 rounded-lg transition-colors cursor-pointer ${
                activeView === "portfolio"
                  ? "text-white bg-white/20 font-medium"
                  : "text-white/70 hover:bg-white/10"
              }`}
              onClick={() => setActiveView("portfolio")}
            >
              <User className="w-4 h-4 mr-3" />
              Portfolio
            </div>
            <div
              className={`flex items-center text-sm py-3 px-4 rounded-lg transition-colors cursor-pointer ${
                activeView === "academics"
                  ? "text-white bg-white/20 font-medium"
                  : "text-white/70 hover:bg-white/10"
              }`}
              onClick={() => setActiveView("academics")}
            >
              <BookOpen className="w-4 h-4 mr-3" />
              Academics
            </div>
            <div
              className={`flex items-center text-sm py-3 px-4 rounded-lg transition-colors cursor-pointer ${
                activeView === "co-curricular"
                  ? "text-white bg-white/20 font-medium"
                  : "text-white/70 hover:bg-white/10"
              }`}
              onClick={() => setActiveView("co-curricular")}
            >
              <Trophy className="w-4 h-4 mr-3" />
              Co-curricular
            </div>
            <div
              className={`flex items-center text-sm py-3 px-4 rounded-lg transition-colors cursor-pointer ${
                activeView === "extra-curricular"
                  ? "text-white bg-white/20 font-medium"
                  : "text-white/70 hover:bg-white/10"
              }`}
              onClick={() => setActiveView("extra-curricular")}
            >
              <Users className="w-4 h-4 mr-3" />
              Extra curricular
            </div>
            <div
              className={`flex items-center text-sm py-3 px-4 rounded-lg transition-colors cursor-pointer ${
                activeView === "feedback"
                  ? "text-white bg-white/20 font-medium"
                  : "text-white/70 hover:bg-white/10"
              }`}
              onClick={() => setActiveView("feedback")}
            >
              <MessageSquare className="w-4 h-4 mr-3" />
              Feedback
            </div>
            <div
              className={`flex items-center text-sm py-3 px-4 rounded-lg transition-colors cursor-pointer ${
                activeView === "career"
                  ? "text-white bg-white/20 font-medium"
                  : "text-white/70 hover:bg-white/10"
              }`}
              onClick={() => setActiveView("career")}
            >
              <Briefcase className="w-4 h-4 mr-3" />
              Career
            </div>
            <div
              className={`flex items-center text-sm py-3 px-4 rounded-lg transition-colors cursor-pointer ${
                activeView === "settings"
                  ? "text-white bg-white/20 font-medium"
                  : "text-white/70 hover:bg-white/10"
              }`}
              onClick={() => setActiveView("settings")}
            >
              <Settings className="w-4 h-4 mr-3" />
              Settings
            </div>
          </nav>

          <button
            onClick={logout}
            className="flex items-center text-white/80 hover:text-white transition-colors mt-auto"
          >
            <LogOut className="w-5 h-5 mr-3" />
            <span className="text-sm">Logout</span>
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* Conditional Content Rendering */}
          {activeView === "portfolio" ? (
            <StudentPortfolio onBack={() => setActiveView("dashboard")} />
          ) : (
            <>
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center flex-1 max-w-md">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search"
                      className="pl-10 bg-white border-gray-200 rounded-lg h-10 text-sm"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Bell className="w-5 h-5 text-gray-600" />
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-xs">
                        AI
                      </span>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 text-sm">
                        Aleena Ida
                      </div>
                      <div className="text-xs text-gray-600">Student</div>
                      <div className="text-xs text-gray-500">
                        Marian Engineering College
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Welcome Banner */}
              <Card className="mb-6 bg-gradient-to-r from-purple-500 via-purple-600 to-pink-500 border-0 text-white overflow-hidden relative">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="z-10">
                      <p className="text-purple-100 mb-1 text-sm">
                        September 4, 2023
                      </p>
                      <h1 className="text-2xl font-bold mb-2">
                        Welcome back, Aleena!
                      </h1>
                      <p className="text-purple-100 text-sm">
                        Always stay updated in your student portal
                      </p>
                    </div>
                    <div className="relative">
                      {/* Decorative elements */}
                      <div className="absolute -top-4 -right-4 w-20 h-20 bg-white/10 rounded-full"></div>
                      <div className="absolute top-2 right-8 w-12 h-12 bg-yellow-400/80 rounded-lg transform rotate-12"></div>
                      <div className="absolute top-8 right-2 w-8 h-8 bg-blue-400/80 rounded"></div>
                      <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
                        <GraduationCap className="w-12 h-12 text-white/90" />
                      </div>
                      {/* Small decorative dots */}
                      <div className="absolute -bottom-2 right-12 w-2 h-2 bg-green-400 rounded-full"></div>
                      <div className="absolute top-0 right-16 w-2 h-2 bg-pink-300 rounded-full"></div>
                      <div className="absolute bottom-4 right-20 w-2 h-2 bg-blue-300 rounded-full"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-6">
                  {/* SGPA Trend */}
                  <Card className="shadow-sm">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base font-semibold">
                          SGPA Trend
                        </CardTitle>
                        <span className="text-sm text-gray-600">
                          CGPA : 9.0
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-end justify-center h-32 gap-8">
                        <div className="flex flex-col items-center">
                          <div className="w-12 h-16 bg-cyan-200 rounded-lg flex items-end justify-center pb-1">
                            <span className="text-xs font-semibold text-gray-700">
                              8.2
                            </span>
                          </div>
                          <span className="text-xs text-gray-600 mt-2">S1</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="w-12 h-20 bg-cyan-300 rounded-lg flex items-end justify-center pb-1">
                            <span className="text-xs font-semibold text-gray-700">
                              8.7
                            </span>
                          </div>
                          <span className="text-xs text-gray-600 mt-2">S2</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="w-12 h-24 bg-cyan-400 rounded-lg flex items-end justify-center pb-1">
                            <span className="text-xs font-semibold text-white">
                              9.2
                            </span>
                          </div>
                          <span className="text-xs text-gray-600 mt-2">S3</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <button aria-label="Previous semester">
                          <ChevronLeft className="w-4 h-4 text-gray-400" />
                        </button>
                        <button aria-label="Next semester">
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Time Table */}
                  <Card className="shadow-sm">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base font-semibold">
                          Time Table
                        </CardTitle>
                        <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 text-xs px-2 py-1">
                          Monday
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between py-2">
                          <span className="text-sm text-gray-600">
                            09:00-10:00
                          </span>
                          <span className="text-sm font-medium">Art Class</span>
                        </div>
                        <div className="flex items-center justify-between py-2">
                          <span className="text-sm text-gray-600">
                            10:00-11:00
                          </span>
                          <span className="text-sm font-medium">Art Class</span>
                        </div>
                        <div className="flex items-center justify-between py-2">
                          <span className="text-sm text-gray-600">
                            11:00-12:00
                          </span>
                          <span className="text-sm font-medium">Art Class</span>
                        </div>
                        <div className="flex items-center justify-between py-2">
                          <span className="text-sm text-gray-600">
                            13:00-14:00
                          </span>
                          <span className="text-sm font-medium">Art Class</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Notice */}
                  <Card className="shadow-sm">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base font-semibold">
                        Notice
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-purple-600 text-sm">
                        29 Sep 2025, Monday is a Holiday
                      </p>
                    </CardContent>
                  </Card>

                  {/* Attendance */}
                  <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-sm">
                    <CardContent className="p-6">
                      <div className="text-center">
                        <h3 className="text-base font-semibold mb-2">
                          Attendance
                        </h3>
                        <div className="text-3xl font-bold">60%</div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Deadlines */}
                  <Card className="shadow-sm">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base font-semibold">
                        Deadlines
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <Calendar className="w-4 h-4 text-purple-500" />
                          <div>
                            <div className="font-medium text-sm">
                              Biology Assignment
                            </div>
                            <div className="text-xs text-gray-500">
                              29/9/2025
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Calendar className="w-4 h-4 text-purple-500" />
                          <div>
                            <div className="font-medium text-sm">
                              Biology Assignment
                            </div>
                            <div className="text-xs text-gray-500">
                              29/9/2025
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Calendar className="w-4 h-4 text-purple-500" />
                          <div>
                            <div className="font-medium text-sm">
                              Biology Assignment
                            </div>
                            <div className="text-xs text-gray-500">
                              29/9/2025
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Skills/Tags */}
                  <Card className="shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex flex-wrap gap-2 mb-4">
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100 text-xs px-2 py-1">
                          Web development
                        </Badge>
                        <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100 text-xs px-2 py-1">
                          UI/X
                        </Badge>
                        <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 text-xs px-2 py-1">
                          Filmography
                        </Badge>
                        <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 text-xs px-2 py-1">
                          Video Editing
                        </Badge>
                        <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100 text-xs px-2 py-1">
                          Painting
                        </Badge>
                      </div>
                      <Button className="w-full bg-cyan-400 hover:bg-cyan-500 text-black font-medium rounded-lg text-sm h-8">
                        Edit Profile
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Calendar */}
                  <Card className="shadow-sm">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <button aria-label="Previous month">
                          <ChevronLeft className="w-4 h-4 text-gray-400" />
                        </button>
                        <span className="font-semibold text-sm">
                          January 2025
                        </span>
                        <button aria-label="Next month">
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-7 gap-1 text-center text-xs">
                        <div className="text-gray-500 font-medium py-1">S</div>
                        <div className="text-gray-500 font-medium py-1">M</div>
                        <div className="text-gray-500 font-medium py-1">T</div>
                        <div className="text-gray-500 font-medium py-1">W</div>
                        <div className="text-gray-500 font-medium py-1">T</div>
                        <div className="text-gray-500 font-medium py-1">F</div>
                        <div className="text-gray-500 font-medium py-1">S</div>

                        <div className="text-gray-400 py-1">29</div>
                        <div className="text-gray-400 py-1">30</div>
                        <div className="text-gray-400 py-1">31</div>
                        <div className="py-1">1</div>
                        <div className="py-1">2</div>
                        <div className="py-1">3</div>
                        <div className="py-1">4</div>

                        <div className="py-1">5</div>
                        <div className="py-1">6</div>
                        <div className="py-1">7</div>
                        <div className="py-1">8</div>
                        <div className="py-1">9</div>
                        <div className="py-1">10</div>
                        <div className="py-1">11</div>

                        <div className="py-1">12</div>
                        <div className="py-1">13</div>
                        <div className="py-1">14</div>
                        <div className="py-1">15</div>
                        <div className="bg-purple-600 text-white rounded-full w-5 h-5 flex items-center justify-center mx-auto">
                          16
                        </div>
                        <div className="py-1">17</div>
                        <div className="py-1">18</div>

                        <div className="py-1">19</div>
                        <div className="py-1">20</div>
                        <div className="py-1">21</div>
                        <div className="py-1">22</div>
                        <div className="py-1">23</div>
                        <div className="py-1">24</div>
                        <div className="py-1">25</div>

                        <div className="py-1">26</div>
                        <div className="py-1">27</div>
                        <div className="py-1">28</div>
                        <div className="py-1">29</div>
                        <div className="py-1">30</div>
                        <div className="py-1">31</div>
                        <div className="text-gray-400 py-1">1</div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
