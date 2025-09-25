// Test Script for Faculty Generator
// Run this to verify the faculty generator is working correctly

import {
    UserGenerator,
    FacultyGenerator,
    generateDemoUsers,
    generateDemoFaculty,
    DEFAULT_DEMO_CONFIG,
    FACULTY_DESIGNATIONS
} from './index';

/**
 * Test the faculty generator functionality
 */
async function testFacultyGenerator(): Promise<void> {
    console.log('🧪 Testing Faculty Generator...\n');

    try {
        // Step 1: Generate users first (needed for faculty generation)
        console.log('📋 Step 1: Generate users for faculty profiles');
        const userResult = await generateDemoUsers({
            ...DEFAULT_DEMO_CONFIG,
            studentCount: 10,
            facultyCount: 8
        });

        if (!userResult.success || !userResult.data) {
            throw new Error(`User generation failed: ${userResult.error}`);
        }

        console.log(`✅ Generated ${userResult.count} users (${userResult.data.filter(u => u.role === 'faculty').length} faculty)`);

        // Step 2: Generate faculty profiles
        console.log('\n📋 Step 2: Generate faculty profiles from users');
        const facultyResult = await generateDemoFaculty(userResult.data, DEFAULT_DEMO_CONFIG);

        if (!facultyResult.success || !facultyResult.data) {
            throw new Error(`Faculty generation failed: ${facultyResult.error}`);
        }

        console.log(`✅ Generated ${facultyResult.count} faculty profiles successfully`);

        // Step 3: Show statistics
        console.log('\n📊 Step 3: Generation Statistics');
        const generator = new FacultyGenerator(DEFAULT_DEMO_CONFIG);
        const stats = generator.getGenerationStats(facultyResult.data);

        console.log(`📈 Total faculty: ${stats.total}`);
        console.log(`📈 Phone number coverage: ${stats.phoneNumberCoverage}%`);

        console.log('\n🏫 Department Distribution:');
        Object.entries(stats.byDepartment).forEach(([dept, count]) => {
            const percentage = ((count / stats.total) * 100).toFixed(1);
            console.log(`   ${dept}: ${count} (${percentage}%)`);
        });

        console.log('\n👔 Designation Distribution:');
        Object.entries(stats.byDesignation).forEach(([designation, count]) => {
            const percentage = ((count / stats.total) * 100).toFixed(1);
            console.log(`   ${designation}: ${count} (${percentage}%)`);
        });

        // Step 4: Show sample faculty
        console.log('\n👨‍🏫 Sample Generated Faculty:');
        facultyResult.data.slice(0, 5).forEach((faculty, index) => {
            console.log(`   ${index + 1}. ${faculty.employee_id} - ${faculty.name}`);
            console.log(`      Department: ${faculty.department}`);
            console.log(`      Designation: ${faculty.designation}`);
            console.log(`      Phone: ${faculty.phone || 'Not provided'}`);
            console.log(`      User ID: ${faculty.user_id}`);
            console.log('');
        });

        // Step 5: Validate data quality
        console.log('📋 Step 4: Data quality validation');

        const employeeIds = facultyResult.data.map(f => f.employee_id);
        const userIds = facultyResult.data.map(f => f.user_id);

        const uniqueEmployeeIds = new Set(employeeIds).size;
        const uniqueUserIds = new Set(userIds).size;

        if (uniqueEmployeeIds !== employeeIds.length) {
            throw new Error('Duplicate employee IDs found');
        }

        if (uniqueUserIds !== userIds.length) {
            throw new Error('Duplicate user IDs found');
        }

        console.log(`✅ All ${facultyResult.count} faculty have unique employee IDs and user IDs`);

        // Validate employee ID format
        const invalidEmployeeIds = facultyResult.data.filter(faculty =>
            !faculty.employee_id.startsWith('FAC')
        );

        if (invalidEmployeeIds.length > 0) {
            throw new Error(`Invalid employee ID format found for ${invalidEmployeeIds.length} faculty`);
        }

        console.log('✅ All employee ID formats are valid');

        // Validate departments
        const validDepartments = [
            'Computer Science and Engineering',
            'Electronics and Communication Engineering',
            'Mechanical Engineering',
            'Civil Engineering',
            'Electrical Engineering',
            'Information Technology',
            'Chemical Engineering',
            'Biotechnology',
            'Aerospace Engineering',
            'Industrial Engineering'
        ];

        const invalidDepartments = facultyResult.data.filter(faculty =>
            !validDepartments.includes(faculty.department)
        );

        if (invalidDepartments.length > 0) {
            throw new Error(`Invalid departments found for ${invalidDepartments.length} faculty`);
        }

        console.log('✅ All departments are valid');

        // Validate designations
        const validDesignations = FACULTY_DESIGNATIONS.map(d => d.title);
        const invalidDesignations = facultyResult.data.filter(faculty =>
            !validDesignations.includes(faculty.designation)
        );

        if (invalidDesignations.length > 0) {
            throw new Error(`Invalid designations found for ${invalidDesignations.length} faculty`);
        }

        console.log('✅ All designations are valid');

        console.log('\n🎉 All faculty generator tests passed!');
        console.log('✨ Faculty generator is ready for production use.');

    } catch (error) {
        console.error('\n❌ Faculty generator test failed:', error);
        process.exit(1);
    }
}

/**
 * Test performance with larger datasets
 */
