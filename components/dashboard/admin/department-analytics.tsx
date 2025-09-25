"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

interface DepartmentAnalyticsProps {
  data: Array<{
    name: string
    students: number
    achievements: number
    avgPoints: number
  }>
}

export function DepartmentAnalytics({ data }: DepartmentAnalyticsProps) {
  const totalStudents = data.reduce((sum, dept) => sum + dept.students, 0)
  const totalAchievements = data.reduce((sum, dept) => sum + dept.achievements, 0)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Department Performance Overview</CardTitle>
          <CardDescription>Comparative analysis across all departments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {data.map((dept) => {
              const studentPercentage = (dept.students / totalStudents) * 100
              const achievementPercentage = (dept.achievements / totalAchievements) * 100
              const achievementsPerStudent = dept.achievements / dept.students

              return (
                <div key={dept.name} className="space-y-3 p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{dept.name}</h3>
                    <Badge variant="outline">{dept.students} students</Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Total Achievements</div>
                      <div className="text-2xl font-bold">{dept.achievements}</div>
                      <Progress value={achievementPercentage} className="mt-1 h-2" />
                    </div>

                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Avg Points per Student</div>
                      <div className="text-2xl font-bold">{dept.avgPoints.toFixed(1)}</div>
                      <Progress value={(dept.avgPoints / 100) * 100} className="mt-1 h-2" />
                    </div>

                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Achievements per Student</div>
                      <div className="text-2xl font-bold">{achievementsPerStudent.toFixed(1)}</div>
                      <Progress value={(achievementsPerStudent / 5) * 100} className="mt-1 h-2" />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Departments</CardTitle>
            <CardDescription>Ranked by average points per student</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data
                .sort((a, b) => b.avgPoints - a.avgPoints)
                .map((dept, index) => (
                  <div key={dept.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-primary">#{index + 1}</span>
                      </div>
                      <span className="font-medium">{dept.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{dept.avgPoints.toFixed(1)} pts</div>
                      <div className="text-sm text-muted-foreground">{dept.students} students</div>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Department Insights</CardTitle>
            <CardDescription>Key metrics and recommendations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                <div className="font-medium text-green-800 dark:text-green-200 text-sm">Highest Engagement</div>
                <div className="text-green-600 dark:text-green-400">
                  {data.sort((a, b) => b.achievements / b.students - a.achievements / a.students)[0]?.name}
                </div>
              </div>

              <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <div className="font-medium text-blue-800 dark:text-blue-200 text-sm">Most Students</div>
                <div className="text-blue-600 dark:text-blue-400">
                  {data.sort((a, b) => b.students - a.students)[0]?.name}
                </div>
              </div>

              <div className="p-3 bg-purple-50 dark:bg-purple-950 rounded-lg">
                <div className="font-medium text-purple-800 dark:text-purple-200 text-sm">Growth Opportunity</div>
                <div className="text-purple-600 dark:text-purple-400">
                  {data.sort((a, b) => a.avgPoints - b.avgPoints)[0]?.name}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
