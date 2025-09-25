"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { mockNIRFParameters, calculateNIRFScore, generateRecommendations } from "@/lib/compliance-data"
import { Download, BarChart3, Target } from "lucide-react"

export function NIRFReport() {
  const overallScore = calculateNIRFScore(mockNIRFParameters)
  const recommendations = generateRecommendations("NIRF", mockNIRFParameters)
  const currentRank = 47 // Mock current rank
  const targetRank = 35 // Mock target rank

  const handleDownloadReport = () => {
    console.log("Downloading NIRF ranking report...")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">NIRF Ranking Report</h2>
          <p className="text-gray-600">National Institutional Ranking Framework 2024</p>
        </div>
        <Button onClick={handleDownloadReport} className="bg-purple-600 hover:bg-purple-700">
          <Download className="w-4 h-4 mr-2" />
          Download Report
        </Button>
      </div>

      {/* Overall Performance */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold mb-2">{overallScore.toFixed(1)}</div>
            <div className="text-blue-100">Overall Score</div>
            <div className="text-sm text-blue-200">Out of 100</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-green-600 to-green-800 text-white">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold mb-2">#{currentRank}</div>
            <div className="text-green-100">Current Rank</div>
            <div className="text-sm text-green-200">Engineering Category</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-purple-600 to-purple-800 text-white">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold mb-2">#{targetRank}</div>
            <div className="text-purple-100">Target Rank</div>
            <div className="text-sm text-purple-200">Next Year Goal</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-orange-600 to-orange-800 text-white">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold mb-2">83%</div>
            <div className="text-orange-100">Percentile</div>
            <div className="text-sm text-orange-200">National Standing</div>
          </CardContent>
        </Card>
      </div>

      {/* Parameter Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            NIRF Parameters Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {mockNIRFParameters.map((param) => (
              <div key={param.id} className="space-y-3">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold">{param.name}</h4>
                    <p className="text-sm text-gray-600">
                      Weight: {param.weight}% | Rank: #{param.rank}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">{param.score.toFixed(1)}</div>
                    <Badge
                      variant={
                        param.percentile >= 85 ? "default" : param.percentile >= 70 ? "secondary" : "destructive"
                      }
                    >
                      {param.percentile}th percentile
                    </Badge>
                  </div>
                </div>
                <Progress value={param.score} className="h-3" />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="bg-gray-50 p-3 rounded">
                    <div className="font-medium">Score</div>
                    <div className="text-gray-600">
                      {param.score.toFixed(1)}/{param.maxScore}
                    </div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <div className="font-medium">Rank</div>
                    <div className="text-gray-600">#{param.rank}</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <div className="font-medium">Percentile</div>
                    <div className="text-gray-600">{param.percentile}%</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <div className="font-medium">Weight</div>
                    <div className="text-gray-600">{param.weight}%</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Improvement Strategy */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Strategic Improvement Plan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-4">Priority Actions</h4>
              <div className="space-y-3">
                {recommendations.slice(0, 3).map((recommendation, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-semibold text-red-600">H</span>
                    </div>
                    <p className="text-sm text-red-800">{recommendation}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Secondary Actions</h4>
              <div className="space-y-3">
                {recommendations.slice(3).map((recommendation, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
                  >
                    <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-semibold text-yellow-600">M</span>
                    </div>
                    <p className="text-sm text-yellow-800">{recommendation}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Implementation Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold text-blue-600">Q1</span>
              </div>
              <div>
                <h4 className="font-medium">Data Collection & Analysis</h4>
                <p className="text-sm text-gray-600">Gather comprehensive institutional data for all parameters</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold text-green-600">Q2</span>
              </div>
              <div>
                <h4 className="font-medium">Strategic Initiatives</h4>
                <p className="text-sm text-gray-600">Implement priority improvement actions and track progress</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-lg">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold text-purple-600">Q3</span>
              </div>
              <div>
                <h4 className="font-medium">Performance Review</h4>
                <p className="text-sm text-gray-600">Evaluate progress and adjust strategies for optimal results</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
