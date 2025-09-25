// Student Profile Generator

import {
    generateUUID,
    generateStudentId,
    generateCGPA,
    generatePhoneNumber,
    randomChoice,
    randomInt,
    formatDateForDB,
    randomPastDate,
    calculateSemester,
    isValidAcademicProgression,
    logProgress
} from '../utils';
import type {
    StudentInsert,
    UserInsert,
    DemoDataConfig,
    GenerationResult,
    Department
} from '../types';

/**
 * Department definitions with codes and full names
 */
export const DEPARTMENTS: Department[] = [
    { code: 'CS', name: 'Computer Science', fullName: 'Computer Science and Engineering' },
    { code: 'ECE', name: 'Electronics', fullName: 'Electronics and Communication Engineering' },
    { code: 'ME', name: 'Mechanical', fullName: 'Mechanical Engineering' },
    { code: 'CE', name: 'Civil', fullName: 'Civil Engineering' },
    { code: 'EE', name: 'Electrical', fullName: 'Electrical Engineering' },
    { code: 'IT', name: 'Information Technology', fullName: 'Information Technology' },
    { code: 'CHE', name: 'Chemical', fullName: 'Chemical Engineering' },
    { code: 'BT', name: 'Biotechnology', fullName: 'Biotechnology' },
    { code: 'AE', name: 'Aerospace', fullName: 'Aerospace Engineering' },
    { code: 'IE', name: 'Industrial', fullName: 'Industrial Engineering' }
];

/**
 * Academic year distribution (realistic university distribution)
 */
const YEAR_DISTRIBUTION = {
    1: 0.30, // 30% first year
    2: 0.28, // 28% second year  
    3: 0.25, // 25% third year
    4: 0.17  // 17% fourth year (some dropouts/delays)
};

/**
 * Department popularity distribution (based on typical engineering college enrollment)
 */
const DEPARTMENT_POPULARITY = {
    'CS': 0.25,   // 25% - Most popular
    'ECE': 0.20,  // 20% 
    'ME': 0.15,   // 15%
    'IT': 0.12,   // 12%
    'EE': 0.10,   // 10%
    'CE': 0.08,   // 8%
    'CHE': 0.04,  // 4%
    'BT': 0.03,   // 3%
    'AE': 0.02,   // 2%
    'IE': 0.01    // 1%
};

/**
 * Generate enrollment date based on current year
 */
function generateEnrollmentDate(currentYear: number): Date {
    const currentDate = new Date();
    const yearsAgo = currentYear - 1;

    // Academic year typically starts in July/August
    const enrollmentYear = currentDate.getFullYear() - yearsAgo;
    const enrollmentMonth = randomInt(7, 8); // July or August
    const enrollmentDay = randomInt(1, 15);

    return new Date(enrollmentYear, enrollmentMonth - 1, enrollmentDay);
}

/**
 * Calculate department distribution based on student count
 */
function calculateDepartmentDistribution(totalStudents: number): Record<string, number> {
    const distribution: Record<string, number> = {};
    let remaining = totalStudents;

    // Calculate based on popularity, ensuring each department gets at least 1 student
    for (const [deptCode, popularity] of Object.entries(DEPARTMENT_POPULARITY)) {
        if (remaining <= Object.keys(DEPARTMENT_POPULARITY).length - Object.keys(distribution).length) {
            // Ensure remaining departments get at least 1 student each
            distribution[deptCode] = 1;
            remaining--;
        } else {
            const count = Math.max(1, Math.floor(totalStudents * popularity));
            distribution[deptCode] = Math.min(count, remaining - (Object.keys(DEPARTMENT_POPULARITY).length - Object.keys(distribution).length - 1));
            remaining -= distribution[deptCode];
        }
    }

    // Distribute any remaining students to popular departments
    const popularDepts = ['CS', 'ECE', 'ME', 'IT'];
    let deptIndex = 0;
    while (remaining > 0) {
        distribution[popularDepts[deptIndex % popularDepts.length]]++;
        remaining--;
        deptIndex++;
    }

    return distribution;
}

/**
 * Calculate year distribution based on student count
 */
function calculateYearDistribution(totalStudents: number): Record<number, number> {
    const distribution: Record<number, number> = {};
    let remaining = totalStudents;

    for (const [year, percentage] of Object.entries(YEAR_DISTRIBUTION)) {
        const yearNum = parseInt(year);
        const count = Math.floor(totalStudents * percentage);
        distribution[yearNum] = count;
        remaining -= count;
    }

    // Distribute remaining students to years 2 and 3 (most common)
    const commonYears = [2, 3];
    let yearIndex = 0;
    while (remaining > 0) {
        distribution[commonYears[yearIndex % commonYears.length]]++;
        remaining--;
        yearIndex++;
    }

    return distribution;
}

/**
 * Generate a student profile for a specific user
 */
