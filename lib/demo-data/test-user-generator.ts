// Test Script for User Generator
// Run this to verify the user generator is working correctly

import { UserGenerator, generateDemoUsers, DEFAULT_DEMO_CONFIG } from './index';

/**
 * Test the user generator functionality
 */
async function testUserGenerator(): Promise<void> {
    console.log('🧪 Testing User Generator...\n');

    try {
        // Test 1: Generate users with default config
        console.log('📋 Test 1: Generate users with default configuration');
        const result = await generateDemoUsers(DEFAULT_DEMO_CONFIG);

        if (!result.success) {
            throw new Error(`User generation failed: ${result.error}`);
        }

        console.log(`✅ Generated ${result.count} users successfully`);

        if (result.data) {
            // Show statistics
            const generator = new UserGenerator(DEFAULT_DEMO_CONFIG);
            const stats = generator.getGenerationStats(result.data);

            console.log('📊 Generation Statistics:');
            console.log(`   Total users: ${stats.total}`);
            console.log(`   By role:`);
            Object.entries(stats.byRole).forEach(([role, count]) => {
                console.log(`     ${role}: ${count}`);
            });
            console.log(`   By email domain:`);
            Object.entries(stats.emailDomains).forEach(([domain, count]) => {
                console.log(`     ${domain}: ${count}`);
            });

            // Show sample users
            console.log('\n👥 Sample Generated Users:');
            result.data.slice(0, 5).forEach((user, index) => {
                console.log(`   ${index + 1}. ${user.email} (${user.role})`);
            });
        }

        // Test 2: Generate specific role users
        console.log('\n📋 Test 2: Generate specific role users');
        const generator = new UserGenerator(DEFAULT_DEMO_CONFIG);

        const studentResult = await generator.generateUsersForSpecificRole('student', 3);
        if (!studentResult.success) {
            throw new Error(`Student generation failed: ${studentResult.error}`);
        }
        console.log(`✅ Generated ${studentResult.count} students`);

        const facultyResult = await generator.generateUsersForSpecificRole('faculty', 2);
        if (!facultyResult.success) {
            throw new Error(`Faculty generation failed: ${facultyResult.error}`);
        }
        console.log(`✅ Generated ${facultyResult.count} faculty`);

        const adminResult = await generator.generateUsersForSpecificRole('admin', 1);
        if (!adminResult.success) {
            throw new Error(`Admin generation failed: ${adminResult.error}`);
        }
        console.log(`✅ Generated ${adminResult.count} admin`);

        // Test 3: Validate data quality
        console.log('\n📋 Test 3: Data quality validation');

        if (result.data) {
            const emails = result.data.map(u => u.email);
            const ids = result.data.map(u => u.id);

            const uniqueEmails = new Set(emails).size;
            const uniqueIds = new Set(ids).size;

            if (uniqueEmails !== emails.length) {
                throw new Error('Duplicate emails found');
            }

            if (uniqueIds !== ids.length) {
                throw new Error('Duplicate IDs found');
            }

            console.log(`✅ All ${result.count} users have unique emails and IDs`);

            // Validate email formats
            const invalidEmails = emails.filter(email => !email.includes('@') || !email.includes('.'));
            if (invalidEmails.length > 0) {
                throw new Error(`Invalid email formats found: ${invalidEmails.join(', ')}`);
            }

            console.log('✅ All email formats are valid');

            // Validate UUID formats
            const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
            const invalidIds = ids.filter(id => !uuidRegex.test(id));
            if (invalidIds.length > 0) {
                throw new Error(`Invalid UUID formats found: ${invalidIds.join(', ')}`);
            }

            console.log('✅ All UUID formats are valid');
        }

        console.log('\n🎉 All user generator tests passed!');
        console.log('✨ User generator is ready for production use.');

    } catch (error) {
        console.error('\n❌ User generator test failed:', error);
        process.exit(1);
    }
}

/**
 * Test performance with larger datasets
 */
async function testPerformance(): Promise<void> {
    console.log('\n⚡ Performance Test: Generating 100 users...');

    const startTime = Date.now();

    const config = {
        ...DEFAULT_DEMO_CONFIG,
        studentCount: 80,
        facultyCount: 15
    };

    const result = await generateDemoUsers(config);

    const endTime = Date.now();
    const duration = endTime - startTime;

    if (!result.success) {
        throw new Error(`Performance test failed: ${result.error}`);
    }

    console.log(`✅ Generated ${result.count} users in ${duration}ms`);
    console.log(`📈 Performance: ${Math.round(result.count / (duration / 1000))} users/second`);
}

// Run tests if this file is executed directly
if (require.main === module) {
    (async () => {
        await testUserGenerator();
        await testPerformance();
    })().catch(error => {
        console.error('💥 Test script failed:', error);
        process.exit(1);
    });
}

export { testUserGenerator, testPerformance };