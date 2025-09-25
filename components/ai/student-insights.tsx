"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  TrendingUp,
  Brain,
  Target,
  Award,
  Users,
  BookOpen,
  Zap,
  Star,
  ArrowUp,
  ArrowDown,
  BarChart3
} from "lucide-react"

interface StudentSkill {
  name: string
  category: "technical" | "soft" | "domain"
  proficiency: "beginner" | "intermediate" | "advanced"
  progress: number
  trend: "up" | "down" | "stable"
}

interface StudentInsight {
  id: string
  name: string
  avatar?: string
  department: string
  year: number
  topSkills: StudentSkill[]
  skillGaps: string[]
  careerPath: string
  achievements: number
  progressScore: number
  recommendations: string[]
}

// Mock data for student insights
const mockStudentInsights: StudentInsight[] = [
  {
    id: "1",
    name: "Aleena Ida Ignatius",
    department: "Computer Science",
    year: 3,
    topSkills: [
      { name: "React.js", category: "technical", proficiency: "advanced", progress: 85, trend: "up" },
      { name: "UI/UX Design", category: "technical", proficiency: "intermediate", progress: 70, trend: "up" },
      { name: "Problem Solving", category: "soft", proficiency: "advanced", progress: 90, trend: "stable" },
      { name: "Machine Learning", category: "domain", proficiency: "intermediate", progress: 65, trend: "up" },
      { name: "Communication", category: "soft", proficiency: "advanced", progress: 88, trend: "stable" }
    ],
    skillGaps: ["Node.js", "Database Design", "Cloud Computing", "DevOps"],
    careerPath: "Full Stack Developer",
    achievements: 12,
    progressScore: 78,
    recommendations: [
      "Complete AWS Certification to strengthen cloud skills",
      "Build a full-stack project using Node.js and MongoDB",
      "Participate in hackathons to improve problem-solving speed",
      "Consider taking a course on system design"
    ]
  },
  {
    id: "2",
    name: "John Doe",
    department: "Computer Science",
    year: 2,
    topSkills: [
      { name: "Python", category: "technical", proficiency: "intermediate", progress: 75, trend: "up" },
      { name: "Data Analysis", category: "domain", proficiency: "intermediate", progress: 68, trend: "up" },
      { name: "Leadership", category: "soft", proficiency: "intermediate", progress: 60, trend: "up" },
      { name: "Statistics", category: "domain", proficiency: "beginner", progress: 45, trend: "stable" }
    ],
    skillGaps: ["Machine Learning", "Deep Learning", "SQL", "Presentation Skills"],
    careerPath: "Data Scientist",
    achievements: 8,
    progressScore: 62,
    recommendations: [
      "Enroll in a comprehensive ML course on Coursera",
      "Practice SQL with real datasets",
      "Join data science competitions on Kaggle",
      "Improve presentation skills through workshops"
    ]
  }
]

interface StudentInsightsProps {
  onRecommendCourse?: (studentId: string, course: string) => void
}

