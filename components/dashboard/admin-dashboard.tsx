"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/lib/auth"
import { mockAnalytics } from "@/lib/mock-data"
import { OverviewStats } from "./admin/overview-stats"
import { AchievementAnalytics } from "./admin/achievement-analytics"
import { ComplianceMetrics } from "./admin/compliance-metrics"
import { DepartmentAnalytics } from "./admin/department-analytics"
import { ReportsGenerator } from "./admin/reports-generator"

export function AdminDashboard() {
  const { user } = useAuth()
  const [analytics, setAnalytics] = useState(mockAnalytics)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock data loading - in real app, this would fetch from Supabase
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }, [])

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading analytics...</div>
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Institutional analytics and compliance management for University of Excellence
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Export Data</Button>
          <Button>Generate Report</Button>
        </div>
      </div>

      {/* Overview Stats */}
      <OverviewStats data={analytics.overview} />

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="departments">Departments</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Achievement Trends</CardTitle>
                <CardDescription>Monthly achievement submissions and approvals</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.achievements.byMonth.slice(-6).map((month) => (
                    <div key={month.month} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium w-8">{month.month}</span>
                        <div className="flex-1">
                          <Progress value={(month.approved / month.count) * 100} className="h-2" />
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {month.approved}/{month.count}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Performing Students</CardTitle>
                <CardDescription>Students with highest achievement points</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.achievements.topPerformers.map((student, index) => (
                    <div key={student.studentId} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-primary">#{index + 1}</span>
                        </div>
                        <div>
                          <div className="font-medium">{student.name}</div>
                          <div className="text-sm text-muted-foreground">{student.studentId}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{student.points} pts</div>
                        <div className="text-sm text-muted-foreground">{student.achievements} achievements</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-4">
          <AchievementAnalytics data={analytics.achievements} />
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <ComplianceMetrics data={analytics.compliance} />
        </TabsContent>

        <TabsContent value="departments" className="space-y-4">
          <DepartmentAnalytics data={analytics.departments} />
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <ReportsGenerator />
        </TabsContent>
      </Tabs>
    </div>
  )
}