function generateStudentProfile(
    user: UserInsert,
    department: Department,
    year: number,
    firstName: string,
    lastName: string
): StudentInsert {
    const enrollmentDate = generateEnrollmentDate(year);
    const semester = calculateSemester(year, enrollmentDate);

    // Validate academic progression
    if (!isValidAcademicProgression(year, semester)) {
        // Fallback to valid semester
        const validSemester = (year - 1) * 2 + randomInt(1, 2);
        console.warn(`Invalid progression for year ${year}, semester ${semester}. Using ${validSemester}`);
    }

    const studentId = generateStudentId(department.code, new Date().getFullYear() - year + 1);
    const cgpa = generateCGPA(year);
    const phone = Math.random() > 0.3 ? generatePhoneNumber() : null; // 70% have phone numbers

    return {
        id: generateUUID(),
        user_id: user.id,
        student_id: studentId,
        first_name: firstName,
        last_name: lastName,
        department: department.fullName,
        year: year,
        semester: Math.min(semester, year * 2), // Ensure semester doesn't exceed year limit
        cgpa: cgpa,
        profile_image: null, // Will be populated later if needed
        phone: phone,
        created_at: formatDateForDB(enrollmentDate),
        updated_at: formatDateForDB(new Date())
    };
}

/**
 * Extract names from user email
 */
function extractNamesFromEmail(email: string): { firstName: string; lastName: string } {
    const username = email.split('@')[0];
    const nameParts = username.split('.');

    if (nameParts.length >= 2) {
        return {
            firstName: nameParts[0].charAt(0).toUpperCase() + nameParts[0].slice(1),
            lastName: nameParts[1].charAt(0).toUpperCase() + nameParts[1].slice(1)
        };
    }

    // Fallback if email format is unexpected
    return {
        firstName: username.charAt(0).toUpperCase() + username.slice(1),
        lastName: 'Student'
    };
}

/**
 * Main student generator class
 */
export class StudentGenerator {
    private config: DemoDataConfig;

    constructor(config: DemoDataConfig) {
        this.config = config;
    }

