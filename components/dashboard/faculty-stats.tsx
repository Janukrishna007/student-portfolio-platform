"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface FacultyStatsProps {
  pendingCount: number
  approvedCount: number
  rejectedCount: number
  totalReviewed: number
}

export function FacultyStats({ pendingCount, approvedCount, rejectedCount, totalReviewed }: FacultyStatsProps) {
  const approvalRate = totalReviewed > 0 ? (approvedCount / totalReviewed) * 100 : 0
  const avgResponseTime = 2.3 // Mock data - in real app, calculate from actual data

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-600">{pendingCount}</div>
          <p className="text-xs text-muted-foreground">Awaiting your review</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Reviewed</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalReviewed}</div>
          <p className="text-xs text-muted-foreground">
            {approvedCount} approved, {rejectedCount} rejected
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Approval Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{Math.round(approvalRate)}%</div>
          <Progress value={approvalRate} className="mt-2" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{avgResponseTime}</div>
          <p className="text-xs text-muted-foreground">days per review</p>
        </CardContent>
      </Card>
    </div>
  )
}
