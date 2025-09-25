"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Bell, 
  Edit, 
  Download, 
  Upload,
  ExternalLink
} from "lucide-react";

interface PortfolioProps {
  onBack: () => void;
}

export function StudentPortfolio({ onBack }: PortfolioProps) {
  const skills = [
    "UI/UX Design",
    "Graphic Design", 
    "Team collaboration",
    "Basic Front End Development (CSS, HTML, JavaScript)"
  ];

  const certificates = [
    "Google UX Design Certificate (Coursera)",
    "Figma Essentials for UI Design",
    "Introduction to Graphic Design (Coursera)",
    "Introduction to Front End development (Coursera)"
  ];

  const achievements = [
    "Winner - College UI/UX Design Hackathon",
    "Designed the official event poster for Tech Fest 2024",
    "Recognized as 'Best Creative Designer' at Annual College Fest",
    "Recognized as 'Techie of the Year (2023)' by Department"
  ];

  const experiences = [
    { 
      role: "Outreach Ninja",
      company: "Friends of Figma, Thiruvananthapuram",
      period: "Apr 2023 - Present • 5 mos",
      type: "volunteer"
    },
    {
      role: "Design Lead", 
      company: "Mendfinans club MCE",
      period: "Jul 2024 - Present • 1 yr 3 mos",
      type: "leadership"
    },
    {
      role: "GDSC MCE",
      company: "",
      period: "1 yr 3 mos",
      type: "membership"
    }
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
                    A passionate and creative individual with a strong interest in design, 
                    technology, and innovation. Enthusiastic about blending creativity with 
                    functionality to deliver impactful solutions.
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
                      <h4 className="font-medium text-sm text-gray-900">{exp.role}</h4>
                      {exp.company && (
                        <p className="text-sm text-gray-600 mb-1">{exp.company}</p>
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
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  Upload
                </Button>
              </div>
              <div className="space-y-3">
                {certificates.map((cert, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                    <span className="text-sm text-gray-700 flex-1">{cert}</span>
                    <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Achievements and Awards */}
          <Card className="shadow-sm">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Achievements and Awards</h3>
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
    </div>
  );
}
