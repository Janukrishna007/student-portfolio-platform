"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth";
import { useStudent } from "@/hooks/use-student";
import { certificateService } from "@/lib/certificate-service";
import { CertificateUploadDialog } from "./certificate-upload-dialog";
import type { Database } from "@/lib/supabase";
import {
  Search,
  Bell,
  Edit,
  Download,
  Upload,
  ExternalLink,
  FileText,
  Trash2,
  Eye,
} from "lucide-react";

type Certificate = Database["public"]["Tables"]["certificates"]["Row"];

interface PortfolioProps {
  onBack: () => void;
}

export function StudentPortfolio({ onBack }: PortfolioProps) {
  const { user } = useAuth();
  const { student } = useStudent();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loadingCertificates, setLoadingCertificates] = useState(true);
  const [showUploadDialog, setShowUploadDialog] = useState(false);

  const skills = [
    "UI/UX Design",
    "Graphic Design",
    "Team collaboration",
    "Basic Front End Development (CSS, HTML, JavaScript)",
  ];

  // Load certificates from database
  useEffect(() => {
    const loadCertificates = async () => {
      if (!student?.id) return;

      setLoadingCertificates(true);
      try {
        const userCertificates =
          await certificateService.getCertificatesByStudent(student.id);
        setCertificates(userCertificates);
      } catch (error) {
        console.error("Failed to load certificates:", error);
      } finally {
        setLoadingCertificates(false);
      }
    };

    loadCertificates();
  }, [student]);

  const handleUploadSuccess = () => {
    // Reload certificates after successful upload
    const loadCertificates = async () => {
      if (!student?.id) return;

      try {
        const userCertificates =
          await certificateService.getCertificatesByStudent(student.id);
        setCertificates(userCertificates);
      } catch (error) {
        console.error("Failed to reload certificates:", error);
      }
    };

    loadCertificates();
  };

  const handleCertificateView = (certificate: Certificate) => {
    if (certificate.certificate_url) {
      window.open(certificate.certificate_url, "_blank");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return (
          <Badge className="bg-green-100 text-green-700 text-xs">
            Verified
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-700 text-xs">Rejected</Badge>
        );
      default:
        return (
          <Badge className="bg-yellow-100 text-yellow-700 text-xs">
            Pending
          </Badge>
        );
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "academic":
        return "text-blue-600";
      case "professional":
        return "text-purple-600";
      case "skill":
        return "text-green-600";
      case "achievement":
        return "text-orange-600";
      default:
        return "text-gray-600";
    }
  };

  const achievements = [
    "Winner - College UI/UX Design Hackathon",
    "Designed the official event poster for Tech Fest 2024",
    "Recognized as 'Best Creative Designer' at Annual College Fest",
    "Recognized as 'Techie of the Year (2023)' by Department",
  ];

  const experiences = [
    {
      role: "Outreach Ninja",
      company: "Friends of Figma, Thiruvananthapuram",
      period: "Apr 2023 - Present • 5 mos",
      type: "volunteer",
    },
    {
      role: "Design Lead",
      company: "Mendfinans club MCE",
      period: "Jul 2024 - Present • 1 yr 3 mos",
      type: "leadership",
    },
    {
      role: "GDSC MCE",
      company: "",
      period: "1 yr 3 mos",
      type: "membership",
    },
  ];

  return (
    <div className="flex-1 p-6 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search"
              className="pl-12 pr-4 py-3 bg-gray-50 border-0 rounded-2xl h-12 text-sm focus:bg-white focus:ring-2 focus:ring-purple-200"
            />
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="relative">
            <Bell className="w-6 h-6 text-gray-600" />
          </div>
          <div className="flex items-center gap-4">
            <div>
              <div className="font-semibold text-gray-900 text-right">
                Aleena Ida
              </div>
              <div className="text-sm text-gray-500 text-right">Student</div>
              <div className="text-xs text-gray-400 text-right">
                Marian Engineering College
              </div>
            </div>
            <div className="w-14 h-14 rounded-full overflow-hidden">
              <div className="w-full h-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
                <span className="text-white font-semibold text-lg">AI</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Portfolio Title and Actions */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Portfolio</h1>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="flex items-center gap-2 text-sm rounded-xl border-gray-200 hover:bg-gray-50">
            <Edit className="w-4 h-4" />
            Edit
          </Button>
          <Button className="flex items-center gap-2 text-sm rounded-xl" style={{ backgroundColor: '#925FE2' }}>
            <Download className="w-4 h-4" />
            Download
          </Button>
        </div>
      </div>

      {/* Profile Header Card */}
      <Card className="mb-8 border-0 text-white overflow-hidden rounded-3xl" style={{ background: 'linear-gradient(135deg, #925FE2 0%, #B57CE6 100%)' }}>
        <CardContent className="p-8">
          <div className="flex items-start gap-8">
            <div className="w-32 h-32 rounded-full overflow-hidden flex-shrink-0">
              <div className="w-full h-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
                <span className="text-white font-bold text-4xl">AI</span>
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-4xl font-bold mb-6">Aleena Ida Ignatius</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4">About</h3>
                  <p className="text-purple-100 text-base leading-relaxed">
                    A passionate and creative individual with a strong interest in design, 
                    technology, and innovation. Enthusiastic about blending creativity with 
                    functionality to deliver impactful solutions.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4">Interests</h3>
                  <div className="flex flex-wrap gap-3">
                    <div className="px-4 py-2 rounded-full text-sm font-medium" style={{ backgroundColor: '#87E7FA', color: '#0F4C75' }}>
                      Web development
                    </div>
                    <div className="px-4 py-2 rounded-full text-sm font-medium bg-white/20 text-white">
                      UI/X
                    </div>
                    <div className="px-4 py-2 rounded-full text-sm font-medium" style={{ backgroundColor: '#FDCB45', color: '#8B5A00' }}>
                      Filmography
                    </div>
                    <div className="px-4 py-2 rounded-full text-sm font-medium bg-white/20 text-white">
                      Video Editing
                    </div>
                    <div className="px-4 py-2 rounded-full text-sm font-medium bg-white/20 text-white">
                      Painting
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-8">
          {/* Skills */}
          <Card className="border-0 shadow-sm rounded-2xl">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-6 text-gray-800">Skills</h3>
              <div className="space-y-4">
                {skills.map((skill, index) => (
                  <div key={index} className="text-base text-gray-700 font-medium">
                    {skill}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Experience */}
          <Card className="border-0 shadow-sm rounded-2xl">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-6 text-gray-800">Experience</h3>
              <div className="space-y-6">
                {experiences.map((exp, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <div className="w-8 h-8 bg-gray-300 rounded-lg"></div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-base text-gray-900 mb-1">
                        {exp.role}
                      </h4>
                      {exp.company && (
                        <p className="text-base text-gray-600 mb-2">
                          {exp.company}
                        </p>
                      )}
                      <p className="text-sm text-gray-500">{exp.period}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Certificates */}
          <Card className="border-0 shadow-sm rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800">Certificates</h3>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 rounded-xl border-gray-200 hover:bg-gray-50"
                  onClick={() => setShowUploadDialog(true)}
                >
                  <Upload className="w-4 h-4" />
                  Upload
                </Button>
              </div>

              {loadingCertificates ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-sm text-gray-500">
                    Loading certificates...
                  </div>
                </div>
              ) : certificates.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-500 mb-4">
                    No certificates uploaded yet
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowUploadDialog(true)}
                    className="flex items-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    Upload Your First Certificate
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {certificates.map((cert) => (
                    <div
                      key={cert.id}
                      className="flex items-start justify-between py-3 border-b border-gray-100 last:border-0"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-sm text-gray-900 truncate">
                            {cert.title}
                          </h4>
                          {getStatusBadge(cert.status)}
                        </div>
                        <p className="text-xs text-gray-600 mb-1">
                          {cert.issuer} •{" "}
                          {new Date(cert.issue_date).toLocaleDateString()}
                        </p>
                        <p
                          className={`text-xs font-medium capitalize ${getCategoryColor(
                            cert.category
                          )}`}
                        >
                          {cert.category}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 ml-2">
                        {cert.certificate_url && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-gray-500 hover:text-gray-700 h-8 w-8 p-0"
                            onClick={() => handleCertificateView(cert)}
                            title="View certificate"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-gray-500 hover:text-blue-700 h-8 w-8 p-0"
                          title="Open details"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between py-3 hover:bg-gray-50 rounded-lg px-2">
                  <div className="flex-1">
                    <h4 className="font-semibold text-base text-gray-900 mb-1">
                      Introduction to Front End development (Coursera)
                    </h4>
                  </div>
                  <ExternalLink className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Achievements and Awards */}
          <Card className="border-0 shadow-sm rounded-2xl">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-6 text-gray-800">
                Achievements and Awards
              </h3>
              <div className="space-y-4">
                {achievements.map((achievement, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-3 h-3 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: '#925FE2' }}></div>
                    <span className="text-base text-gray-700 font-medium">{achievement}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Certificate Upload Dialog */}
      {student && (
        <CertificateUploadDialog
          isOpen={showUploadDialog}
          onClose={() => setShowUploadDialog(false)}
          studentId={student.id}
          onUploadSuccess={handleUploadSuccess}
        />
      )}
    </div>
  );
}
