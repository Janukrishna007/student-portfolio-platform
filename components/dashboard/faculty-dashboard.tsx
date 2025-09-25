"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/lib/auth"
import type { Achievement, Faculty, ApprovalWorkflow, Certificate, Student } from "@/lib/types"
import { mockFaculty, mockPendingAchievements, mockApprovalWorkflows, mockStudents } from "@/lib/mock-data"
import { StudentInsights } from "@/components/ai/student-insights"
import { MentorshipTools } from "@/components/ai/mentorship-tools"
import { EnhancedCertificateReview } from "@/components/ai/enhanced-certificate-review"
import {
  Search,
  Bell,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  LogOut,
  BarChart3,
  Calendar as CalendarIcon,
  Plus,
  MessageSquare,
  BookOpen,
  Users,
  FileText,
  School,
  Brain,
  Target,
  Award,
} from "lucide-react"

// Mock certificate data for faculty review
const mockCertificates: (Certificate & { student: Student })[] = [
  {
    id: "1",
    student_id: "1",
    title: "Google Course UI / UX Certificate",
    issuer: "Google",
    issue_date: "2024-08-15",
    category: "professional",
    status: "pending",
    created_at: "2024-08-16T10:00:00Z",
    updated_at: "2024-08-16T10:00:00Z",
    student: {
      id: "1",
      user_id: "1",
      student_id: "CS2021001",
      first_name: "Aleena Ida",
      last_name: "Ignatius",
      department: "Computer Science",
      year: 3,
      semester: 6,
      created_at: "2024-01-15T10:00:00Z",
      updated_at: "2024-01-15T10:00:00Z",
    }
  },
  {
    id: "2",
    student_id: "1",
    title: "Google Course UI / UX Certificate",
    issuer: "Google",
    issue_date: "2024-08-10",
    category: "professional",
    status: "pending",
    created_at: "2024-08-11T10:00:00Z",
    updated_at: "2024-08-11T10:00:00Z",
    student: {
      id: "1",
      user_id: "1",
      student_id: "CS2021001",
      first_name: "Aleena Ida",
      last_name: "Ignatius",
      department: "Computer Science",
      year: 3,
      semester: 6,
      created_at: "2024-01-15T10:00:00Z",
      updated_at: "2024-01-15T10:00:00Z",
    }
  },
  {
    id: "3",
    student_id: "1",
    title: "Google Course UI / UX Certificate",
    issuer: "Google",
    issue_date: "2024-08-05",
    category: "professional",
    status: "pending",
    created_at: "2024-08-06T10:00:00Z",
    updated_at: "2024-08-06T10:00:00Z",
    student: {
      id: "1",
      user_id: "1",
      student_id: "CS2021001",
      first_name: "Aleena Ida",
      last_name: "Ignatius",
      department: "Computer Science",
      year: 3,
      semester: 6,
      created_at: "2024-01-15T10:00:00Z",
      updated_at: "2024-01-15T10:00:00Z",
    }
  },
  {
    id: "4",
    student_id: "1",
    title: "Google Course UI / UX Certificate",
    issuer: "Google",
    issue_date: "2024-08-01",
    category: "professional",
    status: "pending",
    created_at: "2024-08-02T10:00:00Z",
    updated_at: "2024-08-02T10:00:00Z",
    student: {
      id: "1",
      user_id: "1",
      student_id: "CS2021001",
      first_name: "Aleena Ida",
      last_name: "Ignatius",
      department: "Computer Science",
      year: 3,
      semester: 6,
      created_at: "2024-01-15T10:00:00Z",
      updated_at: "2024-01-15T10:00:00Z",
    }
  },
  {
    id: "5",
    student_id: "1",
    title: "Google Course UI / UX Certificate",
    issuer: "Google",
    issue_date: "2024-07-28",
    category: "professional",
    status: "pending",
    created_at: "2024-07-29T10:00:00Z",
    updated_at: "2024-07-29T10:00:00Z",
    student: {
      id: "1",
      user_id: "1",
      student_id: "CS2021001",
      first_name: "Aleena Ida",
      last_name: "Ignatius",
      department: "Computer Science",
      year: 3,
      semester: 6,
      created_at: "2024-01-15T10:00:00Z",
      updated_at: "2024-01-15T10:00:00Z",
    }
  },
  {
    id: "6",
    student_id: "1",
    title: "Google Course UI / UX Certificate",
    issuer: "Google",
    issue_date: "2024-07-25",
    category: "professional",
    status: "pending",
    created_at: "2024-07-26T10:00:00Z",
    updated_at: "2024-07-26T10:00:00Z",
    student: {
      id: "1",
      user_id: "1",
      student_id: "CS2021001",
      first_name: "Aleena Ida",
      last_name: "Ignatius",
      department: "Computer Science",
      year: 3,
      semester: 6,
      created_at: "2024-01-15T10:00:00Z",
      updated_at: "2024-01-15T10:00:00Z",
    }
  }
]

