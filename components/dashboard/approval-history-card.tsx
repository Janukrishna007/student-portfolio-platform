"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { ApprovalWorkflow } from "@/lib/types"
import { mockAchievements, mockStudents } from "@/lib/mock-data"
import { format } from "date-fns"

interface ApprovalHistoryCardProps {
  workflow: ApprovalWorkflow
}

export function ApprovalHistoryCard({ workflow }: ApprovalHistoryCardProps) {
  // Find the related achievement and student
  const achievement = mockAchievements.find((a) => a.id === workflow.achievement_id)
  const student = mockStudents.find((s) => s.id === achievement?.student_id)

  if (!achievement || !student) {
    return null
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "needs_revision":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  return (
    <Card className="hover:shadow-sm transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base">{achievement.title}</CardTitle>
            <CardDescription className="mt-1">
              {student.first_name} {student.last_name} ({student.student_id})
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(workflow.status)}>{workflow.status}</Badge>
            <Badge variant="outline" className="text-xs">
              {achievement.points} pts
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>Category: {achievement.category}</span>
            <span>•</span>
            <span>
              Reviewed: {workflow.reviewed_at ? format(new Date(workflow.reviewed_at), "MMM dd, yyyy") : "Pending"}
            </span>
          </div>

          {workflow.comments && (
            <div className="bg-muted/50 p-3 rounded-lg">
              <h4 className="font-medium text-sm mb-1">Review Comments</h4>
              <p className="text-sm text-muted-foreground">{workflow.comments}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
