"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import type { Achievement } from "@/lib/types"
import { format } from "date-fns"

interface AchievementReviewCardProps {
  achievement: Achievement
  onApproval: (achievementId: string, status: "approved" | "rejected", comments: string) => void
}

export function AchievementReviewCard({ achievement, onApproval }: AchievementReviewCardProps) {
  const [reviewDialog, setReviewDialog] = useState<"approve" | "reject" | null>(null)
  const [comments, setComments] = useState("")
  const [loading, setLoading] = useState(false)

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
      case "publication":
        return "📚"
      case "extracurricular":
        return "🎯"
      default:
        return "⭐"
    }
  }

  const handleReview = async (status: "approved" | "rejected") => {
    setLoading(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    onApproval(achievement.id, status, comments)
    setReviewDialog(null)
    setComments("")
    setLoading(false)
  }

  const getPointsRecommendation = (category: string) => {
    const pointsMap = {
      academic: { high: 100, medium: 75, low: 50 },
      certification: { high: 90, medium: 70, low: 50 },
      competition: { high: 100, medium: 80, low: 60 },
      internship: { high: 85, medium: 65, low: 45 },
      leadership: { high: 95, medium: 75, low: 55 },
      publication: { high: 120, medium: 90, low: 60 },
      project: { high: 80, medium: 60, low: 40 },
      extracurricular: { high: 70, medium: 50, low: 30 },
    }
    return pointsMap[category as keyof typeof pointsMap] || { high: 75, medium: 50, low: 25 }
  }

  const pointsRec = getPointsRecommendation(achievement.category)

  return (
    <Card className="hover:shadow-md transition-shadow border-l-4 border-l-yellow-400">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{getCategoryIcon(achievement.category)}</span>
            <div>
              <CardTitle className="text-lg">{achievement.title}</CardTitle>
              <CardDescription className="mt-1">
                Submitted on {format(new Date(achievement.created_at), "MMM dd, yyyy")} • Achieved on{" "}
                {format(new Date(achievement.date_achieved), "MMM dd, yyyy")}
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
              Pending Review
            </Badge>
            <Badge variant="outline" className="font-medium">
              {achievement.points} pts
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <h4 className="font-medium mb-2">Description</h4>
          <p className="text-sm text-muted-foreground">{achievement.description}</p>
        </div>

        <div className="flex items-center gap-4">
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
        </div>

        <div className="bg-muted/50 p-3 rounded-lg">
          <h4 className="font-medium mb-2 text-sm">Points Recommendation</h4>
          <div className="flex gap-2 text-xs">
            <Badge variant="outline">High: {pointsRec.high} pts</Badge>
            <Badge variant="outline">Medium: {pointsRec.medium} pts</Badge>
            <Badge variant="outline">Low: {pointsRec.low} pts</Badge>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Dialog open={reviewDialog === "approve"} onOpenChange={(open) => !open && setReviewDialog(null)}>
            <DialogTrigger asChild>
              <Button className="flex-1 bg-green-600 hover:bg-green-700" onClick={() => setReviewDialog("approve")}>
                Approve
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Approve Achievement</DialogTitle>
                <DialogDescription>
                  You are about to approve "{achievement.title}". Please provide feedback for the student.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="approve-comments">Comments (Optional)</Label>
                  <Textarea
                    id="approve-comments"
                    placeholder="Great work! This achievement demonstrates excellent..."
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setReviewDialog(null)}>
                  Cancel
                </Button>
                <Button
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => handleReview("approved")}
                  disabled={loading}
                >
                  {loading ? "Approving..." : "Approve Achievement"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={reviewDialog === "reject"} onOpenChange={(open) => !open && setReviewDialog(null)}>
            <DialogTrigger asChild>
              <Button variant="destructive" className="flex-1" onClick={() => setReviewDialog("reject")}>
                Reject
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Reject Achievement</DialogTitle>
                <DialogDescription>
                  Please provide clear feedback explaining why this achievement cannot be approved.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="reject-comments">Reason for Rejection *</Label>
                  <Textarea
                    id="reject-comments"
                    placeholder="Please provide additional documentation or clarification regarding..."
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setReviewDialog(null)}>
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleReview("rejected")}
                  disabled={loading || !comments.trim()}
                >
                  {loading ? "Rejecting..." : "Reject Achievement"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button variant="outline" className="flex-1 bg-transparent">
            Request More Info
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