export function StudentInsights({ onRecommendCourse }: StudentInsightsProps) {
  const [selectedStudent, setSelectedStudent] = useState<StudentInsight | null>(null)
  
  const getSkillColor = (category: string) => {
    switch (category) {
      case "technical":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "soft":
        return "bg-green-100 text-green-800 border-green-200"
      case "domain":
        return "bg-purple-100 text-purple-800 border-purple-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getProficiencyColor = (level: string) => {
    switch (level) {
      case "advanced":
        return "text-green-600"
      case "intermediate":
        return "text-yellow-600"
      case "beginner":
        return "text-orange-600"
      default:
        return "text-gray-600"
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <ArrowUp className="w-3 h-3 text-green-500" />
      case "down":
        return <ArrowDown className="w-3 h-3 text-red-500" />
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Student Skill Insights</h2>
          <p className="text-gray-600">AI-powered analysis of student skills and progress</p>
        </div>
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-purple-600" />
          <span className="text-sm font-medium text-purple-600">AI Powered</span>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Students</p>
                <p className="text-xl font-bold text-gray-900">{mockStudentInsights.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Avg Progress</p>
                <p className="text-xl font-bold text-gray-900">
                  {Math.round(mockStudentInsights.reduce((acc, s) => acc + s.progressScore, 0) / mockStudentInsights.length)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Award className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Achievements</p>
                <p className="text-xl font-bold text-gray-900">
                  {mockStudentInsights.reduce((acc, s) => acc + s.achievements, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Target className="w-4 h-4 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Skill Gaps</p>
                <p className="text-xl font-bold text-gray-900">
                  {mockStudentInsights.reduce((acc, s) => acc + s.skillGaps.length, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Student List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {mockStudentInsights.map((student) => (
          <Card key={student.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={student.avatar} />
                  <AvatarFallback className="bg-gradient-to-br from-purple-400 to-pink-500 text-white">
                    {student.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <CardTitle className="text-lg">{student.name}</CardTitle>
                  <CardDescription>
                    {student.department} • Year {student.year}
                  </CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">{student.progressScore}%</div>
                  <div className="text-xs text-gray-500">Progress Score</div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Top Skills */}
              <div>
                <h4 className="font-medium mb-2 text-sm">Top Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {student.topSkills.slice(0, 3).map((skill) => (
                    <div key={skill.name} className="flex items-center gap-1">
                      <Badge className={`text-xs ${getSkillColor(skill.category)}`}>
                        {skill.name}
                      </Badge>
                      {getTrendIcon(skill.trend)}
                    </div>
                  ))}
                </div>
              </div>

              {/* Career Path */}
              <div>
                <h4 className="font-medium mb-2 text-sm">Career Path</h4>
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-purple-600" />
                  <span className="text-sm text-gray-700">{student.careerPath}</span>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900">{student.achievements}</div>
                  <div className="text-xs text-gray-500">Achievements</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900">{student.skillGaps.length}</div>
                  <div className="text-xs text-gray-500">Skill Gaps</div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      size="sm" 
                      className="flex-1"
                      onClick={() => setSelectedStudent(student)}
                    >
                      <BarChart3 className="w-4 h-4 mr-1" />
                      View Details
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className="bg-gradient-to-br from-purple-400 to-pink-500 text-white">
                            {student.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        {student.name} - Skill Analysis
                      </DialogTitle>
                      <DialogDescription>
                        Detailed AI-powered insights and recommendations
                      </DialogDescription>
                    </DialogHeader>
                    
                    <Tabs defaultValue="skills" className="mt-4">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="skills">Skills Analysis</TabsTrigger>
                        <TabsTrigger value="gaps">Skill Gaps</TabsTrigger>
                        <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="skills" className="space-y-4">
                        <div className="grid gap-4">
                          {student.topSkills.map((skill) => (
                            <div key={skill.name} className="p-4 border rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <Badge className={`text-xs ${getSkillColor(skill.category)}`}>
                                    {skill.category}
                                  </Badge>
                                  <span className="font-medium">{skill.name}</span>
                                  {getTrendIcon(skill.trend)}
                                </div>
                                <span className={`text-sm font-medium ${getProficiencyColor(skill.proficiency)}`}>
                                  {skill.proficiency}
                                </span>
                              </div>
                              <Progress value={skill.progress} className="h-2" />
                              <div className="text-xs text-gray-500 mt-1">{skill.progress}% proficiency</div>
                            </div>
                          ))}
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="gaps" className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {student.skillGaps.map((gap) => (
                            <div key={gap} className="p-3 border rounded-lg bg-orange-50 border-orange-200">
                              <div className="flex items-center justify-between">
                                <span className="font-medium text-orange-800">{gap}</span>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  className="text-xs"
                                  onClick={() => onRecommendCourse?.(student.id, gap)}
                                >
                                  Recommend Course
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="recommendations" className="space-y-3">
                        {student.recommendations.map((rec, index) => (
                          <div key={index} className="p-4 border rounded-lg bg-blue-50 border-blue-200">
                            <div className="flex items-start gap-3">
                              <Zap className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                              <span className="text-blue-800">{rec}</span>
                            </div>
                          </div>
                        ))}
                      </TabsContent>
                    </Tabs>
                  </DialogContent>
                </Dialog>
                
                <Button size="sm" variant="outline" className="flex-1">
                  <BookOpen className="w-4 h-4 mr-1" />
                  Mentor
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}