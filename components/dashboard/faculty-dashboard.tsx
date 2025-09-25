"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/lib/auth"
import type { Achievement, Faculty, ApprovalWorkflow } from "@/lib/types"
import { mockFaculty, mockPendingAchievements, mockApprovalWorkflows } from "@/lib/mock-data"
import { AchievementReviewCard } from "./achievement-review-card"
import { ApprovalHistoryCard } from "./approval-history-card"
import { FacultyStats } from "./faculty-stats"
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
  CheckCircle,
  Clock,
  FileText,
} from "lucide-react"

export function FacultyDashboard() {
  const { user, logout } = useAuth()
  const [faculty, setFaculty] = useState<Faculty | null>(null)
  const [pendingAchievements, setPendingAchievements] = useState<Achievement[]>([])
  const [approvalHistory, setApprovalHistory] = useState<ApprovalWorkflow[]>([])
  const [loading, setLoading] = useState(true)
  const [activeView, setActiveView] = useState<
    | "dashboard"
    | "pending"
    | "history"
    | "analytics"
    | "students"
    | "reports"
    | "settings"
  >("dashboard")

  useEffect(() => {
    // Mock data loading - in real app, this would fetch from Supabase
    const facultyData = mockFaculty.find((f) => f.user_id === user?.id)
    const pendingReviews = mockPendingAchievements.filter((a) => a.verification_status === "pending")
    const workflows = mockApprovalWorkflows.filter((w) => w.faculty_id === facultyData?.id)

    setFaculty(facultyData || null)
    setPendingAchievements(pendingReviews)
    setApprovalHistory(workflows)
    setLoading(false)
  }, [user])

  const handleApproval = (achievementId: string, status: "approved" | "rejected", comments: string) => {
    // Update achievement status
    setPendingAchievements((prev) =>
      prev
        .map((achievement) =>
          achievement.id === achievementId ? { ...achievement, verification_status: status } : achievement,
        )
        .filter((achievement) => achievement.id !== achievementId),
    )

    // Add to approval history
    const newWorkflow: ApprovalWorkflow = {
      id: Date.now().toString(),
      achievement_id: achievementId,
      faculty_id: faculty?.id || "1",
      status,
      comments,
      reviewed_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    setApprovalHistory((prev) => [newWorkflow, ...prev])
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">Loading...</div>
    )
  }

  if (!faculty) {
    return (
      <div className="text-center text-red-500">Faculty profile not found</div>
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
                activeView === "pending"
                  ? "text-white bg-white/20 font-medium"
                  : "text-white/70 hover:bg-white/10"
              }`}
              onClick={() => setActiveView("pending")}
            >
              <Clock className="w-4 h-4 mr-3" />
              Pending Reviews
            </div>
            <div
              className={`flex items-center text-sm py-3 px-4 rounded-lg transition-colors cursor-pointer ${
                activeView === "history"
                  ? "text-white bg-white/20 font-medium"
                  : "text-white/70 hover:bg-white/10"
              }`}
              onClick={() => setActiveView("history")}
            >
              <CheckCircle className="w-4 h-4 mr-3" />
              Review History
            </div>
            <div
              className={`flex items-center text-sm py-3 px-4 rounded-lg transition-colors cursor-pointer ${
                activeView === "analytics"
                  ? "text-white bg-white/20 font-medium"
                  : "text-white/70 hover:bg-white/10"
              }`}
              onClick={() => setActiveView("analytics")}
            >
              <Trophy className="w-4 h-4 mr-3" />
              Analytics
            </div>
            <div
              className={`flex items-center text-sm py-3 px-4 rounded-lg transition-colors cursor-pointer ${
                activeView === "students"
                  ? "text-white bg-white/20 font-medium"
                  : "text-white/70 hover:bg-white/10"
              }`}
              onClick={() => setActiveView("students")}
            >
              <Users className="w-4 h-4 mr-3" />
              Students
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
                    {faculty.first_name.charAt(0)}{faculty.last_name.charAt(0)}
                  </span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900 text-sm">
                    {faculty.first_name} {faculty.last_name}
                  </div>
                  <div className="text-xs text-gray-600">{faculty.designation}</div>
                  <div className="text-xs text-gray-500">
                    {faculty.department}
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
                    Welcome back, {faculty.first_name}!
                  </h1>
                  <p className="text-purple-100 text-sm">
                    Manage student achievements and reviews from your faculty portal
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
                {/* Faculty Stats */}
                <FacultyStats
                  pendingCount={pendingAchievements.length}
                  approvedCount={approvalHistory.filter((w) => w.status === "approved").length}
                  rejectedCount={approvalHistory.filter((w) => w.status === "rejected").length}
                  totalReviewed={approvalHistory.length}
                />

                {/* Recent Reviews */}
                <Card className="shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-semibold">
                      Recent Reviews
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {approvalHistory.slice(0, 3).map((workflow) => (
                        <div key={workflow.id} className="flex items-center justify-between py-2">
                          <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full ${
                              workflow.status === "approved" ? "bg-green-500" : "bg-red-500"
                            }`}></div>
                            <span className="text-sm font-medium">Achievement #{workflow.achievement_id}</span>
                          </div>
                          <Badge className={`text-xs ${
                            workflow.status === "approved" 
                              ? "bg-green-100 text-green-700 hover:bg-green-100" 
                              : "bg-red-100 text-red-700 hover:bg-red-100"
                          }`}>
                            {workflow.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Pending Count */}
                <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-sm">
                  <CardContent className="p-6">
                    <div className="text-center">
                      <h3 className="text-base font-semibold mb-2">
                        Pending Reviews
                      </h3>
                      <div className="text-3xl font-bold">{pendingAchievements.length}</div>
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
                      onClick={() => setActiveView("pending")}
                    >
                      Review Achievements
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full text-sm h-8"
                      onClick={() => setActiveView("reports")}
                    >
                      Generate Report
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

          {activeView === "pending" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Achievements Awaiting Review</h2>
                <Button variant="outline">Bulk Actions</Button>
              </div>

              <div className="grid gap-4">
                {pendingAchievements.length === 0 ? (
                  <Card>
                    <CardContent className="pt-6 text-center">
                      <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                      </div>
                      <p className="text-muted-foreground">All caught up!</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        No achievements pending your review at the moment.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  pendingAchievements.map((achievement) => (
                    <AchievementReviewCard key={achievement.id} achievement={achievement} onApproval={handleApproval} />
                  ))
                )}
              </div>
            </div>
          )}

          {activeView === "history" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Review History</h2>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Filter
                  </Button>
                  <Button variant="outline" size="sm">
                    Export
                  </Button>
                </div>
              </div>

              <div className="grid gap-4">
                {approvalHistory.length === 0 ? (
                  <Card>
                    <CardContent className="pt-6 text-center">
                      <p className="text-muted-foreground">No review history available.</p>
                    </CardContent>
                  </Card>
                ) : (
                  approvalHistory.map((workflow) => <ApprovalHistoryCard key={workflow.id} workflow={workflow} />)
                )}
              </div>
            </div>
          )}

          {activeView === "analytics" && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Review Analytics</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Review Performance</CardTitle>
                    <CardDescription>Your review activity this month</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Average Review Time</span>
                        <span className="font-medium">2.3 days</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Reviews This Month</span>
                        <span className="font-medium">{approvalHistory.length}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Approval Rate</span>
                        <span className="font-medium">
                          {approvalHistory.length > 0
                            ? Math.round(
                                (approvalHistory.filter((w) => w.status === "approved").length / approvalHistory.length) *
                                  100,
                              )
                            : 0}
                          %
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Category Distribution</CardTitle>
                    <CardDescription>Types of achievements reviewed</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {["certification", "competition", "leadership", "publication"].map((category) => (
                        <div key={category} className="flex items-center justify-between">
                          <Badge variant="outline" className="capitalize">
                            {category}
                          </Badge>
                          <span className="text-sm font-medium">
                            {mockPendingAchievements.filter((a) => a.category === category).length}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeView === "students" && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Student Management</h2>
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-muted-foreground">Student management features coming soon...</p>
                </CardContent>
              </Card>
            </div>
          )}

          {activeView === "reports" && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Reports & Analytics</h2>
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-muted-foreground">Report generation features coming soon...</p>
                </CardContent>
              </Card>
            </div>
          )}

          {activeView === "settings" && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Settings</h2>
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-muted-foreground">Settings panel coming soon...</p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
