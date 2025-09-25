// Unit Tests for User Generator

import {
    UserGenerator,
    generateFullName,
    generateUserForRole,
    calculateRoleDistribution,
    generateDemoUsers,
    FIRST_NAMES,
    LAST_NAMES,
    EMAIL_DOMAINS
} from '../user-generator';
import { DEFAULT_DEMO_CONFIG } from '../../types';

describe('User Generator', () => {
    describe('generateFullName', () => {
        it('should generate valid names', () => {
            const name = generateFullName();

            expect(name.firstName).toBeTruthy();
            expect(name.lastName).toBeTruthy();
            expect(name.fullName).toBe(`${name.firstName} ${name.lastName}`);

            // Check if names are from the predefined lists
            const allFirstNames = [...FIRST_NAMES.male, ...FIRST_NAMES.female];
            expect(allFirstNames).toContain(name.firstName);
            expect(LAST_NAMES).toContain(name.lastName);
        });

        it('should generate different names on multiple calls', () => {
            const names = Array.from({ length: 10 }, () => generateFullName());
            const uniqueNames = new Set(names.map(n => n.fullName));

            // Should have some variety (not all identical)
            expect(uniqueNames.size).toBeGreaterThan(1);
        });
    });

    describe('generateUserForRole', () => {
        it('should generate valid student user', () => {
            const user = generateUserForRole('student');

            expect(user.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
            expect(user.email).toContain('@university.edu');
            expect(user.role).toBe('student');
            expect(user.created_at).toBeTruthy();
            expect(user.updated_at).toBeTruthy();
        });

        it('should generate valid faculty user', () => {
            const user = generateUserForRole('faculty');

            expect(user.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
            expect(user.email).toContain('@university.edu');
            expect(user.role).toBe('faculty');
            expect(user.created_at).toBeTruthy();
            expect(user.updated_at).toBeTruthy();
        });

        it('should generate valid admin user', () => {
            const user = generateUserForRole('admin');

            expect(user.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
            expect(user.email).toContain('@admin.university.edu');
            expect(user.role).toBe('admin');
            expect(user.created_at).toBeTruthy();
            expect(user.updated_at).toBeTruthy();
        });

        it('should generate unique IDs and emails', () => {
            const users = Array.from({ length: 10 }, () => generateUserForRole('student'));

            const ids = users.map(u => u.id);
            const emails = users.map(u => u.email);

            expect(new Set(ids).size).toBe(10); // All unique IDs
            expect(new Set(emails).size).toBe(10); // All unique emails
        });
    });

    describe('calculateRoleDistribution', () => {
        it('should calculate correct role distribution', () => {
            const distribution = calculateRoleDistribution(100, DEFAULT_DEMO_CONFIG);

            expect(distribution.student).toBe(80); // 80%
            expect(distribution.faculty).toBe(15); // 15%
            expect(distribution.admin).toBe(5); // 5%
            expect(distribution.student + distribution.faculty + distribution.admin).toBe(100);
        });

        it('should ensure at least 1 admin', () => {
            const distribution = calculateRoleDistribution(10, DEFAULT_DEMO_CONFIG);

            expect(distribution.admin).toBeGreaterThanOrEqual(1);
            expect(distribution.student + distribution.faculty + distribution.admin).toBe(10);
        });
    });

    describe('UserGenerator class', () => {
        let generator: UserGenerator;

        beforeEach(() => {
            generator = new UserGenerator(DEFAULT_DEMO_CONFIG);
        });

        describe('generateUsers', () => {
            it('should generate users successfully', async () => {
                const result = await generator.generateUsers();

                expect(result.success).toBe(true);
                expect(result.data).toBeDefined();
                expect(result.count).toBeGreaterThan(0);
                expect(result.error).toBeUndefined();

                if (result.data) {
                    expect(result.data.length).toBe(result.count);

                    // Check role distribution
                    const roles = result.data.map(u => u.role);
                    expect(roles).toContain('student');
                    expect(roles).toContain('faculty');
                    expect(roles).toContain('admin');
                }
            });

            it('should generate unique users', async () => {
                const result = await generator.generateUsers();

                expect(result.success).toBe(true);

                if (result.data) {
                    const emails = result.data.map(u => u.email);
                    const ids = result.data.map(u => u.id);

                    expect(new Set(emails).size).toBe(emails.length);
                    expect(new Set(ids).size).toBe(ids.length);
                }
            });
        });

        describe('generateUsersForSpecificRole', () => {
            it('should generate only students', async () => {
                const result = await generator.generateUsersForSpecificRole('student', 5);

                expect(result.success).toBe(true);
                expect(result.count).toBe(5);

                if (result.data) {
                    expect(result.data.every(u => u.role === 'student')).toBe(true);
                    expect(result.data.every(u => u.email.includes('@university.edu'))).toBe(true);
                }
            });

            it('should generate only faculty', async () => {
                const result = await generator.generateUsersForSpecificRole('faculty', 3);

                expect(result.success).toBe(true);
                expect(result.count).toBe(3);

                if (result.data) {
                    expect(result.data.every(u => u.role === 'faculty')).toBe(true);
                    expect(result.data.every(u => u.email.includes('@university.edu'))).toBe(true);
                }
            });

            it('should generate only admin', async () => {
                const result = await generator.generateUsersForSpecificRole('admin', 2);

                expect(result.success).toBe(true);
                expect(result.count).toBe(2);

                if (result.data) {
                    expect(result.data.every(u => u.role === 'admin')).toBe(true);
                    expect(result.data.every(u => u.email.includes('@admin.university.edu'))).toBe(true);
                }
            });
        });

        describe('getGenerationStats', () => {
            it('should calculate correct statistics', async () => {
                const result = await generator.generateUsers();

                expect(result.success).toBe(true);

                if (result.data) {
                    const stats = generator.getGenerationStats(result.data);

                    expect(stats.total).toBe(result.data.length);
                    expect(stats.byRole).toBeDefined();
                    expect(stats.emailDomains).toBeDefined();

                    // Check role counts
                    const totalRoles = Object.values(stats.byRole).reduce((sum, count) => sum + count, 0);
                    expect(totalRoles).toBe(stats.total);

                    // Check email domains
                    expect(stats.emailDomains['university.edu']).toBeGreaterThan(0);
                    expect(stats.emailDomains['admin.university.edu']).toBeGreaterThan(0);
                }
            });
        });
    });

    describe('generateDemoUsers convenience function', () => {
        it('should generate users with default config', async () => {
            const result = await generateDemoUsers(DEFAULT_DEMO_CONFIG);

            expect(result.success).toBe(true);
            expect(result.data).toBeDefined();
            expect(result.count).toBeGreaterThan(0);

            if (result.data) {
                // Should have all three roles
                const roles = result.data.map(u => u.role);
                expect(roles).toContain('student');
                expect(roles).toContain('faculty');
                expect(roles).toContain('admin');
            }
        });
    });

    describe('Data validation', () => {
        it('should validate user data correctly', async () => {
            const generator = new UserGenerator(DEFAULT_DEMO_CONFIG);
            const result = await generator.generateUsers();

            expect(result.success).toBe(true);

            if (result.data) {
                for (const user of result.data) {
                    // Required fields
                    expect(user.id).toBeTruthy();
                    expect(user.email).toBeTruthy();
                    expect(user.role).toBeTruthy();
                    expect(user.created_at).toBeTruthy();
                    expect(user.updated_at).toBeTruthy();

                    // Valid formats
                    expect(user.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
                    expect(user.email).toMatch(/^[^@]+@[^@]+\.[^@]+$/);
                    expect(['student', 'faculty', 'admin']).toContain(user.role);

                    // Valid timestamps
                    expect(new Date(user.created_at).getTime()).not.toBeNaN();
                    expect(new Date(user.updated_at).getTime()).not.toBeNaN();
                }
            }
        });
    });
});