"use client";

import React, { useState, useEffect } from "react";
import {
  User,
  Trophy,
  Briefcase,
  Bell,
  Search,
  FileText,
  Download,
  Upload,
  ExternalLink,
  LogOut,
  BookOpen,
  Users,
  Zap,
  Brain,
  Target,
  Award,
  TrendingUp,
  Share2,
  BarChart3,
  Settings,
  Eye,
  Edit3,
  Plus,
  AlertCircle,
  CheckCircle2,
  X,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/lib/auth";
import { mockStudents, mockAchievements } from "@/lib/mock-data";
import { CertificateUploadDialog } from "@/components/portfolio/certificate-upload-dialog";
import { certificateService } from "@/lib/certificate-service";
import { aiCategorization } from "@/lib/ai-categorization";
import type { Student, Achievement, Certificate } from "@/lib/types";

interface StudentDashboardProps {
  className?: string;
}

export function EnhancedStudentDashboard({ className }: StudentDashboardProps) {
  const { user, logout } = useAuth();
  const [student, setStudent] = useState<Student | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<
    | "dashboard"
    | "portfolio"
    | "certificate-management"
    | "ai-analysis"
    | "portfolio-builder"
    | "career-recommendations"
    | "export"
  >("certificate-management"); // Start with Certificate Management to showcase the main feature
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [careerRecommendations, setCareerRecommendations] = useState<any[]>([]);

  useEffect(() => {
    // Mock data loading - in real app, this would fetch from Supabase
    const studentData = mockStudents.find((s) => s.user_id === user?.id);
    const studentAchievements = mockAchievements.filter(
      (a) => a.student_id === studentData?.id
    );

    setStudent(studentData || null);
    setAchievements(studentAchievements);
    
    // Load certificates
    if (studentData) {
      loadCertificates(studentData.id);
      loadAIAnalysis();
      loadCareerRecommendations();
    }
    
    setLoading(false);
  }, [user]);

  const loadCertificates = async (studentId: string) => {
    try {
      const certs = await certificateService.getCertificatesByStudent(studentId);
      // Type conversion to match Certificate interface
      const convertedCerts: Certificate[] = certs.map(cert => ({
        ...cert,
        certificate_url: cert.certificate_url || undefined
      }));
      setCertificates(convertedCerts);
    } catch (error) {
      console.error('Failed to load certificates:', error);
    }
  };

  const loadAIAnalysis = async () => {
    // Mock AI analysis data
    setAiAnalysis({
      skillsIdentified: 12,
      interestAreas: 5,
      verifiedCertificates: 8,
      fieldAnalysis: [
        { field: "UI/UX Design", percentage: 85, color: "#925FE2" },
        { field: "Web Development", percentage: 70, color: "#87E7FA" },
        { field: "Graphic Design", percentage: 60, color: "#FDCB45" }
      ]
    });
  };

  const loadCareerRecommendations = async () => {
    // Mock career recommendations
    setCareerRecommendations([
      {
        type: "company",
        name: "Google",
        role: "UI/UX Designer",
        matchScore: 92,
        reason: "Based on your UX design skills and Google certifications",
        logo: "G",
        color: "bg-blue-100 text-blue-600"
      },
      {
        type: "company",
        name: "Figma",
        role: "Product Designer",
        matchScore: 88,
        reason: "Perfect fit for your design expertise and Figma skills",
        logo: "F",
        color: "bg-purple-100 text-purple-600"
      }
    ]);
  };

  const handleCertificateUploadSuccess = () => {
    if (student) {
      loadCertificates(student.id);
    }
  };

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
    <div className="min-h-screen bg-[#F7F5FF] flex">
      {/* Sidebar */}
      <aside className="w-60 flex flex-col items-center py-8 px-4 bg-gradient-to-b from-[#925FE2] to-[#B57CE6] rounded-2xl m-4">
        {/* Logo */}
        <div className="mb-12">
          <div className="w-16 h-16 bg-white flex items-center justify-center rounded-2xl shadow-md">
            <span className="text-4xl font-bold" style={{ color: '#925FE2' }}>P</span>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="flex flex-col gap-2 w-full">
          <SidebarItem 
            icon={<BarChart3 />} 
            label="Dashboard" 
            active={activeView === "dashboard"}
            onClick={() => setActiveView("dashboard")}
          />
          <SidebarItem 
            icon={<User />} 
            label="Portfolio" 
            active={activeView === "portfolio"}
            onClick={() => setActiveView("portfolio")}
          />
          <SidebarItem 
            icon={<Upload />} 
            label="Certificate Upload" 
            active={activeView === "certificate-management"}
            onClick={() => setActiveView("certificate-management")}
          />
          <SidebarItem 
            icon={<Brain />} 
            label="AI Analysis" 
            active={activeView === "ai-analysis"}
            onClick={() => setActiveView("ai-analysis")}
          />
          <SidebarItem 
            icon={<Zap />} 
            label="Portfolio Builder" 
            active={activeView === "portfolio-builder"}
            onClick={() => setActiveView("portfolio-builder")}
          />
          <SidebarItem 
            icon={<Briefcase />} 
            label="Career Rec." 
            active={activeView === "career-recommendations"}
            onClick={() => setActiveView("career-recommendations")}
          />
          <SidebarItem 
            icon={<Download />} 
            label="Export" 
            active={activeView === "export"}
            onClick={() => setActiveView("export")}
          />
        </nav>
        
        {/* Logout */}
        <button 
          onClick={() => {
            logout();
            window.location.href = "/";
          }}
          className="mt-auto flex items-center gap-3 text-white/80 hover:text-white py-2 px-4 rounded-xl transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Logout
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

        {/* Content based on active view */}
        {activeView === "dashboard" && (
          <DashboardOverview 
            student={student} 
            achievements={achievements} 
            certificates={certificates}
            totalPoints={totalPoints}
            approvedAchievements={approvedAchievements}
          />
        )}
        
        {activeView === "portfolio" && (
          <PortfolioView 
            student={student} 
            achievements={achievements} 
            certificates={certificates}
          />
        )}
        
        {activeView === "certificate-management" && (
          <CertificateManagement 
            student={student}
            certificates={certificates}
            onUploadClick={() => setUploadDialogOpen(true)}
            onRefresh={() => loadCertificates(student.id)}
          />
        )}
        
        {activeView === "ai-analysis" && (
          <AIAnalysisView aiAnalysis={aiAnalysis} />
        )}
        
        {activeView === "portfolio-builder" && (
          <PortfolioBuilderView student={student} certificates={certificates} />
        )}
        
        {activeView === "career-recommendations" && (
          <CareerRecommendationsView recommendations={careerRecommendations} />
        )}
        
        {activeView === "export" && (
          <ExportView student={student} />
        )}

        {/* Certificate Upload Dialog */}
        <CertificateUploadDialog
          isOpen={uploadDialogOpen}
          onClose={() => setUploadDialogOpen(false)}
          studentId={student.id}
          onUploadSuccess={handleCertificateUploadSuccess}
        />
      </main>
    </div>
  );
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
  );
}

