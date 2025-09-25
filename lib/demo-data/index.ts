// Demo Data Generation - Main Export File

export * from './types';
export * from './utils';
export * from './database';

// Re-export generators
export * from './generators/user-generator';
export * from './generators/student-generator';
export * from './generators/faculty-generator';

// Re-export commonly used utilities
export {
    generateUUID,
    randomInt,
    randomFloat,
    randomChoice,
    randomChoices,
    shuffleArray,
    randomDate,
    randomPastDate,
    formatDateForDB,
    formatDateOnly,
    generateEmail,
    generateStudentId,
    generateEmployeeId,
    generateCGPA,
    generatePhoneNumber,
    generateURL,
    generateQRCodeURL,
    logProgress,
    delay
} from './utils';

export {
    DemoDataDatabase
} from './database';

export {
    UserGenerator,
    generateDemoUsers
} from './generators/user-generator';

export {
    StudentGenerator,
    generateDemoStudents,
    DEPARTMENTS
} from './generators/student-generator';

export {
    FacultyGenerator,
    generateDemoFaculty,
    FACULTY_DESIGNATIONS
} from './generators/faculty-generator';

export {
    DEFAULT_DEMO_CONFIG,
    type DemoDataConfig,
    type GenerationResult,
    type DemoDataGenerationResult,
    type Department,
    type CertificateTemplate,
    type SkillTemplate,
    type CompanyTemplate,
    type JobTemplate
} from './types';