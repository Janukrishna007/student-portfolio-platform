// Unit Tests for Faculty Generator

import {
    FacultyGenerator,
    generateDemoFaculty,
    generateFacultyProfile,
    generateFacultyName,
    extractFacultyNameFromEmail,
    calculateFacultyDepartmentDistribution,
    calculateDesignationDistribution,
    FACULTY_DESIGNATIONS,
    FACULTY_FIRST_NAMES,
    FACULTY_LAST_NAMES,
    FACULTY_DEPARTMENT_DISTRIBUTION
} from '../faculty-generator';
import { DEPARTMENTS } from '../student-generator';
import { DEFAULT_DEMO_CONFIG } from '../../types';
import type { UserInsert } from '../../types';

// Mock user data for testing
const mockUsers: UserInsert[] = [
    {
        id: '550e8400-e29b-41d4-a716-446655440001',
        email: 'prof.smith@university.edu',
        role: 'faculty',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
    },
    {
        id: '550e8400-e29b-41d4-a716-446655440002',
        email: 'dr.johnson@university.edu',
        role: 'faculty',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
    },
    {
        id: '550e8400-e29b-41d4-a716-446655440003',
        email: 'john.doe@university.edu',
        role: 'student',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
    }
];

describe('Faculty Generator', () => {
    describe('generateFacultyName', () => {
        it('should generate valid faculty names', () => {
            const name = generateFacultyName();

            expect(name.fullName).toBeTruthy();
            expect(name.firstName).toBeTruthy();
            expect(name.lastName).toBeTruthy();

            // Check if names are from the predefined lists
            const allFirstNames = [...FACULTY_FIRST_NAMES.male, ...FACULTY_FIRST_NAMES.female];
            expect(allFirstNames).toContain(name.firstName);
            expect(FACULTY_LAST_NAMES).toContain(name.lastName);
        });

        it('should sometimes include academic titles', () => {
            const names = Array.from({ length: 20 }, () => generateFacultyName());
            const titledNames = names.filter(name =>
                name.fullName.includes('Dr.') ||
                name.fullName.includes('Prof.')
            );

            // Should have some titled names (around 80% based on implementation)
            expect(titledNames.length).toBeGreaterThan(10);
        });

        it('should generate different names on multiple calls', () => {
            const names = Array.from({ length: 10 }, () => generateFacultyName());
            const uniqueNames = new Set(names.map(n => n.fullName));

            // Should have some variety (not all identical)
            expect(uniqueNames.size).toBeGreaterThan(1);
        });
    });

    describe('extractFacultyNameFromEmail', () => {
        it('should extract names from prof.lastname format', () => {
            const result = extractFacultyNameFromEmail('prof.smith@university.edu');
            expect(result.firstName).toBe('Professor');
            expect(result.lastName).toBe('Smith');
        });

        it('should extract names from dr.lastname format', () => {
            const result = extractFacultyNameFromEmail('dr.johnson@university.edu');
            expect(result.firstName).toBe('Dr.');
            expect(result.lastName).toBe('Johnson');
        });

        it('should extract names from firstname.lastname format', () => {
            const result = extractFacultyNameFromEmail('john.doe@university.edu');
            expect(result.firstName).toBe('John');
            expect(result.lastName).toBe('Doe');
        });

        it('should handle single name emails', () => {
            const result = extractFacultyNameFromEmail('professor@university.edu');
            expect(result.firstName).toBe('Professor');
            expect(result.lastName).toBe('Faculty');
        });
    });

    describe('calculateFacultyDepartmentDistribution', () => {
        it('should distribute faculty across all departments', () => {
            const distribution = calculateFacultyDepartmentDistribution(20);

            // Should have all departments
            const deptCodes = Object.keys(FACULTY_DEPARTMENT_DISTRIBUTION);
            expect(Object.keys(distribution)).toEqual(expect.arrayContaining(deptCodes));

            // Total should equal input
            const total = Object.values(distribution).reduce((sum, count) => sum + count, 0);
            expect(total).toBe(20);

            // Each department should have at least 1 faculty
            Object.values(distribution).forEach(count => {
                expect(count).toBeGreaterThanOrEqual(1);
            });
        });

        it('should respect department distribution for large numbers', () => {
            const distribution = calculateFacultyDepartmentDistribution(100);

            // CS should have the most faculty
            expect(distribution['CS']).toBeGreaterThan(distribution['IE']);
            expect(distribution['ECE']).toBeGreaterThan(distribution['AE']);
        });

        it('should handle small numbers gracefully', () => {
            const distribution = calculateFacultyDepartmentDistribution(5);

            const total = Object.values(distribution).reduce((sum, count) => sum + count, 0);
            expect(total).toBe(5);

            // Should still have some distribution
            expect(Object.keys(distribution).length).toBeGreaterThan(0);
        });
    });

    describe('calculateDesignationDistribution', () => {
        it('should distribute faculty across all designations', () => {
            const distribution = calculateDesignationDistribution(20);

            // Should have designations
            const designationTitles = FACULTY_DESIGNATIONS.map(d => d.title);
            const distributionKeys = Object.keys(distribution);

            // Should contain some of the designations
            expect(distributionKeys.some(key => designationTitles.includes(key))).toBe(true);

            // Total should equal input
            const total = Object.values(distribution).reduce((sum, count) => sum + count, 0);
            expect(total).toBe(20);

            // Assistant Professor should have the most (based on weights)
            expect(distribution['Assistant Professor']).toBeGreaterThan(0);
        });

        it('should respect designation hierarchy', () => {
            const distribution = calculateDesignationDistribution(100);

            // Assistant Professor should have more than Professor
            expect(distribution['Assistant Professor'] || 0).toBeGreaterThan(distribution['Professor'] || 0);

            // Dean should have the least (if any)
            const deanCount = distribution['Dean'] || 0;
            const assistantCount = distribution['Assistant Professor'] || 0;
            expect(assistantCount).toBeGreaterThanOrEqual(deanCount);
        });
    });

    describe('generateFacultyProfile', () => {
        it('should generate valid faculty profile', () => {
            const user = mockUsers[0];
            const department = DEPARTMENTS[0];
            const designation = 'Assistant Professor';
            const faculty = generateFacultyProfile(user, department, designation);

            expect(faculty.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
            expect(faculty.user_id).toBe(user.id);
            expect(faculty.employee_id).toMatch(/^FAC\d{3}/);
            expect(faculty.name).toBeTruthy();
            expect(faculty.department).toBe(department.fullName);
            expect(faculty.designation).toBe(designation);
            expect(faculty.created_at).toBeTruthy();
        });

        it('should generate unique employee IDs', () => {
            const user = mockUsers[0];
            const department = DEPARTMENTS[0];
            const designation = 'Assistant Professor';

            const faculty1 = generateFacultyProfile(user, department, designation);
            const faculty2 = generateFacultyProfile(user, department, designation);

            expect(faculty1.employee_id).not.toBe(faculty2.employee_id);
        });
    });

    describe('FacultyGenerator class', () => {
        let generator: FacultyGenerator;

        beforeEach(() => {
            generator = new FacultyGenerator(DEFAULT_DEMO_CONFIG);
        });

        describe('generateFaculty', () => {
            it('should generate faculty from user accounts', async () => {
                const result = await generator.generateFaculty(mockUsers);

                expect(result.success).toBe(true);
                expect(result.data).toBeDefined();
                expect(result.count).toBe(2); // Only 2 faculty users in mock data
                expect(result.error).toBeUndefined();

                if (result.data) {
                    expect(result.data.length).toBe(2);

                    // Check that all generated faculty have valid data
                    result.data.forEach(faculty => {
                        expect(faculty.id).toBeTruthy();
                        expect(faculty.user_id).toBeTruthy();
                        expect(faculty.employee_id).toBeTruthy();
                        expect(faculty.name).toBeTruthy();
                        expect(faculty.department).toBeTruthy();
                        expect(faculty.designation).toBeTruthy();
                        expect(faculty.created_at).toBeTruthy();
                    });
                }
            });

            it('should handle empty user list', async () => {
                const result = await generator.generateFaculty([]);

                expect(result.success).toBe(false);
                expect(result.error).toContain('No faculty users provided');
                expect(result.count).toBe(0);
            });

            it('should filter only faculty users', async () => {
                const result = await generator.generateFaculty(mockUsers);

                expect(result.success).toBe(true);
                expect(result.count).toBe(2); // Should ignore the student user
            });

            it('should generate unique employee IDs', async () => {
                // Create more users to test uniqueness
                const moreFacultyUsers: UserInsert[] = [];
                for (let i = 0; i < 10; i++) {
                    moreFacultyUsers.push({
                        id: `550e8400-e29b-41d4-a716-44665544000${i}`,
                        email: `faculty${i}.test@university.edu`,
                        role: 'faculty',
                        created_at: '2024-01-01T00:00:00Z',
                        updated_at: '2024-01-01T00:00:00Z'
                    });
                }

                const result = await generator.generateFaculty(moreFacultyUsers);

                expect(result.success).toBe(true);

                if (result.data) {
                    const employeeIds = result.data.map(f => f.employee_id);
                    const uniqueIds = new Set(employeeIds);
                    expect(uniqueIds.size).toBe(employeeIds.length);
                }
            });
        });

        describe('getGenerationStats', () => {
            it('should calculate correct statistics', async () => {
                const result = await generator.generateFaculty(mockUsers);

                expect(result.success).toBe(true);

                if (result.data) {
                    const stats = generator.getGenerationStats(result.data);

                    expect(stats.total).toBe(result.data.length);
                    expect(stats.byDepartment).toBeDefined();
                    expect(stats.byDesignation).toBeDefined();
                    expect(stats.phoneNumberCoverage).toBeGreaterThanOrEqual(0);
                    expect(stats.phoneNumberCoverage).toBeLessThanOrEqual(100);

                    // Check department counts
                    const totalDeptCount = Object.values(stats.byDepartment).reduce((sum, count) => sum + count, 0);
                    expect(totalDeptCount).toBe(stats.total);

                    // Check designation counts
                    const totalDesignationCount = Object.values(stats.byDesignation).reduce((sum, count) => sum + count, 0);
                    expect(totalDesignationCount).toBe(stats.total);
                }
            });

            it('should calculate phone number coverage correctly', async () => {
                const result = await generator.generateFaculty(mockUsers);

                expect(result.success).toBe(true);

                if (result.data) {
                    const stats = generator.getGenerationStats(result.data);

                    // Phone coverage should be high (around 90% based on implementation)
                    expect(stats.phoneNumberCoverage).toBeGreaterThan(50);

                    // Verify calculation
                    const facultyWithPhone = result.data.filter(f => f.phone !== null).length;
                    const expectedCoverage = parseFloat((facultyWithPhone / result.data.length * 100).toFixed(1));
                    expect(stats.phoneNumberCoverage).toBe(expectedCoverage);
                }
            });
        });
    });

    describe('generateDemoFaculty convenience function', () => {
        it('should generate faculty with default config', async () => {
            const result = await generateDemoFaculty(mockUsers, DEFAULT_DEMO_CONFIG);

            expect(result.success).toBe(true);
            expect(result.data).toBeDefined();
            expect(result.count).toBe(2);

            if (result.data) {
                // Should have valid faculty data
                result.data.forEach(faculty => {
                    expect(faculty.user_id).toBeTruthy();
                    expect(faculty.employee_id).toBeTruthy();
                    expect(faculty.department).toBeTruthy();
                    expect(DEPARTMENTS.map(d => d.fullName)).toContain(faculty.department);
                    expect(FACULTY_DESIGNATIONS.map(d => d.title)).toContain(faculty.designation);
                });
            }
        });
    });

    describe('Data validation', () => {
        it('should validate faculty data correctly', async () => {
            const generator = new FacultyGenerator(DEFAULT_DEMO_CONFIG);
            const result = await generator.generateFaculty(mockUsers);

            expect(result.success).toBe(true);

            if (result.data) {
                for (const faculty of result.data) {
                    // Required fields
                    expect(faculty.id).toBeTruthy();
                    expect(faculty.user_id).toBeTruthy();
                    expect(faculty.employee_id).toBeTruthy();
                    expect(faculty.name).toBeTruthy();
                    expect(faculty.department).toBeTruthy();
                    expect(faculty.designation).toBeTruthy();
                    expect(faculty.created_at).toBeTruthy();

                    // Valid department
                    const validDepartments = DEPARTMENTS.map(d => d.fullName);
                    expect(validDepartments).toContain(faculty.department);

                    // Valid designation
                    const validDesignations = FACULTY_DESIGNATIONS.map(d => d.title);
                    expect(validDesignations).toContain(faculty.designation);

                    // Valid employee ID format
                    expect(faculty.employee_id).toMatch(/^FAC\d{3}/);

                    // Valid UUID format
                    expect(faculty.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);

                    // Valid timestamp
                    expect(new Date(faculty.created_at).getTime()).not.toBeNaN();
                }
            }
        });
    });

    describe('Faculty constants', () => {
        it('should have valid faculty designations', () => {
            expect(FACULTY_DESIGNATIONS.length).toBeGreaterThan(0);

            FACULTY_DESIGNATIONS.forEach(designation => {
                expect(designation.title).toBeTruthy();
                expect(designation.minExperience).toBeGreaterThanOrEqual(0);
                expect(designation.maxExperience).toBeGreaterThan(designation.minExperience);
                expect(designation.weight).toBeGreaterThan(0);
                expect(designation.weight).toBeLessThanOrEqual(1);
            });

            // Weights should sum to approximately 1
            const totalWeight = FACULTY_DESIGNATIONS.reduce((sum, d) => sum + d.weight, 0);
            expect(totalWeight).toBeCloseTo(1.0, 2);
        });

        it('should have valid faculty names', () => {
            expect(FACULTY_FIRST_NAMES.male.length).toBeGreaterThan(0);
            expect(FACULTY_FIRST_NAMES.female.length).toBeGreaterThan(0);
            expect(FACULTY_LAST_NAMES.length).toBeGreaterThan(0);

            // Names should be non-empty strings
            [...FACULTY_FIRST_NAMES.male, ...FACULTY_FIRST_NAMES.female, ...FACULTY_LAST_NAMES].forEach(name => {
                expect(typeof name).toBe('string');
                expect(name.length).toBeGreaterThan(0);
            });
        });

        it('should have valid department distribution', () => {
            const deptCodes = Object.keys(FACULTY_DEPARTMENT_DISTRIBUTION);
            const definedCodes = DEPARTMENTS.map(d => d.code);

            // All distribution codes should have corresponding department definitions
            deptCodes.forEach(code => {
                expect(definedCodes).toContain(code);
            });

            const totalDistribution = Object.values(FACULTY_DEPARTMENT_DISTRIBUTION).reduce((sum, pct) => sum + pct, 0);
            expect(totalDistribution).toBeCloseTo(1.0, 2);
        });
    });
});