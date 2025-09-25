# Demo Data Generation Design Document

## Overview

The demo data generation system will create realistic, interconnected sample data for the student portfolio platform. The system will generate data for all major entities including users, students, faculty, certificates, skills, portfolios, reviews, recommendations, and analytics. The data will be designed to showcase the platform's full functionality while maintaining referential integrity and realistic relationships.

## Architecture

### Data Generation Strategy

The demo data generation will follow a hierarchical approach:

1. **Foundation Layer**: Create users and authentication-related data
2. **Profile Layer**: Generate student and faculty profiles
3. **Content Layer**: Create certificates, skills, and portfolios
4. **Interaction Layer**: Generate reviews, recommendations, and analytics
5. **Verification Layer**: Ensure data consistency and relationships

### Data Sources and Patterns

- **Realistic Names**: Use diverse name pools representing different backgrounds
- **Academic Data**: Realistic department names, course titles, and academic progression
- **Certificate Data**: Industry-standard certification names and issuing organizations
- **Skills Mapping**: Logical skill extraction based on certificates and academic background
- **Timeline Consistency**: Proper chronological ordering of events

## Components and Interfaces

### 1. User and Authentication Data Generator

**Purpose**: Create base user accounts for students, faculty, and admin roles

**Components**:
- User account generator with email patterns
- Role assignment (student: 80%, faculty: 15%, admin: 5%)
- UUID generation for auth integration

**Sample Data Structure**:
```sql
-- Users table population
INSERT INTO public.users (id, email, role) VALUES 
  ('uuid-1', 'john.doe@university.edu', 'student'),
  ('uuid-2', 'prof.smith@university.edu', 'faculty');
```

### 2. Student Profile Generator

**Purpose**: Create comprehensive student profiles with academic information

**Components**:
- Student ID generation (department prefix + year + sequence)
- Academic progression logic (year/semester correlation)
- CGPA generation with realistic distribution
- Department assignment with proper distribution

**Sample Data Structure**:
```sql
-- Students table population
INSERT INTO public.students (user_id, student_id, first_name, last_name, department, year, semester, cgpa) VALUES 
  ('uuid-1', 'CS2021001', 'John', 'Doe', 'Computer Science', 3, 5, 8.5);
```

### 3. Faculty Profile Generator

**Purpose**: Create faculty profiles across departments

**Components**:
- Employee ID generation
- Department distribution
- Designation hierarchy (Assistant Professor, Associate Professor, Professor)
- Contact information generation

### 4. Certificate Generator

**Purpose**: Create realistic certificates aligned with student profiles

**Components**:
- Certificate categorization engine
- Issuer database (companies, institutions, platforms)
- Date logic (ensuring chronological consistency)
- Status distribution (70% verified, 20% pending, 10% rejected)

**Certificate Categories**:
- **Academic**: Course completions, academic achievements
- **Professional**: Industry certifications, internship certificates
- **Skill**: Technical skill certifications, online course completions
- **Achievement**: Competition wins, project recognitions

### 5. Skills Extraction Engine

**Purpose**: Generate skills based on certificates and academic background

**Components**:
- Skill mapping database (certificate → skills)
- Proficiency level assignment logic
- Category classification (technical, soft, domain)
- AI confidence scoring simulation

**Skill Generation Logic**:
```javascript
// Pseudo-code for skill extraction
function extractSkills(certificate, studentProfile) {
  const skills = skillMappingDB[certificate.category][certificate.title];
  return skills.map(skill => ({
    name: skill.name,
    category: skill.category,
    proficiency: calculateProficiency(studentProfile.year, skill.complexity),
    confidence: generateConfidenceScore()
  }));
}
```

### 6. Portfolio Generator

**Purpose**: Create portfolio entries showcasing student achievements

**Components**:
- Portfolio title and description generator
- Public URL generation with unique identifiers
- QR code URL simulation
- Public/private status assignment (60% public)

### 7. Review System Generator

**Purpose**: Create faculty reviews for certificates

**Components**:
- Faculty-certificate assignment logic
- Review status distribution
- Feedback generation with realistic comments
- Timeline consistency for review dates

### 8. Recommendation Engine

**Purpose**: Generate AI-powered career recommendations

**Components**:
- Recommendation type distribution (jobs: 40%, internships: 30%, courses: 20%, skills: 10%)
- Relevance score calculation based on student profile
- Company database for job/internship recommendations
- Course suggestion engine

**Recommendation Logic**:
```javascript
// Pseudo-code for recommendation generation
function generateRecommendations(studentProfile, skills) {
  const recommendations = [];
  
  // Job recommendations based on skills
  const jobRecommendations = jobDatabase
    .filter(job => hasMatchingSkills(job.requiredSkills, skills))
    .map(job => ({
      type: 'job',
      title: job.title,
      company: job.company,
      relevance: calculateRelevance(job.requiredSkills, skills)
    }));
    
  return recommendations;
}
```

### 9. Analytics Data Generator

**Purpose**: Create sample analytics data for reporting

**Components**:
- NAAC report data generator
- NIRF metrics calculator
- Department-wise analytics
- Student progress tracking data

## Data Models

### Student Profile Model
```typescript
interface StudentProfile {
  id: string;
  user_id: string;
  student_id: string;
  first_name: string;
  last_name: string;
  department: string;
  year: number;
  semester: number;
  cgpa: number;
  profile_image?: string;
  phone?: string;
}
```

### Certificate Model
```typescript
interface Certificate {
  id: string;
  student_id: string;
  title: string;
  issuer: string;
  issue_date: Date;
  certificate_url?: string;
  category: 'academic' | 'professional' | 'skill' | 'achievement';
  status: 'pending' | 'verified' | 'rejected';
}
```

### Skill Model
```typescript
interface Skill {
  id: string;
  student_id: string;
  skill_name: string;
  category: 'technical' | 'soft' | 'domain';
  proficiency_level: 'beginner' | 'intermediate' | 'advanced';
  source_certificate_id?: string;
  ai_confidence: number;
}
```

## Error Handling

### Data Consistency Validation
- Foreign key constraint validation
- Duplicate prevention mechanisms
- Data type validation
- Range validation for numeric fields

### Rollback Strategy
- Transaction-based data insertion
- Cleanup procedures for failed generations
- Partial data recovery mechanisms

### Logging and Monitoring
- Generation progress tracking
- Error logging for debugging
- Data quality metrics collection

## Testing Strategy

### Unit Testing
- Individual generator function testing
- Data validation testing
- Relationship integrity testing

### Integration Testing
- End-to-end data generation testing
- Database constraint validation
- Performance testing with large datasets

### Data Quality Testing
- Referential integrity validation
- Realistic data distribution verification
- Timeline consistency checking

### Sample Data Verification
- Manual review of generated profiles
- Skill-certificate alignment verification
- Recommendation relevance assessment

## Implementation Considerations

### Performance Optimization
- Batch insertion strategies
- Index-aware data generation
- Memory-efficient processing for large datasets

### Scalability
- Configurable data volume parameters
- Modular generation components
- Parallel processing capabilities

### Maintenance
- Easy data refresh mechanisms
- Version control for data schemas
- Documentation for data patterns

### Security
- No sensitive data in demo datasets
- Placeholder data for PII fields
- Secure random generation for IDs