// Infrastructure Validation Script
// Run this to verify that the demo data generation infrastructure is working correctly

import {
    generateUUID,
    randomInt,
    generateEmail,
    generateStudentId,
    generateCGPA,
    DemoDataDatabase,
    DEFAULT_DEMO_CONFIG,
    UserGenerator,
    generateDemoUsers,
    StudentGenerator,
    generateDemoStudents,
    FacultyGenerator,
    generateDemoFaculty
} from './index';

/**
 * Validate that all utility functions are working correctly
 */
async function validateUtilities(): Promise<boolean> {
    console.log('🔧 Validating utility functions...');

    try {
        // Test UUID generation
        const uuid = generateUUID();
        if (!uuid || typeof uuid !== 'string' || uuid.length !== 36) {
            throw new Error('UUID generation failed');
        }
        console.log('✅ UUID generation working');

        // Test random number generation
        const randomNum = randomInt(1, 100);
        if (randomNum < 1 || randomNum > 100) {
            throw new Error('Random number generation failed');
        }
        console.log('✅ Random number generation working');

        // Test email generation
        const email = generateEmail('John', 'Doe');
        if (!email.includes('@') || !email.includes('john.doe')) {
            throw new Error('Email generation failed');
        }
        console.log('✅ Email generation working');

        // Test student ID generation
        const studentId = generateStudentId('CS', 2021);
        if (!studentId.startsWith('CS2021')) {
            throw new Error('Student ID generation failed');
        }
        console.log('✅ Student ID generation working');

        // Test CGPA generation
        const cgpa = generateCGPA(3);
        if (cgpa < 6.0 || cgpa > 10.0) {
            throw new Error('CGPA generation failed');
        }
        console.log('✅ CGPA generation working');

        return true;
    } catch (error) {
        console.error('❌ Utility validation failed:', error);
        return false;
    }
}

/**
 * Validate database connection and basic operations
 */
async function validateDatabase(): Promise<boolean> {
    console.log('🗄️ Validating database connection...');

    try {
        const db = new DemoDataDatabase();

        // Test connection
        const isConnected = await db.testConnection();
        if (!isConnected) {
            throw new Error('Database connection failed');
        }
        console.log('✅ Database connection working');

        // Test getting stats (should not fail even with empty database)
        const stats = await db.getDatabaseStats();
        if (typeof stats !== 'object') {
            throw new Error('Database stats retrieval failed');
        }
        console.log('✅ Database stats retrieval working');
        console.log('📊 Current database stats:', stats);

        return true;
    } catch (error) {
        console.error('❌ Database validation failed:', error);
        return false;
    }
}

/**
 * Validate configuration and types
 */
function validateConfiguration(): boolean {
    console.log('⚙️ Validating configuration...');

    try {
        // Test default configuration
        if (!DEFAULT_DEMO_CONFIG || typeof DEFAULT_DEMO_CONFIG !== 'object') {
            throw new Error('Default configuration is invalid');
        }

        if (DEFAULT_DEMO_CONFIG.studentCount <= 0) {
            throw new Error('Student count must be positive');
        }

        if (DEFAULT_DEMO_CONFIG.facultyCount <= 0) {
            throw new Error('Faculty count must be positive');
        }

        if (DEFAULT_DEMO_CONFIG.verificationRate < 0 || DEFAULT_DEMO_CONFIG.verificationRate > 1) {
            throw new Error('Verification rate must be between 0 and 1');
        }

        console.log('✅ Configuration validation passed');
        console.log('📋 Default config:', DEFAULT_DEMO_CONFIG);

        return true;
    } catch (error) {
        console.error('❌ Configuration validation failed:', error);
        return false;
    }
}

/**
 * Validate user generator functionality
 */
async function validateUserGenerator(): Promise<boolean> {
    console.log('👥 Validating user generator...');

    try {
        // Test user generation
        const result = await generateDemoUsers({
            ...DEFAULT_DEMO_CONFIG,
            studentCount: 5,
            facultyCount: 2
        });

        if (!result.success) {
            throw new Error(`User generation failed: ${result.error}`);
        }

        if (!result.data || result.data.length === 0) {
            throw new Error('No users generated');
        }

        console.log('✅ User generation working');

        // Test user generator class
        const generator = new UserGenerator(DEFAULT_DEMO_CONFIG);
        const stats = generator.getGenerationStats(result.data);

        if (!stats || typeof stats.total !== 'number') {
            throw new Error('User statistics generation failed');
        }

        console.log('✅ User statistics generation working');
        console.log(`📊 Generated ${stats.total} users with roles:`, stats.byRole);

        return true;
    } catch (error) {
        console.error('❌ User generator validation failed:', error);
        return false;
    }
}