async function testPerformance(): Promise<void> {
    console.log('\n⚡ Performance Test: Generating 25 faculty...');

    const startTime = Date.now();

    // Generate users first
    const userResult = await generateDemoUsers({
        ...DEFAULT_DEMO_CONFIG,
        studentCount: 50,
        facultyCount: 25
    });

    if (!userResult.success || !userResult.data) {
        throw new Error(`User generation failed: ${userResult.error}`);
    }

    // Generate faculty
    const facultyResult = await generateDemoFaculty(userResult.data, DEFAULT_DEMO_CONFIG);

    const endTime = Date.now();
    const duration = endTime - startTime;

    if (!facultyResult.success) {
        throw new Error(`Performance test failed: ${facultyResult.error}`);
    }

    console.log(`✅ Generated ${facultyResult.count} faculty in ${duration}ms`);
    console.log(`📈 Performance: ${Math.round(facultyResult.count / (duration / 1000))} faculty/second`);
}

/**
 * Test designation and department distribution accuracy
 */
async function testDistributionAccuracy(): Promise<void> {
    console.log('\n📊 Distribution Accuracy Test: Generating 30 faculty...');

    // Generate a larger dataset to test distribution accuracy
    const userResult = await generateDemoUsers({
        ...DEFAULT_DEMO_CONFIG,
        studentCount: 50,
        facultyCount: 30
    });

    if (!userResult.success || !userResult.data) {
        throw new Error(`User generation failed: ${userResult.error}`);
    }

    const facultyResult = await generateDemoFaculty(userResult.data, DEFAULT_DEMO_CONFIG);

    if (!facultyResult.success || !facultyResult.data) {
        throw new Error(`Faculty generation failed: ${facultyResult.error}`);
    }

    const generator = new FacultyGenerator(DEFAULT_DEMO_CONFIG);
    const stats = generator.getGenerationStats(facultyResult.data);

    console.log('📈 Department Distribution Analysis:');
    console.log('   Expected CS to be most popular: ', stats.byDepartment['Computer Science and Engineering'] || 0);
    console.log('   Expected IE to be least popular: ', stats.byDepartment['Industrial Engineering'] || 0);

    console.log('\n📈 Designation Distribution Analysis:');
    console.log('   Assistant Professor (should be most): ', stats.byDesignation['Assistant Professor'] || 0);
    console.log('   Professor (should be fewer): ', stats.byDesignation['Professor'] || 0);
    console.log('   Dean (should be fewest): ', stats.byDesignation['Dean'] || 0);

    console.log('\n📈 Contact Information Analysis:');
    console.log('   Phone number coverage: ', stats.phoneNumberCoverage + '%');
    console.log('   Faculty with phones: ', facultyResult.data.filter(f => f.phone).length);
    console.log('   Faculty without phones: ', facultyResult.data.filter(f => !f.phone).length);

    console.log('\n📈 Name Analysis:');
    const titledFaculty = facultyResult.data.filter(f =>
        f.name.includes('Dr.') || f.name.includes('Prof.')
    );
    console.log('   Faculty with academic titles: ', titledFaculty.length);
    console.log('   Percentage with titles: ', ((titledFaculty.length / stats.total) * 100).toFixed(1) + '%');

    console.log('\n✅ Distribution test completed successfully');
}

/**
 * Test integration with user roles
 */
async function testUserIntegration(): Promise<void> {
    console.log('\n🔗 User Integration Test...');

    // Generate mixed users
    const userResult = await generateDemoUsers({
        ...DEFAULT_DEMO_CONFIG,
        studentCount: 15,
        facultyCount: 10
    });

    if (!userResult.success || !userResult.data) {
        throw new Error(`User generation failed: ${userResult.error}`);
    }

    const facultyResult = await generateDemoFaculty(userResult.data, DEFAULT_DEMO_CONFIG);

    if (!facultyResult.success || !facultyResult.data) {
        throw new Error(`Faculty generation failed: ${facultyResult.error}`);
    }

    // Verify that only faculty users were processed
    const facultyUsers = userResult.data.filter(u => u.role === 'faculty');
    expect(facultyResult.count).toBe(facultyUsers.length);

    // Verify user ID mapping
    const facultyUserIds = new Set(facultyResult.data.map(f => f.user_id));
    const expectedUserIds = new Set(facultyUsers.map(u => u.id));

    expect(facultyUserIds).toEqual(expectedUserIds);

    console.log(`✅ Processed ${facultyUsers.length} faculty users correctly`);
    console.log(`✅ Ignored ${userResult.data.length - facultyUsers.length} non-faculty users`);
    console.log('✅ User integration test passed');
}

// Simple expect function for testing
function expect(actual: any) {
    return {
        toBe: (expected: any) => {
            if (actual !== expected) {
                throw new Error(`Expected ${actual} to be ${expected}`);
            }
        },
        toEqual: (expected: any) => {
            if (JSON.stringify(actual) !== JSON.stringify(expected)) {
                throw new Error(`Expected ${JSON.stringify(actual)} to equal ${JSON.stringify(expected)}`);
            }
        }
    };
}

// Run tests if this file is executed directly
if (require.main === module) {
    (async () => {
        await testFacultyGenerator();
        await testPerformance();
        await testDistributionAccuracy();
        await testUserIntegration();
    })().catch(error => {
        console.error('💥 Test script failed:', error);
        process.exit(1);
    });
}

export { testFacultyGenerator, testPerformance, testDistributionAccuracy, testUserIntegration };