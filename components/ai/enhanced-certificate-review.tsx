"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  CheckCircle,
  X,
  Eye,
  MoreVertical,
  Download,
  Flag,
  Clock,
  Award,
  Building,
  Calendar,
  ExternalLink,
  MessageSquare,
  AlertTriangle,
} from "lucide-react"

interface CertificateDetail {
  id: string
  student: {
    id: string
    name: string
    studentId: string
    department: string
    year: number
    avatar?: string
  }
  title: string
  issuer: string
  issueDate: string
  category: "academic" | "professional" | "skill" | "achievement"
  description?: string
  certificateUrl?: string
  verificationUrl?: string
  skills: string[]
  status: "pending" | "verified" | "rejected"
  submittedAt: string
  fileSize?: string
  fileType?: string
  credibilityScore?: number
  aiAnalysis?: {
    authenticity: number
    relevance: number
    skillsDetected: string[]
    recommendations: string[]
  }
}

interface CertificateReviewProps {
  certificates: CertificateDetail[]
  onApprove: (certificateId: string, feedback?: string) => void
  onReject: (certificateId: string, reason: string) => void
  onRequestMoreInfo: (certificateId: string, message: string) => void
}

// Mock data for demonstration
const mockCertificates: CertificateDetail[] = [
  {
    id: "1",
    student: {
      id: "1",
      name: "Aleena Ida Ignatius",
      studentId: "CS2021001",
      department: "Computer Science",
      year: 3
    },
    title: "Google Course UI / UX Certificate",
    issuer: "Google",
    issueDate: "2024-01-15",
    category: "professional",
    description: "Comprehensive course covering user interface and user experience design principles",
    skills: ["UI Design", "UX Research", "Prototyping", "Figma", "User Testing"],
    status: "pending",
    submittedAt: "2024-01-20T10:00:00Z",
    fileSize: "2.4 MB",
    fileType: "PDF",
    credibilityScore: 95,
    aiAnalysis: {
      authenticity: 92,
      relevance: 88,
      skillsDetected: ["UI Design", "UX Research", "Prototyping", "Design Thinking"],
      recommendations: [
        "Certificate appears authentic with proper Google branding",
        "Skills align well with current industry requirements",
        "Consider verifying through Google's official verification system"
      ]
    }
  },
  {
    id: "2",
    student: {
      id: "1",
      name: "Aleena Ida Ignatius",
      studentId: "CS2021001",
      department: "Computer Science",
      year: 3
    },
    title: "AWS Cloud Practitioner",
    issuer: "Amazon Web Services",
    issueDate: "2024-01-10",
    category: "professional",
    description: "Foundational certification for cloud computing with AWS",
    skills: ["Cloud Computing", "AWS Services", "Security", "Pricing"],
    status: "pending",
    submittedAt: "2024-01-18T14:30:00Z",
    fileSize: "1.8 MB",
    fileType: "PDF",
    credibilityScore: 98,
    aiAnalysis: {
      authenticity: 95,
      relevance: 94,
      skillsDetected: ["AWS", "Cloud Computing", "EC2", "S3"],
      recommendations: [
        "High authenticity score - certificate format matches AWS standards",
        "Highly relevant for modern software development careers",
        "Can be verified through AWS certification verification portal"
      ]
    }
  }
]

