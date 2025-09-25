"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

interface ComplianceMetricsProps {
  data: {
    naac: {
      score: number
      maxScore: number
      criteria: Record<string, { score: number; weight: number }>
    }
    nirf: {
      rank: number
      score: number
      parameters: Record<string, { score: number; weight: number }>
    }
  }
}

export function ComplianceMetrics({ data }: ComplianceMetricsProps) {
  const naacPercentage = (data.naac.score / data.naac.maxScore) * 100
  const nirfPercentage = (data.nirf.score / 100) * 100

  const getNaacGrade = (score: number) => {
    if (score >= 3.5) return { grade: "A++", color: "bg-green-600" }
    if (score >= 3.0) return { grade: "A+", color: "bg-green-500" }
    if (score >= 2.5) return { grade: "A", color: "bg-blue-500" }
    if (score >= 2.0) return { grade: "B++", color: "bg-yellow-500" }
    return { grade: "B+", color: "bg-orange-500" }
  }

  const naacGrade = getNaacGrade(data.naac.score)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              NAAC Accreditation
              <Badge className={`${naacGrade.color} text-white`}>{naacGrade.grade}</Badge>
            </CardTitle>
            <CardDescription>National Assessment and Accreditation Council</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">
                  {data.naac.score.toFixed(1)}/{data.naac.maxScore}
                </div>
                <Progress value={naacPercentage} className="mt-2 h-3" />
                <p className="text-sm text-muted-foreground mt-2">Overall NAAC Score</p>
              </div>

              <div className="space-y-3">
                {Object.entries(data.naac.criteria).map(([criterion, { score, weight }]) => (
                  <div key={criterion} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{criterion}</span>
                      <span className="text-muted-foreground">
                        {score.toFixed(1)}/4.0 (Weight: {weight})
                      </span>
                    </div>
                    <Progress value={(score / 4.0) * 100} className="h-2" />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              NIRF Ranking
              <Badge variant="outline">Rank #{data.nirf.rank}</Badge>
            </CardTitle>
            <CardDescription>National Institutional Ranking Framework</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{data.nirf.score.toFixed(2)}/100</div>
                <Progress value={nirfPercentage} className="mt-2 h-3" />
                <p className="text-sm text-muted-foreground mt-2">Overall NIRF Score</p>
              </div>

              <div className="space-y-3">
                {Object.entries(data.nirf.parameters).map(([parameter, { score, weight }]) => (
                  <div key={parameter} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{parameter}</span>
                      <span className="text-muted-foreground">
                        {score.toFixed(2)} ({weight}%)
                      </span>
                    </div>
                    <Progress value={(score / (weight * 1.0)) * 100} className="h-2" />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Compliance Recommendations</CardTitle>
          <CardDescription>Areas for improvement to enhance institutional rankings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-medium text-sm">NAAC Improvement Areas</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span>Enhance Research & Innovation activities</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span>Improve Teaching-Learning processes</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span>Strengthen Governance mechanisms</span>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium text-sm">NIRF Enhancement Strategies</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Increase research publications and citations</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Improve graduation outcomes tracking</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Enhance outreach and inclusivity programs</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
