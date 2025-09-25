"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  BookOpen,
  Target,
  Users,
  Send,
  Star,
  ExternalLink,
  Clock,
  Award,
  Plus,
  Search,
  Filter,
} from "lucide-react"

interface Course {
  id: string
  title: string
  provider: string
  duration: string
  level: "beginner" | "intermediate" | "advanced"
  rating: number
  price: string
  category: string
  skills: string[]
  url: string
}

interface Activity {
  id: string
  title: string
  type: "competition" | "project" | "workshop" | "internship"
  description: string
  deadline?: string
  difficulty: "easy" | "medium" | "hard"
  skills: string[]
  benefits: string[]
  url?: string
}

interface Recommendation {
  id: string
  studentName: string
  type: "course" | "activity"
  title: string
  reason: string
  status: "sent" | "accepted" | "declined" | "completed"
  sentAt: string
}

// Mock data
const mockCourses: Course[] = [
  {
    id: "1",
    title: "Complete Node.js Developer Course",
    provider: "Udemy",
    duration: "40 hours",
    level: "intermediate",
    rating: 4.6,
    price: "$89.99",
    category: "Backend Development",
    skills: ["Node.js", "Express.js", "MongoDB", "REST APIs"],
    url: "https://example.com/nodejs-course"
  },
  {
    id: "2",
    title: "AWS Cloud Practitioner Certification",
    provider: "AWS",
    duration: "30 hours",
    level: "beginner",
    rating: 4.8,
    price: "Free",
    category: "Cloud Computing",
    skills: ["AWS", "Cloud Computing", "EC2", "S3"],
    url: "https://aws.amazon.com/certification/"
  }
]

const mockActivities: Activity[] = [
  {
    id: "1",
    title: "Google Code Jam",
    type: "competition",
    description: "Annual programming competition hosted by Google",
    deadline: "2024-04-15",
    difficulty: "hard",
    skills: ["Algorithms", "Data Structures", "Problem Solving"],
    benefits: ["Recognition", "Cash Prizes", "Google Interview Opportunity"],
    url: "https://codingcompetitions.withgoogle.com/codejam"
  }
]

const mockRecommendations: Recommendation[] = [
  {
    id: "1",
    studentName: "Aleena Ida Ignatius",
    type: "course",
    title: "Complete Node.js Developer Course",
    reason: "To strengthen backend development skills for full-stack career path",
    status: "accepted",
    sentAt: "2024-01-15T10:00:00Z"
  }
]