export function FacultyDashboard() {
  const { user, logout } = useAuth()
  const [faculty, setFaculty] = useState<Faculty | null>(null)
  const [pendingCertificates, setPendingCertificates] = useState<(Certificate & { student: Student })[]>([])
  const [loading, setLoading] = useState(true)
  const [currentDate] = useState(new Date())
  const [activeView, setActiveView] = useState<"dashboard" | "certificates" | "insights" | "mentorship">("dashboard")

  useEffect(() => {
    // Mock data loading - in real app, this would fetch from Supabase
    const facultyData = mockFaculty.find((f) => f.user_id === user?.id)
    
    setFaculty(facultyData || null)
    setPendingCertificates(mockCertificates)
    setLoading(false)
  }, [user])

  const handleCertificateApproval = (certificateId: string, status: "approved" | "rejected") => {
    setPendingCertificates((prev) =>
      prev.filter((cert) => cert.id !== certificateId)
    )
    // In real implementation, this would update the database
  }

  const generateCalendar = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay())
    
    const days = []
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate)
      date.setDate(date.getDate() + i)
      days.push(date)
    }
    
    return days
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
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
              <School className="w-10 h-10 text-white" />
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 space-y-1">
            <div 
              className={`flex items-center text-sm font-medium py-3 px-4 rounded-lg transition-colors cursor-pointer ${
                activeView === "dashboard" ? "text-white bg-white/20" : "text-white/70 hover:bg-white/10"
              }`}
              onClick={() => setActiveView("dashboard")}
            >
              <BarChart3 className="w-4 h-4 mr-3" />
              Dashboard
            </div>
            <div 
              className={`flex items-center text-sm py-3 px-4 rounded-lg transition-colors cursor-pointer ${
                activeView === "certificates" ? "text-white bg-white/20 font-medium" : "text-white/70 hover:bg-white/10"
              }`}
              onClick={() => setActiveView("certificates")}
            >
              <Award className="w-4 h-4 mr-3" />
              Certificate Review
            </div>
            <div 
              className={`flex items-center text-sm py-3 px-4 rounded-lg transition-colors cursor-pointer ${
                activeView === "insights" ? "text-white bg-white/20 font-medium" : "text-white/70 hover:bg-white/10"
              }`}
              onClick={() => setActiveView("insights")}
            >
              <Brain className="w-4 h-4 mr-3" />
              Student Insights
            </div>
            <div 
              className={`flex items-center text-sm py-3 px-4 rounded-lg transition-colors cursor-pointer ${
                activeView === "mentorship" ? "text-white bg-white/20 font-medium" : "text-white/70 hover:bg-white/10"
              }`}
              onClick={() => setActiveView("mentorship")}
            >
              <Target className="w-4 h-4 mr-3" />
              Mentorship Tools
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
                <Avatar className="w-10 h-10">
                  <AvatarImage src="/avatar-placeholder.jpg" />
                  <AvatarFallback className="bg-gradient-to-br from-amber-400 to-orange-500 text-white text-sm font-semibold">
                    MF
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold text-gray-900 text-sm">Mercelin Francis</div>
                  <div className="text-xs text-gray-600">Assistant Professor</div>
                  <div className="text-xs text-gray-500">Marian Engineering College</div>
                </div>
              </div>
            </div>
          </div>

          {/* Welcome Banner */}
          <Card className="mb-6 bg-gradient-to-r from-purple-500 via-purple-600 to-pink-500 border-0 text-white overflow-hidden relative">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="z-10">
                  <p className="text-purple-100 mb-1 text-sm">{formatDate(currentDate)}</p>
                  <h1 className="text-2xl font-bold mb-2">Welcome back, Aleena!</h1>
                  <p className="text-purple-100 text-sm">Always stay updated in your student portal</p>
                </div>
                <div className="relative">
                  <div className="absolute -top-4 -right-4 w-20 h-20 bg-white/10 rounded-full"></div>
                  <div className="absolute top-2 right-8 w-12 h-12 bg-yellow-400/80 rounded-lg transform rotate-12"></div>
                  <div className="absolute top-8 right-2 w-8 h-8 bg-blue-400/80 rounded"></div>
                  <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
                    <GraduationCap className="w-12 h-12 text-white/90" />
                  </div>
                  <div className="absolute -bottom-2 right-12 w-2 h-2 bg-green-400 rounded-full"></div>
                  <div className="absolute top-0 right-16 w-2 h-2 bg-pink-300 rounded-full"></div>
                  <div className="absolute bottom-4 right-20 w-2 h-2 bg-blue-300 rounded-full"></div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Dashboard Content */}
          {activeView === "dashboard" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - My Students */}
              <div className="lg:col-span-2 space-y-6">
                <Card className="shadow-sm">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
                        <BookOpen className="w-6 h-6 text-white" />
                      </div>
                      <CardTitle className="text-lg font-semibold">
                        My Students
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                        <Users className="w-12 h-12 text-white" />
                      </div>
                      <p className="text-gray-600 text-sm mb-4">View detailed student insights and analytics</p>
                      <Button 
                        onClick={() => setActiveView("insights")}
                        className="bg-purple-600 hover:bg-purple-700 text-white"
                      >
                        <Brain className="w-4 h-4 mr-2" />
                        View Student Insights
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Add Upcoming Event */}
                <Card className="shadow-sm">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-500 rounded-xl flex items-center justify-center">
                        <CalendarIcon className="w-6 h-6 text-white" />
                      </div>
                      <CardTitle className="text-lg font-semibold">
                        Add Upcoming Event
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm mb-4">
                      Create and publish academic or extracurricular events for students to join.
                    </p>
                    <Button className="bg-purple-600 hover:bg-purple-700 text-white rounded-lg">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Event
                    </Button>
                  </CardContent>
                </Card>

                {/* Post Notice */}
                <Card className="shadow-sm">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center">
                        <MessageSquare className="w-6 h-6 text-white" />
                      </div>
                      <CardTitle className="text-lg font-semibold">
                        Post Notice
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm mb-4">
                      Share important announcements and updates with your students.
                    </p>
                    <Button className="bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg">
                      <FileText className="w-4 h-4 mr-2" />
                      Create Notice
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* To Be Approved */}
                <Card className="shadow-sm">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-semibold">
                        To Be Approved ({pendingCertificates.length})
                      </CardTitle>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setActiveView("certificates")}
                      >
                        View All
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {pendingCertificates.slice(0, 6).map((certificate) => (
                        <div key={certificate.id} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src="/student-avatar.jpg" />
                            <AvatarFallback className="bg-gradient-to-br from-purple-400 to-pink-500 text-white text-xs">
                              AI
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm text-gray-900">
                              {certificate.student.first_name} {certificate.student.last_name}
                            </p>
                            <p className="text-xs text-gray-600 truncate">
                              {certificate.title}
                            </p>
                            <p className="text-xs text-blue-600 underline cursor-pointer hover:text-blue-800">
                              View →
                            </p>
                          </div>
                          <div className="flex gap-1">
                            <Button 
                              size="sm" 
                              className="bg-purple-600 hover:bg-purple-700 text-white text-xs px-3 py-1 rounded-full h-6"
                              onClick={() => handleCertificateApproval(certificate.id, "approved")}
                            >
                              Approve
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="text-gray-600 border-gray-300 text-xs px-3 py-1 rounded-full h-6"
                              onClick={() => handleCertificateApproval(certificate.id, "rejected")}
                            >
                              Reject
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Profile Info Card */}
                <Card className="shadow-sm">
                  <CardContent className="p-6">
                    <div className="text-center">
                      <Avatar className="w-20 h-20 mx-auto mb-4">
                        <AvatarImage src="/faculty-avatar.jpg" />
                        <AvatarFallback className="bg-gradient-to-br from-amber-400 to-orange-500 text-white text-xl">
                          MF
                        </AvatarFallback>
                      </Avatar>
                      <h3 className="font-bold text-lg text-gray-900">Mercelin Francis</h3>
                      <p className="text-sm text-gray-600 mb-2">Assistant Professor</p>
                      <p className="text-sm text-gray-500 mb-4">Marian Engineering College</p>
                      
                      {/* Skill Tags */}
                      <div className="flex flex-wrap gap-2 justify-center mb-4">
                        <Badge className="bg-green-100 text-green-700 border-green-200 text-xs">
                          Web development
                        </Badge>
                        <Badge className="bg-purple-100 text-purple-700 border-purple-200 text-xs">
                          UI/X
                        </Badge>
                        <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200 text-xs">
                          Filmography
                        </Badge>
                        <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-xs">
                          Video Editing
                        </Badge>
                        <Badge className="bg-gray-100 text-gray-700 border-gray-200 text-xs">
                          Painting
                        </Badge>
                      </div>
                      
                      <Button className="bg-cyan-400 hover:bg-cyan-500 text-black font-medium rounded-lg w-full">
                        Edit Profile
                      </Button>
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
                        {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                      </span>
                      <button aria-label="Next month">
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-7 gap-1 text-center text-xs">
                      {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day) => (
                        <div key={day} className="text-gray-500 font-medium py-2">{day}</div>
                      ))}
                      {generateCalendar().map((date, index) => {
                        const isCurrentMonth = date.getMonth() === currentDate.getMonth()
                        const isToday = date.toDateString() === new Date().toDateString()
                        return (
                          <div key={index} className={`py-2 text-xs ${
                            !isCurrentMonth ? "text-gray-400" : ""
                          } ${isToday ? "bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center mx-auto" : ""}`}>
                            {date.getDate()}
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Certificate Review View */}
          {activeView === "certificates" && (
            <EnhancedCertificateReview
              certificates={pendingCertificates.map(cert => ({
                id: cert.id,
                student: {
                  id: cert.student.id,
                  name: `${cert.student.first_name} ${cert.student.last_name}`,
                  studentId: cert.student.student_id,
                  department: cert.student.department,
                  year: cert.student.year
                },
                title: cert.title,
                issuer: cert.issuer,
                issueDate: cert.issue_date,
                category: cert.category,
                skills: ['UI Design', 'UX Research', 'Prototyping'], // Mock skills
                status: cert.status,
                submittedAt: cert.created_at
              }))}
              onApprove={(id, feedback) => {
                console.log('Approved:', id, feedback)
                handleCertificateApproval(id, "approved")
              }}
              onReject={(id, reason) => {
                console.log('Rejected:', id, reason)
                handleCertificateApproval(id, "rejected")
              }}
              onRequestMoreInfo={(id, message) => {
                console.log('Requested more info:', id, message)
              }}
            />
          )}

          {/* Student Insights View */}
          {activeView === "insights" && (
            <StudentInsights
              onRecommendCourse={(studentId, course) => {
                console.log('Recommending course:', course, 'to student:', studentId)
              }}
            />
          )}

          {/* Mentorship Tools View */}
          {activeView === "mentorship" && (
            <MentorshipTools />
          )}
        </div>
      </div>
    </div>
  )
}
