"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Lightbulb, TrendingUp, Target } from "lucide-react"
import type { Achievement } from "@/lib/types"

interface SmartRecommendationsProps {
  achievements: Achievement[]
  studentProfile: {
    department: string
    year: number
    cgpa?: number
  }
}

export function SmartRecommendations({ achievements, studentProfile }: SmartRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<
    Array<{
      type: "missing_category" | "skill_gap" | "opportunity" | "improvement"
      title: string
      description: string
      priority: "high" | "medium" | "low"
      actionable: boolean
    }>
  >([])

  useEffect(() => {
    generateRecommendations()
  }, [achievements, studentProfile])

  const generateRecommendations = () => {
    const recs = []

    // Analyze missing categories
    const categories = achievements.map((a) => a.category)
    const missingCategories = ["certification", "internship", "leadership", "project", "publication"].filter(
      (cat) => !categories.includes(cat as any),
    )

    missingCategories.forEach((category) => {
      recs.push({
        type: "missing_category" as const,
        title: `Add ${category} achievements`,
        description: `You haven't recorded any ${category} achievements. This could strengthen your profile.`,
        priority: category === "internship" || category === "certification" ? ("high" as const) : ("medium" as const),
        actionable: true,
      })
    })

    // Department-specific recommendations
    if (studentProfile.department === "Computer Science") {
      if (!categories.includes("certification")) {
        recs.push({
          type: "skill_gap" as const,
          title: "Technical Certifications Recommended",
          description:
            "Consider pursuing AWS, Google Cloud, or Microsoft Azure certifications to enhance your technical profile.",
          priority: "high" as const,
          actionable: true,
        })
      }

      if (!categories.includes("project")) {
        recs.push({
          type: "opportunity" as const,
          title: "Showcase Your Projects",
          description: "Document your coding projects, hackathon submissions, or open-source contributions.",
          priority: "medium" as const,
          actionable: true,
        })
      }
    }

    // Year-based recommendations
    if (studentProfile.year >= 3 && !categories.includes("internship")) {
      recs.push({
        type: "opportunity" as const,
        title: "Internship Experience Needed",
        description: "As a senior student, internship experience is crucial for placement opportunities.",
        priority: "high" as const,
        actionable: true,
      })
    }

    // CGPA-based recommendations
    if (studentProfile.cgpa && studentProfile.cgpa >= 8.0 && !categories.includes("academic")) {
      recs.push({
        type: "improvement" as const,
        title: "Highlight Academic Excellence",
        description: "Your high CGPA qualifies for academic excellence awards. Document any honors or scholarships.",
        priority: "medium" as const,
        actionable: true,
      })
    }

    // Leadership gap
    if (!categories.includes("leadership") && achievements.length > 3) {
      recs.push({
        type: "opportunity" as const,
        title: "Leadership Opportunities",
        description: "Consider taking leadership roles in clubs, events, or student organizations.",
        priority: "medium" as const,
        actionable: true,
      })
    }

    setRecommendations(recs.slice(0, 6)) // Limit to top 6 recommendations
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "missing_category":
        return <Target className="w-4 h-4" />
      case "skill_gap":
        return <TrendingUp className="w-4 h-4" />
      case "opportunity":
        return <Lightbulb className="w-4 h-4" />
      case "improvement":
        return <TrendingUp className="w-4 h-4" />
      default:
        return <Lightbulb className="w-4 h-4" />
    }
  }

  if (recommendations.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <Lightbulb className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Great job! No immediate recommendations at this time.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5" />
          Smart Recommendations
        </CardTitle>
        <CardDescription>AI-powered suggestions to enhance your achievement profile</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recommendations.map((rec, index) => (
            <div key={index} className="p-4 border rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getTypeIcon(rec.type)}
                  <h4 className="font-medium">{rec.title}</h4>
                </div>
                <Badge className={getPriorityColor(rec.priority)}>{rec.priority} priority</Badge>
              </div>

              <p className="text-sm text-muted-foreground">{rec.description}</p>

              {rec.actionable && (
                <div className="flex gap-2 pt-2">
                  <Button size="sm" variant="outline">
                    Learn More
                  </Button>
                  <Button size="sm">Take Action</Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
