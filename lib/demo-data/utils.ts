// Demo Data Generation Utilities

import { randomUUID } from "crypto";

/**
 * Generate a random UUID compatible with Supabase
 */
export function generateUUID(): string {
    return randomUUID();
}

/**
 * Generate a random number between min and max (inclusive)
 */
export function randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generate a random float between min and max
 */
export function randomFloat(min: number, max: number, decimals: number = 2): number {
    const value = Math.random() * (max - min) + min;
    return parseFloat(value.toFixed(decimals));
}

/**
 * Pick a random element from an array
 */
export function randomChoice<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
}

/**
 * Pick multiple random elements from an array without replacement
 */
export function randomChoices<T>(array: T[], count: number): T[] {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, array.length));
}

/**
 * Shuffle an array using Fisher-Yates algorithm
 */
export function shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

/**
 * Generate a random date between two dates
 */
export function randomDate(start: Date, end: Date): Date {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

/**
 * Generate a random date in the past (within specified days)
 */
export function randomPastDate(maxDaysAgo: number): Date {
    const now = new Date();
    const pastDate = new Date(now.getTime() - Math.random() * maxDaysAgo * 24 * 60 * 60 * 1000);
    return pastDate;
}

/**
 * Generate a random date in the future (within specified days)
 */
export function randomFutureDate(maxDaysAhead: number): Date {
    const now = new Date();
    const futureDate = new Date(now.getTime() + Math.random() * maxDaysAhead * 24 * 60 * 60 * 1000);
    return futureDate;
}

/**
 * Format date for database insertion (ISO string)
 */
export function formatDateForDB(date: Date): string {
    return date.toISOString();
}

/**
 * Format date for database date field (YYYY-MM-DD)
 */
export function formatDateOnly(date: Date): string {
    return date.toISOString().split('T')[0];
}

/**
 * Generate a random phone number
 */
export function generatePhoneNumber(): string {
    const areaCode = randomInt(200, 999);
    const exchange = randomInt(200, 999);
    const number = randomInt(1000, 9999);
    return `+1-${areaCode}-${exchange}-${number}`;
}

/**
 * Generate a random email address
 */
export function generateEmail(firstName: string, lastName: string, domain: string = "university.edu"): string {
    const username = `${firstName.toLowerCase()}.${lastName.toLowerCase()}`;
    return `${username}@${domain}`;
}

/**
 * Generate a student ID with department prefix
 */
export function generateStudentId(departmentCode: string, year: number): string {
    const yearSuffix = year.toString();
    const sequence = randomInt(1, 999).toString().padStart(3, '0');
    return `${departmentCode}${yearSuffix}${sequence}`;
}

/**
 * Generate an employee ID
 */
export function generateEmployeeId(prefix: string = "FAC"): string {
    const sequence = randomInt(1, 999).toString().padStart(3, '0');
    return `${prefix}${sequence}`;
}

/**
 * Generate a random CGPA (Grade Point Average)
 */
export function generateCGPA(year: number): number {
    // Higher years tend to have slightly better CGPAs
    const baseMin = 6.0 + (year - 1) * 0.2;
    const baseMax = 9.5 + (year - 1) * 0.1;
    return randomFloat(baseMin, Math.min(baseMax, 10.0), 2);
}

/**
 * Generate a random URL
 */
export function generateURL(baseUrl: string, path?: string): string {
    const randomPath = path || generateUUID().substring(0, 8);
    return `${baseUrl}/${randomPath}`;
}

/**
 * Generate a QR code URL (placeholder)
 */
export function generateQRCodeURL(data: string): string {
    // In a real implementation, this would generate an actual QR code
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(data)}`;
}

/**
 * Calculate academic semester based on year and current date
 */
export function calculateSemester(year: number, enrollmentDate: Date): number {
    const now = new Date();
    const monthsSinceEnrollment = (now.getTime() - enrollmentDate.getTime()) / (1000 * 60 * 60 * 24 * 30);
    const semestersSinceEnrollment = Math.floor(monthsSinceEnrollment / 6);
    return Math.min((year - 1) * 2 + 1 + semestersSinceEnrollment, year * 2);
}

/**
 * Validate academic year and semester combination
 */
export function isValidAcademicProgression(year: number, semester: number): boolean {
    const minSemester = (year - 1) * 2 + 1;
    const maxSemester = year * 2;
    return semester >= minSemester && semester <= maxSemester;
}

/**
 * Generate a realistic timeline for certificates based on academic progression
 */
export function generateCertificateTimeline(enrollmentDate: Date, currentYear: number): Date[] {
    const timeline: Date[] = [];
    const now = new Date();

    // Generate dates spread across the academic journey
    for (let year = 1; year <= currentYear; year++) {
        const yearStart = new Date(enrollmentDate);
        yearStart.setFullYear(yearStart.getFullYear() + year - 1);

        const yearEnd = new Date(yearStart);
        yearEnd.setFullYear(yearEnd.getFullYear() + 1);

        // Don't generate future dates
        const endDate = yearEnd > now ? now : yearEnd;

        if (yearStart < endDate) {
            timeline.push(randomDate(yearStart, endDate));
        }
    }

    return timeline.sort((a, b) => a.getTime() - b.getTime());
}

/**
 * Calculate confidence score for AI-generated data
 */
export function generateConfidenceScore(): number {
    // Generate a confidence score between 0.7 and 0.95 (realistic AI confidence range)
    return randomFloat(0.70, 0.95, 2);
}

/**
 * Calculate relevance score for recommendations
 */
export function calculateRelevanceScore(studentSkills: string[], requiredSkills: string[]): number {
    if (requiredSkills.length === 0) return 0.5;

    const matchingSkills = studentSkills.filter(skill =>
        requiredSkills.some(required =>
            required.toLowerCase().includes(skill.toLowerCase()) ||
            skill.toLowerCase().includes(required.toLowerCase())
        )
    );

    const baseScore = matchingSkills.length / requiredSkills.length;
    // Add some randomness to make it more realistic
    const randomFactor = randomFloat(0.8, 1.2);
    return Math.min(baseScore * randomFactor, 1.0);
}

/**
 * Generate a batch of UUIDs
 */
export function generateUUIDBatch(count: number): string[] {
    return Array.from({ length: count }, () => generateUUID());
}

/**
 * Create a delay for demonstration purposes
 */
export function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Log generation progress
 */
export function logProgress(stage: string, completed: number, total: number, item?: string): void {
    const percentage = Math.round((completed / total) * 100);
    const itemText = item ? ` (${item})` : '';
    console.log(`[${stage}] ${completed}/${total} (${percentage}%)${itemText}`);
}

/**
 * Validate required fields in an object
 */
export function validateRequiredFields<T extends Record<string, any>>(
    obj: T,
    requiredFields: (keyof T)[]
): { isValid: boolean; missingFields: string[] } {
    const missingFields = requiredFields.filter(field =>
        obj[field] === undefined || obj[field] === null || obj[field] === ''
    );

    return {
        isValid: missingFields.length === 0,
        missingFields: missingFields.map(field => String(field))
    };
}

/**
 * Clean and normalize text data
 */
export function normalizeText(text: string): string {
    return text.trim().replace(/\s+/g, ' ');
}

/**
 * Generate a realistic description based on keywords
 */
export function generateDescription(keywords: string[], minLength: number = 50): string {
    const templates = [
        "A comprehensive program focusing on {keywords} with practical applications and industry-relevant skills.",
        "Advanced training in {keywords} designed to enhance professional capabilities and career prospects.",
        "Specialized certification covering {keywords} with hands-on experience and real-world projects.",
        "In-depth study of {keywords} combining theoretical knowledge with practical implementation.",
        "Professional development program emphasizing {keywords} and their applications in modern industry."
    ];

    const template = randomChoice(templates);
    const keywordText = keywords.slice(0, 3).join(', ');
    let description = template.replace('{keywords}', keywordText);

    // Ensure minimum length
    while (description.length < minLength) {
        description += " This program provides valuable insights and practical experience.";
    }

    return normalizeText(description);
}