// User and Authentication Data Generator

import {
    generateUUID,
    generateEmail,
    randomChoice,
    formatDateForDB,
    logProgress
} from '../utils';
import type {
    UserInsert,
    DemoDataConfig,
    GenerationResult
} from '../types';

/**
 * Name pools for generating realistic user names
 */
const FIRST_NAMES = {
    male: [
        'Aarav', 'Arjun', 'Aditya', 'Ankit', 'Abhishek', 'Akash', 'Amit', 'Aman',
        'Rohit', 'Rahul', 'Ravi', 'Raj', 'Rohan', 'Rishabh', 'Rajesh', 'Ramesh',
        'Vikash', 'Vikas', 'Vivek', 'Vinay', 'Varun', 'Vishal', 'Vimal', 'Vijay',
        'Sanjay', 'Suresh', 'Sandeep', 'Shubham', 'Shivam', 'Sachin', 'Sumit', 'Sagar',
        'Deepak', 'Dinesh', 'Dev', 'Dhruv', 'Darshan', 'Dhanush', 'Daksh', 'Divyansh',
        'Harsh', 'Himanshu', 'Hardik', 'Hitesh', 'Hemant', 'Harshal', 'Hrithik', 'Hriday',
        'Karan', 'Kartik', 'Kunal', 'Krishna', 'Krish', 'Kshitij', 'Kabir', 'Kamal',
        'Manish', 'Mohit', 'Mayank', 'Mukesh', 'Manoj', 'Manan', 'Madhav', 'Milan',
        'Nikhil', 'Naman', 'Naveen', 'Nitesh', 'Neeraj', 'Nakul', 'Nitin', 'Nishant',
        'Pradeep', 'Pranav', 'Pawan', 'Prakash', 'Piyush', 'Parth', 'Priyank', 'Pulkit'
    ],
    female: [
        'Aadhya', 'Ananya', 'Aisha', 'Aditi', 'Anjali', 'Arya', 'Avni', 'Akshara',
        'Riya', 'Rhea', 'Radhika', 'Rashi', 'Ritika', 'Rashmi', 'Rekha', 'Renu',
        'Vani', 'Vidya', 'Varsha', 'Veena', 'Vandana', 'Vaishnavi', 'Vrinda', 'Vibha',
        'Sneha', 'Shruti', 'Swati', 'Sunita', 'Suman', 'Shweta', 'Simran', 'Sakshi',
        'Deepika', 'Divya', 'Diya', 'Damini', 'Devika', 'Diksha', 'Durga', 'Drishti',
        'Harsha', 'Hema', 'Hiral', 'Hina', 'Heena', 'Himani', 'Hritika', 'Hansika',
        'Kavya', 'Kirti', 'Komal', 'Kiran', 'Kajal', 'Kanchan', 'Kalpana', 'Kamala',
        'Meera', 'Maya', 'Manisha', 'Madhuri', 'Meenal', 'Megha', 'Monika', 'Minal',
        'Nisha', 'Neha', 'Nikita', 'Nidhi', 'Namrata', 'Naina', 'Navya', 'Neerja',
        'Priya', 'Pooja', 'Preeti', 'Pallavi', 'Payal', 'Poonam', 'Pragya', 'Prachi'
    ]
};

const LAST_NAMES = [
    'Sharma', 'Verma', 'Gupta', 'Singh', 'Kumar', 'Agarwal', 'Jain', 'Bansal',
    'Agrawal', 'Goyal', 'Mittal', 'Jindal', 'Garg', 'Chopra', 'Malhotra', 'Arora',
    'Kapoor', 'Bhatia', 'Sethi', 'Khanna', 'Sood', 'Anand', 'Bhalla', 'Chadha',
    'Dua', 'Gill', 'Khurana', 'Lal', 'Mehra', 'Nair', 'Oberoi', 'Pandey',
    'Rao', 'Reddy', 'Sinha', 'Tiwari', 'Yadav', 'Chandra', 'Das', 'Ghosh',
    'Iyer', 'Joshi', 'Kaul', 'Lata', 'Menon', 'Naik', 'Oak', 'Patil',
    'Qureshi', 'Rajan', 'Saxena', 'Tandon', 'Upadhyay', 'Varma', 'Walia', 'Xavier'
];

