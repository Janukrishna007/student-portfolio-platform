// Test Script for Student Generator
// Run this to verify the student generator is working correctly

import {
    UserGenerator,
    StudentGenerator,
    generateDemoUsers,
    generateDemoStudents,
    DEFAULT_DEMO_CONFIG,
    DEPARTMENTS
} from './index';

/**
 * Test the student generator functionality
 */
async function testStudentGenerator(): Promise<void> {
    console.log('🧪 Testing Student Generator...\n');

    try {
        // Step 1: Generate users first (needed for student generation)
        console.log('📋 Step 1: Generate users for student profiles');
        const userResult = await generateDemoUsers({
            ...DEFAULT_DEMO_CONFIG,
            studentCount: 15,
            facultyCount: 3
        });

        if (!userResult.success || !userResult.data) {
            throw new Error(`User generation failed: ${userResult.error}`);
        }

        console.log(`✅ Generated ${userResult.count} users (${userResult.data.filter(u => u.role === 'student').length} students)`);

        // Step 2: Generate student profiles
        console.log('\n📋 Step 2: Generate student profiles from users');
        const studentResult = await generateDemoStudents(userResult.data, DEFAULT_DEMO_CONFIG);

        if (!studentResult.success || !studentResult.data) {
            throw new Error(`Student generation failed: ${studentResult.error}`);
        }

        console.log(`✅ Generated ${studentResult.count} student profiles successfully`);

        // Step 3: Show statistics
        console.log('\n📊 Step 3: Generation Statistics');
        const generator = new StudentGenerator(DEFAULT_DEMO_CONFIG);
        const stats = generator.getGenerationStats(studentResult.data);

        console.log(`📈 Total students: ${stats.total}`);
        console.log(`📈 Average CGPA: ${stats.averageCGPA}`);

        console.log('\n🏫 Department Distribution:');
        Object.entries(stats.byDepartment).forEach(([dept, count]) => {
            const percentage = ((count / stats.total) * 100).toFixed(1);
            console.log(`   ${dept}: ${count} (${percentage}%)`);
        });

        console.log('\n📚 Year Distribution:');
        Object.entries(stats.byYear).forEach(([year, count]) => {
            const percentage = ((count / stats.total) * 100).toFixed(1);
            console.log(`   Year ${year}: ${count} (${percentage}%)`);
        });

        console.log('\n🎯 CGPA Distribution:');
        stats.cgpaDistribution.forEach(({ range, count }) => {
            const percentage = ((count / stats.total) * 100).toFixed(1);
            console.log(`   ${range}: ${count} (${percentage}%)`);
        });

        // Step 4: Show sample students
        console.log('\n👨‍🎓 Sample Generated Students:');
        studentResult.data.slice(0, 5).forEach((student, index) => {
            console.log(`   ${index + 1}. ${student.student_id} - ${student.first_name} ${student.last_name}`);
            console.log(`      Department: ${student.department}`);
            console.log(`      Year: ${student.year}, Semester: ${student.semester}, CGPA: ${student.cgpa}`);
            console.log(`      User ID: ${student.user_id}`);
            console.log('');
        });

        // Step 5: Validate data quality
        console.log('📋 Step 4: Data quality validation');

        const studentIds = studentResult.data.map(s => s.student_id);
        const userIds = studentResult.data.map(s => s.user_id);

        const uniqueStudentIds = new Set(studentIds).size;
        const uniqueUserIds = new Set(userIds).size;

        if (uniqueStudentIds !== studentIds.length) {
            throw new Error('Duplicate student IDs found');
        }

        if (uniqueUserIds !== userIds.length) {
            throw new Error('Duplicate user IDs found');
        }

        console.log(`✅ All ${studentResult.count} students have unique student IDs and user IDs`);

        // Validate academic progression
        const invalidProgression = studentResult.data.filter(student => {
            const minSemester = (student.year - 1) * 2 + 1;
            const maxSemester = student.year * 2;
            return student.semester < minSemester || student.semester > maxSemester;
        });

        if (invalidProgression.length > 0) {
            throw new Error(`Invalid academic progression found for ${invalidProgression.length} students`);
        }

        console.log('✅ All academic progressions are valid');

        // Validate CGPA ranges
        const invalidCGPA = studentResult.data.filter(student =>
            student.cgpa !== null && (student.cgpa < 0 || student.cgpa > 10)
        );

        if (invalidCGPA.length > 0) {
            throw new Error(`Invalid CGPA values found for ${invalidCGPA.length} students`);
        }

        console.log('✅ All CGPA values are within valid range');

        // Validate departments
        const validDepartments = DEPARTMENTS.map(d => d.fullName);
        const invalidDepartments = studentResult.data.filter(student =>
            !validDepartments.includes(student.department)
        );

        if (invalidDepartments.length > 0) {
            throw new Error(`Invalid departments found for ${invalidDepartments.length} students`);
        }

        console.log('✅ All departments are valid');

        console.log('\n🎉 All student generator tests passed!');
        console.log('✨ Student generator is ready for production use.');

    } catch (error) {
        console.error('\n❌ Student generator test failed:', error);
        process.exit(1);
    }
}

