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
              <span className="text-white font-semibold text-xs">AI</span>
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

      {/* Portfolio Title and Actions */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Portfolio</h1>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="flex items-center gap-2 text-sm">
            <Edit className="w-4 h-4" />
            Edit
          </Button>
          <Button className="flex items-center gap-2 text-sm bg-gray-900 hover:bg-gray-800">
            <Download className="w-4 h-4" />
            Download
          </Button>
        </div>
      </div>

      {/* Profile Header Card */}
      <Card className="mb-6 bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 border-0 text-white overflow-hidden">
        <CardContent className="p-8">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center overflow-hidden">
              <Image
                src="/placeholder-user.jpg"
                alt="Aleena Ida"
                width={96}
                height={96}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold mb-2">Aleena Ida Ignatius</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">About</h3>
                  <p className="text-purple-100 text-sm leading-relaxed">
                    A passionate and creative individual with a strong interest
                    in design, technology, and innovation. Enthusiastic about
                    blending creativity with functionality to deliver impactful
                    solutions.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-3">Interests</h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-white/20 text-white hover:bg-white/30 text-xs px-3 py-1">
                      Web development
                    </Badge>
                    <Badge className="bg-white/20 text-white hover:bg-white/30 text-xs px-3 py-1">
                      UI/X
                    </Badge>
                    <Badge className="bg-white/20 text-white hover:bg-white/30 text-xs px-3 py-1">
                      Filmography
                    </Badge>
                    <Badge className="bg-white/20 text-white hover:bg-white/30 text-xs px-3 py-1">
                      Video Editing
                    </Badge>
                    <Badge className="bg-white/20 text-white hover:bg-white/30 text-xs px-3 py-1">
                      Painting
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Skills */}
          <Card className="shadow-sm">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Skills</h3>
              <div className="space-y-3">
                {skills.map((skill, index) => (
                  <div key={index} className="text-sm text-gray-700">
                    {skill}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Experience */}
          <Card className="shadow-sm">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Experience</h3>
              <div className="space-y-4">
                {experiences.map((exp, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <div className="w-6 h-6 bg-gray-300 rounded"></div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm text-gray-900">
                        {exp.role}
                      </h4>
                      {exp.company && (
                        <p className="text-sm text-gray-600 mb-1">
                          {exp.company}
                        </p>
                      )}
                      <p className="text-xs text-gray-500">{exp.period}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Certificates */}
          <Card className="shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Certificates</h3>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
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
              )}
            </CardContent>
          </Card>

          {/* Achievements and Awards */}
          <Card className="shadow-sm">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">
                Achievements and Awards
              </h3>
              <div className="space-y-3">
                {achievements.map((achievement, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm text-gray-700">{achievement}</span>
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
