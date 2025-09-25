"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  mockNAACCriteria,
  calculateNAACGrade,
  calculateOverallNAACScore,
  generateRecommendations,
} from "@/lib/compliance-data"
import { Download, FileText, TrendingUp } from "lucide-react"

export function NAACReport() {
  const overallScore = calculateOverallNAACScore(mockNAACCriteria)
  const grade = calculateNAACGrade(overallScore)
  const recommendations = generateRecommendations("NAAC", mockNAACCriteria)

  const handleDownloadReport = () => {
    console.log("Downloading NAAC compliance report...")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">NAAC Compliance Report</h2>
          <p className="text-gray-600">Academic Year 2023-24</p>
        </div>
        <Button onClick={handleDownloadReport} className="bg-purple-600 hover:bg-purple-700">
          <Download className="w-4 h-4 mr-2" />
          Download Report
        </Button>
      </div>

      {/* Overall Score Card */}
      <Card className="bg-gradient-to-r from-purple-600 to-purple-800 text-white">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">{overallScore.toFixed(2)}</div>
              <div className="text-purple-100">Overall Score</div>
              <div className="text-sm text-purple-200">Out of 4.0</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">{grade}</div>
              <div className="text-purple-100">NAAC Grade</div>
              <div className="text-sm text-purple-200">Current Accreditation</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">2024</div>
              <div className="text-purple-100">Valid Until</div>
              <div className="text-sm text-purple-200">Next Review Due</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Criteria Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {mockNAACCriteria.map((criterion) => (
          <Card key={criterion.id}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{criterion.name}</CardTitle>
                  <p className="text-sm text-gray-600">Weight: {criterion.weight}%</p>
                </div>
                <Badge
                  variant={
                    criterion.currentScore >= 80
                      ? "default"
                      : criterion.currentScore >= 60
                        ? "secondary"
                        : "destructive"
                  }
                >
                  {criterion.currentScore}/100
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Progress value={criterion.currentScore} className="h-3" />
                <div className="space-y-3">
                  {criterion.subCriteria.map((sub) => (
                    <div key={sub.id} className="border-l-2 border-purple-200 pl-4">
                      <div className="flex justify-between items-center mb-1">
                        <h4 className="text-sm font-medium">{sub.name}</h4>
                        <span className="text-sm text-gray-600">
                          {sub.score}/{sub.maxScore}
                        </span>
                      </div>
                      <Progress value={(sub.score / sub.maxScore) * 100} className="h-2" />
                      <div className="mt-2">
                        <p className="text-xs text-gray-500 mb-1">Evidence:</p>
                        <div className="flex flex-wrap gap-1">
                          {sub.evidence.map((evidence, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {evidence}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Improvement Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-semibold text-purple-600">{index + 1}</span>
                </div>
                <p className="text-sm text-gray-700">{recommendation}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Items */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Required Documentation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border border-gray-200 rounded-lg">
              <h4 className="font-medium mb-2">Self Study Report (SSR)</h4>
              <p className="text-sm text-gray-600 mb-3">Comprehensive institutional self-assessment</p>
              <Badge variant="outline" className="text-green-600 border-green-600">
                Completed
              </Badge>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <h4 className="font-medium mb-2">Supporting Documents</h4>
              <p className="text-sm text-gray-600 mb-3">Evidence files and institutional data</p>
              <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                In Progress
              </Badge>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <h4 className="font-medium mb-2">Peer Team Visit</h4>
              <p className="text-sm text-gray-600 mb-3">External evaluation and assessment</p>
              <Badge variant="outline" className="text-gray-600 border-gray-600">
                Pending
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
