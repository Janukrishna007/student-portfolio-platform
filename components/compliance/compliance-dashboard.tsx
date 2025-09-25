"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { NAACReport } from "./naac-report"
import { NIRFReport } from "./nirf-report"
import { FileText, TrendingUp, Award, Calendar } from "lucide-react"

export function ComplianceDashboard() {
  const [activeTab, setActiveTab] = useState("naac")

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Institutional Compliance</h1>
          <p className="text-gray-600">NAAC Accreditation & NIRF Ranking Management</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">A+</div>
                <div className="text-sm text-gray-600">NAAC Grade</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">#47</div>
                <div className="text-sm text-gray-600">NIRF Rank</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">95%</div>
                <div className="text-sm text-gray-600">Compliance</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">2027</div>
                <div className="text-sm text-gray-600">Next Review</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Compliance Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <h4 className="font-medium">NAAC Self Study Report Submitted</h4>
                <p className="text-sm text-gray-600">Comprehensive institutional assessment completed and submitted</p>
              </div>
              <Badge className="bg-green-100 text-green-800">Completed</Badge>
            </div>
            <div className="flex items-center gap-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <h4 className="font-medium">NIRF Data Collection in Progress</h4>
                <p className="text-sm text-gray-600">Gathering institutional data for 2024 ranking submission</p>
              </div>
              <Badge variant="secondary">In Progress</Badge>
            </div>
            <div className="flex items-center gap-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <div className="flex-1">
                <h4 className="font-medium">Faculty Development Program Scheduled</h4>
                <p className="text-sm text-gray-600">Training sessions to improve teaching-learning outcomes</p>
              </div>
              <Badge variant="outline">Scheduled</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Reports */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="naac">NAAC Accreditation</TabsTrigger>
          <TabsTrigger value="nirf">NIRF Ranking</TabsTrigger>
        </TabsList>
        <TabsContent value="naac" className="mt-6">
          <NAACReport />
        </TabsContent>
        <TabsContent value="nirf" className="mt-6">
          <NIRFReport />
        </TabsContent>
      </Tabs>
    </div>
  )
}
