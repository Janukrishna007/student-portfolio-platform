// Faculty Profile Generator

import {
    generateUUID,
    generateEmployeeId,
    generatePhoneNumber,
    randomChoice,
    randomInt,
    formatDateForDB,
    logProgress
} from '../utils';
import { DEPARTMENTS } from './student-generator';
import type {
    FacultyInsert,
    UserInsert,
    DemoDataConfig,
    GenerationResult,
    Department
} from '../types';

/**
 * Faculty designation hierarchy with experience requirements
 */
export const FACULTY_DESIGNATIONS = [
    { title: 'Assistant Professor', minExperience: 0, maxExperience: 8, weight: 0.50 },
    { title: 'Associate Professor', minExperience: 5, maxExperience: 15, weight: 0.30 },
    { title: 'Professor', minExperience: 10, maxExperience: 35, weight: 0.15 },
    { title: 'Head of Department', minExperience: 8, maxExperience: 30, weight: 0.03 },
    { title: 'Dean', minExperience: 15, maxExperience: 35, weight: 0.02 }
];

/**
 * Faculty name pools (more formal/professional names)
 */
const FACULTY_FIRST_NAMES = {
    male: [
        'Rajesh', 'Suresh', 'Mahesh', 'Ramesh', 'Dinesh', 'Mukesh', 'Naresh', 'Hitesh',
        'Anil', 'Sunil', 'Kapil', 'Nitin', 'Ajay', 'Vijay', 'Sanjay', 'Manoj',
        'Ashok', 'Vinod', 'Pramod', 'Subhash', 'Prakash', 'Akash', 'Aakash', 'Vikash',
        'Ravi', 'Kavi', 'Devi', 'Shiv', 'Ram', 'Shyam', 'Ghanshyam', 'Balram',
        'Mohan', 'Sohan', 'Rohan', 'Gohan', 'Krishna', 'Govind', 'Arvind', 'Anand',
        'Chandra', 'Surya', 'Aditya', 'Arjun', 'Bharat', 'Vikram', 'Param', 'Uttam'
    ],
    female: [
        'Sunita', 'Anita', 'Geeta', 'Seeta', 'Meera', 'Veera', 'Hira', 'Mira',
        'Kavita', 'Savita', 'Lalita', 'Mamta', 'Samta', 'Shanta', 'Kanta', 'Sushma',
        'Rekha', 'Lekha', 'Radha', 'Sudha', 'Vidya', 'Divya', 'Priya', 'Maya',
        'Usha', 'Asha', 'Nisha', 'Disha', 'Ritu', 'Situ', 'Mitu', 'Kitu',
        'Sushila', 'Kamala', 'Vimala', 'Nirmala', 'Sharmila', 'Pramila', 'Urmila', 'Leela',
        'Saraswati', 'Bharati', 'Gayatri', 'Savitri', 'Sandhya', 'Vandana', 'Archana', 'Kalpana'
    ]
};

const FACULTY_LAST_NAMES = [
    'Sharma', 'Verma', 'Gupta', 'Singh', 'Kumar', 'Agarwal', 'Jain', 'Bansal',
    'Agrawal', 'Goyal', 'Mittal', 'Jindal', 'Garg', 'Chopra', 'Malhotra', 'Arora',
    'Kapoor', 'Bhatia', 'Sethi', 'Khanna', 'Sood', 'Anand', 'Bhalla', 'Chadha',
    'Dua', 'Gill', 'Khurana', 'Lal', 'Mehra', 'Nair', 'Oberoi', 'Pandey',
    'Rao', 'Reddy', 'Sinha', 'Tiwari', 'Yadav', 'Chandra', 'Das', 'Ghosh',
    'Iyer', 'Joshi', 'Kaul', 'Lata', 'Menon', 'Naik', 'Oak', 'Patil',
    'Qureshi', 'Rajan', 'Saxena', 'Tandon', 'Upadhyay', 'Varma', 'Walia', 'Xavier'
];

/**
 * Academic titles and prefixes
 */
