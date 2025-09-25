// Database types and interfaces for the student achievement platform

export interface User {
  id: string
  email: string
  role: "student" | "faculty" | "admin"
  created_at: string
  updated_at: string
}

export interface Student {
  id: string
  user_id: string
  student_id: string
  first_name: string
  last_name: string
  department: string
  year: number
  semester: number
  cgpa?: number
  profile_image?: string
  phone?: string
  created_at: string
  updated_at: string
}

export interface Faculty {
  id: string
  user_id: string
  employee_id: string
  first_name: string
  last_name: string
  department: string
  designation: string
  created_at: string
  updated_at: string
}

export interface Achievement {
  id: string
  student_id: string
  title: string
  description: string
  category:
    | "academic"
    | "extracurricular"
    | "certification"
    | "internship"
    | "leadership"
    | "project"
    | "competition"
    | "publication"
  subcategory?: string
  date_achieved: string
  verification_status: "pending" | "approved" | "rejected"
  verified_by?: string
  verification_date?: string
  documents?: string[]
  points: number
  metadata?: Record<string, any>
  created_at: string
  updated_at: string
}

export interface Certificate {
  id: string
  student_id: string
  title: string
  issuer: string
  issue_date: string
  certificate_url?: string
  category: "academic" | "professional" | "skill" | "achievement"
  status: "pending" | "verified" | "rejected"
  created_at: string
  updated_at: string
}

export interface Portfolio {
  id: string
  student_id: string
  title: string
  description?: string
  is_public: boolean
  qr_code?: string
  template: "modern" | "classic" | "minimal" | "academic"
  custom_sections?: Record<string, any>
  created_at: string
  updated_at: string
}

export interface ApprovalWorkflow {
  id: string
  achievement_id: string
  faculty_id: string
  status: "pending" | "approved" | "rejected" | "needs_revision"
  comments?: string
  reviewed_at?: string
  created_at: string
  updated_at: string
}

export interface Institution {
  id: string
  name: string
  code: string
  type: "university" | "college" | "institute"
  address: string
  contact_email: string
  contact_phone: string
  logo?: string
  settings: Record<string, any>
  created_at: string
  updated_at: string
}

export interface Analytics {
  id: string
  institution_id: string
  metric_type: "student_achievements" | "faculty_approvals" | "portfolio_views" | "compliance_score"
  metric_value: number
  period: string
  metadata?: Record<string, any>
  created_at: string
}

export interface ComplianceReport {
  id: string
  institution_id: string
  report_type: "naac" | "nirf" | "custom"
  academic_year: string
  data: Record<string, any>
  generated_by: string
  generated_at: string
  status: "draft" | "final" | "submitted"
}
