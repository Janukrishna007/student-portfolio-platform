// Mock data for development and testing
import type { User, Student, Faculty, Achievement, Institution, ApprovalWorkflow } from "./types"

export const mockUsers: User[] = [
  {
    id: "1",
    email: "john.doe@university.edu",
    role: "student",
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    email: "prof.smith@university.edu",
    role: "faculty",
    created_at: "2024-01-10T09:00:00Z",
    updated_at: "2024-01-10T09:00:00Z",
  },
  {
    id: "3",
    email: "admin@university.edu",
    role: "admin",
    created_at: "2024-01-01T08:00:00Z",
    updated_at: "2024-01-01T08:00:00Z",
  },
]

export const mockStudents: Student[] = [
  {
    id: "1",
    user_id: "1",
    student_id: "CS2021001",
    first_name: "John",
    last_name: "Doe",
    department: "Computer Science",
    year: 3,
    semester: 6,
    cgpa: 8.5,
    phone: "+91-9876543210",
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T10:00:00Z",
  },
]

export const mockFaculty: Faculty[] = [
  {
    id: "1",
    user_id: "2",
    employee_id: "FAC001",
    first_name: "Dr. Sarah",
    last_name: "Smith",
    department: "Computer Science",
    designation: "Professor",
    created_at: "2024-01-10T09:00:00Z",
    updated_at: "2024-01-10T09:00:00Z",
  },
]

export const mockAchievements: Achievement[] = [
  {
    id: "1",
    student_id: "1",
    title: "First Prize in National Coding Competition",
    description: "Won first place in the National Level Coding Competition organized by TechFest 2024",
    category: "competition",
    subcategory: "programming",
    date_achieved: "2024-03-15",
    verification_status: "approved",
    verified_by: "1",
    verification_date: "2024-03-20T10:00:00Z",
    points: 100,
    created_at: "2024-03-16T10:00:00Z",
    updated_at: "2024-03-20T10:00:00Z",
  },
  {
    id: "2",
    student_id: "1",
    title: "AWS Cloud Practitioner Certification",
    description: "Successfully completed AWS Cloud Practitioner certification",
    category: "certification",
    subcategory: "cloud computing",
    date_achieved: "2024-02-10",
    verification_status: "approved",
    verified_by: "1",
    verification_date: "2024-02-15T10:00:00Z",
    points: 75,
    created_at: "2024-02-11T10:00:00Z",
    updated_at: "2024-02-15T10:00:00Z",
  },
  {
    id: "3",
    student_id: "1",
    title: "Summer Internship at Tech Corp",
    description: "Completed 8-week summer internship as Software Development Intern",
    category: "internship",
    subcategory: "software development",
    date_achieved: "2024-07-30",
    verification_status: "pending",
    points: 80,
    created_at: "2024-08-01T10:00:00Z",
    updated_at: "2024-08-01T10:00:00Z",
  },
]

export const mockPendingAchievements: Achievement[] = [
  {
    id: "4",
    student_id: "1",
    title: "Google Cloud Professional Certificate",
    description: "Completed Google Cloud Professional Cloud Architect certification program",
    category: "certification",
    subcategory: "cloud architecture",
    date_achieved: "2024-08-15",
    verification_status: "pending",
    points: 85,
    created_at: "2024-08-16T10:00:00Z",
    updated_at: "2024-08-16T10:00:00Z",
  },
  {
    id: "5",
    student_id: "1",
    title: "Research Paper Publication",
    description: 'Published research paper on "Machine Learning Applications in Healthcare" in IEEE Conference',
    category: "publication",
    subcategory: "research",
    date_achieved: "2024-07-20",
    verification_status: "pending",
    points: 120,
    created_at: "2024-07-21T10:00:00Z",
    updated_at: "2024-07-21T10:00:00Z",
  },
  {
    id: "6",
    student_id: "1",
    title: "Student Council President",
    description: "Elected as Student Council President for academic year 2024-25",
    category: "leadership",
    subcategory: "student government",
    date_achieved: "2024-06-01",
    verification_status: "pending",
    points: 100,
    created_at: "2024-06-02T10:00:00Z",
    updated_at: "2024-06-02T10:00:00Z",
  },
]

