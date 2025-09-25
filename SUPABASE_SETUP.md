# Supabase Setup Instructions

## 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com) and create an account
2. Click "New Project"
3. Choose your organization
4. Enter project name: `student-portfolio-platform`
5. Enter database password (save this!)
6. Choose region closest to you
7. Click "Create new project"

## 2. Get Your Credentials
1. Go to your project dashboard
2. Click "Settings" → "API"
3. Copy the following:
   - **Project URL**: `https://your-project-ref.supabase.co`
   - **Anon public key**: `eyJ...` (starts with eyJ)
   - **Service role key**: `eyJ...` (starts with eyJ, but different from anon key)

## 3. Update Environment Variables
Open `.env.local` and replace the placeholder values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-actual-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-actual-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-actual-service-role-key
```

## 4. Set Up Database Schema
1. In your Supabase dashboard, go to "SQL Editor"
2. Click "New query"
3. Copy the entire contents of `database/schema.sql`
4. Paste it into the SQL editor
5. Click "Run" to execute the schema

This will create:
- ✅ Users table
- ✅ Students table  
- ✅ Certificates table
- ✅ Storage bucket for certificates
- ✅ Row Level Security policies
- ✅ Proper indexes and triggers

## 5. Test the Connection
```bash
npm run dev
```

Open your browser to `http://localhost:3000` and try logging in with the existing demo credentials:

- **Admin**: `admin@university.edu` / `password`
- **Faculty**: `prof.smith@university.edu` / `password`  
- **Student**: `john.doe@university.edu` / `password`

## 6. How It Works Now

### Dual Authentication System
The system now supports both:

1. **Mock Authentication** (current/fallback):
   - Uses localStorage for session management
   - Hardcoded demo users for testing
   - Works without Supabase configuration

2. **Supabase Authentication** (when configured):
   - Real user authentication with Supabase Auth
   - Database-backed user profiles
   - Secure session management
   - File upload capabilities

### Automatic Fallback
- If Supabase is not configured (placeholder URLs), it uses mock auth
- If Supabase fails, it falls back to mock auth
- Your existing login system continues to work unchanged

### Database Operations
Once Supabase is configured, you can:
- Create real user accounts
- Store student profiles in the database
- Upload and manage certificates
- Use proper role-based access control

## 7. Migration from Mock to Real Data

When you're ready to switch from mock data to real Supabase data:

1. **Create Auth Users**: Use Supabase Auth to create real user accounts
2. **Migrate Data**: Insert corresponding records in the `users` and `students` tables
3. **Update Components**: Components will automatically use Supabase data when available

## 8. Next Steps

1. **Configure Supabase** with your actual credentials
2. **Run the schema** to create database tables
3. **Test authentication** - it should work with both systems
4. **Create real users** through Supabase Auth UI or programmatically
5. **Upload certificates** using the real file storage system

## 9. Available Database Operations

The system now includes comprehensive database utilities in `lib/database.ts`:

- ✅ User management (create, read, update)
- ✅ Student profile management
- ✅ Certificate CRUD operations
- ✅ File upload/download for certificates
- ✅ Analytics and reporting functions
- ✅ Role-based data access

## 10. Security Features

- ✅ Row Level Security (RLS) enabled
- ✅ Role-based access policies
- ✅ Secure file upload policies  
- ✅ Proper data isolation between users
- ✅ Admin/Faculty elevated permissions

Your application is now ready for both development (mock data) and production (Supabase) use!
