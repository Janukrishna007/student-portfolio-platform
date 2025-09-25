"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

export function ReportsGenerator() {
  const [reportType, setReportType] = useState("")
  const [academicYear, setAcademicYear] = useState("")
  const [departments, setDepartments] = useState<string[]>([])
  const [generating, setGenerating] = useState(false)

  const reportTypes = [
    { value: "naac", label: "NAAC Compliance Report", description: "Comprehensive report for NAAC accreditation" },
    { value: "nirf", label: "NIRF Ranking Report", description: "Data compilation for NIRF ranking submission" },
    { value: "annual", label: "Annual Achievement Report", description: "Yearly summary of student achievements" },
    {
      value: "department",
      label: "Department Performance Report",
      description: "Department-wise analytics and insights",
    },
    { value: "student", label: "Student Portfolio Report", description: "Individual student achievement summaries" },
  ]

  const availableDepartments = ["Computer Science", "Electronics", "Mechanical", "Civil", "Chemical"]

  const handleDepartmentChange = (dept: string, checked: boolean) => {
    if (checked) {
      setDepartments([...departments, dept])
    } else {
      setDepartments(departments.filter((d) => d !== dept))
    }
  }

  const generateReport = async () => {
    setGenerating(true)
    // Simulate report generation
    await new Promise((resolve) => setTimeout(resolve, 3000))
    setGenerating(false)

    // In real app, this would trigger actual report generation
    alert(`${reportTypes.find((r) => r.value === reportType)?.label} generated successfully!`)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Generate Institutional Reports</CardTitle>
          <CardDescription>
            Create comprehensive reports for compliance, rankings, and institutional analysis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="report-type">Report Type</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  {reportTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="academic-year">Academic Year</Label>
              <Select value={academicYear} onValueChange={setAcademicYear}>
                <SelectTrigger>
                  <SelectValue placeholder="Select academic year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024-25">2024-25</SelectItem>
                  <SelectItem value="2023-24">2023-24</SelectItem>
                  <SelectItem value="2022-23">2022-23</SelectItem>
                  <SelectItem value="2021-22">2021-22</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {reportType && (
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Report Description</h4>
                <p className="text-sm text-muted-foreground">
                  {reportTypes.find((r) => r.value === reportType)?.description}
                </p>
              </div>

              <div className="space-y-3">
                <Label>Include Departments</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {availableDepartments.map((dept) => (
                    <div key={dept} className="flex items-center space-x-2">
                      <Checkbox
                        id={dept}
                        checked={departments.includes(dept)}
                        onCheckedChange={(checked) => handleDepartmentChange(dept, checked as boolean)}
                      />
                      <Label htmlFor={dept} className="text-sm">
                        {dept}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-4">
            <Button onClick={generateReport} disabled={!reportType || !academicYear || generating} className="flex-1">
              {generating ? "Generating Report..." : "Generate Report"}
            </Button>
            <Button variant="outline">Preview</Button>
            <Button variant="outline">Schedule</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Reports</CardTitle>
          <CardDescription>Previously generated institutional reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { name: "NAAC Compliance Report 2024-25", date: "2024-08-15", status: "completed", type: "naac" },
              { name: "NIRF Ranking Report 2024", date: "2024-07-20", status: "completed", type: "nirf" },
              { name: "Annual Achievement Report 2023-24", date: "2024-06-30", status: "completed", type: "annual" },
              { name: "Department Performance Q2 2024", date: "2024-08-01", status: "processing", type: "department" },
            ].map((report, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-medium">{report.name}</div>
                  <div className="text-sm text-muted-foreground">Generated on {report.date}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={report.status === "completed" ? "default" : "secondary"}
                    className={
                      report.status === "completed"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        : ""
                    }
                  >
                    {report.status}
                  </Badge>
                  {report.status === "completed" && (
                    <Button variant="outline" size="sm">
                      Download
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
