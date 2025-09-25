"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useAuth } from "@/lib/auth"
import { mockAnalytics } from "@/lib/mock-data"
import {
  Search,
  Bell,
  GraduationCap,
  LogOut,
  BarChart3,
  Users,
  Calendar as CalendarIcon,
  MoreVertical,
  Plus,
  Eye,
  Edit,
  Trash2,
  Download,
  Clock,
} from "lucide-react"

// Mock data for events and activities
const mockEvents = [
  { id: "1", name: "Design Workshop", date: "29/9/2025", type: "workshop" },
  { id: "2", name: "Design Workshop", date: "29/9/2025", type: "workshop" },
  { id: "3", name: "Design Workshop", date: "29/9/2025", type: "workshop" },
  { id: "4", name: "Design Workshop", date: "29/9/2025", type: "workshop" },
  { id: "5", name: "Design Workshop", date: "29/9/2025", type: "workshop" },
]

const departmentData = [
  { name: "CSE", activity: 120, academics: 110 },
  { name: "AH", activity: 90, academics: 85 },
  { name: "EEE", activity: 140, academics: 125 },
  { name: "ME", activity: 100, academics: 95 },
  { name: "EC", activity: 80, academics: 75 },
]

export function AdminDashboard() {
  const { user, logout } = useAuth()
  const [analytics, setAnalytics] = useState(mockAnalytics)
  const [loading, setLoading] = useState(true)
  const [selectedEvent, setSelectedEvent] = useState<any>(null)
  const [showUserModal, setShowUserModal] = useState(false)
  const [showNAACModal, setShowNAACModal] = useState(false)
  const [showAICTEModal, setShowAICTEModal] = useState(false)
  const [showNIRFModal, setShowNIRFModal] = useState(false)

  useEffect(() => {
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
    <div className="min-h-screen bg-[#F7F5FF] flex">
      {/* Left Sidebar */}
      <aside className="w-60 flex flex-col items-center py-8 px-4 bg-gradient-to-b from-[#925FE2] to-[#B57CE6] rounded-2xl m-4">
        {/* Logo */}
        <div className="mb-12">
          <div className="w-16 h-16 bg-white flex items-center justify-center rounded-2xl shadow-md">
            <span className="text-4xl font-bold" style={{ color: '#925FE2' }}>P</span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 space-y-2 w-full">
          <SidebarItem 
            icon={<BarChart3 />} 
            label="Dashboard" 
            active={true}
          />
        </nav>

        <button
          onClick={() => {
            logout();
            window.location.href = "/";
          }}
          className="mt-auto flex items-center gap-3 text-white/80 hover:text-white py-2 px-4 rounded-xl transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm">Logout</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col px-8 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4 bg-[#F4EEFB] rounded-xl px-4 py-2 w-96">
            <Search className="w-5 h-5 text-[#925FE2]" />
            <Input className="bg-transparent border-0 focus:ring-0 text-[#925FE2] placeholder-[#925FE2]/70" placeholder="Search" />
          </div>
          <div className="flex items-center gap-5">
            <Bell className="w-6 h-6 text-[#925FE2]" />
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#925FE2]">
              <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Profile" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>

        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-[#925FE2] to-[#B57CE6] rounded-2xl p-8 mb-8 text-white relative overflow-hidden">
          <div className="flex items-center justify-between relative z-10">
            <div>
              <p className="text-white/80 mb-2 text-sm">
                September 4, 2023
              </p>
              <h1 className="text-3xl font-bold mb-2">
                Welcome back, Aleena!
              </h1>
              <p className="text-white/90 text-sm">
                Always stay updated in your student portal
              </p>
            </div>
            <div className="relative">
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-white/10 rounded-full"></div>
              <div className="absolute top-2 right-8 w-12 h-12 bg-[#FDCB45] rounded-lg transform rotate-12"></div>
              <div className="absolute top-8 right-2 w-8 h-8 bg-[#87E7FA] rounded"></div>
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
                <GraduationCap className="w-12 h-12 text-white/90" />
              </div>
              <div className="absolute -bottom-2 right-12 w-3 h-3 bg-green-400 rounded-full"></div>
              <div className="absolute top-0 right-16 w-3 h-3 bg-pink-300 rounded-full"></div>
              <div className="absolute bottom-4 right-20 w-3 h-3 bg-blue-300 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Students and Staff Cards */}
            <div className="grid grid-cols-2 gap-6">
              <Card className="bg-gradient-to-br from-[#FDCB45] to-[#FDB345] text-white border-0 shadow-lg rounded-2xl cursor-pointer transition-transform hover:scale-105" onClick={() => setShowUserModal(true)}>
                <CardContent className="p-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-2xl font-bold mb-4">Students</h3>
                      <p className="text-4xl font-bold">{analytics.overview.totalStudents.toLocaleString()}</p>
                    </div>
                    <div className="relative">
                      <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                        <GraduationCap className="w-10 h-10 text-white" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#87E7FA] rounded transform rotate-12"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-[#FDCB45] to-[#FDB345] text-white border-0 shadow-lg rounded-2xl cursor-pointer transition-transform hover:scale-105" onClick={() => setShowUserModal(true)}>
                <CardContent className="p-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-2xl font-bold mb-4">Staff</h3>
                      <p className="text-4xl font-bold">{analytics.overview.totalFaculty.toLocaleString()}</p>
                    </div>
                    <div className="relative">
                      <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                        <Users className="w-10 h-10 text-white" />
                      </div>
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-pink-400 rounded-full"></div>
                      <div className="absolute bottom-2 -right-2 w-4 h-4 bg-blue-400 rounded"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Active Events */}
            <Card className="shadow-sm border-0 rounded-2xl">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold text-gray-800">Active Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockEvents.map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer" onClick={() => setSelectedEvent(event)}>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#925FE2] rounded-xl flex items-center justify-center">
                          <CalendarIcon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{event.name}</h4>
                          <p className="text-sm text-gray-600">{event.date}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Department Activity Chart */}
          <div className="space-y-6">
            <Card className="shadow-sm border-0 rounded-2xl">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold text-gray-800">Department Activity Comparison Chart</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Chart Area */}
                  <div className="relative h-64">
                    <div className="flex items-end justify-between h-full px-4">
                      {departmentData.map((dept, index) => (
                        <div key={dept.name} className="flex flex-col items-center space-y-2">
                          <div className="flex space-x-1">
                            {/* Activity Bar */}
                            <div className="w-6 bg-gray-200 rounded-t-lg relative" style={{ height: '200px' }}>
                              <div 
                                className="bg-[#925FE2] rounded-t-lg absolute bottom-0 w-full transition-all duration-300"
                                style={{ height: `${(dept.activity / 150) * 200}px` }}
                              ></div>
                            </div>
                            {/* Academics Bar */}
                            <div className="w-6 bg-gray-200 rounded-t-lg relative" style={{ height: '200px' }}>
                              <div 
                                className="bg-[#B57CE6] rounded-t-lg absolute bottom-0 w-full transition-all duration-300"
                                style={{ height: `${(dept.academics / 150) * 200}px` }}
                              ></div>
                            </div>
                          </div>
                          <span className="text-sm font-medium text-gray-700">{dept.name}</span>
                        </div>
                      ))}
                    </div>
                    {/* Y-axis labels */}
                    <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500">
                      <span>150</span>
                      <span>120</span>
                      <span>90</span>
                      <span>60</span>
                      <span>30</span>
                      <span>0</span>
                    </div>
                  </div>
                  
                  {/* Legend */}
                  <div className="flex items-center justify-center gap-6">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-[#925FE2] rounded"></div>
                      <span className="text-sm text-gray-600">Activity</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-[#B57CE6] rounded"></div>
                      <span className="text-sm text-gray-600">Academics</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Modals */}
        <UserManagementModal open={showUserModal} onClose={() => setShowUserModal(false)} />
        <NAACReportModal open={showNAACModal} onClose={() => setShowNAACModal(false)} />
        <AICTEReportModal open={showAICTEModal} onClose={() => setShowAICTEModal(false)} />
        <NIRFReportModal open={showNIRFModal} onClose={() => setShowNIRFModal(false)} />
        
        {selectedEvent && (
          <EventDetailsModal 
            event={selectedEvent} 
            open={!!selectedEvent} 
            onClose={() => setSelectedEvent(null)} 
          />
        )}
      </main>
    </div>
  )
}

// Component definitions
function SidebarItem({ icon, label, active, onClick }: { 
  icon: React.ReactNode; 
  label: string; 
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <div 
      className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-colors ${
        active ? 'bg-white/20 text-white' : 'text-white/90 hover:bg-white/10'
      }`}
      onClick={onClick}
    >
      <span className="w-5 h-5 flex items-center justify-center">{icon}</span>
      <span className="font-medium text-sm">{label}</span>
    </div>
  )
}

// Modal Components
function UserManagementModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>User Management</DialogTitle>
          <DialogDescription>
            Create, manage, and assign roles for students and faculty
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Input placeholder="Search users..." className="w-64" />
              <Button variant="outline">Filter</Button>
            </div>
            <Button className="bg-[#925FE2] hover:bg-[#7c4fd3]">
              <Plus className="w-4 h-4 mr-2" />
              Add User
            </Button>
          </div>
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-gray-50 p-4 font-medium text-sm grid grid-cols-5 gap-4">
              <span>Name</span>
              <span>Role</span>
              <span>Department</span>
              <span>Status</span>
              <span>Actions</span>
            </div>
            <div className="divide-y max-h-96 overflow-y-auto">
              {[
                { name: "John Doe", role: "Faculty", dept: "CSE", status: "Active" },
                { name: "Jane Smith", role: "Student", dept: "ECE", status: "Active" },
                { name: "Bob Wilson", role: "Faculty", dept: "ME", status: "Inactive" },
                { name: "Alice Johnson", role: "Student", dept: "CSE", status: "Active" },
                { name: "Mike Davis", role: "Faculty", dept: "EEE", status: "Active" },
              ].map((user, i) => (
                <div key={i} className="p-4 grid grid-cols-5 gap-4 items-center">
                  <span className="font-medium">{user.name}</span>
                  <Badge variant={user.role === "Faculty" ? "default" : "secondary"}>
                    {user.role}
                  </Badge>
                  <span>{user.dept}</span>
                  <Badge variant={user.status === "Active" ? "default" : "destructive"}>
                    {user.status}
                  </Badge>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function NAACReportModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>NAAC Accreditation Report</DialogTitle>
          <DialogDescription>
            Generate comprehensive NAAC accreditation report
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Report Period</label>
              <Input placeholder="2023-2024" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Assessment Year</label>
              <Input placeholder="2024" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Include Criteria</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                "Curricular Aspects",
                "Teaching & Learning",
                "Research & Innovation",
                "Infrastructure & Resources",
                "Student Support",
                "Governance & Leadership",
                "Institutional Values"
              ].map((criteria) => (
                <div key={criteria} className="flex items-center space-x-2">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="text-sm">{criteria}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button className="bg-[#925FE2] hover:bg-[#7c4fd3]">
              <Download className="w-4 h-4 mr-2" />
              Generate Report
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function AICTEReportModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>AICTE Compliance Report</DialogTitle>
          <DialogDescription>
            Generate AICTE compliance and approval report
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Academic Year</label>
              <Input placeholder="2023-24" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Institution Code</label>
              <Input placeholder="1-123456789" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Report Sections</label>
            <div className="grid grid-cols-1 gap-2">
              {[
                "Faculty Details & Qualifications",
                "Student Intake & Admission",
                "Infrastructure & Facilities",
                "Library & Laboratory Resources",
                "Financial Status",
                "Placement Records"
              ].map((section) => (
                <div key={section} className="flex items-center space-x-2">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="text-sm">{section}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button className="bg-[#925FE2] hover:bg-[#7c4fd3]">
              <Download className="w-4 h-4 mr-2" />
              Generate Report
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function NIRFReportModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>NIRF Ranking Report</DialogTitle>
          <DialogDescription>
            Generate National Institutional Ranking Framework report
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Ranking Year</label>
              <Input placeholder="2024" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Input placeholder="Engineering" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Parameters</label>
            <div className="grid grid-cols-1 gap-2">
              {[
                "Teaching, Learning & Resources (30%)",
                "Research & Professional Practice (30%)",
                "Graduation Outcomes (20%)",
                "Outreach & Inclusivity (10%)",
                "Perception (10%)"
              ].map((param) => (
                <div key={param} className="flex items-center space-x-2">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="text-sm">{param}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button className="bg-[#925FE2] hover:bg-[#7c4fd3]">
              <Download className="w-4 h-4 mr-2" />
              Generate Report
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function EventDetailsModal({ event, open, onClose }: { event: any; open: boolean; onClose: () => void }) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{event?.name}</DialogTitle>
          <DialogDescription>
            Event details and management options
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <CalendarIcon className="w-5 h-5 text-[#925FE2]" />
            <span className="text-sm">{event?.date}</span>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-[#925FE2]" />
            <span className="text-sm">Duration: 2 hours</span>
          </div>
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-[#925FE2]" />
            <span className="text-sm">Participants: 45 registered</span>
          </div>
          <div className="border-t pt-4">
            <h4 className="font-semibold mb-2">Description</h4>
            <p className="text-sm text-gray-600">
              Interactive workshop focusing on modern design principles and user experience best practices.
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>Close</Button>
            <Button className="bg-[#925FE2] hover:bg-[#7c4fd3]">
              <Edit className="w-4 h-4 mr-2" />
              Edit Event
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}