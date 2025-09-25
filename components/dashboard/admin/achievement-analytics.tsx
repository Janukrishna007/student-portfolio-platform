"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface AchievementAnalyticsProps {
  data: {
    byCategory: Record<string, number>
    byMonth: Array<{ month: string; count: number; approved: number }>
    topPerformers: Array<{ studentId: string; name: string; achievements: number; points: number }>
  }
}

export function AchievementAnalytics({ data }: AchievementAnalyticsProps) {
  const totalAchievements = Object.values(data.byCategory).reduce((sum, count) => sum + count, 0)

  const getCategoryIcon = (category: string) => {
    const icons = {
      academic: "🎓",
      certification: "📜",
      competition: "🏆",
      internship: "💼",
      leadership: "👑",
      project: "🚀",
      publication: "📚",
      extracurricular: "🎯",
    }
    return icons[category as keyof typeof icons] || "⭐"
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Achievement Categories</CardTitle>
            <CardDescription>Distribution of achievements by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(data.byCategory)
                .sort(([, a], [, b]) => b - a)
                .map(([category, count]) => {
                  const percentage = (count / totalAchievements) * 100
                  return (
                    <div key={category} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{getCategoryIcon(category)}</span>
                          <span className="capitalize font-medium">{category}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {count} ({percentage.toFixed(1)}%)
                        </div>
                      </div>
                      <Progress value={percentage} className="h-2" />
                    </div>
                  )
                })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Trends</CardTitle>
            <CardDescription>Achievement submissions and approval rates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.byMonth.slice(-6).map((month) => {
                const approvalRate = (month.approved / month.count) * 100
                return (
                  <div key={month.month} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{month.month}</span>
                      <div className="text-sm text-muted-foreground">
                        {month.approved}/{month.count} ({approvalRate.toFixed(1)}%)
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <div className="text-xs text-muted-foreground mb-1">Submissions</div>
                        <Progress value={(month.count / 500) * 100} className="h-2" />
                      </div>
                      <div className="flex-1">
                        <div className="text-xs text-muted-foreground mb-1">Approval Rate</div>
                        <Progress value={approvalRate} className="h-2" />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Achievement Insights</CardTitle>
          <CardDescription>Key metrics and trends</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {Math.round((data.byMonth.slice(-1)[0]?.approved / data.byMonth.slice(-1)[0]?.count) * 100)}%
              </div>
              <div className="text-sm text-muted-foreground">Current Approval Rate</div>
            </div>
            <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {Math.round(totalAchievements / 2847)}
              </div>
              <div className="text-sm text-muted-foreground">Avg Achievements per Student</div>
            </div>
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {Object.keys(data.byCategory).length}
              </div>
              <div className="text-sm text-muted-foreground">Active Categories</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
