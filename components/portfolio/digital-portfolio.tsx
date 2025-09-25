"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { generateQRData, generateQRCodeURL } from "@/lib/qr-generator"
import { Download, Share2, QrCode, Award, Calendar, MapPin } from "lucide-react"
import type { Student, Achievement } from "@/lib/types"

interface DigitalPortfolioProps {
  student: Student
  achievements: Achievement[]
}

export function DigitalPortfolio({ student, achievements }: DigitalPortfolioProps) {
  const qrData = generateQRData(student.id, `portfolio-${student.id}`)
  const qrCodeURL = generateQRCodeURL(qrData)

  const totalPoints = achievements.reduce((sum, achievement) => sum + achievement.points, 0)
  const categoryStats = achievements.reduce(
    (stats, achievement) => {
      stats[achievement.category] = (stats[achievement.category] || 0) + 1
      return stats
    },
    {} as Record<string, number>,
  )

  const handleDownloadPDF = () => {
    // In a real implementation, this would generate and download a PDF
    console.log("Downloading portfolio PDF...")
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${student.name}'s Academic Portfolio`,
        text: `Check out ${student.name}'s verified academic achievements and portfolio`,
        url: window.location.href,
      })
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-6">
      {/* Portfolio Header */}
      <Card className="bg-gradient-to-br from-purple-600 to-purple-800 text-white border-0">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <Avatar className="w-24 h-24 border-4 border-white/20">
              <AvatarImage src={`/placeholder_svg.png?height=96&width=96&text=${student.name.charAt(0)}`} />
              <AvatarFallback className="text-2xl bg-white/20">{student.name.charAt(0)}</AvatarFallback>
            </Avatar>

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold mb-2">{student.name}</h1>
              <p className="text-purple-100 mb-2">{student.email}</p>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                <Badge variant="secondary" className="bg-white/20 text-white border-0">
                  <MapPin className="w-3 h-3 mr-1" />
                  {student.department}
                </Badge>
                <Badge variant="secondary" className="bg-white/20 text-white border-0">
                  <Calendar className="w-3 h-3 mr-1" />
                  Class of 2024
                </Badge>
                <Badge variant="secondary" className="bg-white/20 text-white border-0">
                  <Award className="w-3 h-3 mr-1" />
                  {totalPoints} Points
                </Badge>
              </div>
            </div>

            <div className="text-center">
              <div className="bg-white p-4 rounded-xl mb-4">
                <img src={qrCodeURL || "/placeholder.svg"} alt="Portfolio QR Code" className="w-32 h-32" />
              </div>
              <p className="text-sm text-purple-100">Scan to verify</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Portfolio Actions */}
      <div className="flex flex-wrap gap-4 justify-center">
        <Button onClick={handleDownloadPDF} className="bg-purple-600 hover:bg-purple-700">
          <Download className="w-4 h-4 mr-2" />
          Download PDF
        </Button>
        <Button onClick={handleShare} variant="outline">
          <Share2 className="w-4 h-4 mr-2" />
          Share Portfolio
        </Button>
        <Button variant="outline">
          <QrCode className="w-4 h-4 mr-2" />
          QR Verification
        </Button>
      </div>

      {/* Achievement Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Achievement Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Total Achievements</span>
                  <span className="font-semibold">{achievements.length}</span>
                </div>
                <Progress value={(achievements.length / 20) * 100} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Achievement Points</span>
                  <span className="font-semibold">{totalPoints}</span>
                </div>
                <Progress value={(totalPoints / 1000) * 100} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Category Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(categoryStats).map(([category, count]) => (
                <div key={category} className="flex justify-between items-center">
                  <span className="text-sm capitalize">{category}</span>
                  <Badge variant="secondary">{count}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Verification Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm">Portfolio Verified</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm">QR Code Active</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm">Last Updated: Today</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Achievements Grid */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Verified Achievements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-gray-900">{achievement.title}</h4>
                  <Badge
                    variant={achievement.status === "approved" ? "default" : "secondary"}
                    className={achievement.status === "approved" ? "bg-green-100 text-green-800" : ""}
                  >
                    {achievement.status === "approved" ? "Verified" : "Pending"}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-3">{achievement.description}</p>
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span className="capitalize">{achievement.category}</span>
                  <span>{achievement.points} points</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* QR Verification Info */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <QrCode className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">QR Code Verification</h3>
              <p className="text-sm text-gray-600">
                This portfolio is secured with QR code verification. Scan the code above to verify authenticity and
                access the latest version of this portfolio.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