/**
 * Email domain patterns for different user roles
 */
const EMAIL_DOMAINS = {
    student: 'university.edu',
    faculty: 'university.edu',
    admin: 'admin.university.edu'
};

/**
 * User role distribution configuration
 */
interface RoleDistribution {
    student: number;
    faculty: number;
    admin: number;
}

/**
 * Generate a realistic full name
 */
function generateFullName(): { firstName: string; lastName: string; fullName: string } {
    const gender = randomChoice(['male', 'female']);
    const firstName = randomChoice(FIRST_NAMES[gender]);
    const lastName = randomChoice(LAST_NAMES);
    const fullName = `${firstName} ${lastName}`;

    return { firstName, lastName, fullName };
}

/**
 * Calculate role distribution based on total count and percentages
 */
function calculateRoleDistribution(totalUsers: number, config: DemoDataConfig): RoleDistribution {
    const totalRoles = totalUsers;

    // Calculate based on typical university distribution
    const studentCount = Math.floor(totalRoles * 0.80); // 80% students
    const facultyCount = Math.floor(totalRoles * 0.15); // 15% faculty
    const adminCount = totalRoles - studentCount - facultyCount; // Remaining as admin

    return {
        student: studentCount,
        faculty: facultyCount,
        admin: Math.max(adminCount, 1) // Ensure at least 1 admin
    };
}

/**
 * Generate user data for a specific role
 */
function generateUserForRole(role: 'student' | 'faculty' | 'admin'): UserInsert {
    const { firstName, lastName } = generateFullName();
    const userId = generateUUID();
    const email = generateEmail(firstName, lastName, EMAIL_DOMAINS[role]);
    const now = new Date();

    return {
        id: userId,
        email: email,
        role: role,
        created_at: formatDateForDB(now),
        updated_at: formatDateForDB(now)
    };
}

/**
 * Generate a batch of users for a specific role
 */
function generateUsersForRole(role: 'student' | 'faculty' | 'admin', count: number): UserInsert[] {
    const users: UserInsert[] = [];
    const usedEmails = new Set<string>();

    for (let i = 0; i < count; i++) {
        let user: UserInsert;
        let attempts = 0;
        const maxAttempts = 10;

        // Ensure unique emails
        do {
            user = generateUserForRole(role);
            attempts++;

            if (attempts > maxAttempts) {
                // If we can't generate a unique email, modify the existing one
                const timestamp = Date.now().toString().slice(-4);
                user.email = user.email.replace('@', `${timestamp}@`);
                break;
            }
        } while (usedEmails.has(user.email));

        usedEmails.add(user.email);
        users.push(user);

        // Log progress for large batches
        if (count > 10 && (i + 1) % Math.ceil(count / 10) === 0) {
            logProgress(`Generating ${role} users`, i + 1, count);
        }
    }

    return users;
}

/**
 * Main user generator class
 */
export class UserGenerator {
    private config: DemoDataConfig;

    constructor(config: DemoDataConfig) {
        this.config = config;
    }