export function MentorshipTools() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [selectedTab, setSelectedTab] = useState<"courses" | "activities" | "recommendations">("courses")
  const [recommendations, setRecommendations] = useState<Recommendation[]>(mockRecommendations)
  const [isRecommendDialogOpen, setIsRecommendDialogOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<Course | Activity | null>(null)
  
  const [recommendForm, setRecommendForm] = useState({
    studentName: "",
    reason: "",
    additionalNotes: ""
  })

  const filteredCourses = mockCourses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === "all" || course.category.toLowerCase().includes(filterCategory.toLowerCase())
    return matchesSearch && matchesCategory
  })

  const filteredActivities = mockActivities.filter(activity => {
    const matchesSearch = activity.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === "all" || activity.type === filterCategory
    return matchesSearch && matchesCategory
  })

  const handleRecommend = (item: Course | Activity) => {
    setSelectedItem(item)
    setIsRecommendDialogOpen(true)
  }

  const submitRecommendation = () => {
    if (selectedItem && recommendForm.studentName && recommendForm.reason) {
      const newRecommendation: Recommendation = {
        id: Date.now().toString(),
        studentName: recommendForm.studentName,
        type: 'title' in selectedItem ? 'course' : 'activity',
        title: selectedItem.title,
        reason: recommendForm.reason,
        status: 'sent',
        sentAt: new Date().toISOString()
      }
      
      setRecommendations(prev => [newRecommendation, ...prev])
      setIsRecommendDialogOpen(false)
      setRecommendForm({ studentName: "", reason: "", additionalNotes: "" })
      setSelectedItem(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Mentorship Tools</h2>
          <p className="text-gray-600">Recommend courses and activities to help students grow</p>
        </div>
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-purple-600" />
          <span className="text-sm font-medium text-purple-600">Smart Recommendations</span>
        </div>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search courses, activities, or skills..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="backend">Backend Development</SelectItem>
                <SelectItem value="cloud">Cloud Computing</SelectItem>
                <SelectItem value="competition">Competitions</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-gray-100 rounded-lg w-fit">
        <button
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            selectedTab === "courses" ? "bg-white shadow-sm text-gray-900" : "text-gray-600 hover:text-gray-900"
          }`}
          onClick={() => setSelectedTab("courses")}
        >
          <BookOpen className="w-4 h-4 mr-2 inline" />
          Courses ({filteredCourses.length})
        </button>
        <button
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            selectedTab === "activities" ? "bg-white shadow-sm text-gray-900" : "text-gray-600 hover:text-gray-900"
          }`}
          onClick={() => setSelectedTab("activities")}
        >
          <Target className="w-4 h-4 mr-2 inline" />
          Activities ({filteredActivities.length})
        </button>
        <button
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            selectedTab === "recommendations" ? "bg-white shadow-sm text-gray-900" : "text-gray-600 hover:text-gray-900"
          }`}
          onClick={() => setSelectedTab("recommendations")}
        >
          <Send className="w-4 h-4 mr-2 inline" />
          Sent Recommendations ({recommendations.length})
        </button>
      </div>

      {/* Content based on selected tab */}
      {selectedTab === "courses" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredCourses.map((course) => (
            <Card key={course.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{course.title}</CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <span>{course.provider}</span>
                      <Badge variant="outline" className="text-xs">
                        {course.level}
                      </Badge>
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium">{course.rating}</span>
                    </div>
                    <div className="text-sm text-gray-600">{course.price}</div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{course.duration}</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {course.category}
                  </Badge>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2 text-sm">Skills You'll Learn</h4>
                  <div className="flex flex-wrap gap-2">
                    {course.skills.map((skill) => (
                      <Badge key={skill} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="flex gap-2 pt-2">
                  <Button 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleRecommend(course)}
                  >
                    <Send className="w-4 h-4 mr-1" />
                    Recommend
                  </Button>
                  <Button size="sm" variant="outline" asChild>
                    <a href={course.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {selectedTab === "activities" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredActivities.map((activity) => (
            <Card key={activity.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{activity.title}</CardTitle>
                    <CardDescription className="mt-1">
                      {activity.description}
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="text-xs capitalize">
                    {activity.type}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {activity.deadline && (
                  <div className="flex items-center gap-2 text-sm text-orange-600 bg-orange-50 p-2 rounded">
                    <Clock className="w-4 h-4" />
                    Deadline: {new Date(activity.deadline).toLocaleDateString()}
                  </div>
                )}
                
                <div>
                  <h4 className="font-medium mb-2 text-sm">Skills Required</h4>
                  <div className="flex flex-wrap gap-2">
                    {activity.skills.map((skill) => (
                      <Badge key={skill} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2 text-sm">Benefits</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {activity.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <Award className="w-3 h-3 text-green-500" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="flex gap-2 pt-2">
                  <Button 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleRecommend(activity)}
                  >
                    <Send className="w-4 h-4 mr-1" />
                    Recommend
                  </Button>
                  {activity.url && (
                    <Button size="sm" variant="outline" asChild>
                      <a href={activity.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {selectedTab === "recommendations" && (
        <div className="space-y-4">
          {recommendations.map((rec) => (
            <Card key={rec.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {rec.studentName.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h3 className="font-medium">{rec.studentName}</h3>
                        <p className="text-sm text-gray-600">{rec.title}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 mt-2">{rec.reason}</p>
                  </div>
                  <div className="text-right">
                    <Badge className={`text-xs ${
                      rec.status === "sent" ? "bg-blue-100 text-blue-800" :
                      rec.status === "accepted" ? "bg-green-100 text-green-800" :
                      rec.status === "declined" ? "bg-red-100 text-red-800" :
                      "bg-purple-100 text-purple-800"
                    }`}>
                      {rec.status}
                    </Badge>
                    <div className="text-xs text-gray-500 mt-1">
                      {new Date(rec.sentAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Recommendation Dialog */}
      <Dialog open={isRecommendDialogOpen} onOpenChange={setIsRecommendDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Recommend {selectedItem?.title}</DialogTitle>
            <DialogDescription>
              Send a personalized recommendation to a student
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="student-name">Student Name</Label>
              <Input
                id="student-name"
                placeholder="Enter student name"
                value={recommendForm.studentName}
                onChange={(e) => setRecommendForm(prev => ({ ...prev, studentName: e.target.value }))}
              />
            </div>
            
            <div>
              <Label htmlFor="reason">Reason for Recommendation</Label>
              <Textarea
                id="reason"
                placeholder="Explain why this would be beneficial for the student..."
                value={recommendForm.reason}
                onChange={(e) => setRecommendForm(prev => ({ ...prev, reason: e.target.value }))}
              />
            </div>
            
            <div>
              <Label htmlFor="notes">Additional Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Any additional guidance or tips..."
                value={recommendForm.additionalNotes}
                onChange={(e) => setRecommendForm(prev => ({ ...prev, additionalNotes: e.target.value }))}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRecommendDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={submitRecommendation}
              disabled={!recommendForm.studentName || !recommendForm.reason}
            >
              <Send className="w-4 h-4 mr-2" />
              Send Recommendation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}