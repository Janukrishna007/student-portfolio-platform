// AI-powered achievement categorization and point assignment system

export interface CategoryPrediction {
  category: string
  subcategory?: string
  confidence: number
  suggestedPoints: number
  reasoning: string
}

export interface AchievementAnalysis {
  predictions: CategoryPrediction[]
  recommendedCategory: CategoryPrediction
  keywords: string[]
  complexity: "low" | "medium" | "high"
  impact: "local" | "regional" | "national" | "international"
}

// Mock AI categorization service - in real app, this would call actual AI models
export class AICategorization {
  private categoryKeywords = {
    academic: {
      keywords: [
        "grade",
        "gpa",
        "cgpa",
        "scholarship",
        "dean",
        "honor",
        "academic",
        "study",
        "course",
        "exam",
        "topper",
      ],
      subcategories: ["academic excellence", "scholarship", "honors", "dean's list"],
    },
    certification: {
      keywords: [
        "certificate",
        "certification",
        "certified",
        "aws",
        "google",
        "microsoft",
        "cisco",
        "oracle",
        "course completion",
      ],
      subcategories: ["cloud computing", "programming", "data science", "cybersecurity", "project management"],
    },
    competition: {
      keywords: [
        "competition",
        "contest",
        "hackathon",
        "prize",
        "winner",
        "champion",
        "tournament",
        "olympiad",
        "coding",
      ],
      subcategories: ["programming", "design", "innovation", "sports", "debate", "quiz"],
    },
    internship: {
      keywords: [
        "internship",
        "intern",
        "training",
        "industrial",
        "company",
        "corporate",
        "work experience",
        "placement",
      ],
      subcategories: ["software development", "research", "marketing", "finance", "engineering"],
    },
    leadership: {
      keywords: [
        "leader",
        "president",
        "captain",
        "head",
        "coordinator",
        "organizer",
        "volunteer",
        "council",
        "committee",
      ],
      subcategories: ["student government", "club leadership", "event management", "community service"],
    },
    project: {
      keywords: [
        "project",
        "development",
        "built",
        "created",
        "designed",
        "implemented",
        "application",
        "system",
        "website",
      ],
      subcategories: ["software development", "research project", "innovation", "prototype"],
    },
    publication: {
      keywords: ["published", "paper", "research", "journal", "conference", "article", "ieee", "acm", "springer"],
      subcategories: ["research paper", "conference paper", "journal article", "book chapter"],
    },
    extracurricular: {
      keywords: ["club", "society", "cultural", "sports", "music", "dance", "drama", "art", "volunteer", "community"],
      subcategories: ["cultural activities", "sports", "community service", "clubs and societies"],
    },
  }

  private pointsMatrix = {
    academic: { low: 50, medium: 75, high: 100 },
    certification: { low: 50, medium: 70, high: 90 },
    competition: { low: 60, medium: 80, high: 100 },
    internship: { low: 45, medium: 65, high: 85 },
    leadership: { low: 55, medium: 75, high: 95 },
    project: { low: 40, medium: 60, high: 80 },
    publication: { low: 60, medium: 90, high: 120 },
    extracurricular: { low: 30, medium: 50, high: 70 },
  }

  async analyzeAchievement(title: string, description: string): Promise<AchievementAnalysis> {
    const text = `${title} ${description}`.toLowerCase()
    const words = text.split(/\s+/)

    // Extract keywords
    const foundKeywords: string[] = []
    const categoryScores: Record<string, number> = {}

    // Calculate category scores based on keyword matching
    Object.entries(this.categoryKeywords).forEach(([category, data]) => {
      let score = 0
      data.keywords.forEach((keyword) => {
        if (text.includes(keyword.toLowerCase())) {
          score += 1
          foundKeywords.push(keyword)
        }
      })
      categoryScores[category] = score
    })

    // Determine complexity based on description length and keywords
    const complexity = this.determineComplexity(description, foundKeywords)

    // Determine impact based on keywords
    const impact = this.determineImpact(text)

    // Generate predictions for top categories
    const predictions: CategoryPrediction[] = Object.entries(categoryScores)
      .filter(([, score]) => score > 0)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([category, score]) => {
        const confidence = Math.min(score * 0.3 + 0.4, 0.95)
        const subcategory = this.suggestSubcategory(category, text)
        const suggestedPoints = this.calculatePoints(category, complexity, impact)

        return {
          category,
          subcategory,
          confidence,
          suggestedPoints,
          reasoning: this.generateReasoning(category, foundKeywords, complexity, impact),
        }
      })

    // If no strong matches, provide default categorization
    if (predictions.length === 0) {
      predictions.push({
        category: "extracurricular",
        confidence: 0.5,
        suggestedPoints: 40,
        reasoning: "Default categorization based on general achievement pattern",
      })
    }

    return {
      predictions,
      recommendedCategory: predictions[0],
      keywords: foundKeywords,
      complexity,
      impact,
    }
  }

  private determineComplexity(description: string, keywords: string[]): "low" | "medium" | "high" {
    const length = description.length
    const keywordCount = keywords.length

    if (length > 200 || keywordCount > 5) return "high"
    if (length > 100 || keywordCount > 3) return "medium"
    return "low"
  }

  private determineImpact(text: string): "local" | "regional" | "national" | "international" {
    if (text.includes("international") || text.includes("global") || text.includes("world")) return "international"
    if (text.includes("national") || text.includes("india") || text.includes("country")) return "national"
    if (text.includes("state") || text.includes("regional") || text.includes("zone")) return "regional"
    return "local"
  }

  private suggestSubcategory(category: string, text: string): string | undefined {
    const categoryData = this.categoryKeywords[category as keyof typeof this.categoryKeywords]
    if (!categoryData) return undefined

    for (const subcategory of categoryData.subcategories) {
      if (text.includes(subcategory.toLowerCase())) {
        return subcategory
      }
    }

    // Return first subcategory as default
    return categoryData.subcategories[0]
  }

  private calculatePoints(
    category: string,
    complexity: "low" | "medium" | "high",
    impact: "local" | "regional" | "national" | "international",
  ): number {
    const basePoints = this.pointsMatrix[category as keyof typeof this.pointsMatrix]?.[complexity] || 50

    // Apply impact multiplier
    const impactMultiplier = {
      local: 1.0,
      regional: 1.1,
      national: 1.25,
      international: 1.5,
    }

    return Math.round(basePoints * impactMultiplier[impact])
  }

  private generateReasoning(category: string, keywords: string[], complexity: string, impact: string): string {
    const reasons = []

    if (keywords.length > 0) {
      reasons.push(`Keywords detected: ${keywords.slice(0, 3).join(", ")}`)
    }

    reasons.push(`Complexity: ${complexity}`)
    reasons.push(`Impact level: ${impact}`)

    const categoryReasons = {
      academic: "Related to academic performance and educational excellence",
      certification: "Professional certification or skill validation",
      competition: "Competitive achievement demonstrating excellence",
      internship: "Professional work experience and industry exposure",
      leadership: "Leadership role or organizational responsibility",
      project: "Creative or technical project development",
      publication: "Research contribution and knowledge dissemination",
      extracurricular: "Non-academic activity contributing to overall development",
    }

    reasons.unshift(categoryReasons[category as keyof typeof categoryReasons] || "General achievement")

    return reasons.join(". ")
  }
}

export const aiCategorization = new AICategorization()