    /**
     * Generate all users based on configuration
     */
    async generateUsers(): Promise<GenerationResult<UserInsert>> {
        try {
            console.log('👥 Generating user accounts...');

            // Calculate total users needed (students + faculty + admin)
            const totalUsers = this.config.studentCount + this.config.facultyCount + 2; // +2 for admin accounts

            // Calculate role distribution
            const roleDistribution = calculateRoleDistribution(totalUsers, this.config);

            console.log(`📊 Role distribution: ${roleDistribution.student} students, ${roleDistribution.faculty} faculty, ${roleDistribution.admin} admin`);

            const allUsers: UserInsert[] = [];

            // Generate students
            if (roleDistribution.student > 0) {
                console.log(`👨‍🎓 Generating ${roleDistribution.student} student accounts...`);
                const students = generateUsersForRole('student', roleDistribution.student);
                allUsers.push(...students);
            }

            // Generate faculty
            if (roleDistribution.faculty > 0) {
                console.log(`👨‍🏫 Generating ${roleDistribution.faculty} faculty accounts...`);
                const faculty = generateUsersForRole('faculty', roleDistribution.faculty);
                allUsers.push(...faculty);
            }

            // Generate admin
            if (roleDistribution.admin > 0) {
                console.log(`👨‍💼 Generating ${roleDistribution.admin} admin accounts...`);
                const admins = generateUsersForRole('admin', roleDistribution.admin);
                allUsers.push(...admins);
            }

            // Validate generated data
            const validation = this.validateUsers(allUsers);
            if (!validation.isValid) {
                return {
                    success: false,
                    error: `User validation failed: ${validation.errors.join(', ')}`,
                    count: 0
                };
            }

            console.log(`✅ Generated ${allUsers.length} user accounts successfully`);

            return {
                success: true,
                data: allUsers,
                count: allUsers.length
            };

        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error generating users',
                count: 0
            };
        }
    }

    /**
     * Generate users for a specific role only
     */
    async generateUsersForSpecificRole(
        role: 'student' | 'faculty' | 'admin',
        count: number
    ): Promise<GenerationResult<UserInsert>> {
        try {
            console.log(`👥 Generating ${count} ${role} accounts...`);

            const users = generateUsersForRole(role, count);

            // Validate generated data
            const validation = this.validateUsers(users);
            if (!validation.isValid) {
                return {
                    success: false,
                    error: `User validation failed: ${validation.errors.join(', ')}`,
                    count: 0
                };
            }

            console.log(`✅ Generated ${users.length} ${role} accounts successfully`);

            return {
                success: true,
                data: users,
                count: users.length
            };

        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : `Unknown error generating ${role} users`,
                count: 0
            };
        }
    }

    /**
     * Validate generated user data
     */
    private validateUsers(users: UserInsert[]): { isValid: boolean; errors: string[] } {
        const errors: string[] = [];
        const emailSet = new Set<string>();
        const idSet = new Set<string>();

        for (const user of users) {
            // Check required fields
            if (!user.id || !user.email || !user.role) {
                errors.push(`User missing required fields: ${JSON.stringify(user)}`);
                continue;
            }

            // Check for duplicate emails
            if (emailSet.has(user.email)) {
                errors.push(`Duplicate email found: ${user.email}`);
            }
            emailSet.add(user.email);

            // Check for duplicate IDs
            if (idSet.has(user.id)) {
                errors.push(`Duplicate ID found: ${user.id}`);
            }
            idSet.add(user.id);

            // Validate email format
            if (!user.email.includes('@') || !user.email.includes('.')) {
                errors.push(`Invalid email format: ${user.email}`);
            }

            // Validate role
            if (!['student', 'faculty', 'admin'].includes(user.role)) {
                errors.push(`Invalid role: ${user.role}`);
            }

            // Validate UUID format
            const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
            if (!uuidRegex.test(user.id)) {
                errors.push(`Invalid UUID format: ${user.id}`);
            }
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    /**
     * Get statistics about generated users
     */
    getGenerationStats(users: UserInsert[]): {
        total: number;
        byRole: Record<string, number>;
        emailDomains: Record<string, number>;
    } {
        const stats = {
            total: users.length,
            byRole: {} as Record<string, number>,
            emailDomains: {} as Record<string, number>
        };

        for (const user of users) {
            // Count by role
            stats.byRole[user.role] = (stats.byRole[user.role] || 0) + 1;

            // Count by email domain
            const domain = user.email.split('@')[1];
            stats.emailDomains[domain] = (stats.emailDomains[domain] || 0) + 1;
        }

        return stats;
    }
}

/**
 * Convenience function to generate users with default configuration
 */
export async function generateDemoUsers(config: DemoDataConfig): Promise<GenerationResult<UserInsert>> {
    const generator = new UserGenerator(config);
    return await generator.generateUsers();
}

/**
 * Export utility functions for testing
 */
export {
    generateFullName,
    generateUserForRole,
    calculateRoleDistribution,
    FIRST_NAMES,
    LAST_NAMES,
    EMAIL_DOMAINS
};