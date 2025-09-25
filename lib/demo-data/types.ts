// Demo Data Generation Types and Interfaces

import type { Database } from "../supabase";

// Type aliases for easier use
export type UserInsert = Database["public"]["Tables"]["users"]["Insert"];
export type StudentInsert = Database["public"]["Tables"]["students"]["Insert"];
export type FacultyInsert = Database["public"]["Tables"]["faculty"]["Insert"];
export type CertificateInsert = Database["public"]["Tables"]["certificates"]["Insert"];
export type SkillInsert = Database["public"]["Tables"]["skills"]["Insert"];
export type PortfolioInsert = Database["public"]["Tables"]["portfolios"]["Insert"];
export type ReviewInsert = Database["public"]["Tables"]["reviews"]["Insert"];
export type RecommendationInsert = Database["public"]["Tables"]["recommendations"]["Insert"];
export type AnalyticsInsert = Database["public"]["Tables"]["analytics"]["Insert"];

// Demo data generation configuration
export interface DemoDataConfig {
    studentCount: number;
    facultyCount: number;
    certificatesPerStudent: {
        min: number;
        max: number;
    };
    skillsPerStudent: {
        min: number;
        max: number;
    };
    recommendationsPerStudent: {
        min: number;
        max: number;
    };
    verificationRate: number; // Percentage of certificates that should be verified
    publicPortfolioRate: number; // Percentage of portfolios that should be public
}

// Default configuration
export const DEFAULT_DEMO_CONFIG: DemoDataConfig = {
    studentCount: 12,
    facultyCount: 6,
    certificatesPerStudent: { min: 3, max: 8 },
    skillsPerStudent: { min: 5, max: 15 },
    recommendationsPerStudent: { min: 3, max: 6 },
    verificationRate: 0.7, // 70% verified
    publicPortfolioRate: 0.6, // 60% public
};

// Data generation result types
export interface GenerationResult<T> {
    success: boolean;
    data?: T[];
    error?: string;
    count?: number;
}

export interface DemoDataGenerationResult {
    users: GenerationResult<UserInsert>;
    students: GenerationResult<StudentInsert>;
    faculty: GenerationResult<FacultyInsert>;
    certificates: GenerationResult<CertificateInsert>;
    skills: GenerationResult<SkillInsert>;
    portfolios: GenerationResult<PortfolioInsert>;
    reviews: GenerationResult<ReviewInsert>;
    recommendations: GenerationResult<RecommendationInsert>;
    analytics: GenerationResult<AnalyticsInsert>;
    totalRecords: number;
    generationTime: number; // in milliseconds
}

// Department and academic data types
export interface Department {
    code: string;
    name: string;
    fullName: string;
}

export interface AcademicYear {
    year: number;
    semester: number;
    isValid: boolean;
}

// Certificate and skill mapping types
export interface CertificateTemplate {
    title: string;
    issuer: string;
    category: "academic" | "professional" | "skill" | "achievement";
    departments: string[]; // Which departments this certificate is relevant for
    yearLevels: number[]; // Which academic years this certificate is appropriate for
    skills: string[]; // Skills that can be extracted from this certificate
    duration?: number; // How long the certificate is valid (in months)
}

export interface SkillTemplate {
    name: string;
    category: "technical" | "soft" | "domain";
    relatedCertificates: string[]; // Certificate titles that typically include this skill
    proficiencyByYear: {
        [year: number]: "beginner" | "intermediate" | "advanced";
    };
}

// Company and job data types
export interface CompanyTemplate {
    name: string;
    industry: string;
    size: "startup" | "small" | "medium" | "large" | "enterprise";
    locations: string[];
}

export interface JobTemplate {
    title: string;
    company: string;
    type: "job" | "internship";
    requiredSkills: string[];
    departments: string[]; // Which departments this job is relevant for
    experienceLevel: "entry" | "mid" | "senior";
}

// Analytics data types
export interface AnalyticsTemplate {
    reportType: "naac" | "nirf" | "department" | "student_progress";
    dataStructure: Record<string, any>;
    periodType: "monthly" | "quarterly" | "yearly";
}

// Generation progress tracking
export interface GenerationProgress {
    stage: string;
    completed: number;
    total: number;
    currentItem?: string;
    errors: string[];
}

// Validation types
export interface ValidationRule<T> {
    field: keyof T;
    validator: (value: any) => boolean;
    errorMessage: string;
}

export interface DataValidationResult {
    isValid: boolean;
    errors: string[];
    warnings: string[];
}