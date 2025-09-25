// NAAC and NIRF compliance data structures and calculations
export interface NAACCriteria {
  id: string
  name: string
  weight: number
  maxScore: number
  currentScore: number
  subCriteria: {
    id: string
    name: string
    score: number
    maxScore: number
    evidence: string[]
  }[]
}

export interface NIRFParameter {
  id: string
  name: string
  weight: number
  score: number
  maxScore: number
  rank: number
  percentile: number
}

export interface ComplianceReport {
  id: string
  type: "NAAC" | "NIRF"
  generatedAt: string
  academicYear: string
  overallScore: number
  grade?: string
  rank?: number
  recommendations: string[]
}

export const mockNAACCriteria: NAACCriteria[] = [
  {
    id: "criteria1",
    name: "Curricular Aspects",
    weight: 15,
    maxScore: 100,
    currentScore: 85,
    subCriteria: [
      {
        id: "1.1",
        name: "Curriculum Planning and Implementation",
        score: 88,
        maxScore: 100,
        evidence: ["Curriculum documents", "Academic calendar", "Course outcomes"],
      },
      {
        id: "1.2",
        name: "Academic Flexibility",
        score: 82,
        maxScore: 100,
        evidence: ["Choice-based credit system", "Interdisciplinary programs"],
      },
    ],
  },
  {
    id: "criteria2",
    name: "Teaching-Learning and Evaluation",
    weight: 30,
    maxScore: 100,
    currentScore: 78,
    subCriteria: [
      {
        id: "2.1",
        name: "Student Enrollment and Profile",
        score: 80,
        maxScore: 100,
        evidence: ["Admission data", "Student diversity metrics"],
      },
      {
        id: "2.2",
        name: "Student Teacher Ratio",
        score: 76,
        maxScore: 100,
        evidence: ["Faculty data", "Student enrollment data"],
      },
    ],
  },
  {
    id: "criteria3",
    name: "Research, Innovations and Extension",
    weight: 25,
    maxScore: 100,
    currentScore: 72,
    subCriteria: [
      {
        id: "3.1",
        name: "Research Publications",
        score: 75,
        maxScore: 100,
        evidence: ["Publication database", "Citation metrics"],
      },
      {
        id: "3.2",
        name: "Research Funding",
        score: 69,
        maxScore: 100,
        evidence: ["Grant records", "Funding database"],
      },
    ],
  },
  {
    id: "criteria4",
    name: "Infrastructure and Learning Resources",
    weight: 15,
    maxScore: 100,
    currentScore: 88,
    subCriteria: [
      {
        id: "4.1",
        name: "Physical Facilities",
        score: 90,
        maxScore: 100,
        evidence: ["Infrastructure audit", "Facility utilization data"],
      },
      {
        id: "4.2",
        name: "Library and Information Resources",
        score: 86,
        maxScore: 100,
        evidence: ["Library statistics", "Digital resource access"],
      },
    ],
  },
  {
    id: "criteria5",
    name: "Student Support and Progression",
    weight: 15,
    maxScore: 100,
    currentScore: 82,
    subCriteria: [
      {
        id: "5.1",
        name: "Student Support Services",
        score: 84,
        maxScore: 100,
        evidence: ["Support program data", "Student feedback"],
      },
      {
        id: "5.2",
        name: "Student Progression",
        score: 80,
        maxScore: 100,
        evidence: ["Placement data", "Higher education progression"],
      },
    ],
  },
]

export const mockNIRFParameters: NIRFParameter[] = [
  {
    id: "tlr",
    name: "Teaching, Learning & Resources",
    weight: 30,
    score: 75.5,
    maxScore: 100,
    rank: 45,
    percentile: 85,
  },
  {
    id: "rpc",
    name: "Research and Professional Practice",
    weight: 30,
    score: 68.2,
    maxScore: 100,
    rank: 52,
    percentile: 78,
  },
  {
    id: "go",
    name: "Graduation Outcomes",
    weight: 20,
    score: 82.1,
    maxScore: 100,
    rank: 38,
    percentile: 88,
  },
  {
    id: "oi",
    name: "Outreach and Inclusivity",
    weight: 10,
    score: 71.8,
    maxScore: 100,
    rank: 41,
    percentile: 82,
  },
  {
    id: "pr",
    name: "Perception",
    weight: 10,
    score: 79.3,
    maxScore: 100,
    rank: 43,
    percentile: 84,
  },
]

export function calculateNAACGrade(score: number): string {
  if (score >= 3.51) return "A++"
  if (score >= 3.26) return "A+"
  if (score >= 3.01) return "A"
  if (score >= 2.76) return "B++"
  if (score >= 2.51) return "B+"
  if (score >= 2.01) return "B"
  if (score >= 1.51) return "C"
  return "D"
}

export function calculateOverallNAACScore(criteria: NAACCriteria[]): number {
  const weightedSum = criteria.reduce((sum, criterion) => {
    return sum + (criterion.currentScore * criterion.weight) / 100
  }, 0)
  return weightedSum / 25 // Convert to 4-point scale
}

export function calculateNIRFScore(parameters: NIRFParameter[]): number {
  return parameters.reduce((sum, param) => {
    return sum + (param.score * param.weight) / 100
  }, 0)
}

export function generateRecommendations(type: "NAAC" | "NIRF", data: any): string[] {
  if (type === "NAAC") {
    return [
      "Enhance research publication quality and quantity",
      "Improve student-teacher ratio through faculty recruitment",
      "Strengthen industry collaboration and internship programs",
      "Upgrade digital infrastructure and learning management systems",
      "Implement comprehensive student feedback mechanisms",
    ]
  } else {
    return [
      "Focus on improving research output and citations",
      "Enhance placement rates and salary packages",
      "Strengthen alumni network and industry connections",
      "Improve faculty qualifications and research productivity",
      "Expand outreach programs and social impact initiatives",
    ]
  }
}