/**
 * Test performance with larger datasets
 */
async function testPerformance(): Promise<void> {
    console.log('\n⚡ Performance Test: Generating 50 students...');

    const startTime = Date.now();

    // Generate users first
    const userResult = await generateDemoUsers({
        ...DEFAULT_DEMO_CONFIG,
        studentCount: 50,
        facultyCount: 10
    });

    if (!userResult.success || !userResult.data) {
        throw new Error(`User generation failed: ${userResult.error}`);
    }

    // Generate students
    const studentResult = await generateDemoStudents(userResult.data, DEFAULT_DEMO_CONFIG);

    const endTime = Date.now();
    const duration = endTime - startTime;

    if (!studentResult.success) {
        throw new Error(`Performance test failed: ${studentResult.error}`);
    }

    console.log(`✅ Generated ${studentResult.count} students in ${duration}ms`);
    console.log(`📈 Performance: ${Math.round(studentResult.count / (duration / 1000))} students/second`);
}

/**
 * Test department and year distribution accuracy
 */
async function testDistributionAccuracy(): Promise<void> {
    console.log('\n📊 Distribution Accuracy Test: Generating 100 students...');

    // Generate a larger dataset to test distribution accuracy
    const userResult = await generateDemoUsers({
        ...DEFAULT_DEMO_CONFIG,
        studentCount: 100,
        facultyCount: 20
    });

    if (!userResult.success || !userResult.data) {
        throw new Error(`User generation failed: ${userResult.error}`);
    }

    const studentResult = await generateDemoStudents(userResult.data, DEFAULT_DEMO_CONFIG);

    if (!studentResult.success || !studentResult.data) {
        throw new Error(`Student generation failed: ${studentResult.error}`);
    }

    const generator = new StudentGenerator(DEFAULT_DEMO_CONFIG);
    const stats = generator.getGenerationStats(studentResult.data);

    console.log('📈 Department Distribution Analysis:');
    console.log('   Expected CS to be most popular: ', stats.byDepartment['Computer Science and Engineering'] || 0);
    console.log('   Expected IE to be least popular: ', stats.byDepartment['Industrial Engineering'] || 0);

    console.log('\n📈 Year Distribution Analysis:');
    console.log('   Year 1 (should be ~30%): ', ((stats.byYear[1] || 0) / stats.total * 100).toFixed(1) + '%');
    console.log('   Year 4 (should be ~17%): ', ((stats.byYear[4] || 0) / stats.total * 100).toFixed(1) + '%');

    console.log('\n📈 CGPA Distribution Analysis:');
    const highCGPA = stats.cgpaDistribution.find(d => d.range === '9.0-10.0')?.count || 0;
    const lowCGPA = stats.cgpaDistribution.find(d => d.range === 'Below 6.0')?.count || 0;
    console.log('   High CGPA (9.0-10.0): ', highCGPA);
    console.log('   Low CGPA (Below 6.0): ', lowCGPA);
    console.log('   Average CGPA: ', stats.averageCGPA);

    console.log('\n✅ Distribution test completed successfully');
}

// Run tests if this file is executed directly
if (require.main === module) {
    (async () => {
        await testStudentGenerator();
        await testPerformance();
        await testDistributionAccuracy();
    })().catch(error => {
        console.error('💥 Test script failed:', error);
        process.exit(1);
    });
}

export { testStudentGenerator, testPerformance, testDistributionAccuracy };