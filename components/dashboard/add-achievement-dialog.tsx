"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Achievement } from "@/lib/types"
import { AchievementAnalyzer } from "@/components/ai/achievement-analyzer"
import type { AchievementAnalysis } from "@/lib/ai-categorization"

interface AddAchievementDialogProps {
  onAdd: (achievement: Achievement) => void
}

export function AddAchievementDialog({ onAdd }: AddAchievementDialogProps) {
  const [open, setOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("manual")
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    subcategory: "",
    date_achieved: "",
    points: 0,
  })

  const categories = [
    { value: "academic", label: "Academic Excellence" },
    { value: "certification", label: "Certification" },
    { value: "competition", label: "Competition" },
    { value: "internship", label: "Internship" },
    { value: "leadership", label: "Leadership" },
    { value: "project", label: "Project" },
    { value: "extracurricular", label: "Extracurricular" },
    { value: "publication", label: "Publication" },
  ]

  const handleAIAnalysis = (analysis: AchievementAnalysis) => {
    const recommended = analysis.recommendedCategory
    setFormData((prev) => ({
      ...prev,
      category: recommended.category,
      subcategory: recommended.subcategory || "",
      points: recommended.suggestedPoints,
    }))
    setActiveTab("manual")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newAchievement: Achievement = {
      id: Date.now().toString(),
      student_id: "1", // Mock student ID
      title: formData.title,
      description: formData.description,
      category: formData.category as Achievement["category"],
      subcategory: formData.subcategory || undefined,
      date_achieved: formData.date_achieved,
      verification_status: "pending",
      points: formData.points,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    onAdd(newAchievement)
    setOpen(false)
    setFormData({
      title: "",
      description: "",
      category: "",
      subcategory: "",
      date_achieved: "",
      points: 0,
    })
    setActiveTab("manual")
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Achievement</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Achievement</DialogTitle>
          <DialogDescription>
            Record a new achievement for verification and inclusion in your portfolio.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="ai">AI-Powered</TabsTrigger>
            <TabsTrigger value="manual">Manual Entry</TabsTrigger>
          </TabsList>

          <TabsContent value="ai" className="space-y-4">
            <AchievementAnalyzer onAnalysisComplete={handleAIAnalysis} />
          </TabsContent>

          <TabsContent value="manual" className="space-y-4">
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Achievement Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., First Prize in National Coding Competition"
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Provide details about your achievement..."
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData({ ...formData, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="subcategory">Subcategory (Optional)</Label>
                    <Input
                      id="subcategory"
                      value={formData.subcategory}
                      onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                      placeholder="e.g., Programming, Cloud Computing"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="date">Date Achieved</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date_achieved}
                      onChange={(e) => setFormData({ ...formData, date_achieved: e.target.value })}
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="points">Points</Label>
                    <Input
                      id="points"
                      type="number"
                      value={formData.points}
                      onChange={(e) => setFormData({ ...formData, points: Number.parseInt(e.target.value) || 0 })}
                      placeholder="75"
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add Achievement</Button>
              </DialogFooter>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
