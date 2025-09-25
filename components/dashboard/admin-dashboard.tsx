"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/lib/auth"
import { mockAnalytics } from "@/lib/mock-data"
import { OverviewStats } from "./admin/overview-stats"
import { AchievementAnalytics } from "./admin/achievement-analytics"
import { ComplianceMetrics } from "./admin/compliance-metrics"
import { DepartmentAnalytics } from "./admin/department-analytics"
import { ReportsGenerator } from "./admin/reports-generator"
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
  Shield,
  FileText,
  Database,
} from "lucide-react"

export function AdminDashboard() {
  const { user, logout } = useAuth()
  const [analytics, setAnalytics] = useState(mockAnalytics)
  const [loading, setLoading] = useState(true)
  const [activeView, setActiveView] = useState<
    | "dashboard"
    | "overview"
    | "achievements"
    | "compliance"
    | "departments"
    | "reports"
    | "users"
    | "settings"
  >("dashboard")

  useEffect(() => {
    // Mock data loading - in real app, this would fetch from Supabase
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">Loading analytics...</div>
    )
  }

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
                activeView === "overview"
                  ? "text-white bg-white/20 font-medium"
                  : "text-white/70 hover:bg-white/10"
              }`}
              onClick={() => setActiveView("overview")}
            >
              <Database className="w-4 h-4 mr-3" />
              Overview
            </div>
            <div
              className={`flex items-center text-sm py-3 px-4 rounded-lg transition-colors cursor-pointer ${
                activeView === "achievements"
                  ? "text-white bg-white/20 font-medium"
                  : "text-white/70 hover:bg-white/10"
              }`}
              onClick={() => setActiveView("achievements")}
            >
              <Trophy className="w-4 h-4 mr-3" />
              Achievements
            </div>
            <div
              className={`flex items-center text-sm py-3 px-4 rounded-lg transition-colors cursor-pointer ${
                activeView === "compliance"
                  ? "text-white bg-white/20 font-medium"
                  : "text-white/70 hover:bg-white/10"
              }`}
              onClick={() => setActiveView("compliance")}
            >
              <Shield className="w-4 h-4 mr-3" />
              Compliance
            </div>
            <div
              className={`flex items-center text-sm py-3 px-4 rounded-lg transition-colors cursor-pointer ${
                activeView === "departments"
                  ? "text-white bg-white/20 font-medium"
                  : "text-white/70 hover:bg-white/10"
              }`}
              onClick={() => setActiveView("departments")}
            >
              <Users className="w-4 h-4 mr-3" />
              Departments
            </div>
            <div
              className={`flex items-center text-sm py-3 px-4 rounded-lg transition-colors cursor-pointer ${
                activeView === "reports"
                  ? "text-white bg-white/20 font-medium"
                  : "text-white/70 hover:bg-white/10"
              }`}
              onClick={() => setActiveView("reports")}
            >
              <FileText className="w-4 h-4 mr-3" />
              Reports
            </div>
            <div
              className={`flex items-center text-sm py-3 px-4 rounded-lg transition-colors cursor-pointer ${
                activeView === "users"
                  ? "text-white bg-white/20 font-medium"
                  : "text-white/70 hover:bg-white/10"
              }`}
              onClick={() => setActiveView("users")}
            >
              <User className="w-4 h-4 mr-3" />
              User Management
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
            onClick={() => {
              logout();
              window.location.href = "/";
            }}
            className="flex items-center text-white/80 hover:text-white transition-colors mt-auto"
          >
            <LogOut className="w-5 h-5 mr-3" />
            <span className="text-sm">Logout</span>
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
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
                    AD
                  </span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900 text-sm">
                    Admin User
                  </div>
                  <div className="text-xs text-gray-600">Administrator</div>
                  <div className="text-xs text-gray-500">
                    System Administrator
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
                    {new Date().toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                  <h1 className="text-2xl font-bold mb-2">
                    Welcome back, Admin!
                  </h1>
                  <p className="text-purple-100 text-sm">
                    Monitor institutional analytics and manage system compliance
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

          {/* Content based on active view */}
          {activeView === "dashboard" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column */}
              <div className="lg:col-span-2 space-y-6">
                {/* Overview Stats */}
                <OverviewStats data={analytics.overview} />

                {/* Achievement Trends */}
                <Card className="shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-semibold">
                      Achievement Trends
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analytics.achievements.byMonth.slice(-3).map((month) => (
                        <div key={month.month} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-medium w-8">{month.month}</span>
                            <div className="flex-1">
                              <Progress value={(month.approved / month.count) * 100} className="h-2" />
                            </div>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {month.approved}/{month.count}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Total Users */}
                <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-sm">
                  <CardContent className="p-6">
                    <div className="text-center">
                      <h3 className="text-base font-semibold mb-2">
                        Total Users
                      </h3>
                      <div className="text-3xl font-bold">{analytics.overview.totalStudents + analytics.overview.totalFaculty}</div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card className="shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-semibold">
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button 
                      className="w-full bg-cyan-400 hover:bg-cyan-500 text-black font-medium rounded-lg text-sm h-8"
                      onClick={() => setActiveView("reports")}
                    >
                      Generate Report
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full text-sm h-8"
                      onClick={() => setActiveView("users")}
                    >
                      Manage Users
                    </Button>
                  </CardContent>
                </Card>

                {/* System Status */}
                <Card className="shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-semibold">
                      System Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Database</span>
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100 text-xs">
                          Online
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">API Services</span>
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100 text-xs">
                          Healthy
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Storage</span>
                        <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 text-xs">
                          85% Used
                        </Badge>
                      </div>
                    </div>
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
                        {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
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

                      {Array.from({ length: 35 }, (_, i) => {
                        const day = i - 6;
                        const isToday = day === new Date().getDate();
                        return (
                          <div key={i} className={`py-1 ${
                            day <= 0 || day > 31 ? "text-gray-400" : ""
                          } ${isToday ? "bg-purple-600 text-white rounded-full w-5 h-5 flex items-center justify-center mx-auto" : ""}`}>
                            {day > 0 && day <= 31 ? day : ""}
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeView === "overview" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Achievement Trends</CardTitle>
                    <CardDescription>Monthly achievement submissions and approvals</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analytics.achievements.byMonth.slice(-6).map((month) => (
                        <div key={month.month} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-medium w-8">{month.month}</span>
                            <div className="flex-1">
                              <Progress value={(month.approved / month.count) * 100} className="h-2" />
                            </div>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {month.approved}/{month.count}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Top Performing Students</CardTitle>
                    <CardDescription>Students with highest achievement points</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analytics.achievements.topPerformers.map((student, index) => (
                        <div key={student.studentId} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                              <span className="text-sm font-bold text-primary">#{index + 1}</span>
                            </div>
                            <div>
                              <div className="font-medium">{student.name}</div>
                              <div className="text-sm text-muted-foreground">{student.studentId}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">{student.points} pts</div>
                            <div className="text-sm text-muted-foreground">{student.achievements} achievements</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeView === "achievements" && (
            <div className="space-y-4">
              <AchievementAnalytics data={analytics.achievements} />
            </div>
          )}

          {activeView === "compliance" && (
            <div className="space-y-4">
              <ComplianceMetrics data={analytics.compliance} />
            </div>
          )}

          {activeView === "departments" && (
            <div className="space-y-4">
              <DepartmentAnalytics data={analytics.departments} />
            </div>
          )}

          {activeView === "reports" && (
            <div className="space-y-4">
              <ReportsGenerator />
            </div>
          )}

          {activeView === "users" && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">User Management</h2>
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-muted-foreground">User management features coming soon...</p>
                </CardContent>
              </Card>
            </div>
          )}

          {activeView === "settings" && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">System Settings</h2>
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-muted-foreground">System settings panel coming soon...</p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
