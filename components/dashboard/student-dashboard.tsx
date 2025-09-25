"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/lib/auth"
import type { Achievement, Student } from "@/lib/types"
import { mockAchievements, mockStudents } from "@/lib/mock-data"
import { Search, Bell, Calendar, ChevronLeft, ChevronRight, GraduationCap, LogOut } from "lucide-react"

export function StudentDashboard() {
  const { user, logout } = useAuth()
  const [student, setStudent] = useState<Student | null>(null)
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock data loading - in real app, this would fetch from Supabase
    const studentData = mockStudents.find((s) => s.user_id === user?.id)
    const studentAchievements = mockAchievements.filter((a) => a.student_id === studentData?.id)

    setStudent(studentData || null)
    setAchievements(studentAchievements)
    setLoading(false)
  }, [user])

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>
  }

  if (!student) {
    return <div className="text-center text-red-500">Student profile not found</div>
  }

  const totalPoints = achievements.reduce((sum, achievement) => sum + achievement.points, 0)
  const approvedAchievements = achievements.filter((a) => a.verification_status === "approved")

  return (
    <div className="min-h-screen bg-transparent">
      <div className="flex">
        {/* Left Sidebar */}
        <div className="w-80 bg-purple-600 min-h-screen p-6 flex flex-col">
          <div className="mb-8">
            <div className="w-16 h-16 bg-purple-700 rounded-2xl flex items-center justify-center mb-6">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <div className="flex items-center text-white text-xl font-semibold">
              <GraduationCap className="w-6 h-6 mr-3" />
              Dashboard
            </div>
          </div>

          <div className="flex-1"></div>

          <button onClick={logout} className="flex items-center text-white/80 hover:text-white transition-colors">
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center flex-1 max-w-md">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input placeholder="Search" className="pl-10 bg-white/80 border-gray-200 rounded-xl h-12" />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Bell className="w-6 h-6 text-gray-600" />
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {student.first_name.charAt(0)}
                    {student.last_name.charAt(0)}
                  </span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">
                    {student.first_name} {student.last_name}
                  </div>
                  <div className="text-sm text-gray-600">Student</div>
                  <div className="text-xs text-gray-500">{student.department}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Welcome Banner */}
          <Card className="mb-8 bg-gradient-to-r from-purple-500 to-purple-600 border-0 text-white">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 mb-2">September 4, 2023</p>
                  <h1 className="text-3xl font-bold mb-2">Welcome back, {student.first_name}!</h1>
                  <p className="text-purple-100">Always stay updated in your student portal</p>
                </div>
                <div className="w-32 h-32 bg-purple-400/30 rounded-full flex items-center justify-center">
                  <GraduationCap className="w-16 h-16 text-white/80" />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* SGPA Trend */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">SGPA Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end justify-between h-32 gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-20 bg-purple-200 rounded-lg flex items-end justify-center pb-2">
                        <span className="text-sm font-semibold">8.2</span>
                      </div>
                      <span className="text-sm text-gray-600 mt-2">S1</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-24 bg-purple-400 rounded-lg flex items-end justify-center pb-2">
                        <span className="text-sm font-semibold text-white">8.7</span>
                      </div>
                      <span className="text-sm text-gray-600 mt-2">S2</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-28 bg-purple-500 rounded-lg flex items-end justify-center pb-2">
                        <span className="text-sm font-semibold text-white">9.2</span>
                      </div>
                      <span className="text-sm text-gray-600 mt-2">S3</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <ChevronLeft className="w-5 h-5 text-gray-400" />
                    <div className="text-center">
                      <div className="text-sm text-gray-600">CGPA : 9.0</div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </CardContent>
              </Card>

              {/* Time Table */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Time Table</CardTitle>
                    <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100">Monday</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between py-2">
                      <span className="text-gray-600">09:00-10:00</span>
                      <span className="font-medium">Art Class</span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-gray-600">10:00-11:00</span>
                      <span className="font-medium">Art Class</span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-gray-600">11:00-12:00</span>
                      <span className="font-medium">Art Class</span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-gray-600">13:00-14:00</span>
                      <span className="font-medium">Art Class</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Notice */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Notice</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-purple-600 text-sm">29 Sep 2025, Monday is a Holiday</p>
                </CardContent>
              </Card>

              {/* Attendance */}
              <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
                <CardContent className="p-6">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold mb-2">Attendance</h3>
                    <div className="text-4xl font-bold">60%</div>
                  </div>
                </CardContent>
              </Card>

              {/* Deadlines */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Deadlines</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-purple-500" />
                      <div>
                        <div className="font-medium text-sm">Biology Assignment</div>
                        <div className="text-xs text-gray-500">29/9/2025</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-purple-500" />
                      <div>
                        <div className="font-medium text-sm">Biology Assignment</div>
                        <div className="text-xs text-gray-500">29/9/2025</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-purple-500" />
                      <div>
                        <div className="font-medium text-sm">Biology Assignment</div>
                        <div className="text-xs text-gray-500">29/9/2025</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Skills/Tags */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Web development</Badge>
                    <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100">UI/X</Badge>
                    <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">Filmography</Badge>
                    <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Video Editing</Badge>
                    <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100">Painting</Badge>
                  </div>
                  <Button className="w-full bg-purple-600 hover:bg-purple-700 rounded-xl">Edit Profile</Button>
                </CardContent>
              </Card>

              {/* Calendar */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <ChevronLeft className="w-5 h-5 text-gray-400" />
                    <span className="font-semibold">January 2025</span>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-7 gap-1 text-center text-sm">
                    <div className="text-gray-500 font-medium">S</div>
                    <div className="text-gray-500 font-medium">M</div>
                    <div className="text-gray-500 font-medium">T</div>
                    <div className="text-gray-500 font-medium">W</div>
                    <div className="text-gray-500 font-medium">T</div>
                    <div className="text-gray-500 font-medium">F</div>
                    <div className="text-gray-500 font-medium">S</div>

                    <div className="text-gray-400">29</div>
                    <div className="text-gray-400">30</div>
                    <div className="text-gray-400">31</div>
                    <div>1</div>
                    <div>2</div>
                    <div>3</div>
                    <div>4</div>

                    <div>5</div>
                    <div>6</div>
                    <div>7</div>
                    <div>8</div>
                    <div>9</div>
                    <div>10</div>
                    <div>11</div>

                    <div>12</div>
                    <div>13</div>
                    <div>14</div>
                    <div>15</div>
                    <div className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center mx-auto">
                      16
                    </div>
                    <div>17</div>
                    <div>18</div>

                    <div>19</div>
                    <div>20</div>
                    <div>21</div>
                    <div>22</div>
                    <div>23</div>
                    <div>24</div>
                    <div>25</div>

                    <div>26</div>
                    <div>27</div>
                    <div>28</div>
                    <div>29</div>
                    <div>30</div>
                    <div>31</div>
                    <div className="text-gray-400">1</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
