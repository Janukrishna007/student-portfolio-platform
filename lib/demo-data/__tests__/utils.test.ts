// Unit Tests for Demo Data Generation Utilities

import {
    generateUUID,
    randomInt,
    randomFloat,
    randomChoice,
    randomChoices,
    shuffleArray,
    generateEmail,
    generateStudentId,
    generateEmployeeId,
    generateCGPA,
    generatePhoneNumber,
    isValidAcademicProgression,
    calculateRelevanceScore,
    validateRequiredFields,
    normalizeText
} from '../utils';

describe('Demo Data Generation Utils', () => {
    describe('generateUUID', () => {
        it('should generate a valid UUID', () => {
            const uuid = generateUUID();
            expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
        });

        it('should generate unique UUIDs', () => {
            const uuid1 = generateUUID();
            const uuid2 = generateUUID();
            expect(uuid1).not.toBe(uuid2);
        });
    });

    describe('randomInt', () => {
        it('should generate numbers within range', () => {
            for (let i = 0; i < 100; i++) {
                const num = randomInt(1, 10);
                expect(num).toBeGreaterThanOrEqual(1);
                expect(num).toBeLessThanOrEqual(10);
                expect(Number.isInteger(num)).toBe(true);
            }
        });
    });

    describe('randomFloat', () => {
        it('should generate floats within range with correct decimals', () => {
            for (let i = 0; i < 100; i++) {
                const num = randomFloat(1.0, 10.0, 2);
                expect(num).toBeGreaterThanOrEqual(1.0);
                expect(num).toBeLessThanOrEqual(10.0);
                expect(num.toString().split('.')[1]?.length || 0).toBeLessThanOrEqual(2);
            }
        });
    });

    describe('randomChoice', () => {
        it('should pick an element from array', () => {
            const array = ['a', 'b', 'c', 'd'];
            const choice = randomChoice(array);
            expect(array).toContain(choice);
        });
    });

    describe('randomChoices', () => {
        it('should pick multiple unique elements', () => {
            const array = ['a', 'b', 'c', 'd', 'e'];
            const choices = randomChoices(array, 3);
            expect(choices).toHaveLength(3);
            expect(new Set(choices).size).toBe(3); // All unique
            choices.forEach(choice => expect(array).toContain(choice));
        });

        it('should not exceed array length', () => {
            const array = ['a', 'b'];
            const choices = randomChoices(array, 5);
            expect(choices).toHaveLength(2);
        });
    });

    describe('shuffleArray', () => {
        it('should return array with same elements', () => {
            const original = [1, 2, 3, 4, 5];
            const shuffled = shuffleArray(original);
            expect(shuffled).toHaveLength(original.length);
            expect(shuffled.sort()).toEqual(original.sort());
        });

        it('should not modify original array', () => {
            const original = [1, 2, 3, 4, 5];
            const originalCopy = [...original];
            shuffleArray(original);
            expect(original).toEqual(originalCopy);
        });
    });

    describe('generateEmail', () => {
        it('should generate valid email format', () => {
            const email = generateEmail('John', 'Doe');
            expect(email).toBe('john.doe@university.edu');
        });

        it('should use custom domain', () => {
            const email = generateEmail('Jane', 'Smith', 'example.com');
            expect(email).toBe('jane.smith@example.com');
        });
    });

    describe('generateStudentId', () => {
        it('should generate student ID with correct format', () => {
            const studentId = generateStudentId('CS', 2021);
            expect(studentId).toMatch(/^CS2021\d{3}$/);
        });
    });

    describe('generateEmployeeId', () => {
        it('should generate employee ID with correct format', () => {
            const employeeId = generateEmployeeId('FAC');
            expect(employeeId).toMatch(/^FAC\d{3}$/);
        });
    });

    describe('generateCGPA', () => {
        it('should generate CGPA within valid range', () => {
            for (let year = 1; year <= 4; year++) {
                const cgpa = generateCGPA(year);
                expect(cgpa).toBeGreaterThanOrEqual(6.0);
                expect(cgpa).toBeLessThanOrEqual(10.0);
            }
        });
    });

    describe('generatePhoneNumber', () => {
        it('should generate phone number with correct format', () => {
            const phone = generatePhoneNumber();
            expect(phone).toMatch(/^\+1-\d{3}-\d{3}-\d{4}$/);
        });
    });

    describe('isValidAcademicProgression', () => {
        it('should validate correct year/semester combinations', () => {
            expect(isValidAcademicProgression(1, 1)).toBe(true);
            expect(isValidAcademicProgression(1, 2)).toBe(true);
            expect(isValidAcademicProgression(2, 3)).toBe(true);
            expect(isValidAcademicProgression(2, 4)).toBe(true);
            expect(isValidAcademicProgression(4, 8)).toBe(true);
        });

        it('should reject invalid year/semester combinations', () => {
            expect(isValidAcademicProgression(1, 3)).toBe(false);
            expect(isValidAcademicProgression(2, 1)).toBe(false);
            expect(isValidAcademicProgression(4, 9)).toBe(false);
        });
    });

    describe('calculateRelevanceScore', () => {
        it('should calculate relevance based on skill matching', () => {
            const studentSkills = ['JavaScript', 'React', 'Node.js'];
            const requiredSkills = ['JavaScript', 'React'];
            const score = calculateRelevanceScore(studentSkills, requiredSkills);
            expect(score).toBeGreaterThan(0.8); // Should be high match
        });

        it('should return low score for no matches', () => {
            const studentSkills = ['Python', 'Django'];
            const requiredSkills = ['JavaScript', 'React'];
            const score = calculateRelevanceScore(studentSkills, requiredSkills);
            expect(score).toBeLessThan(0.5); // Should be low match
        });
    });

    describe('validateRequiredFields', () => {
        it('should validate required fields correctly', () => {
            const obj = { name: 'John', email: 'john@example.com', age: null };
            const result = validateRequiredFields(obj, ['name', 'email']);
            expect(result.isValid).toBe(true);
            expect(result.missingFields).toHaveLength(0);
        });

        it('should detect missing fields', () => {
            const obj = { name: 'John', email: '', age: null };
            const result = validateRequiredFields(obj, ['name', 'email', 'age']);
            expect(result.isValid).toBe(false);
            expect(result.missingFields).toContain('email');
            expect(result.missingFields).toContain('age');
        });
    });

    describe('normalizeText', () => {
        it('should normalize whitespace', () => {
            const text = '  Hello    world  \n  test  ';
            const normalized = normalizeText(text);
            expect(normalized).toBe('Hello world test');
        });
    });
});

// Mock test to verify the infrastructure is working
describe('Infrastructure Test', () => {
    it('should be able to import all utilities', () => {
        expect(typeof generateUUID).toBe('function');
        expect(typeof randomInt).toBe('function');
        expect(typeof generateEmail).toBe('function');
        expect(typeof generateStudentId).toBe('function');
    });
});