export function EnhancedCertificateReview({
  certificates = mockCertificates,
  onApprove,
  onReject,
  onRequestMoreInfo
}: CertificateReviewProps) {
  const [selectedCertificate, setSelectedCertificate] = useState<CertificateDetail | null>(null)
  const [reviewAction, setReviewAction] = useState<"approve" | "reject" | "request-info" | null>(null)
  const [feedback, setFeedback] = useState("")
  const [searchTerm, setSearchTerm] = useState("")

  const filteredCertificates = certificates.filter(cert =>
    cert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cert.student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cert.issuer.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleReviewSubmit = () => {
    if (!selectedCertificate || !reviewAction) return

    switch (reviewAction) {
      case "approve":
        onApprove?.(selectedCertificate.id, feedback)
        break
      case "reject":
        onReject?.(selectedCertificate.id, feedback)
        break
      case "request-info":
        onRequestMoreInfo?.(selectedCertificate.id, feedback)
        break
    }

    setSelectedCertificate(null)
    setReviewAction(null)
    setFeedback("")
  }

  const getCredibilityColor = (score: number) => {
    if (score >= 90) return "text-green-600 bg-green-50"
    if (score >= 70) return "text-yellow-600 bg-yellow-50"
    return "text-red-600 bg-red-50"
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "academic":
        return "🎓"
      case "professional":
        return "💼"
      case "skill":
        return "🛠️"
      case "achievement":
        return "🏆"
      default:
        return "📜"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Certificate Review</h2>
          <p className="text-gray-600">Review and verify student certificates with AI assistance</p>
        </div>
        <Badge variant="secondary" className="px-3 py-1">
          {filteredCertificates.length} pending review
        </Badge>
      </div>

      {/* Search */}
      <div className="relative">
        <Input
          placeholder="Search certificates by title, student name, or issuer..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-4"
        />
      </div>

      {/* Certificates List */}
      <div className="space-y-4">
        {filteredCertificates.map((certificate) => (
          <Card key={certificate.id} className="hover:shadow-md transition-shadow border-l-4 border-l-orange-400">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={certificate.student.avatar} />
                    <AvatarFallback className="bg-gradient-to-br from-purple-400 to-pink-500 text-white">
                      {certificate.student.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <span className="text-xl">{getCategoryIcon(certificate.category)}</span>
                      {certificate.title}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <span>{certificate.student.name}</span>
                      <span>•</span>
                      <span>{certificate.student.studentId}</span>
                      <span>•</span>
                      <span>{certificate.student.department}</span>
                    </CardDescription>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {certificate.credibilityScore && (
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${getCredibilityColor(certificate.credibilityScore)}`}>
                      {certificate.credibilityScore}% credible
                    </div>
                  )}
                  <Badge className="bg-orange-100 text-orange-800">
                    Pending Review
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>
                        <Download className="w-4 h-4 mr-2" />
                        Download Certificate
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Verify Online
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Flag className="w-4 h-4 mr-2" />
                        Flag as Suspicious
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Certificate Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">Issuer:</span>
                  <span className="font-medium">{certificate.issuer}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">Issued:</span>
                  <span className="font-medium">{new Date(certificate.issueDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">Submitted:</span>
                  <span className="font-medium">{new Date(certificate.submittedAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Skills */}
              <div>
                <h4 className="font-medium mb-2 text-sm">Skills Covered</h4>
                <div className="flex flex-wrap gap-2">
                  {certificate.skills.map((skill) => (
                    <Badge key={skill} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* AI Analysis */}
              {certificate.aiAnalysis && (
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-medium mb-2 text-sm flex items-center gap-2">
                    <Award className="w-4 h-4 text-blue-600" />
                    AI Analysis
                  </h4>
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <span className="text-xs text-gray-600">Authenticity:</span>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${certificate.aiAnalysis.authenticity}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-medium">{certificate.aiAnalysis.authenticity}%</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-xs text-gray-600">Relevance:</span>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full" 
                            style={{ width: `${certificate.aiAnalysis.relevance}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-medium">{certificate.aiAnalysis.relevance}%</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-blue-800">
                    <strong>AI Recommendations:</strong>
                    <ul className="mt-1 space-y-1">
                      {certificate.aiAnalysis.recommendations.slice(0, 2).map((rec, index) => (
                        <li key={index} className="flex items-start gap-1">
                          <span>•</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      size="sm" 
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      onClick={() => {
                        setSelectedCertificate(certificate)
                        setReviewAction("approve")
                      }}
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Approve
                    </Button>
                  </DialogTrigger>
                </Dialog>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      size="sm" 
                      variant="destructive" 
                      className="flex-1"
                      onClick={() => {
                        setSelectedCertificate(certificate)
                        setReviewAction("reject")
                      }}
                    >
                      <X className="w-4 h-4 mr-1" />
                      Reject
                    </Button>
                  </DialogTrigger>
                </Dialog>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => {
                        setSelectedCertificate(certificate)
                        setReviewAction("request-info")
                      }}
                    >
                      <MessageSquare className="w-4 h-4 mr-1" />
                      Request Info
                    </Button>
                  </DialogTrigger>
                </Dialog>

                <Button size="sm" variant="outline">
                  <Eye className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Review Dialog */}
      <Dialog 
        open={!!selectedCertificate && !!reviewAction} 
        onOpenChange={(open) => {
          if (!open) {
            setSelectedCertificate(null)
            setReviewAction(null)
            setFeedback("")
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {reviewAction === "approve" && "Approve Certificate"}
              {reviewAction === "reject" && "Reject Certificate"}
              {reviewAction === "request-info" && "Request More Information"}
            </DialogTitle>
            <DialogDescription>
              {selectedCertificate && (
                <>
                  {reviewAction === "approve" && `Approve "${selectedCertificate.title}" for ${selectedCertificate.student.name}`}
                  {reviewAction === "reject" && `Reject "${selectedCertificate.title}" and provide feedback`}
                  {reviewAction === "request-info" && `Request additional information about "${selectedCertificate.title}"`}
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="feedback">
                {reviewAction === "approve" && "Feedback (Optional)"}
                {reviewAction === "reject" && "Reason for Rejection *"}
                {reviewAction === "request-info" && "What information do you need? *"}
              </Label>
              <Textarea
                id="feedback"
                placeholder={
                  reviewAction === "approve" ? "Great work! This certificate demonstrates..." :
                  reviewAction === "reject" ? "Please provide a clear reason for rejection..." :
                  "Please provide additional documentation or clarification regarding..."
                }
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                required={reviewAction !== "approve"}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setSelectedCertificate(null)
                setReviewAction(null)
                setFeedback("")
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleReviewSubmit}
              disabled={reviewAction !== "approve" && !feedback.trim()}
              className={
                reviewAction === "approve" ? "bg-green-600 hover:bg-green-700" :
                reviewAction === "reject" ? "bg-red-600 hover:bg-red-700" :
                ""
              }
            >
              {reviewAction === "approve" && "Approve Certificate"}
              {reviewAction === "reject" && "Reject Certificate"}
              {reviewAction === "request-info" && "Send Request"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}