// Additional components for the Enhanced Student Dashboard

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
  Sparkles,
  Star,
  Building,
  MapPin,
  Clock,
  Filter,
  Calendar,
  Link,
  Folder,
  GraduationCap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { certificateService } from "@/lib/certificate-service";
import { aiCategorization } from "@/lib/ai-categorization";
import type { Student, Achievement, Certificate } from "@/lib/types";

export function PortfolioView({ student, achievements, certificates }: {
  student: Student;
  achievements: Achievement[];
  certificates: Certificate[];
}) {
  const verifiedCertificates = certificates.filter(cert => cert.status === 'verified');
  const skills = extractSkillsFromCertificates(certificates);
  const interests = extractInterestsFromCertificates(certificates);

  return (
    <div className="space-y-6">
      {/* Portfolio Title and Actions */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-3xl font-bold text-gray-900">Portfolio</h2>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="flex items-center gap-2 rounded-xl border-[#925FE2] text-[#925FE2]">
            <Edit3 className="w-4 h-4" /> Edit
          </Button>
          <Button variant="outline" className="flex items-center gap-2 rounded-xl border-[#925FE2] text-[#925FE2]">
            <Share2 className="w-4 h-4" /> Share
          </Button>
          <Button className="flex items-center gap-2 rounded-xl" style={{ backgroundColor: '#925FE2' }}>
            <Download className="w-4 h-4" /> Download PDF
          </Button>
        </div>
      </div>
      
      {/* Profile Header */}
      <section className="bg-gradient-to-r from-[#925FE2] to-[#B57CE6] rounded-2xl p-8 flex gap-8 items-center mb-6">
        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
          {student.first_name[0]}{student.last_name[0]}
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-white mb-2">{student.first_name} {student.last_name}</h1>
          <p className="text-white/90 mb-4">Student at {student.department} Department • Year {student.year}</p>
          <p className="text-white/80 mb-4 max-w-2xl">
            A passionate and dedicated student with expertise in multiple domains. 
            Continuously learning and building skills through certifications and practical projects.
          </p>
          <div className="flex flex-wrap gap-2">
            {interests.map((interest, index) => (
              <Tag key={index} color={getInterestColor(interest)} text="#fff">{interest}</Tag>
            ))}
          </div>
        </div>
      </section>
      
      {/* Portfolio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Skills & Expertise */}
        <Card className="border-0 shadow-sm rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">Skills & Expertise</h3>
              <Badge variant="outline">{skills.length} Skills</Badge>
            </div>
            <div className="space-y-3">
              {skills.map((skill, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{skill.name}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-2 bg-gray-200 rounded-full">
                      <div 
                        className="h-2 rounded-full" 
                        style={{ backgroundColor: '#925FE2', width: `${skill.proficiency}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500">{skill.proficiency}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* Verified Certificates */}
        <Card className="border-0 shadow-sm rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">Verified Certificates</h3>
              <Badge className="bg-green-100 text-green-800">{verifiedCertificates.length} Verified</Badge>
            </div>
            <div className="space-y-3">
              {verifiedCertificates.slice(0, 5).map((cert, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <Award className="w-5 h-5 text-green-500" />
                    <div>
                      <h4 className="font-medium text-sm text-gray-900">{cert.title}</h4>
                      <p className="text-xs text-gray-600">{cert.issuer}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* Recent Projects */}
        <Card className="border-0 shadow-sm rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">Recent Projects</h3>
              <Button variant="outline" size="sm" className="rounded-xl">
                <Plus className="w-4 h-4 mr-1" /> Add Project
              </Button>
            </div>
            <div className="space-y-3">
              {generateProjectsFromCertificates(certificates).slice(0, 3).map((project, index) => (
                <div key={index} className="p-3 border border-gray-200 rounded-xl">
                  <h4 className="font-medium text-sm text-gray-900 mb-1">{project.title}</h4>
                  <p className="text-xs text-gray-600 mb-2">{project.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {project.technologies.map((tech, techIndex) => (
                      <span key={techIndex} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* Achievements & Awards */}
        <Card className="border-0 shadow-sm rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">Achievements & Awards</h3>
              <Badge variant="outline">{achievements.length} Total</Badge>
            </div>
            <div className="space-y-3">
              {achievements.slice(0, 4).map((achievement, index) => (
                <div key={index} className="flex items-start gap-3">
                  <Trophy className="w-5 h-5 mt-0.5" style={{ color: '#925FE2' }} />
                  <div className="flex-1">
                    <h4 className="font-medium text-sm text-gray-900">{achievement.title}</h4>
                    <p className="text-xs text-gray-600">{achievement.date_achieved}</p>
                    <Badge 
                      className={achievement.verification_status === 'approved' ? 'bg-green-100 text-green-800 text-xs' : 'bg-yellow-100 text-yellow-800 text-xs'}
                    >
                      {achievement.verification_status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function CertificateManagement({ student, certificates, onUploadClick, onRefresh }: {
  student: Student;
  certificates: Certificate[];
  onUploadClick: () => void;
  onRefresh: () => void;
}) {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const filteredCertificates = certificates.filter(cert => {
    const matchesCategory = filterCategory === 'all' || cert.category === filterCategory;
    const matchesSearch = cert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cert.issuer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAnalyzeCertificates = async () => {
    setIsAnalyzing(true);
    try {
      // Simulate AI analysis
      await new Promise(resolve => setTimeout(resolve, 2000));
      // In real implementation, this would call the AI service
      onRefresh();
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getCategoryStats = () => {
    const stats = {
      all: certificates.length,
      academic: certificates.filter(c => c.category === 'academic').length,
      professional: certificates.filter(c => c.category === 'professional').length,
      skill: certificates.filter(c => c.category === 'skill').length,
      achievement: certificates.filter(c => c.category === 'achievement').length
    };
    return stats;
  };

  const stats = getCategoryStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Certificate Upload & Management</h1>
          <p className="text-gray-600 mt-2">Upload, organize, and analyze your certificates with AI-powered insights</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            onClick={handleAnalyzeCertificates}
            disabled={isAnalyzing || certificates.length === 0}
            variant="outline" 
            className="rounded-xl border-[#925FE2] text-[#925FE2]"
          >
            <Brain className="w-4 h-4 mr-2" />
            {isAnalyzing ? 'Analyzing...' : 'AI Analysis'}
          </Button>
          <Button 
            onClick={onUploadClick}
            className="rounded-xl" 
            style={{ backgroundColor: '#925FE2' }}
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload Certificate
          </Button>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="border-0 shadow-sm rounded-2xl">
          <CardContent className="p-4 text-center">
            <FileText className="w-8 h-8 mx-auto mb-2" style={{ color: '#925FE2' }} />
            <h3 className="text-xl font-bold text-gray-900">{stats.all}</h3>
            <p className="text-sm text-gray-600">Total</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm rounded-2xl">
          <CardContent className="p-4 text-center">
            <GraduationCap className="w-8 h-8 mx-auto mb-2" style={{ color: '#87E7FA' }} />
            <h3 className="text-xl font-bold text-gray-900">{stats.academic}</h3>
            <p className="text-sm text-gray-600">Academic</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm rounded-2xl">
          <CardContent className="p-4 text-center">
            <Briefcase className="w-8 h-8 mx-auto mb-2" style={{ color: '#FDCB45' }} />
            <h3 className="text-xl font-bold text-gray-900">{stats.professional}</h3>
            <p className="text-sm text-gray-600">Professional</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm rounded-2xl">
          <CardContent className="p-4 text-center">
            <Target className="w-8 h-8 mx-auto mb-2" style={{ color: '#10B981' }} />
            <h3 className="text-xl font-bold text-gray-900">{stats.skill}</h3>
            <p className="text-sm text-gray-600">Skills</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm rounded-2xl">
          <CardContent className="p-4 text-center">
            <Trophy className="w-8 h-8 mx-auto mb-2" style={{ color: '#EF4444' }} />
            <h3 className="text-xl font-bold text-gray-900">{stats.achievement}</h3>
            <p className="text-sm text-gray-600">Awards</p>
          </CardContent>
        </Card>
      </div>

      {/* Upload Area */}
      <Card className="border-0 shadow-sm rounded-2xl">
        <CardContent className="p-8">
          <div className="border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center hover:border-purple-400 transition-colors cursor-pointer" onClick={onUploadClick}>
            <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Upload Your Certificates</h3>
            <p className="text-gray-600 mb-6">Support for PDF, JPG, PNG files. AI will automatically categorize and extract insights.</p>
            <div className="flex justify-center gap-4">
              <Button 
                onClick={(e) => { e.stopPropagation(); onUploadClick(); }}
                className="rounded-xl" 
                style={{ backgroundColor: '#925FE2' }}
              >
                <Upload className="w-4 h-4 mr-2" />
                Choose Files
              </Button>
              <Button variant="outline" className="rounded-xl">
                <Link className="w-4 h-4 mr-2" />
                Add from URL
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Certificate Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm rounded-2xl hover:shadow-md transition-shadow cursor-pointer" onClick={() => setFilterCategory('academic')}>
          <CardContent className="p-6 text-center">
            <BookOpen className="w-8 h-8 mx-auto mb-3" style={{ color: '#925FE2' }} />
            <h4 className="font-semibold text-gray-900 mb-1">Courses</h4>
            <p className="text-sm text-gray-600">Online courses & certifications</p>
            <Badge className="mt-2">{stats.academic}</Badge>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm rounded-2xl hover:shadow-md transition-shadow cursor-pointer" onClick={() => setFilterCategory('achievement')}>
          <CardContent className="p-6 text-center">
            <Trophy className="w-8 h-8 mx-auto mb-3" style={{ color: '#925FE2' }} />
            <h4 className="font-semibold text-gray-900 mb-1">Competitions</h4>
            <p className="text-sm text-gray-600">Hackathons & contests</p>
            <Badge className="mt-2">{stats.achievement}</Badge>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm rounded-2xl hover:shadow-md transition-shadow cursor-pointer" onClick={() => setFilterCategory('skill')}>
          <CardContent className="p-6 text-center">
            <Users className="w-8 h-8 mx-auto mb-3" style={{ color: '#925FE2' }} />
            <h4 className="font-semibold text-gray-900 mb-1">Workshops</h4>
            <p className="text-sm text-gray-600">Training & workshops</p>
            <Badge className="mt-2">{stats.skill}</Badge>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm rounded-2xl hover:shadow-md transition-shadow cursor-pointer" onClick={() => setFilterCategory('professional')}>
          <CardContent className="p-6 text-center">
            <Briefcase className="w-8 h-8 mx-auto mb-3" style={{ color: '#925FE2' }} />
            <h4 className="font-semibold text-gray-900 mb-1">Internships</h4>
            <p className="text-sm text-gray-600">Work experience certificates</p>
            <Badge className="mt-2">{stats.professional}</Badge>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="border-0 shadow-sm rounded-2xl">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search certificates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 rounded-xl"
                />
              </div>
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-48 rounded-xl">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="academic">Academic</SelectItem>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="skill">Skills</SelectItem>
                <SelectItem value="achievement">Achievements</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Certificates List */}
      <Card className="border-0 shadow-sm rounded-2xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold text-gray-800">
              Your Certificates ({filteredCertificates.length})
            </CardTitle>
            <Button variant="outline" size="sm" className="rounded-xl" onClick={onRefresh}>
              <Settings className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredCertificates.length > 0 ? (
              filteredCertificates.map((cert, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{cert.title}</h4>
                      <p className="text-sm text-gray-600">{cert.issuer} • {new Date(cert.issue_date).toLocaleDateString()}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={`text-xs ${
                          cert.category === 'academic' ? 'bg-blue-100 text-blue-800' :
                          cert.category === 'professional' ? 'bg-purple-100 text-purple-800' :
                          cert.category === 'skill' ? 'bg-green-100 text-green-800' :
                          'bg-orange-100 text-orange-800'
                        }`}>
                          {cert.category}
                        </Badge>
                        <Badge className={`text-xs ${
                          cert.status === 'verified' ? 'bg-green-100 text-green-800' :
                          cert.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {cert.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {cert.certificate_url && (
                      <Button variant="outline" size="sm" className="rounded-xl">
                        <Eye className="w-4 h-4" />
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600">
                      <Settings className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                  {certificates.length === 0 ? 'No certificates uploaded yet' : 'No certificates match your filters'}
                </h3>
                <p className="text-gray-500 mb-4">
                  {certificates.length === 0 
                    ? 'Start building your portfolio by uploading your first certificate' 
                    : 'Try adjusting your search or filter criteria'
                  }
                </p>
                {certificates.length === 0 && (
                  <Button 
                    onClick={onUploadClick}
                    className="rounded-xl" 
                    style={{ backgroundColor: '#925FE2' }}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Your First Certificate
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function AIAnalysisView({ aiAnalysis }: { aiAnalysis: any }) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisData, setAnalysisData] = useState(aiAnalysis);

  const runAIAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      // Simulate AI analysis process
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock enhanced analysis results
      const newAnalysis = {
        skillsIdentified: Math.floor(Math.random() * 5) + 10,
        interestAreas: Math.floor(Math.random() * 3) + 4,
        verifiedCertificates: Math.floor(Math.random() * 3) + 6,
        fieldAnalysis: [
          { field: "UI/UX Design", percentage: Math.floor(Math.random() * 20) + 80, color: "#925FE2", trend: "+5%" },
          { field: "Web Development", percentage: Math.floor(Math.random() * 15) + 65, color: "#87E7FA", trend: "+12%" },
          { field: "Graphic Design", percentage: Math.floor(Math.random() * 15) + 55, color: "#FDCB45", trend: "+8%" },
          { field: "Data Science", percentage: Math.floor(Math.random() * 20) + 40, color: "#10B981", trend: "+15%" }
        ],
        skillGaps: [
          { skill: "Advanced React", priority: "High", recommendedCourse: "React Advanced Patterns" },
          { skill: "Cloud Architecture", priority: "Medium", recommendedCourse: "AWS Solutions Architect" },
          { skill: "Machine Learning", priority: "Low", recommendedCourse: "ML Fundamentals" }
        ],
        completionStatus: {
          completed: Math.floor(Math.random() * 5) + 8,
          inProgress: Math.floor(Math.random() * 3) + 2,
          planned: Math.floor(Math.random() * 4) + 3
        }
      };
      
      setAnalysisData(newAnalysis);
    } catch (error) {
      console.error('AI Analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (!analysisData) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">AI-Powered Certificate Analysis</h1>
            <p className="text-gray-600 mt-2">Get intelligent insights about your skills, interests, and career development</p>
          </div>
          <Button onClick={runAIAnalysis} className="rounded-xl" style={{ backgroundColor: '#925FE2' }}>
            <Zap className="w-4 h-4 mr-2" />
            Run AI Analysis
          </Button>
        </div>
        
        <Card className="border-0 shadow-sm rounded-2xl">
          <CardContent className="p-12 text-center">
            <Brain className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No analysis available</h3>
            <p className="text-gray-500 mb-6">Upload some certificates to get AI-powered insights about your skills and career path</p>
            <Button onClick={runAIAnalysis} className="rounded-xl" style={{ backgroundColor: '#925FE2' }}>
              <Brain className="w-4 h-4 mr-2" />
              Start Analysis
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AI-Powered Certificate Analysis</h1>
          <p className="text-gray-600 mt-2">Intelligent insights powered by machine learning algorithms</p>
        </div>
        <Button 
          onClick={runAIAnalysis} 
          disabled={isAnalyzing}
          className="rounded-xl" 
          style={{ backgroundColor: '#925FE2' }}
        >
          <Zap className="w-4 h-4 mr-2" />
          {isAnalyzing ? 'Analyzing...' : 'Update Analysis'}
        </Button>
      </div>

      {/* Analysis Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-0 shadow-sm rounded-2xl">
          <CardContent className="p-6 text-center">
            <Brain className="w-12 h-12 mx-auto mb-4" style={{ color: '#925FE2' }} />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{analysisData.skillsIdentified}</h3>
            <p className="text-gray-600">Skills Identified</p>
            <Badge className="mt-2 bg-purple-100 text-purple-800">+3 this week</Badge>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm rounded-2xl">
          <CardContent className="p-6 text-center">
            <Target className="w-12 h-12 mx-auto mb-4" style={{ color: '#87E7FA' }} />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{analysisData.interestAreas}</h3>
            <p className="text-gray-600">Interest Areas</p>
            <Badge className="mt-2 bg-blue-100 text-blue-800">Trending</Badge>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm rounded-2xl">
          <CardContent className="p-6 text-center">
            <Award className="w-12 h-12 mx-auto mb-4" style={{ color: '#FDCB45' }} />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{analysisData.verifiedCertificates}</h3>
            <p className="text-gray-600">Verified Certificates</p>
            <Badge className="mt-2 bg-green-100 text-green-800">Verified</Badge>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm rounded-2xl">
          <CardContent className="p-6 text-center">
            <TrendingUp className="w-12 h-12 mx-auto mb-4" style={{ color: '#10B981' }} />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">85%</h3>
            <p className="text-gray-600">Career Match</p>
            <Badge className="mt-2 bg-green-100 text-green-800">Excellent</Badge>
          </CardContent>
        </Card>
      </div>

      {/* Field Analysis */}
      <Card className="border-0 shadow-sm rounded-2xl">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-800">Field of Interest Analysis</CardTitle>
          <p className="text-gray-600">AI-identified areas based on your certificates and learning patterns</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {analysisData.fieldAnalysis?.map((field: any, index: number) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-gray-900">{field.field}</span>
                    <Badge className="bg-green-100 text-green-800 text-xs">{field.trend}</Badge>
                  </div>
                  <span className="text-sm font-medium text-gray-600">{field.percentage}%</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-3 bg-gray-200 rounded-full">
                    <div 
                      className="h-3 rounded-full transition-all duration-1000" 
                      style={{ backgroundColor: field.color, width: `${field.percentage}%` }}
                    ></div>
                  </div>
                </div>
                <p className="text-xs text-gray-500">Based on {Math.floor(Math.random() * 5) + 2} certificates in this field</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Completion Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-sm rounded-2xl">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-800">Learning Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                  <div>
                    <h4 className="font-medium text-gray-900">Completed</h4>
                    <p className="text-sm text-gray-600">Fully certified skills</p>
                  </div>
                </div>
                <span className="text-2xl font-bold text-green-600">{analysisData.completionStatus?.completed}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <Clock className="w-6 h-6 text-yellow-600" />
                  <div>
                    <h4 className="font-medium text-gray-900">In Progress</h4>
                    <p className="text-sm text-gray-600">Currently learning</p>
                  </div>
                </div>
                <span className="text-2xl font-bold text-yellow-600">{analysisData.completionStatus?.inProgress}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <Target className="w-6 h-6 text-blue-600" />
                  <div>
                    <h4 className="font-medium text-gray-900">Planned</h4>
                    <p className="text-sm text-gray-600">Future learning goals</p>
                  </div>
                </div>
                <span className="text-2xl font-bold text-blue-600">{analysisData.completionStatus?.planned}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm rounded-2xl">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-800">Skill Gap Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analysisData.skillGaps?.map((gap: any, index: number) => (
                <div key={index} className="p-4 border border-gray-200 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{gap.skill}</h4>
                    <Badge className={`text-xs ${
                      gap.priority === 'High' ? 'bg-red-100 text-red-800' :
                      gap.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {gap.priority} Priority
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">Recommended: {gap.recommendedCourse}</p>
                  <Button size="sm" variant="outline" className="w-full rounded-xl">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Find Courses
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights */}
      <Card className="border-0 shadow-sm rounded-2xl">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-800">AI Insights & Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Key Strengths</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
                  <Sparkles className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-gray-700">Strong foundation in UI/UX Design</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
                  <Sparkles className="w-5 h-5 text-blue-600" />
                  <span className="text-sm text-gray-700">Consistent learning pattern in web technologies</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-xl">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  <span className="text-sm text-gray-700">Diverse skill portfolio across multiple domains</span>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Growth Opportunities</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-xl">
                  <Target className="w-5 h-5 text-yellow-600" />
                  <span className="text-sm text-gray-700">Consider advanced backend development</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-xl">
                  <Target className="w-5 h-5 text-orange-600" />
                  <span className="text-sm text-gray-700">Explore cloud computing certifications</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-red-50 rounded-xl">
                  <Target className="w-5 h-5 text-red-600" />
                  <span className="text-sm text-gray-700">Add project management skills</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function PortfolioBuilderView({ student, certificates }: {
  student: Student;
  certificates: Certificate[];
}) {
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [selectedSections, setSelectedSections] = useState({
    skills: true,
    certificates: true,
    projects: true,
    experience: false,
    achievements: true,
    contact: true
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewMode, setPreviewMode] = useState(true);

  const templates = [
    {
      id: 'modern',
      name: 'Modern & Clean',
      description: 'Clean design with modern typography and subtle animations',
      preview: '#925FE2'
    },
    {
      id: 'creative',
      name: 'Creative & Colorful',
      description: 'Vibrant colors and creative layouts for artistic portfolios',
      preview: '#87E7FA'
    },
    {
      id: 'professional',
      name: 'Professional & Minimal',
      description: 'Minimalist design perfect for corporate environments',
      preview: '#FDCB45'
    },
    {
      id: 'academic',
      name: 'Academic & Formal',
      description: 'Traditional layout suitable for academic presentations',
      preview: '#10B981'
    }
  ];

  const generatePortfolio = async () => {
    setIsGenerating(true);
    try {
      // Simulate portfolio generation
      await new Promise(resolve => setTimeout(resolve, 3000));
      // In real implementation, this would call the portfolio generation service
    } catch (error) {
      console.error('Portfolio generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSectionToggle = (section: string) => {
    setSelectedSections(prev => ({
      ...prev,
      [section]: !prev[section as keyof typeof prev]
    }));
  };

  const verifiedCertificates = certificates.filter(cert => cert.status === 'verified');
  const skills = extractSkillsFromCertificates(certificates);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dynamic Portfolio Builder</h1>
          <p className="text-gray-600 mt-2">Create a stunning portfolio automatically from your certificates and achievements</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            onClick={() => setPreviewMode(!previewMode)}
            className="rounded-xl"
          >
            <Eye className="w-4 h-4 mr-2" />
            {previewMode ? 'Edit Mode' : 'Preview Mode'}
          </Button>
          <Button 
            onClick={generatePortfolio}
            disabled={isGenerating}
            className="rounded-xl" 
            style={{ backgroundColor: '#925FE2' }}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            {isGenerating ? 'Generating...' : 'Generate Portfolio'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configuration Panel */}
        <div className="lg:col-span-1 space-y-6">
          {/* Template Selection */}
          <Card className="border-0 shadow-sm rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-gray-800">Template Style</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {templates.map((template) => (
                  <div 
                    key={template.id}
                    className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      selectedTemplate === template.id 
                        ? 'border-purple-500 bg-purple-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedTemplate(template.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: template.preview }}
                      ></div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{template.name}</h4>
                        <p className="text-xs text-gray-600">{template.description}</p>
                      </div>
                      {selectedTemplate === template.id && (
                        <CheckCircle2 className="w-5 h-5 text-purple-600" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Section Selection */}
          <Card className="border-0 shadow-sm rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-gray-800">Sections to Include</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(selectedSections).map(([section, isSelected]) => (
                  <div key={section} className="flex items-center justify-between">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={isSelected}
                        onChange={() => handleSectionToggle(section)}
                        className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                      />
                      <span className="text-sm font-medium text-gray-700 capitalize">
                        {section.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                    </label>
                    <Badge className={isSelected ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}>
                      {isSelected ? 'Included' : 'Optional'}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Generation Stats */}
          <Card className="border-0 shadow-sm rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-gray-800">Portfolio Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Certificates</span>
                  <Badge>{verifiedCertificates.length} verified</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Skills</span>
                  <Badge>{skills.length} identified</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Projects</span>
                  <Badge>{generateProjectsFromCertificates(certificates).length} auto-generated</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Completeness</span>
                  <Badge className="bg-green-100 text-green-800">85%</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Portfolio Preview */}
        <div className="lg:col-span-2">
          <Card className="border-0 shadow-sm rounded-2xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-bold text-gray-800">Portfolio Preview</CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="rounded-xl">
                    <Settings className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="rounded-xl">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 rounded-xl p-6 min-h-[600px]">
                {/* Portfolio Header */}
                <div className="text-center mb-8">
                  <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-red-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                    {student.first_name[0]}{student.last_name[0]}
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{student.first_name} {student.last_name}</h1>
                  <p className="text-gray-600 mb-4">
                    {student.department} Student • Year {student.year}
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {extractInterestsFromCertificates(certificates).slice(0, 4).map((interest, index) => (
                      <span key={index} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Skills Section */}
                {selectedSections.skills && (
                  <div className="mb-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Skills & Expertise</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {skills.slice(0, 6).map((skill, index) => (
                        <div key={index} className="bg-white p-4 rounded-xl">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-gray-900">{skill.name}</span>
                            <span className="text-sm text-gray-600">{skill.proficiency}%</span>
                          </div>
                          <div className="w-full h-2 bg-gray-200 rounded-full">
                            <div 
                              className="h-2 rounded-full" 
                              style={{ backgroundColor: '#925FE2', width: `${skill.proficiency}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Certificates Section */}
                {selectedSections.certificates && (
                  <div className="mb-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Verified Certificates</h2>
                    <div className="grid grid-cols-1 gap-3">
                      {verifiedCertificates.slice(0, 4).map((cert, index) => (
                        <div key={index} className="bg-white p-4 rounded-xl flex items-center gap-4">
                          <Award className="w-6 h-6 text-green-500" />
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900">{cert.title}</h3>
                            <p className="text-sm text-gray-600">{cert.issuer} • {cert.issue_date}</p>
                          </div>
                          <Badge className="bg-green-100 text-green-800">Verified</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Projects Section */}
                {selectedSections.projects && (
                  <div className="mb-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Projects</h2>
                    <div className="grid grid-cols-1 gap-4">
                      {generateProjectsFromCertificates(certificates).slice(0, 3).map((project, index) => (
                        <div key={index} className="bg-white p-4 rounded-xl">
                          <h3 className="font-medium text-gray-900 mb-2">{project.title}</h3>
                          <p className="text-sm text-gray-600 mb-3">{project.description}</p>
                          <div className="flex flex-wrap gap-2">
                            {project.technologies.map((tech, techIndex) => (
                              <span key={techIndex} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Contact Section */}
                {selectedSections.contact && (
                  <div className="text-center mt-8 pt-8 border-t border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Get In Touch</h2>
                    <div className="flex justify-center gap-4">
                      <Button variant="outline" size="sm" className="rounded-xl">
                        <Link className="w-4 h-4 mr-2" />
                        LinkedIn
                      </Button>
                      <Button variant="outline" size="sm" className="rounded-xl">
                        <Link className="w-4 h-4 mr-2" />
                        GitHub
                      </Button>
                      <Button variant="outline" size="sm" className="rounded-xl">
                        <Link className="w-4 h-4 mr-2" />
                        Email
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Generation Actions */}
      <Card className="border-0 shadow-sm rounded-2xl">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Ready to generate your portfolio?</h3>
              <p className="text-sm text-gray-600">Your portfolio will be created based on your current settings and data.</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="rounded-xl">
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
              <Button 
                onClick={generatePortfolio}
                disabled={isGenerating}
                className="rounded-xl" 
                style={{ backgroundColor: '#925FE2' }}
              >
                <Download className="w-4 h-4 mr-2" />
                {isGenerating ? 'Generating...' : 'Download Portfolio'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function CareerRecommendationsView({ recommendations }: { recommendations: any[] }) {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);
  const [careerData, setCareerData] = useState(recommendations);
  const [selectedCareerPath, setSelectedCareerPath] = useState<string | null>(null);

  const updateRecommendations = async () => {
    setIsLoadingRecommendations(true);
    try {
      // Simulate AI recommendation update
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Enhanced mock data with more companies and roles
      const newRecommendations = [
        {
          type: "company",
          name: "Google",
          role: "UI/UX Designer",
          matchScore: 92,
          reason: "Strong match based on your UX design skills and Google certifications",
          logo: "G",
          color: "bg-blue-100 text-blue-600",
          salary: "$85k-$120k",
          location: "Mountain View, CA",
          remote: true,
          skills: ["UI/UX Design", "Figma", "User Research"]
        },
        {
          type: "company",
          name: "Figma",
          role: "Product Designer",
          matchScore: 88,
          reason: "Perfect fit for your design expertise and Figma proficiency",
          logo: "F",
          color: "bg-purple-100 text-purple-600",
          salary: "$80k-$115k",
          location: "San Francisco, CA",
          remote: true,
          skills: ["Product Design", "Figma", "Design Systems"]
        },
        {
          type: "company",
          name: "Microsoft",
          role: "Frontend Developer",
          matchScore: 85,
          reason: "Your web development skills align with Microsoft's tech stack",
          logo: "M",
          color: "bg-green-100 text-green-600",
          salary: "$75k-$110k",
          location: "Seattle, WA",
          remote: true,
          skills: ["React", "TypeScript", "Azure"]
        },
        {
          type: "startup",
          name: "Stripe",
          role: "Full Stack Developer",
          matchScore: 82,
          reason: "Growing fintech company looking for versatile developers",
          logo: "S",
          color: "bg-indigo-100 text-indigo-600",
          salary: "$90k-$130k",
          location: "San Francisco, CA",
          remote: true,
          skills: ["React", "Node.js", "APIs"]
        }
      ];
      
      setCareerData(newRecommendations);
    } catch (error) {
      console.error('Failed to update recommendations:', error);
    } finally {
      setIsLoadingRecommendations(false);
    }
  };

  const jobRoles = [
    {
      title: "UI/UX Designer",
      demand: "High",
      salary: "$65k-$95k",
      growth: "+15%",
      description: "Design user interfaces and experiences for digital products",
      match: "Perfect Match",
      color: "#925FE2",
      skills: ["Figma", "Adobe XD", "User Research", "Prototyping"]
    },
    {
      title: "Frontend Developer",
      demand: "Very High",
      salary: "$55k-$85k",
      growth: "+22%",
      description: "Build user-facing web applications and interfaces",
      match: "Good Match",
      color: "#87E7FA",
      skills: ["React", "JavaScript", "CSS", "HTML"]
    },
    {
      title: "Product Designer",
      demand: "High",
      salary: "$70k-$100k",
      growth: "+18%",
      description: "Design end-to-end product experiences and strategies",
      match: "Excellent Match",
      color: "#FDCB45",
      skills: ["Design Thinking", "Figma", "User Testing", "Strategy"]
    },
    {
      title: "Full Stack Developer",
      demand: "Very High",
      salary: "$75k-$110k",
      growth: "+25%",
      description: "Develop both frontend and backend applications",
      match: "Growing Match",
      color: "#10B981",
      skills: ["React", "Node.js", "Databases", "APIs"]
    }
  ];

  const filteredRecommendations = careerData.filter(rec => 
    selectedFilter === 'all' || rec.type === selectedFilter
  );

  const careerPaths = [
    {
      id: "designer",
      title: "Design Career Path",
      description: "Focus on UI/UX and product design",
      steps: ["Junior Designer", "Mid-level Designer", "Senior Designer", "Design Lead", "Design Director"],
      timeline: "3-7 years",
      icon: "🎨"
    },
    {
      id: "developer",
      title: "Development Career Path",
      description: "Software engineering and development",
      steps: ["Junior Developer", "Mid-level Developer", "Senior Developer", "Tech Lead", "Engineering Manager"],
      timeline: "4-8 years",
      icon: "💻"
    },
    {
      id: "product",
      title: "Product Career Path",
      description: "Product management and strategy",
      steps: ["Associate PM", "Product Manager", "Senior PM", "Principal PM", "VP of Product"],
      timeline: "5-10 years",
      icon: "📊"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Career Recommendation Engine</h1>
          <p className="text-gray-600 mt-2">Personalized career suggestions based on your skills, certifications, and market trends</p>
        </div>
        <Button 
          onClick={updateRecommendations}
          disabled={isLoadingRecommendations}
          className="rounded-xl" 
          style={{ backgroundColor: '#925FE2' }}
        >
          <TrendingUp className="w-4 h-4 mr-2" />
          {isLoadingRecommendations ? 'Updating...' : 'Update Recommendations'}
        </Button>
      </div>

      {/* Career Paths Overview */}
      <Card className="border-0 shadow-sm rounded-2xl">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-800">Suggested Career Paths</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {careerPaths.map((path) => (
              <div 
                key={path.id}
                className={`p-4 rounded-xl cursor-pointer transition-all ${
                  selectedCareerPath === path.id 
                    ? 'bg-purple-50 border-2 border-purple-500' 
                    : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                }`}
                onClick={() => setSelectedCareerPath(path.id)}
              >
                <div className="text-center">
                  <div className="text-3xl mb-2">{path.icon}</div>
                  <h3 className="font-semibold text-gray-900 mb-1">{path.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{path.description}</p>
                  <Badge className="bg-blue-100 text-blue-800">{path.timeline}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        <Button 
          variant={selectedFilter === 'all' ? 'default' : 'outline'}
          onClick={() => setSelectedFilter('all')}
          className="rounded-xl"
        >
          All ({careerData.length})
        </Button>
        <Button 
          variant={selectedFilter === 'company' ? 'default' : 'outline'}
          onClick={() => setSelectedFilter('company')}
          className="rounded-xl"
        >
          Companies ({careerData.filter(r => r.type === 'company').length})
        </Button>
        <Button 
          variant={selectedFilter === 'startup' ? 'default' : 'outline'}
          onClick={() => setSelectedFilter('startup')}
          className="rounded-xl"
        >
          Startups ({careerData.filter(r => r.type === 'startup').length})
        </Button>
      </div>

      {/* Recommended Companies */}
      <Card className="border-0 shadow-sm rounded-2xl">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-800">Recommended Companies</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredRecommendations.map((rec, index) => (
              <div key={index} className="p-6 border border-gray-200 rounded-xl hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${rec.color}`}>
                    <span className="font-bold text-lg">{rec.logo}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-900">{rec.name}</h4>
                      {rec.remote && <Badge className="bg-green-100 text-green-800 text-xs">Remote</Badge>}
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{rec.role}</p>
                    <p className="text-sm text-gray-500">{rec.location}</p>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium text-gray-700">Match Score:</span>
                    <div className="px-2 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: '#925FE2', color: 'white' }}>
                      {rec.matchScore}%
                    </div>
                    <span className="text-sm text-gray-600">• {rec.salary}</span>
                  </div>
                  <p className="text-sm text-gray-600">{rec.reason}</p>
                </div>
                
                <div className="mb-4">
                  <p className="text-xs text-gray-500 mb-2">Required Skills:</p>
                  <div className="flex flex-wrap gap-1">
                    {rec.skills?.map((skill: string, skillIndex: number) => (
                      <span key={skillIndex} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1 rounded-xl" style={{ backgroundColor: '#925FE2' }}>
                    Apply Now
                  </Button>
                  <Button variant="outline" size="sm" className="rounded-xl">
                    Learn More
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Job Roles */}
      <Card className="border-0 shadow-sm rounded-2xl">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-800">Trending Job Roles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {jobRoles.map((role, index) => (
              <div key={index} className="p-6 bg-gray-50 rounded-xl">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: role.color }}>
                      <Briefcase className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{role.title}</h4>
                      <p className="text-sm text-gray-600">{role.demand} demand • {role.salary}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={`text-xs ${
                      role.match === 'Perfect Match' ? 'bg-green-100 text-green-800' :
                      role.match === 'Excellent Match' ? 'bg-blue-100 text-blue-800' :
                      role.match === 'Good Match' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {role.match}
                    </Badge>
                    <p className="text-xs text-gray-500 mt-1">{role.growth} growth</p>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-3">{role.description}</p>
                
                <div className="mb-4">
                  <p className="text-xs text-gray-500 mb-2">Key Skills:</p>
                  <div className="flex flex-wrap gap-1">
                    {role.skills.map((skill, skillIndex) => (
                      <span key={skillIndex} className="px-2 py-1 bg-white text-gray-700 text-xs rounded-full border">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                
                <Button size="sm" variant="outline" className="w-full rounded-xl">
                  <Search className="w-4 h-4 mr-2" />
                  Find Jobs
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Market Insights */}
      <Card className="border-0 shadow-sm rounded-2xl">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-800">Market Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Growing Demand</h3>
              <p className="text-sm text-gray-600">UI/UX roles are growing 15% year-over-year with strong remote opportunities</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Target className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Skill Match</h3>
              <p className="text-sm text-gray-600">Your current skills align well with 85% of available design and development roles</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Award className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Certification Value</h3>
              <p className="text-sm text-gray-600">Your verified certificates can increase salary potential by 20-30%</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function ExportView({ student }: { student: Student }) {
  const [isExporting, setIsExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState('pdf');
  const [includePrivateInfo, setIncludePrivateInfo] = useState(false);
  const [exportHistory, setExportHistory] = useState([
    {
      id: 1,
      type: 'pdf',
      filename: `Portfolio_${student.first_name}${student.last_name}_2024.pdf`,
      size: '1.2 MB',
      date: '2 days ago',
      downloads: 5
    },
    {
      id: 2,
      type: 'web',
      filename: `${student.first_name.toLowerCase()}-portfolio.vercel.app`,
      views: 245,
      date: '1 week ago',
      isPublic: true
    }
  ]);

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      // Simulate PDF generation
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Add to export history
      const newExport = {
        id: exportHistory.length + 1,
        type: 'pdf',
        filename: `Portfolio_${student.first_name}${student.last_name}_${new Date().getFullYear()}.pdf`,
        size: `${(Math.random() * 2 + 0.8).toFixed(1)} MB`,
        date: 'Just now',
        downloads: 1
      };
      setExportHistory(prev => [newExport, ...prev]);
      
      // In real implementation, this would trigger the actual download
      console.log('PDF export completed');
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleGenerateWebLink = async () => {
    setIsExporting(true);
    try {
      // Simulate web link generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newWebLink = {
        id: exportHistory.length + 1,
        type: 'web',
        filename: `${student.first_name.toLowerCase()}-portfolio-${Date.now()}.vercel.app`,
        views: 0,
        date: 'Just now',
        isPublic: true
      };
      setExportHistory(prev => [newWebLink, ...prev]);
      
      console.log('Web link generated');
    } catch (error) {
      console.error('Link generation failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const exportOptions = [
    {
      id: 'pdf',
      title: 'PDF Portfolio',
      description: 'Professional PDF document perfect for job applications and offline sharing',
      icon: Download,
      color: '#925FE2',
      features: ['Print-ready format', 'ATS-friendly', 'Offline access', 'Professional layout'],
      action: handleExportPDF
    },
    {
      id: 'web',
      title: 'Web Portfolio',
      description: 'Interactive online portfolio with live links and responsive design',
      icon: Share2,
      color: '#87E7FA',
      features: ['Mobile responsive', 'Live links', 'SEO optimized', 'Real-time updates'],
      action: handleGenerateWebLink
    },
    {
      id: 'json',
      title: 'Data Export',
      description: 'Raw data in JSON format for developers and system integrations',
      icon: FileText,
      color: '#FDCB45',
      features: ['Machine readable', 'API friendly', 'Complete data', 'Easy integration'],
      action: () => console.log('JSON export')
    },
    {
      id: 'linkedin',
      title: 'LinkedIn Format',
      description: 'Optimized content ready to copy-paste into your LinkedIn profile',
      icon: ExternalLink,
      color: '#10B981',
      features: ['LinkedIn optimized', 'Copy-paste ready', 'Professional tone', 'Keyword rich'],
      action: () => console.log('LinkedIn export')
    }
  ];

  const templates = [
    { id: 'modern', name: 'Modern & Clean', popular: true },
    { id: 'creative', name: 'Creative & Colorful', popular: false },
    { id: 'professional', name: 'Professional & Minimal', popular: true },
    { id: 'academic', name: 'Academic & Formal', popular: false }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Export Your Portfolio</h1>
          <p className="text-gray-600 mt-2">Choose from multiple formats and sharing options to showcase your achievements</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-blue-100 text-blue-800">Ready to export</Badge>
        </div>
      </div>

      {/* Export Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {exportOptions.map((option) => {
          const IconComponent = option.icon;
          return (
            <Card key={option.id} className="border-0 shadow-sm rounded-2xl hover:shadow-md transition-shadow">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center" style={{ backgroundColor: `${option.color}20` }}>
                    <IconComponent className="w-8 h-8" style={{ color: option.color }} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{option.title}</h3>
                  <p className="text-gray-600 text-sm">{option.description}</p>
                </div>
                
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3">Features:</h4>
                  <ul className="space-y-2">
                    {option.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <Button 
                  onClick={option.action}
                  disabled={isExporting}
                  className="w-full rounded-xl" 
                  style={{ backgroundColor: option.color }}
                >
                  <option.icon className="w-4 h-4 mr-2" />
                  {isExporting ? 'Processing...' : `Export ${option.title.split(' ')[0]}`}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Export Settings */}
      <Card className="border-0 shadow-sm rounded-2xl">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-800">Export Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Template Style</h4>
              <Select value={exportFormat} onValueChange={setExportFormat}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Select template" />
                </SelectTrigger>
                <SelectContent>
                  {templates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      <div className="flex items-center gap-2">
                        {template.name}
                        {template.popular && <Badge className="bg-orange-100 text-orange-800 text-xs">Popular</Badge>}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Privacy Settings</h4>
              <div className="space-y-3">
                <label className="flex items-center gap-3">
                  <input 
                    type="checkbox" 
                    checked={includePrivateInfo}
                    onChange={(e) => setIncludePrivateInfo(e.target.checked)}
                    className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-700">Include contact information</span>
                </label>
                <label className="flex items-center gap-3">
                  <input 
                    type="checkbox" 
                    defaultChecked
                    className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-700">Include verified certificates only</span>
                </label>
                <label className="flex items-center gap-3">
                  <input 
                    type="checkbox" 
                    defaultChecked
                    className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-700">Include skills analysis</span>
                </label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="border-0 shadow-sm rounded-2xl">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Quick Export</h3>
              <p className="text-sm text-gray-600">Export with default settings for immediate use</p>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                onClick={handleExportPDF}
                disabled={isExporting}
                className="rounded-xl"
              >
                <Download className="w-4 h-4 mr-2" />
                Quick PDF
              </Button>
              <Button 
                variant="outline" 
                onClick={handleGenerateWebLink}
                disabled={isExporting}
                className="rounded-xl"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Quick Link
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Export History */}
      <Card className="border-0 shadow-sm rounded-2xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold text-gray-800">Export History</CardTitle>
            <Button variant="outline" size="sm" className="rounded-xl">
              <Settings className="w-4 h-4 mr-2" />
              Manage
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {exportHistory.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    item.type === 'pdf' ? 'bg-red-100' : 'bg-blue-100'
                  }`}>
                    {item.type === 'pdf' ? (
                      <FileText className={`w-5 h-5 ${
                        item.type === 'pdf' ? 'text-red-600' : 'text-blue-600'
                      }`} />
                    ) : (
                      <ExternalLink className="w-5 h-5 text-blue-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{item.filename}</h4>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>{item.date}</span>
                      {item.type === 'pdf' && item.size && (
                        <>
                          <span>• {item.size}</span>
                          <span>• {item.downloads} downloads</span>
                        </>
                      )}
                      {item.type === 'web' && (
                        <>
                          <span>• {item.views} views</span>
                          {item.isPublic && <Badge className="bg-green-100 text-green-800 text-xs">Public</Badge>}
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {item.type === 'pdf' ? (
                    <Button variant="outline" size="sm" className="rounded-xl">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm" className="rounded-xl">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Visit
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600">
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Analytics */}
      <Card className="border-0 shadow-sm rounded-2xl">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-800">Portfolio Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Eye className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">1,247</h3>
              <p className="text-sm text-gray-600">Total Views</p>
              <Badge className="mt-1 bg-green-100 text-green-800 text-xs">+15% this week</Badge>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Download className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">23</h3>
              <p className="text-sm text-gray-600">Downloads</p>
              <Badge className="mt-1 bg-blue-100 text-blue-800 text-xs">+3 this week</Badge>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Share2 className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">8</h3>
              <p className="text-sm text-gray-600">Shares</p>
              <Badge className="mt-1 bg-green-100 text-green-800 text-xs">+2 this week</Badge>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">4.8</h3>
              <p className="text-sm text-gray-600">Rating</p>
              <Badge className="mt-1 bg-yellow-100 text-yellow-800 text-xs">Excellent</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Utility components
export function Tag({ color, text, children, border }: { color: string; text: string; children: React.ReactNode; border?: string }) {
  return (
    <span
      className="px-3 py-1 rounded-full text-xs font-medium"
      style={{ backgroundColor: color, color: text, border: border ? `1.5px solid ${border}` : undefined }}
    >
      {children}
    </span>
  );
}

export function CertificateRow({ title }: { title: string }) {
  return (
    <li className="flex items-center justify-between py-2">
      <span>{title}</span>
      <ExternalLink className="w-4 h-4 text-[#925FE2] cursor-pointer" />
    </li>
  );
}

export function ExperienceRow({ role, company, period, iconColor }: { role: string; company?: string; period: string; iconColor: string }) {
  return (
    <div className="flex items-center gap-3 mb-3">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: iconColor }}>
        <User className="w-5 h-5 text-white" />
      </div>
      <div>
        <div className="font-semibold text-sm">{role}</div>
        {company && <div className="text-xs text-[#888]">{company}</div>}
        <div className="text-xs text-[#aaa]">{period}</div>
      </div>
    </div>
  );
}

export function AchievementRow({ text }: { text: string }) {
  return (
    <li className="flex items-center gap-2">
      <span className="w-2 h-2 rounded-full bg-[#925FE2]"></span>
      <span>{text}</span>
    </li>
  );
}

// Utility functions for data processing
interface Skill {
  name: string;
  proficiency: number;
}

interface Project {
  title: string;
  description: string;
  technologies: string[];
}

export function extractSkillsFromCertificates(certificates: Certificate[]): Skill[] {
  const skillMap = new Map<string, number>();
  
  certificates.forEach(cert => {
    // Extract skills based on certificate category and title
    if (cert.category === 'professional' || cert.category === 'skill') {
      const title = cert.title.toLowerCase();
      
      // Common skills mapping
      if (title.includes('ui') || title.includes('ux') || title.includes('design')) {
        skillMap.set('UI/UX Design', (skillMap.get('UI/UX Design') || 0) + 20);
      }
      if (title.includes('web') || title.includes('html') || title.includes('css') || title.includes('javascript')) {
        skillMap.set('Web Development', (skillMap.get('Web Development') || 0) + 25);
      }
      if (title.includes('react') || title.includes('angular') || title.includes('vue')) {
        skillMap.set('Frontend Development', (skillMap.get('Frontend Development') || 0) + 30);
      }
      if (title.includes('node') || title.includes('python') || title.includes('java') || title.includes('backend')) {
        skillMap.set('Backend Development', (skillMap.get('Backend Development') || 0) + 25);
      }
      if (title.includes('graphic') || title.includes('photoshop') || title.includes('illustrator')) {
        skillMap.set('Graphic Design', (skillMap.get('Graphic Design') || 0) + 20);
      }
      if (title.includes('data') || title.includes('analytics') || title.includes('sql')) {
        skillMap.set('Data Analysis', (skillMap.get('Data Analysis') || 0) + 25);
      }
      if (title.includes('project') || title.includes('management') || title.includes('agile')) {
        skillMap.set('Project Management', (skillMap.get('Project Management') || 0) + 15);
      }
    }
  });
  
  return Array.from(skillMap.entries()).map(([name, proficiency]) => ({
    name,
    proficiency: Math.min(proficiency, 100)
  }));
}

export function extractInterestsFromCertificates(certificates: Certificate[]): string[] {
  const interests = new Set<string>();
  
  certificates.forEach(cert => {
    const title = cert.title.toLowerCase();
    const issuer = cert.issuer.toLowerCase();
    
    if (title.includes('design') || title.includes('ui') || title.includes('ux')) {
      interests.add('Design');
    }
    if (title.includes('web') || title.includes('frontend') || title.includes('html') || title.includes('css')) {
      interests.add('Web Development');
    }
    if (title.includes('data') || title.includes('analytics') || title.includes('science')) {
      interests.add('Data Science');
    }
    if (title.includes('mobile') || title.includes('android') || title.includes('ios') || title.includes('react native')) {
      interests.add('Mobile Development');
    }
    if (title.includes('ai') || title.includes('machine learning') || title.includes('ml')) {
      interests.add('Artificial Intelligence');
    }
    if (title.includes('cloud') || title.includes('aws') || title.includes('azure') || title.includes('gcp')) {
      interests.add('Cloud Computing');
    }
    if (title.includes('security') || title.includes('cyber')) {
      interests.add('Cybersecurity');
    }
    if (title.includes('marketing') || title.includes('digital')) {
      interests.add('Digital Marketing');
    }
  });
  
  return Array.from(interests);
}

export function getInterestColor(interest: string): string {
  const colorMap: Record<string, string> = {
    'Design': '#925FE2',
    'Web Development': '#87E7FA',
    'Data Science': '#FDCB45',
    'Mobile Development': '#10B981',
    'Artificial Intelligence': '#EF4444',
    'Cloud Computing': '#3B82F6',
    'Cybersecurity': '#F59E0B',
    'Digital Marketing': '#EC4899'
  };
  
  return colorMap[interest] || '#6B7280';
}

export function generateProjectsFromCertificates(certificates: Certificate[]): Project[] {
  const projects: Project[] = [];
  
  certificates.forEach(cert => {
    const title = cert.title.toLowerCase();
    
    if (title.includes('web') || title.includes('frontend')) {
      projects.push({
        title: 'Portfolio Website',
        description: 'Personal portfolio website showcasing projects and skills',
        technologies: ['React', 'TypeScript', 'Tailwind CSS']
      });
    }
    
    if (title.includes('ui') || title.includes('ux') || title.includes('design')) {
      projects.push({
        title: 'Mobile App Design',
        description: 'Complete UI/UX design for a mobile application',
        technologies: ['Figma', 'Adobe XD', 'Prototyping']
      });
    }
    
    if (title.includes('data') || title.includes('analytics')) {
      projects.push({
        title: 'Data Analytics Dashboard',
        description: 'Interactive dashboard for business analytics',
        technologies: ['Python', 'Pandas', 'Plotly', 'Streamlit']
      });
    }
  });
  
  // Remove duplicates and return unique projects
  const uniqueProjects = projects.filter((project, index, self) => 
    index === self.findIndex(p => p.title === project.title)
  );
  
  return uniqueProjects;
}