function DashboardOverview({ student, achievements, certificates, totalPoints, approvedAchievements }: {
  student: Student;
  achievements: Achievement[];
  certificates: Certificate[];
  totalPoints: number;
  approvedAchievements: Achievement[];
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-0 shadow-sm rounded-2xl">
          <CardContent className="p-6 text-center">
            <Trophy className="w-12 h-12 mx-auto mb-4" style={{ color: '#925FE2' }} />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{achievements.length}</h3>
            <p className="text-gray-600">Total Achievements</p>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-sm rounded-2xl">
          <CardContent className="p-6 text-center">
            <Award className="w-12 h-12 mx-auto mb-4" style={{ color: '#87E7FA' }} />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{certificates.length}</h3>
            <p className="text-gray-600">Certificates</p>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-sm rounded-2xl">
          <CardContent className="p-6 text-center">
            <Target className="w-12 h-12 mx-auto mb-4" style={{ color: '#FDCB45' }} />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{totalPoints}</h3>
            <p className="text-gray-600">Achievement Points</p>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-sm rounded-2xl">
          <CardContent className="p-6 text-center">
            <CheckCircle2 className="w-12 h-12 mx-auto mb-4" style={{ color: '#10B981' }} />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{approvedAchievements.length}</h3>
            <p className="text-gray-600">Approved</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Activity */}
      <Card className="border-0 shadow-sm rounded-2xl">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-800">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {achievements.slice(0, 5).map((achievement, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-4">
                  <Trophy className="w-8 h-8" style={{ color: '#925FE2' }} />
                  <div>
                    <h4 className="font-semibold text-gray-900">{achievement.title}</h4>
                    <p className="text-sm text-gray-600">{achievement.date_achieved}</p>
                  </div>
                </div>
                <Badge 
                  variant={achievement.verification_status === 'approved' ? 'default' : 'secondary'}
                  className={achievement.verification_status === 'approved' ? 'bg-green-100 text-green-800' : ''}
                >
                  {achievement.verification_status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Direct imports to avoid conflicts
import { 
  PortfolioView, 
  CertificateManagement, 
  AIAnalysisView, 
  PortfolioBuilderView, 
  CareerRecommendationsView, 
  ExportView 
} from "./student-dashboard-components";
import { CategoryCard } from "./student-dashboard-utils";