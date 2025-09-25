"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/lib/auth"
import type { Achievement, Faculty, ApprovalWorkflow } from "@/lib/types"
import { mockFaculty, mockPendingAchievements, mockApprovalWorkflows } from "@/lib/mock-data"
import { AchievementReviewCard } from "./achievement-review-card"
import { ApprovalHistoryCard } from "./approval-history-card"
import { FacultyStats } from "./faculty-stats"

export function FacultyDashboard() {
  const { user } = useAuth()
  const [faculty, setFaculty] = useState<Faculty | null>(null)
  const [pendingAchievements, setPendingAchievements] = useState<Achievement[]>([])
  const [approvalHistory, setApprovalHistory] = useState<ApprovalWorkflow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock data loading - in real app, this would fetch from Supabase
    const facultyData = mockFaculty.find((f) => f.user_id === user?.id)
    const pendingReviews = mockPendingAchievements.filter((a) => a.verification_status === "pending")
    const workflows = mockApprovalWorkflows.filter((w) => w.faculty_id === facultyData?.id)

    setFaculty(facultyData || null)
    setPendingAchievements(pendingReviews)
    setApprovalHistory(workflows)
    setLoading(false)
  }, [user])

  const handleApproval = (achievementId: string, status: "approved" | "rejected", comments: string) => {
    // Update achievement status
    setPendingAchievements((prev) =>
      prev
        .map((achievement) =>
          achievement.id === achievementId ? { ...achievement, verification_status: status } : achievement,
        )
        .filter((achievement) => achievement.id !== achievementId),
    )

    // Add to approval history
    const newWorkflow: ApprovalWorkflow = {
      id: Date.now().toString(),
      achievement_id: achievementId,
      faculty_id: faculty?.id || "1",
      status,
      comments,
      reviewed_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    setApprovalHistory((prev) => [newWorkflow, ...prev])
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>
  }

  if (!faculty) {
    return <div className="text-center text-red-500">Faculty profile not found</div>
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Welcome, {faculty.first_name} {faculty.last_name}
          </h1>
          <p className="text-muted-foreground">
            {faculty.designation} • {faculty.department} • {faculty.employee_id}
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-primary">{pendingAchievements.length}</div>
          <div className="text-sm text-muted-foreground">Pending Reviews</div>
        </div>
      </div>

      {/* Faculty Stats */}
      <FacultyStats
        pendingCount={pendingAchievements.length}
        approvedCount={approvalHistory.filter((w) => w.status === "approved").length}
        rejectedCount={approvalHistory.filter((w) => w.status === "rejected").length}
        totalReviewed={approvalHistory.length}
      />

      {/* Main Content Tabs */}
      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">Pending Reviews ({pendingAchievements.length})</TabsTrigger>
          <TabsTrigger value="history">Approval History ({approvalHistory.length})</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Achievements Awaiting Review</h2>
            <Button variant="outline">Bulk Actions</Button>
          </div>

          <div className="grid gap-4">
            {pendingAchievements.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-green-600 dark:text-green-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <p className="text-muted-foreground">All caught up!</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    No achievements pending your review at the moment.
                  </p>
                </CardContent>
              </Card>
            ) : (
              pendingAchievements.map((achievement) => (
                <AchievementReviewCard key={achievement.id} achievement={achievement} onApproval={handleApproval} />
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Review History</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Filter
              </Button>
              <Button variant="outline" size="sm">
                Export
              </Button>
            </div>
          </div>

          <div className="grid gap-4">
            {approvalHistory.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-muted-foreground">No review history available.</p>
                </CardContent>
              </Card>
            ) : (
              approvalHistory.map((workflow) => <ApprovalHistoryCard key={workflow.id} workflow={workflow} />)
            )}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <h2 className="text-xl font-semibold">Review Analytics</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Review Performance</CardTitle>
                <CardDescription>Your review activity this month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Average Review Time</span>
                    <span className="font-medium">2.3 days</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Reviews This Month</span>
                    <span className="font-medium">{approvalHistory.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Approval Rate</span>
                    <span className="font-medium">
                      {approvalHistory.length > 0
                        ? Math.round(
                            (approvalHistory.filter((w) => w.status === "approved").length / approvalHistory.length) *
                              100,
                          )
                        : 0}
                      %
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Category Distribution</CardTitle>
                <CardDescription>Types of achievements reviewed</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {["certification", "competition", "leadership", "publication"].map((category) => (
                    <div key={category} className="flex items-center justify-between">
                      <Badge variant="outline" className="capitalize">
                        {category}
                      </Badge>
                      <span className="text-sm font-medium">
                        {mockPendingAchievements.filter((a) => a.category === category).length}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