/**
 * Validate student generator functionality
 */
async function validateStudentGenerator(): Promise<boolean> {
    console.log('👨‍🎓 Validating student generator...');

    try {
        // First generate users
        const userResult = await generateDemoUsers({
            ...DEFAULT_DEMO_CONFIG,
            studentCount: 8,
            facultyCount: 2
        });

        if (!userResult.success || !userResult.data) {
            throw new Error(`User generation failed: ${userResult.error}`);
        }

        // Then generate students
        const studentResult = await generateDemoStudents(userResult.data, DEFAULT_DEMO_CONFIG);

        if (!studentResult.success) {
            throw new Error(`Student generation failed: ${studentResult.error}`);
        }

        if (!studentResult.data || studentResult.data.length === 0) {
            throw new Error('No students generated');
        }

        console.log('✅ Student generation working');

        // Test student generator class
        const generator = new StudentGenerator(DEFAULT_DEMO_CONFIG);
        const stats = generator.getGenerationStats(studentResult.data);

        if (!stats || typeof stats.total !== 'number') {
            throw new Error('Student statistics generation failed');
        }

        console.log('✅ Student statistics generation working');
        console.log(`📊 Generated ${stats.total} students across ${Object.keys(stats.byDepartment).length} departments`);

        return true;
    } catch (error) {
        console.error('❌ Student generator validation failed:', error);
        return false;
    }
}

/**
 * Validate faculty generator functionality
 */
async function validateFacultyGenerator(): Promise<boolean> {
    console.log('👨‍🏫 Validating faculty generator...');

    try {
        // First generate users
        const userResult = await generateDemoUsers({
            ...DEFAULT_DEMO_CONFIG,
            studentCount: 5,
            facultyCount: 5
        });

        if (!userResult.success || !userResult.data) {
            throw new Error(`User generation failed: ${userResult.error}`);
        }

        // Then generate faculty
        const facultyResult = await generateDemoFaculty(userResult.data, DEFAULT_DEMO_CONFIG);

        if (!facultyResult.success) {
            throw new Error(`Faculty generation failed: ${facultyResult.error}`);
        }

        if (!facultyResult.data || facultyResult.data.length === 0) {
            throw new Error('No faculty generated');
        }

        console.log('✅ Faculty generation working');

        // Test faculty generator class
        const generator = new FacultyGenerator(DEFAULT_DEMO_CONFIG);
        const stats = generator.getGenerationStats(facultyResult.data);

        if (!stats || typeof stats.total !== 'number') {
            throw new Error('Faculty statistics generation failed');
        }

        console.log('✅ Faculty statistics generation working');
        console.log(`📊 Generated ${stats.total} faculty across ${Object.keys(stats.byDepartment).length} departments`);

        return true;
    } catch (error) {
        console.error('❌ Faculty generator validation failed:', error);
        return false;
    }
}

/**
 * Run all validation tests
 */
async function runValidation(): Promise<void> {
    console.log('🚀 Starting infrastructure validation...\n');

    const results = {
        utilities: await validateUtilities(),
        database: await validateDatabase(),
        configuration: validateConfiguration(),
        userGenerator: await validateUserGenerator(),
        studentGenerator: await validateStudentGenerator(),
        facultyGenerator: await validateFacultyGenerator()
    };

    console.log('\n📋 Validation Results:');
    console.log('='.repeat(50));

    Object.entries(results).forEach(([test, passed]) => {
        const status = passed ? '✅ PASSED' : '❌ FAILED';
        console.log(`${test.padEnd(15)}: ${status}`);
    });

    const allPassed = Object.values(results).every(result => result);

    console.log('='.repeat(50));

    if (allPassed) {
        console.log('🎉 All infrastructure validation tests passed!');
        console.log('✨ Demo data generation infrastructure is ready to use.');
    } else {
        console.log('⚠️ Some validation tests failed.');
        console.log('🔧 Please fix the issues before proceeding with demo data generation.');
        process.exit(1);
    }
}

// Run validation if this file is executed directly
if (require.main === module) {
    runValidation().catch(error => {
        console.error('💥 Validation script failed:', error);
        process.exit(1);
    });
}

export { runValidation, validateUtilities, validateDatabase, validateConfiguration, validateUserGenerator, validateStudentGenerator, validateFacultyGenerator };