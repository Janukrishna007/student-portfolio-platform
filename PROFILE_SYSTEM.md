# Profile Management System

This document outlines the comprehensive profile management system for the Student Portfolio Platform.

## Overview

The profile system supports three user types:

- **Students**: Complete academic profiles with certificates and skills tracking
- **Faculty**: Professional profiles with review and mentorship capabilities
- **Admin**: System administration with analytics access

## Database Schema

### Core Tables Created

1. **faculty** - Faculty member profiles
2. **skills** - AI-extracted skills from certificates
3. **portfolios** - Student portfolio generation
4. **reviews** - Faculty certificate reviews and feedback
5. **recommendations** - AI-generated career suggestions
6. **analytics** - NAAC/NIRF compliance reports

### Key Features

#### Student Profiles

- Personal information (name, student ID, department, year, semester)
- CGPA tracking
- Profile photo upload
- Skills automatically extracted from certificates
- Portfolio generation with QR codes
- Career recommendations based on skills

#### Faculty Profiles

- Professional information (name, employee ID, department, designation)
- Profile photo upload
- Certificate review capabilities
- Student mentorship tools
- Analytics on review activity

#### Admin Profiles

- Full system access
- Institution-wide analytics
- NAAC/NIRF report generation
- User management capabilities

## Components Created

### 1. ProfileEditForm

**Location**: `components/profile/profile-edit-form.tsx`

**Features**:

- Dynamic form based on user role (student/faculty)
- Profile photo upload with Supabase Storage
- Form validation with Zod
- Department and designation dropdowns
- Real-time updates

**Usage**:

```tsx
<ProfileEditForm user={user} profile={profile} onProfileUpdate={handleUpdate} />
```

### 2. ProfileDisplay

**Location**: `components/profile/profile-display.tsx`

**Features**:

- Role-specific profile information display
- Statistics cards (certificates, skills, reviews)
- Edit mode toggle
- Avatar display with fallbacks
- Skills overview for students

**Usage**:

```tsx
<ProfileDisplay user={user} profile={profile} onEdit={handleEdit} />
```

### 3. Profile Page

**Location**: `app/profile/page.tsx`

**Features**:

- Complete profile management interface
- Loading states with skeletons
- Error handling
- Auto-refresh on updates

## Services

### ProfileService

**Location**: `lib/profile-service.ts`

**Methods**:

- `getCurrentUser()` - Get authenticated user and profile
- `getUserProfile()` - Fetch user profile by role
- `updateStudentProfile()` - Update student information
- `updateFacultyProfile()` - Update faculty information
- `uploadProfileImage()` - Handle avatar uploads
- `getStudentStats()` - Calculate student statistics
- `getFacultyStats()` - Calculate faculty statistics

## Database Setup

### 1. Run Enhanced Schema

Execute the SQL file to create all necessary tables:

```sql
-- Run this in Supabase SQL Editor
\include database/enhanced-schema.sql
```

### 2. Storage Buckets

The system creates these storage buckets:

- `certificates` - Certificate file uploads
- `avatars` - Profile photo uploads

### 3. Row Level Security

Comprehensive RLS policies ensure:

- Students can only access their own data
- Faculty can review certificates and view student profiles
- Admin has full system access
- Public portfolios are viewable by anyone

## API Integration

### Supabase Types

Updated TypeScript types in `lib/supabase.ts` include all new tables with proper Insert/Update/Row interfaces.

### Authentication Flow

1. User authenticates via Supabase Auth
2. Profile service fetches user role from `users` table
3. Appropriate profile data loaded from `students` or `faculty` table
4. Statistics calculated from related tables

## Usage Examples

### Basic Profile Display

```tsx
import { ProfileDisplay } from "@/components/profile/profile-display";

export default function MyProfile() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    ProfileService.getCurrentUser().then(({ user, profile }) => {
      setUser(user);
      setProfile(profile);
    });
  }, []);

  return <ProfileDisplay user={user} profile={profile} />;
}
```

### Profile Statistics Access

```tsx
// For students
const { stats } = await ProfileService.getStudentStats(studentId);
// Returns: totalCertificates, verifiedCertificates, totalSkills, etc.

// For faculty
const { stats } = await ProfileService.getFacultyStats(facultyId);
// Returns: totalReviews, approvedReviews, studentsSupervised, etc.
```

## Next Steps

1. **AI Integration**: Implement certificate parsing for automatic skill extraction
2. **Portfolio Generation**: Create dynamic portfolio templates
3. **QR Code System**: Generate verification QR codes for portfolios
4. **Analytics Dashboard**: Build comprehensive reporting interface
5. **Mobile Optimization**: Ensure responsive design for mobile users

## File Structure

```
components/
  profile/
    profile-edit-form.tsx     # Profile editing interface
    profile-display.tsx       # Profile viewing interface
app/
  profile/
    page.tsx                 # Main profile page
lib/
  profile-service.ts         # Profile data operations
  types.ts                   # Updated TypeScript interfaces
  supabase.ts               # Enhanced database types
database/
  enhanced-schema.sql        # Complete database schema
```

This profile system provides a solid foundation for the complete Student Portfolio Platform with room for future enhancements and AI integration.
