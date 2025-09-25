"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Loader2, Brain, Sparkles } from "lucide-react"
import { aiCategorization, type AchievementAnalysis } from "@/lib/ai-categorization"

interface AchievementAnalyzerProps {
  onAnalysisComplete?: (analysis: AchievementAnalysis) => void
}

export function AchievementAnalyzer({ onAnalysisComplete }: AchievementAnalyzerProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [analysis, setAnalysis] = useState<AchievementAnalysis | null>(null)
  const [analyzing, setAnalyzing] = useState(false)

  const handleAnalyze = async () => {
    if (!title.trim() || !description.trim()) return

    setAnalyzing(true)
    try {
      // Simulate AI processing delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const result = await aiCategorization.analyzeAchievement(title, description)
      setAnalysis(result)
      onAnalysisComplete?.(result)
    } catch (error) {
      console.error("Analysis failed:", error)
    } finally {
      setAnalyzing(false)
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return "text-green-600 dark:text-green-400"
    if (confidence >= 0.6) return "text-yellow-600 dark:text-yellow-400"
    return "text-red-600 dark:text-red-400"
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "international":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
      case "national":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "regional":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            AI Achievement Analyzer
          </CardTitle>
          <CardDescription>Let AI analyze and categorize your achievement automatically</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ai-title">Achievement Title</Label>
            <Input
              id="ai-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., First Prize in National Coding Competition"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ai-description">Achievement Description</Label>
            <Textarea
              id="ai-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide detailed description of your achievement..."
              rows={4}
            />
          </div>

          <Button
            onClick={handleAnalyze}
            disabled={!title.trim() || !description.trim() || analyzing}
            className="w-full"
          >
            {analyzing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analyzing Achievement...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Analyze with AI
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {analysis && (
        <Card>
          <CardHeader>
            <CardTitle>AI Analysis Results</CardTitle>
            <CardDescription>AI-powered categorization and recommendations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Recommended Category */}
            <div className="p-4 bg-primary/5 rounded-lg border-l-4 border-l-primary">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-lg">Recommended Category</h3>
                <Badge className="capitalize">{analysis.recommendedCategory.category}</Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                <div>
                  <div className="text-sm text-muted-foreground">Confidence</div>
                  <div className={`font-bold ${getConfidenceColor(analysis.recommendedCategory.confidence)}`}>
                    {Math.round(analysis.recommendedCategory.confidence * 100)}%
                  </div>
                  <Progress value={analysis.recommendedCategory.confidence * 100} className="mt-1 h-2" />
                </div>

                <div>
                  <div className="text-sm text-muted-foreground">Suggested Points</div>
                  <div className="font-bold text-primary">{analysis.recommendedCategory.suggestedPoints}</div>
                </div>

                <div>
                  <div className="text-sm text-muted-foreground">Subcategory</div>
                  <div className="font-medium capitalize">{analysis.recommendedCategory.subcategory || "General"}</div>
                </div>
              </div>

              <div className="text-sm text-muted-foreground">
                <strong>Reasoning:</strong> {analysis.recommendedCategory.reasoning}
              </div>
            </div>

            {/* Alternative Predictions */}
            {analysis.predictions.length > 1 && (
              <div>
                <h3 className="font-semibold mb-3">Alternative Categories</h3>
                <div className="space-y-3">
                  {analysis.predictions.slice(1).map((prediction, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline" className="capitalize">
                          {prediction.category}
                        </Badge>
                        <div className="flex items-center gap-2">
                          <span className={`text-sm ${getConfidenceColor(prediction.confidence)}`}>
                            {Math.round(prediction.confidence * 100)}%
                          </span>
                          <span className="text-sm font-medium">{prediction.suggestedPoints} pts</span>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">{prediction.reasoning}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Analysis Insights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-3">Analysis Insights</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Complexity Level</span>
                    <Badge variant="outline" className="capitalize">
                      {analysis.complexity}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Impact Scope</span>
                    <Badge className={getImpactColor(analysis.impact)}>{analysis.impact}</Badge>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Detected Keywords</h3>
                <div className="flex flex-wrap gap-1">
                  {analysis.keywords.slice(0, 8).map((keyword, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {keyword}
                    </Badge>
                  ))}
                  {analysis.keywords.length > 8 && (
                    <Badge variant="secondary" className="text-xs">
                      +{analysis.keywords.length - 8} more
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