const ACADEMIC_TITLES = ['Dr.', 'Prof.', 'Prof. Dr.'];

/**
 * Department distribution for faculty (some departments need more faculty)
 */
const FACULTY_DEPARTMENT_DISTRIBUTION = {
    'CS': 0.22,   // 22% - High demand
    'ECE': 0.18,  // 18%
    'ME': 0.15,   // 15%
    'IT': 0.12,   // 12%
    'EE': 0.10,   // 10%
    'CE': 0.08,   // 8%
    'CHE': 0.06,  // 6%
    'BT': 0.04,   // 4%
    'AE': 0.03,   // 3%
    'IE': 0.02    // 2%
};

/**
 * Generate a realistic faculty name with title
 */
function generateFacultyName(): { fullName: string; firstName: string; lastName: string } {
    const gender = randomChoice(['male', 'female']);
    const firstName = randomChoice(FACULTY_FIRST_NAMES[gender]);
    const lastName = randomChoice(FACULTY_LAST_NAMES);

    // 80% of faculty have academic titles
    const hasTitle = Math.random() < 0.8;
    const title = hasTitle ? randomChoice(ACADEMIC_TITLES) : '';

    const fullName = title ? `${title} ${firstName} ${lastName}` : `${firstName} ${lastName}`;

    return { fullName, firstName, lastName };
}

/**
 * Calculate faculty department distribution
 */
