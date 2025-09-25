// Unit Tests for Student Generator

import {
    StudentGenerator,
    generateDemoStudents,
    generateStudentProfile,
    extractNamesFromEmail,
    calculateDepartmentDistribution,
    calculateYearDistribution,
    DEPARTMENTS,
    YEAR_DISTRIBUTION,
    DEPARTMENT_POPULARITY
} from '../student-generator';
import { DEFAULT_DEMO_CONFIG } from '../../types';
import type { UserInsert } from '../../types';

// Mock user data for testing
const mockUsers: UserInsert[] = [
    {
        id: '550e8400-e29b-41d4-a716-446655440001',
        email: 'john.doe@university.edu',
        role: 'student',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
    },
    {
        id: '550e8400-e29b-41d4-a716-446655440002',
        email: 'jane.smith@university.edu',
        role: 'student',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
    },
    {
        id: '550e8400-e29b-41d4-a716-446655440003',
        email: 'prof.wilson@university.edu',
        role: 'faculty',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
    }
];

describe('Student Generator', () => {
    describe('extractNamesFromEmail', () => {
        it('should extract names from standard email format', () => {
            const result = extractNamesFromEmail('john.doe@university.edu');
            expect(result.firstName).toBe('John');
            expect(result.lastName).toBe('Doe');
        });

        it('should handle single name emails', () => {
            const result = extractNamesFromEmail('john@university.edu');
            expect(result.firstName).toBe('John');
            expect(result.lastName).toBe('Student');
        });

        it('should capitalize names properly', () => {
            const result = extractNamesFromEmail('mary.jane@university.edu');
            expect(result.firstName).toBe('Mary');
            expect(result.lastName).toBe('Jane');
        });
    });

    describe('calculateDepartmentDistribution', () => {
        it('should distribute students across all departments', () => {
            const distribution = calculateDepartmentDistribution(100);

            // Should have all departments
            const deptCodes = Object.keys(DEPARTMENT_POPULARITY);
            expect(Object.keys(distribution)).toEqual(expect.arrayContaining(deptCodes));

            // Total should equal input
            const total = Object.values(distribution).reduce((sum, count) => sum + count, 0);
            expect(total).toBe(100);

            // Each department should have at least 1 student
            Object.values(distribution).forEach(count => {
                expect(count).toBeGreaterThanOrEqual(1);
            });
        });

        it('should respect popularity distribution for large numbers', () => {
            const distribution = calculateDepartmentDistribution(1000);

            // CS should have the most students
            expect(distribution['CS']).toBeGreaterThan(distribution['IE']);
            expect(distribution['ECE']).toBeGreaterThan(distribution['AE']);
        });

        it('should handle small numbers gracefully', () => {
            const distribution = calculateDepartmentDistribution(5);

            const total = Object.values(distribution).reduce((sum, count) => sum + count, 0);
            expect(total).toBe(5);

            // Should still have some distribution
            expect(Object.keys(distribution).length).toBeGreaterThan(0);
        });
    });

    describe('calculateYearDistribution', () => {
        it('should distribute students across all years', () => {
            const distribution = calculateYearDistribution(100);

            // Should have years 1-4
            expect(Object.keys(distribution).map(Number)).toEqual(expect.arrayContaining([1, 2, 3, 4]));

            // Total should equal input
            const total = Object.values(distribution).reduce((sum, count) => sum + count, 0);
            expect(total).toBe(100);

            // Year 1 should have the most students (based on YEAR_DISTRIBUTION)
            expect(distribution[1]).toBeGreaterThan(distribution[4]);
        });

        it('should respect year distribution percentages', () => {
            const distribution = calculateYearDistribution(1000);

            // Check approximate percentages (within 5% tolerance)
            expect(distribution[1]).toBeCloseTo(1000 * YEAR_DISTRIBUTION[1], -1);
            expect(distribution[2]).toBeCloseTo(1000 * YEAR_DISTRIBUTION[2], -1);
        });
    });

    describe('generateStudentProfile', () => {
        it('should generate valid student profile', () => {
            const user = mockUsers[0];
            const department = DEPARTMENTS[0];
            const student = generateStudentProfile(user, department, 2, 'John', 'Doe');

            expect(student.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
            expect(student.user_id).toBe(user.id);
            expect(student.student_id).toMatch(new RegExp(`^${department.code}\\d{4}\\d{3}$`));
            expect(student.first_name).toBe('John');
            expect(student.last_name).toBe('Doe');
            expect(student.department).toBe(department.fullName);
            expect(student.year).toBe(2);
            expect(student.semester).toBeGreaterThanOrEqual(1);
            expect(student.semester).toBeLessThanOrEqual(8);
            expect(student.cgpa).toBeGreaterThanOrEqual(6.0);
            expect(student.cgpa).toBeLessThanOrEqual(10.0);
            expect(student.created_at).toBeTruthy();
            expect(student.updated_at).toBeTruthy();
        });

        it('should generate valid academic progression', () => {
            const user = mockUsers[0];
            const department = DEPARTMENTS[0];

            for (let year = 1; year <= 4; year++) {
                const student = generateStudentProfile(user, department, year, 'Test', 'Student');

                // Semester should be valid for the year
                const minSemester = (year - 1) * 2 + 1;
                const maxSemester = year * 2;

                expect(student.semester).toBeGreaterThanOrEqual(minSemester);
                expect(student.semester).toBeLessThanOrEqual(maxSemester);
            }
        });
    });

    describe('StudentGenerator class', () => {
        let generator: StudentGenerator;

        beforeEach(() => {
            generator = new StudentGenerator(DEFAULT_DEMO_CONFIG);
        });

        describe('generateStudents', () => {
            it('should generate students from user accounts', async () => {
                const result = await generator.generateStudents(mockUsers);

                expect(result.success).toBe(true);
                expect(result.data).toBeDefined();
                expect(result.count).toBe(2); // Only 2 student users in mock data
                expect(result.error).toBeUndefined();

                if (result.data) {
                    expect(result.data.length).toBe(2);

                    // Check that all generated students have valid data
                    result.data.forEach(student => {
                        expect(student.id).toBeTruthy();
                        expect(student.user_id).toBeTruthy();
                        expect(student.student_id).toBeTruthy();
                        expect(student.first_name).toBeTruthy();
                        expect(student.last_name).toBeTruthy();
                        expect(student.department).toBeTruthy();
                        expect(student.year).toBeGreaterThanOrEqual(1);
                        expect(student.year).toBeLessThanOrEqual(4);
                        expect(student.semester).toBeGreaterThanOrEqual(1);
                        expect(student.semester).toBeLessThanOrEqual(8);
                    });
                }
            });

            it('should handle empty user list', async () => {
                const result = await generator.generateStudents([]);

                expect(result.success).toBe(false);
                expect(result.error).toContain('No student users provided');
                expect(result.count).toBe(0);
            });

            it('should filter only student users', async () => {
                const result = await generator.generateStudents(mockUsers);

                expect(result.success).toBe(true);
                expect(result.count).toBe(2); // Should ignore the faculty user
            });

            it('should generate unique student IDs', async () => {
                // Create more users to test uniqueness
                const moreUsers: UserInsert[] = [];
                for (let i = 0; i < 10; i++) {
                    moreUsers.push({
                        id: `550e8400-e29b-41d4-a716-44665544000${i}`,
                        email: `student${i}.test@university.edu`,
                        role: 'student',
                        created_at: '2024-01-01T00:00:00Z',
                        updated_at: '2024-01-01T00:00:00Z'
                    });
                }

                const result = await generator.generateStudents(moreUsers);

                expect(result.success).toBe(true);

                if (result.data) {
                    const studentIds = result.data.map(s => s.student_id);
                    const uniqueIds = new Set(studentIds);
                    expect(uniqueIds.size).toBe(studentIds.length);
                }
            });
        });

        describe('getGenerationStats', () => {
            it('should calculate correct statistics', async () => {
                const result = await generator.generateStudents(mockUsers);

                expect(result.success).toBe(true);

                if (result.data) {
                    const stats = generator.getGenerationStats(result.data);

                    expect(stats.total).toBe(result.data.length);
                    expect(stats.byDepartment).toBeDefined();
                    expect(stats.byYear).toBeDefined();
                    expect(stats.averageCGPA).toBeGreaterThan(0);
                    expect(stats.cgpaDistribution).toBeDefined();
                    expect(stats.cgpaDistribution.length).toBe(5); // 5 CGPA ranges

                    // Check department counts
                    const totalDeptCount = Object.values(stats.byDepartment).reduce((sum, count) => sum + count, 0);
                    expect(totalDeptCount).toBe(stats.total);

                    // Check year counts
                    const totalYearCount = Object.values(stats.byYear).reduce((sum, count) => sum + count, 0);
                    expect(totalYearCount).toBe(stats.total);
                }
            });

            it('should calculate CGPA statistics correctly', async () => {
                const result = await generator.generateStudents(mockUsers);

                expect(result.success).toBe(true);

                if (result.data) {
                    const stats = generator.getGenerationStats(result.data);

                    // Average CGPA should be within valid range
                    expect(stats.averageCGPA).toBeGreaterThanOrEqual(6.0);
                    expect(stats.averageCGPA).toBeLessThanOrEqual(10.0);

                    // CGPA distribution should sum to total students
                    const totalCgpaCount = stats.cgpaDistribution.reduce((sum, range) => sum + range.count, 0);
                    expect(totalCgpaCount).toBe(stats.total);
                }
            });
        });
    });

    describe('generateDemoStudents convenience function', () => {
        it('should generate students with default config', async () => {
            const result = await generateDemoStudents(mockUsers, DEFAULT_DEMO_CONFIG);

            expect(result.success).toBe(true);
            expect(result.data).toBeDefined();
            expect(result.count).toBe(2);

            if (result.data) {
                // Should have valid student data
                result.data.forEach(student => {
                    expect(student.user_id).toBeTruthy();
                    expect(student.student_id).toBeTruthy();
                    expect(student.department).toBeTruthy();
                    expect(DEPARTMENTS.map(d => d.fullName)).toContain(student.department);
                });
            }
        });
    });

    describe('Data validation', () => {
        it('should validate student data correctly', async () => {
            const generator = new StudentGenerator(DEFAULT_DEMO_CONFIG);
            const result = await generator.generateStudents(mockUsers);

            expect(result.success).toBe(true);

            if (result.data) {
                for (const student of result.data) {
                    // Required fields
                    expect(student.id).toBeTruthy();
                    expect(student.user_id).toBeTruthy();
                    expect(student.student_id).toBeTruthy();
                    expect(student.first_name).toBeTruthy();
                    expect(student.last_name).toBeTruthy();
                    expect(student.department).toBeTruthy();
                    expect(student.created_at).toBeTruthy();
                    expect(student.updated_at).toBeTruthy();

                    // Valid ranges
                    expect(student.year).toBeGreaterThanOrEqual(1);
                    expect(student.year).toBeLessThanOrEqual(4);
                    expect(student.semester).toBeGreaterThanOrEqual(1);
                    expect(student.semester).toBeLessThanOrEqual(8);

                    if (student.cgpa !== null) {
                        expect(student.cgpa).toBeGreaterThanOrEqual(0);
                        expect(student.cgpa).toBeLessThanOrEqual(10);
                    }

                    // Valid department
                    const validDepartments = DEPARTMENTS.map(d => d.fullName);
                    expect(validDepartments).toContain(student.department);

                    // Valid UUID format
                    expect(student.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);

                    // Valid timestamps
                    expect(new Date(student.created_at).getTime()).not.toBeNaN();
                    expect(new Date(student.updated_at).getTime()).not.toBeNaN();
                }
            }
        });
    });

    describe('Department and Year constants', () => {
        it('should have valid department definitions', () => {
            expect(DEPARTMENTS.length).toBeGreaterThan(0);

            DEPARTMENTS.forEach(dept => {
                expect(dept.code).toBeTruthy();
                expect(dept.name).toBeTruthy();
                expect(dept.fullName).toBeTruthy();
                expect(dept.code.length).toBeGreaterThanOrEqual(2);
                expect(dept.code.length).toBeLessThanOrEqual(4);
            });
        });

        it('should have valid year distribution', () => {
            const years = Object.keys(YEAR_DISTRIBUTION).map(Number);
            expect(years).toEqual([1, 2, 3, 4]);

            const totalPercentage = Object.values(YEAR_DISTRIBUTION).reduce((sum, pct) => sum + pct, 0);
            expect(totalPercentage).toBeCloseTo(1.0, 2);
        });

        it('should have valid department popularity', () => {
            const deptCodes = Object.keys(DEPARTMENT_POPULARITY);
            const definedCodes = DEPARTMENTS.map(d => d.code);

            // All popularity codes should have corresponding department definitions
            deptCodes.forEach(code => {
                expect(definedCodes).toContain(code);
            });

            const totalPopularity = Object.values(DEPARTMENT_POPULARITY).reduce((sum, pct) => sum + pct, 0);
            expect(totalPopularity).toBeCloseTo(1.0, 2);
        });
    });
});