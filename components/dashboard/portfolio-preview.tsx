"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Student, Achievement } from "@/lib/types"
import { format } from "date-fns"

interface PortfolioPreviewProps {
  student: Student
  achievements: Achievement[]
}

export function PortfolioPreview({ student, achievements }: PortfolioPreviewProps) {
  const totalPoints = achievements.reduce((sum, achievement) => sum + achievement.points, 0)

  const achievementsByCategory = achievements.reduce(
    (acc, achievement) => {
      if (!acc[achievement.category]) {
        acc[achievement.category] = []
      }
      acc[achievement.category].push(achievement)
      return acc
    },
    {} as Record<string, Achievement[]>,
  )

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Preview</CardTitle>
          <CardDescription>
            This is how your digital portfolio will appear to recruiters and admissions committees
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Student Profile Section */}
            <div className="border-b pb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary">
                    {student.first_name[0]}
                    {student.last_name[0]}
                  </span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold">
                    {student.first_name} {student.last_name}
                  </h2>
                  <p className="text-muted-foreground">
                    {student.student_id} • {student.department}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Year {student.year}, Semester {student.semester} • CGPA: {student.cgpa}
                  </p>
                </div>
              </div>
            </div>

            {/* Achievement Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-primary/5 rounded-lg">
                <div className="text-2xl font-bold text-primary">{achievements.length}</div>
                <div className="text-sm text-muted-foreground">Total Achievements</div>
              </div>
              <div className="text-center p-4 bg-primary/5 rounded-lg">
                <div className="text-2xl font-bold text-primary">{totalPoints}</div>
                <div className="text-sm text-muted-foreground">Achievement Points</div>
              </div>
              <div className="text-center p-4 bg-primary/5 rounded-lg">
                <div className="text-2xl font-bold text-primary">{Object.keys(achievementsByCategory).length}</div>
                <div className="text-sm text-muted-foreground">Categories</div>
              </div>
            </div>

            {/* Achievements by Category */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Achievements</h3>
              {Object.entries(achievementsByCategory).map(([category, categoryAchievements]) => (
                <div key={category} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="capitalize">
                      {category}
                    </Badge>
                    <span className="text-sm text-muted-foreground">({categoryAchievements.length} achievements)</span>
                  </div>
                  <div className="grid gap-2 ml-4">
                    {categoryAchievements.map((achievement) => (
                      <div
                        key={achievement.id}
                        className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                      >
                        <div>
                          <div className="font-medium">{achievement.title}</div>
                          <div className="text-sm text-muted-foreground">
                            {format(new Date(achievement.date_achieved), "MMM yyyy")}
                          </div>
                        </div>
                        <Badge variant="secondary">{achievement.points} pts</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {achievements.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p>No verified achievements to display in portfolio yet.</p>
                <p className="text-sm mt-2">Add achievements and get them verified to build your portfolio.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button className="flex-1">Generate Full Portfolio</Button>
        <Button variant="outline" className="flex-1 bg-transparent">
          Download PDF
        </Button>
        <Button variant="outline">Share Portfolio</Button>
      </div>
    </div>
  )
}
