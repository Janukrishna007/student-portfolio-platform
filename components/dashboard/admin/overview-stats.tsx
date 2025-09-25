"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface OverviewStatsProps {
  data: {
    totalStudents: number
    totalFaculty: number
    totalAchievements: number
    pendingApprovals: number
    monthlyGrowth: {
      students: number
      achievements: number
      approvals: number
    }
  }
}

export function OverviewStats({ data }: OverviewStatsProps) {
  const formatGrowth = (value: number) => {
    const sign = value >= 0 ? "+" : ""
    return `${sign}${value.toFixed(1)}%`
  }

  const getGrowthColor = (value: number) => {
    if (value > 0) return "text-green-600 dark:text-green-400"
    if (value < 0) return "text-red-600 dark:text-red-400"
    return "text-gray-600 dark:text-gray-400"
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Students</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.totalStudents.toLocaleString()}</div>
          <p className={`text-xs ${getGrowthColor(data.monthlyGrowth.students)}`}>
            {formatGrowth(data.monthlyGrowth.students)} from last month
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Faculty</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.totalFaculty}</div>
          <p className="text-xs text-muted-foreground">Active faculty members</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Achievements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.totalAchievements.toLocaleString()}</div>
          <p className={`text-xs ${getGrowthColor(data.monthlyGrowth.achievements)}`}>
            {formatGrowth(data.monthlyGrowth.achievements)} from last month
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-600">{data.pendingApprovals}</div>
          <p className={`text-xs ${getGrowthColor(data.monthlyGrowth.approvals)}`}>
            {formatGrowth(data.monthlyGrowth.approvals)} from last month
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
