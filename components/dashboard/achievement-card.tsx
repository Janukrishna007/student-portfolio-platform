"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Achievement } from "@/lib/types"
import { format } from "date-fns"

interface AchievementCardProps {
  achievement: Achievement
}

export function AchievementCard({ achievement }: AchievementCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "academic":
        return "🎓"
      case "certification":
        return "📜"
      case "competition":
        return "🏆"
      case "internship":
        return "💼"
      case "leadership":
        return "👑"
      case "project":
        return "🚀"
      case "extracurricular":
        return "🎯"
      default:
        return "⭐"
    }
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">{getCategoryIcon(achievement.category)}</span>
            <div>
              <CardTitle className="text-lg">{achievement.title}</CardTitle>
              <CardDescription className="mt-1">
                {format(new Date(achievement.date_achieved), "MMM dd, yyyy")}
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(achievement.verification_status)}>{achievement.verification_status}</Badge>
            <Badge variant="outline" className="font-medium">
              {achievement.points} pts
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-3">{achievement.description}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="capitalize">
              {achievement.category}
            </Badge>
            {achievement.subcategory && (
              <Badge variant="outline" className="text-xs">
                {achievement.subcategory}
              </Badge>
            )}
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              View Details
            </Button>
            {achievement.verification_status === "pending" && (
              <Button variant="outline" size="sm">
                Edit
              </Button>
            )}
          </div>
        </div>

        {achievement.verification_status === "approved" && achievement.verification_date && (
          <div className="mt-3 pt-3 border-t text-xs text-muted-foreground">
            Verified on {format(new Date(achievement.verification_date), "MMM dd, yyyy")}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