export const mockApprovalWorkflows: ApprovalWorkflow[] = [
  {
    id: "1",
    achievement_id: "3",
    faculty_id: "1",
    status: "pending" as const,
    comments: "",
    created_at: "2024-08-01T10:00:00Z",
    updated_at: "2024-08-01T10:00:00Z",
  },
  {
    id: "2",
    achievement_id: "1",
    faculty_id: "1",
    status: "approved" as const,
    comments: "Excellent achievement! Well documented with proper certificates.",
    reviewed_at: "2024-03-20T10:00:00Z",
    created_at: "2024-03-16T10:00:00Z",
    updated_at: "2024-03-20T10:00:00Z",
  },
]

export const mockInstitution: Institution = {
  id: "1",
  name: "University of Excellence",
  code: "UOE",
  type: "university",
  address: "123 Education Street, Knowledge City, State 123456",
  contact_email: "info@university.edu",
  contact_phone: "+91-11-12345678",
  settings: {
    achievement_points: {
      academic: { high: 100, medium: 75, low: 50 },
      extracurricular: { high: 80, medium: 60, low: 40 },
      certification: { high: 90, medium: 70, low: 50 },
      internship: { high: 85, medium: 65, low: 45 },
      leadership: { high: 95, medium: 75, low: 55 },
      competition: { high: 100, medium: 80, low: 60 },
    },
  },
  created_at: "2024-01-01T00:00:00Z",
  updated_at: "2024-01-01T00:00:00Z",
}

export const mockAnalytics = {
  overview: {
    totalStudents: 2847,
    totalFaculty: 156,
    totalAchievements: 8934,
    pendingApprovals: 234,
    monthlyGrowth: {
      students: 12.5,
      achievements: 18.3,
      approvals: -5.2,
    },
  },
  achievements: {
    byCategory: {
      academic: 2456,
      certification: 1823,
      competition: 1234,
      internship: 987,
      leadership: 756,
      project: 1234,
      publication: 344,
      extracurricular: 1100,
    },
    byMonth: [
      { month: "Jan", count: 234, approved: 198 },
      { month: "Feb", count: 267, approved: 223 },
      { month: "Mar", count: 298, approved: 245 },
      { month: "Apr", count: 312, approved: 267 },
      { month: "May", count: 289, approved: 234 },
      { month: "Jun", count: 345, approved: 298 },
      { month: "Jul", count: 378, approved: 321 },
      { month: "Aug", count: 423, approved: 356 },
    ],
    topPerformers: [
      { studentId: "CS2021001", name: "John Doe", achievements: 23, points: 1890 },
      { studentId: "EE2021045", name: "Sarah Johnson", achievements: 19, points: 1654 },
      { studentId: "ME2020123", name: "Raj Patel", achievements: 17, points: 1432 },
    ],
  },
  compliance: {
    naac: {
      score: 3.2,
      maxScore: 4.0,
      criteria: {
        "Curricular Aspects": { score: 3.4, weight: 150 },
        "Teaching-Learning": { score: 3.1, weight: 300 },
        "Research & Innovation": { score: 3.0, weight: 300 },
        Infrastructure: { score: 3.3, weight: 100 },
        "Student Support": { score: 3.5, weight: 100 },
        Governance: { score: 3.2, weight: 50 },
      },
    },
    nirf: {
      rank: 87,
      score: 52.34,
      parameters: {
        "Teaching Learning": { score: 28.45, weight: 30 },
        "Research & Professional Practice": { score: 15.67, weight: 30 },
        "Graduation Outcomes": { score: 18.23, weight: 20 },
        "Outreach & Inclusivity": { score: 12.89, weight: 10 },
        Perception: { score: 8.76, weight: 10 },
      },
    },
  },
  departments: [
    { name: "Computer Science", students: 456, achievements: 1234, avgPoints: 67.8 },
    { name: "Electronics", students: 389, achievements: 987, avgPoints: 62.3 },
    { name: "Mechanical", students: 423, achievements: 876, avgPoints: 58.9 },
    { name: "Civil", students: 367, achievements: 654, avgPoints: 55.2 },
    { name: "Chemical", students: 234, achievements: 432, avgPoints: 61.7 },
  ],
}