    /**
     * Generate student profiles from user accounts
     */
    async generateStudents(users: UserInsert[]): Promise<GenerationResult<StudentInsert>> {
        try {
            console.log('👨‍🎓 Generating student profiles...');

            // Filter only student users
            const studentUsers = users.filter(user => user.role === 'student');

            if (studentUsers.length === 0) {
                return {
                    success: false,
                    error: 'No student users provided',
                    count: 0
                };
            }

            console.log(`📊 Creating profiles for ${studentUsers.length} student users`);

            // Calculate distributions
            const departmentDistribution = calculateDepartmentDistribution(studentUsers.length);
            const yearDistribution = calculateYearDistribution(studentUsers.length);

            console.log('📈 Department distribution:', departmentDistribution);
            console.log('📈 Year distribution:', yearDistribution);

            const students: StudentInsert[] = [];
            const usedStudentIds = new Set<string>();

            // Create assignment arrays for fair distribution
            const departmentAssignments: string[] = [];
            const yearAssignments: number[] = [];

            // Build department assignments
            for (const [deptCode, count] of Object.entries(departmentDistribution)) {
                for (let i = 0; i < count; i++) {
                    departmentAssignments.push(deptCode);
                }
            }

            // Build year assignments
            for (const [year, count] of Object.entries(yearDistribution)) {
                for (let i = 0; i < count; i++) {
                    yearAssignments.push(parseInt(year));
                }
            }

            // Shuffle assignments for randomness
            for (let i = departmentAssignments.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [departmentAssignments[i], departmentAssignments[j]] = [departmentAssignments[j], departmentAssignments[i]];
            }

            for (let i = yearAssignments.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [yearAssignments[i], yearAssignments[j]] = [yearAssignments[j], yearAssignments[i]];
            }

            // Generate student profiles
            for (let i = 0; i < studentUsers.length; i++) {
                const user = studentUsers[i];
                const deptCode = departmentAssignments[i] || 'CS'; // Fallback to CS
                const year = yearAssignments[i] || 2; // Fallback to year 2

                const department = DEPARTMENTS.find(d => d.code === deptCode) || DEPARTMENTS[0];
                const { firstName, lastName } = extractNamesFromEmail(user.email);

                let student: StudentInsert;
                let attempts = 0;
                const maxAttempts = 10;

                // Ensure unique student IDs
                do {
                    student = generateStudentProfile(user, department, year, firstName, lastName);
                    attempts++;

                    if (attempts > maxAttempts) {
                        // If we can't generate a unique student ID, modify it
                        const timestamp = Date.now().toString().slice(-3);
                        student.student_id = `${student.student_id}${timestamp}`;
                        break;
                    }
                } while (usedStudentIds.has(student.student_id));

                usedStudentIds.add(student.student_id);
                students.push(student);

                // Log progress for large batches
                if (studentUsers.length > 10 && (i + 1) % Math.ceil(studentUsers.length / 10) === 0) {
                    logProgress('Generating student profiles', i + 1, studentUsers.length, student.student_id);
                }
            }

            // Validate generated data
            const validation = this.validateStudents(students);
            if (!validation.isValid) {
                return {
                    success: false,
                    error: `Student validation failed: ${validation.errors.join(', ')}`,
                    count: 0
                };
            }

            console.log(`✅ Generated ${students.length} student profiles successfully`);

            return {
                success: true,
                data: students,
                count: students.length
            };

        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error generating students',
                count: 0
            };
        }
    }

    /**
     * Validate generated student data
     */
    private validateStudents(students: StudentInsert[]): { isValid: boolean; errors: string[] } {
        const errors: string[] = [];
        const studentIdSet = new Set<string>();
        const userIdSet = new Set<string>();

        for (const student of students) {
            // Check required fields
            if (!student.id || !student.user_id || !student.student_id || !student.first_name || !student.last_name) {
                errors.push(`Student missing required fields: ${JSON.stringify(student)}`);
                continue;
            }

            // Check for duplicate student IDs
            if (studentIdSet.has(student.student_id)) {
                errors.push(`Duplicate student ID found: ${student.student_id}`);
            }
            studentIdSet.add(student.student_id);

            // Check for duplicate user IDs
            if (userIdSet.has(student.user_id)) {
                errors.push(`Duplicate user ID found: ${student.user_id}`);
            }
            userIdSet.add(student.user_id);

            // Validate academic progression
            if (!isValidAcademicProgression(student.year, student.semester)) {
                errors.push(`Invalid academic progression: Year ${student.year}, Semester ${student.semester}`);
            }

            // Validate CGPA range
            if (student.cgpa !== null && (student.cgpa < 0 || student.cgpa > 10)) {
                errors.push(`Invalid CGPA: ${student.cgpa} for student ${student.student_id}`);
            }

            // Validate year range
            if (student.year < 1 || student.year > 4) {
                errors.push(`Invalid year: ${student.year} for student ${student.student_id}`);
            }

            // Validate semester range
            if (student.semester < 1 || student.semester > 8) {
                errors.push(`Invalid semester: ${student.semester} for student ${student.student_id}`);
            }

            // Validate department
            const validDepartments = DEPARTMENTS.map(d => d.fullName);
            if (!validDepartments.includes(student.department)) {
                errors.push(`Invalid department: ${student.department} for student ${student.student_id}`);
            }
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    /**
     * Get statistics about generated students
     */
    getGenerationStats(students: StudentInsert[]): {
        total: number;
        byDepartment: Record<string, number>;
        byYear: Record<number, number>;
        averageCGPA: number;
        cgpaDistribution: { range: string; count: number }[];
    } {
        const stats = {
            total: students.length,
            byDepartment: {} as Record<string, number>,
            byYear: {} as Record<number, number>,
            averageCGPA: 0,
            cgpaDistribution: [] as { range: string; count: number }[]
        };

        let totalCGPA = 0;
        let cgpaCount = 0;
        const cgpaRanges = {
            '9.0-10.0': 0,
            '8.0-8.9': 0,
            '7.0-7.9': 0,
            '6.0-6.9': 0,
            'Below 6.0': 0
        };

        for (const student of students) {
            // Count by department
            stats.byDepartment[student.department] = (stats.byDepartment[student.department] || 0) + 1;

            // Count by year
            stats.byYear[student.year] = (stats.byYear[student.year] || 0) + 1;

            // Calculate CGPA statistics
            if (student.cgpa !== null) {
                totalCGPA += student.cgpa;
                cgpaCount++;

                // Categorize CGPA
                if (student.cgpa >= 9.0) cgpaRanges['9.0-10.0']++;
                else if (student.cgpa >= 8.0) cgpaRanges['8.0-8.9']++;
                else if (student.cgpa >= 7.0) cgpaRanges['7.0-7.9']++;
                else if (student.cgpa >= 6.0) cgpaRanges['6.0-6.9']++;
                else cgpaRanges['Below 6.0']++;
            }
        }

        stats.averageCGPA = cgpaCount > 0 ? parseFloat((totalCGPA / cgpaCount).toFixed(2)) : 0;
        stats.cgpaDistribution = Object.entries(cgpaRanges).map(([range, count]) => ({ range, count }));

        return stats;
    }
}

/**
 * Convenience function to generate students with users
 */
export async function generateDemoStudents(
    users: UserInsert[],
    config: DemoDataConfig
): Promise<GenerationResult<StudentInsert>> {
    const generator = new StudentGenerator(config);
    return await generator.generateStudents(users);
}

/**
 * Export utility functions for testing
 */
export {
    generateStudentProfile,
    extractNamesFromEmail,
    calculateDepartmentDistribution,
    calculateYearDistribution,
    generateEnrollmentDate,
    YEAR_DISTRIBUTION,
    DEPARTMENT_POPULARITY
};