function calculateFacultyDepartmentDistribution(totalFaculty: number): Record<string, number> {
    const distribution: Record<string, number> = {};
    let remaining = totalFaculty;

    // Calculate based on distribution, ensuring each department gets at least 1 faculty
    for (const [deptCode, percentage] of Object.entries(FACULTY_DEPARTMENT_DISTRIBUTION)) {
        if (remaining <= Object.keys(FACULTY_DEPARTMENT_DISTRIBUTION).length - Object.keys(distribution).length) {
            // Ensure remaining departments get at least 1 faculty each
            distribution[deptCode] = 1;
            remaining--;
        } else {
            const count = Math.max(1, Math.floor(totalFaculty * percentage));
            distribution[deptCode] = Math.min(count, remaining - (Object.keys(FACULTY_DEPARTMENT_DISTRIBUTION).length - Object.keys(distribution).length - 1));
            remaining -= distribution[deptCode];
        }
    }

    // Distribute any remaining faculty to popular departments
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
 * Calculate designation distribution based on faculty count
 */
function calculateDesignationDistribution(totalFaculty: number): Record<string, number> {
    const distribution: Record<string, number> = {};
    let remaining = totalFaculty;

    for (const designation of FACULTY_DESIGNATIONS) {
        const count = Math.floor(totalFaculty * designation.weight);
        distribution[designation.title] = count;
        remaining -= count;
    }

    // Distribute remaining faculty to Assistant Professor (most common)
    distribution['Assistant Professor'] += remaining;

    return distribution;
}

/**
 * Generate a faculty profile for a specific user
 */
function generateFacultyProfile(
    user: UserInsert,
    department: Department,
    designation: string
): FacultyInsert {
    const { fullName, firstName, lastName } = generateFacultyName();
    const employeeId = generateEmployeeId('FAC');
    const phone = Math.random() > 0.1 ? generatePhoneNumber() : null; // 90% have phone numbers

    return {
        id: generateUUID(),
        user_id: user.id,
        employee_id: employeeId,
        name: fullName,
        department: department.fullName,
        designation: designation,
        avatar_url: null, // Will be populated later if needed
        phone: phone,
        created_at: formatDateForDB(new Date())
    };
}

/**
 * Extract name from user email (for faculty)
 */
function extractFacultyNameFromEmail(email: string): { firstName: string; lastName: string } {
    const username = email.split('@')[0];

    // Handle "prof.lastname" format
    if (username.startsWith('prof.')) {
        const lastName = username.replace('prof.', '');
        return {
            firstName: 'Professor',
            lastName: lastName.charAt(0).toUpperCase() + lastName.slice(1)
        };
    }

    // Handle "dr.lastname" format
    if (username.startsWith('dr.')) {
        const lastName = username.replace('dr.', '');
        return {
            firstName: 'Dr.',
            lastName: lastName.charAt(0).toUpperCase() + lastName.slice(1)
        };
    }

    // Handle "firstname.lastname" format
    const nameParts = username.split('.');
    if (nameParts.length >= 2) {
        return {
            firstName: nameParts[0].charAt(0).toUpperCase() + nameParts[0].slice(1),
            lastName: nameParts[1].charAt(0).toUpperCase() + nameParts[1].slice(1)
        };
    }

    // Fallback
    return {
        firstName: username.charAt(0).toUpperCase() + username.slice(1),
        lastName: 'Faculty'
    };
}

/**
 * Main faculty generator class
 */
export class FacultyGenerator {
    private config: DemoDataConfig;

    constructor(config: DemoDataConfig) {
        this.config = config;
    }

    /**
     * Generate faculty profiles from user accounts
     */
    async generateFaculty(users: UserInsert[]): Promise<GenerationResult<FacultyInsert>> {
        try {
            console.log('👨‍🏫 Generating faculty profiles...');

            // Filter only faculty users
            const facultyUsers = users.filter(user => user.role === 'faculty');

            if (facultyUsers.length === 0) {
                return {
                    success: false,
                    error: 'No faculty users provided',
                    count: 0
                };
            }

            console.log(`📊 Creating profiles for ${facultyUsers.length} faculty users`);

            // Calculate distributions
            const departmentDistribution = calculateFacultyDepartmentDistribution(facultyUsers.length);
            const designationDistribution = calculateDesignationDistribution(facultyUsers.length);

            console.log('📈 Department distribution:', departmentDistribution);
            console.log('📈 Designation distribution:', designationDistribution);

            const faculty: FacultyInsert[] = [];
            const usedEmployeeIds = new Set<string>();

            // Create assignment arrays for fair distribution
            const departmentAssignments: string[] = [];
            const designationAssignments: string[] = [];

            // Build department assignments
            for (const [deptCode, count] of Object.entries(departmentDistribution)) {
                for (let i = 0; i < count; i++) {
                    departmentAssignments.push(deptCode);
                }
            }

            // Build designation assignments
            for (const [designation, count] of Object.entries(designationDistribution)) {
                for (let i = 0; i < count; i++) {
                    designationAssignments.push(designation);
                }
            }

            // Shuffle assignments for randomness
            for (let i = departmentAssignments.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [departmentAssignments[i], departmentAssignments[j]] = [departmentAssignments[j], departmentAssignments[i]];
            }

            for (let i = designationAssignments.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [designationAssignments[i], designationAssignments[j]] = [designationAssignments[j], designationAssignments[i]];
            }

            // Generate faculty profiles
            for (let i = 0; i < facultyUsers.length; i++) {
                const user = facultyUsers[i];
                const deptCode = departmentAssignments[i] || 'CS'; // Fallback to CS
                const designation = designationAssignments[i] || 'Assistant Professor'; // Fallback

                const department = DEPARTMENTS.find(d => d.code === deptCode) || DEPARTMENTS[0];

                let facultyMember: FacultyInsert;
                let attempts = 0;
                const maxAttempts = 10;

                // Ensure unique employee IDs
                do {
                    facultyMember = generateFacultyProfile(user, department, designation);
                    attempts++;

                    if (attempts > maxAttempts) {
                        // If we can't generate a unique employee ID, modify it
                        const timestamp = Date.now().toString().slice(-3);
                        facultyMember.employee_id = `${facultyMember.employee_id}${timestamp}`;
                        break;
                    }
                } while (usedEmployeeIds.has(facultyMember.employee_id));

                usedEmployeeIds.add(facultyMember.employee_id);
                faculty.push(facultyMember);

                // Log progress for large batches
                if (facultyUsers.length > 5 && (i + 1) % Math.ceil(facultyUsers.length / 5) === 0) {
                    logProgress('Generating faculty profiles', i + 1, facultyUsers.length, facultyMember.employee_id);
                }
            }

            // Validate generated data
            const validation = this.validateFaculty(faculty);
            if (!validation.isValid) {
                return {
                    success: false,
                    error: `Faculty validation failed: ${validation.errors.join(', ')}`,
                    count: 0
                };
            }

            console.log(`✅ Generated ${faculty.length} faculty profiles successfully`);

            return {
                success: true,
                data: faculty,
                count: faculty.length
            };

        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error generating faculty',
                count: 0
            };
        }
    }

    /**
     * Validate generated faculty data
     */
    private validateFaculty(faculty: FacultyInsert[]): { isValid: boolean; errors: string[] } {
        const errors: string[] = [];
        const employeeIdSet = new Set<string>();
        const userIdSet = new Set<string>();

        for (const facultyMember of faculty) {
            // Check required fields
            if (!facultyMember.id || !facultyMember.user_id || !facultyMember.employee_id || !facultyMember.name) {
                errors.push(`Faculty missing required fields: ${JSON.stringify(facultyMember)}`);
                continue;
            }

            // Check for duplicate employee IDs
            if (employeeIdSet.has(facultyMember.employee_id)) {
                errors.push(`Duplicate employee ID found: ${facultyMember.employee_id}`);
            }
            employeeIdSet.add(facultyMember.employee_id);

            // Check for duplicate user IDs
            if (userIdSet.has(facultyMember.user_id)) {
                errors.push(`Duplicate user ID found: ${facultyMember.user_id}`);
            }
            userIdSet.add(facultyMember.user_id);

            // Validate department
            const validDepartments = DEPARTMENTS.map(d => d.fullName);
            if (!validDepartments.includes(facultyMember.department)) {
                errors.push(`Invalid department: ${facultyMember.department} for faculty ${facultyMember.employee_id}`);
            }

            // Validate designation
            const validDesignations = FACULTY_DESIGNATIONS.map(d => d.title);
            if (!validDesignations.includes(facultyMember.designation)) {
                errors.push(`Invalid designation: ${facultyMember.designation} for faculty ${facultyMember.employee_id}`);
            }

            // Validate employee ID format
            if (!facultyMember.employee_id.startsWith('FAC')) {
                errors.push(`Invalid employee ID format: ${facultyMember.employee_id}`);
            }
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    /**
     * Get statistics about generated faculty
     */
    getGenerationStats(faculty: FacultyInsert[]): {
        total: number;
        byDepartment: Record<string, number>;
        byDesignation: Record<string, number>;
        phoneNumberCoverage: number;
    } {
        const stats = {
            total: faculty.length,
            byDepartment: {} as Record<string, number>,
            byDesignation: {} as Record<string, number>,
            phoneNumberCoverage: 0
        };

        let phoneCount = 0;

        for (const facultyMember of faculty) {
            // Count by department
            stats.byDepartment[facultyMember.department] = (stats.byDepartment[facultyMember.department] || 0) + 1;

            // Count by designation
            stats.byDesignation[facultyMember.designation] = (stats.byDesignation[facultyMember.designation] || 0) + 1;

            // Count phone numbers
            if (facultyMember.phone) {
                phoneCount++;
            }
        }

        stats.phoneNumberCoverage = faculty.length > 0 ? parseFloat((phoneCount / faculty.length * 100).toFixed(1)) : 0;

        return stats;
    }
}

/**
 * Convenience function to generate faculty with users
 */
export async function generateDemoFaculty(
    users: UserInsert[],
    config: DemoDataConfig
): Promise<GenerationResult<FacultyInsert>> {
    const generator = new FacultyGenerator(config);
    return await generator.generateFaculty(users);
}

/**
 * Export utility functions for testing
 */
export {
    generateFacultyProfile,
    generateFacultyName,
    extractFacultyNameFromEmail,
    calculateFacultyDepartmentDistribution,
    calculateDesignationDistribution,
    FACULTY_DESIGNATIONS,
    FACULTY_FIRST_NAMES,
    FACULTY_LAST_NAMES,
    FACULTY_DEPARTMENT_DISTRIBUTION
};