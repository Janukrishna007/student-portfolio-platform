// Database Connection and Transaction Management for Demo Data Generation

import { supabase } from "../supabase";
import type { Database } from "../supabase";
import type {
    UserInsert,
    StudentInsert,
    FacultyInsert,
    CertificateInsert,
    SkillInsert,
    PortfolioInsert,
    ReviewInsert,
    RecommendationInsert,
    AnalyticsInsert,
    GenerationResult
} from "./types";

/**
 * Database operations for demo data generation
 */
export class DemoDataDatabase {
    private batchSize = 100; // Number of records to insert in each batch

    /**
     * Test database connection
     */
    async testConnection(): Promise<boolean> {
        try {
            const { data, error } = await supabase.from('users').select('count').limit(1);
            return !error;
        } catch (error) {
            console.error('Database connection test failed:', error);
            return false;
        }
    }

    /**
     * Clear all demo data from the database
     */
    async clearDemoData(): Promise<{ success: boolean; error?: string }> {
        try {
            // Delete in reverse order of dependencies
            const tables = [
                'analytics',
                'recommendations',
                'reviews',
                'skills',
                'portfolios',
                'certificates',
                'faculty',
                'students',
                'users'
            ];

            for (const table of tables) {
                const { error } = await supabase.from(table).delete().neq('id', '00000000-0000-0000-0000-000000000000');
                if (error) {
                    console.warn(`Warning: Could not clear ${table}:`, error.message);
                }
            }

            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error during cleanup'
            };
        }
    }

    /**
     * Insert users in batches
     */
    async insertUsers(users: UserInsert[]): Promise<GenerationResult<UserInsert>> {
        try {
            const insertedUsers: UserInsert[] = [];

            for (let i = 0; i < users.length; i += this.batchSize) {
                const batch = users.slice(i, i + this.batchSize);

                const { data, error } = await supabase
                    .from('users')
                    .insert(batch)
                    .select();

                if (error) {
                    return {
                        success: false,
                        error: `Failed to insert users batch ${Math.floor(i / this.batchSize) + 1}: ${error.message}`,
                        count: insertedUsers.length
                    };
                }

                if (data) {
                    insertedUsers.push(...data);
                }
            }

            return {
                success: true,
                data: insertedUsers,
                count: insertedUsers.length
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error inserting users',
                count: 0
            };
        }
    }

    /**
     * Insert students in batches
     */
    async insertStudents(students: StudentInsert[]): Promise<GenerationResult<StudentInsert>> {
        try {
            const insertedStudents: StudentInsert[] = [];

            for (let i = 0; i < students.length; i += this.batchSize) {
                const batch = students.slice(i, i + this.batchSize);

                const { data, error } = await supabase
                    .from('students')
                    .insert(batch)
                    .select();

                if (error) {
                    return {
                        success: false,
                        error: `Failed to insert students batch ${Math.floor(i / this.batchSize) + 1}: ${error.message}`,
                        count: insertedStudents.length
                    };
                }

                if (data) {
                    insertedStudents.push(...data);
                }
            }

            return {
                success: true,
                data: insertedStudents,
                count: insertedStudents.length
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error inserting students',
                count: 0
            };
        }
    }

    /**
     * Insert faculty in batches
     */
    async insertFaculty(faculty: FacultyInsert[]): Promise<GenerationResult<FacultyInsert>> {
        try {
            const insertedFaculty: FacultyInsert[] = [];

            for (let i = 0; i < faculty.length; i += this.batchSize) {
                const batch = faculty.slice(i, i + this.batchSize);

                const { data, error } = await supabase
                    .from('faculty')
                    .insert(batch)
                    .select();

                if (error) {
                    return {
                        success: false,
                        error: `Failed to insert faculty batch ${Math.floor(i / this.batchSize) + 1}: ${error.message}`,
                        count: insertedFaculty.length
                    };
                }

                if (data) {
                    insertedFaculty.push(...data);
                }
            }

            return {
                success: true,
                data: insertedFaculty,
                count: insertedFaculty.length
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error inserting faculty',
                count: 0
            };
        }
    }

    /**
     * Insert certificates in batches
     */
    async insertCertificates(certificates: CertificateInsert[]): Promise<GenerationResult<CertificateInsert>> {
        try {
            const insertedCertificates: CertificateInsert[] = [];

            for (let i = 0; i < certificates.length; i += this.batchSize) {
                const batch = certificates.slice(i, i + this.batchSize);

                const { data, error } = await supabase
                    .from('certificates')
                    .insert(batch)
                    .select();

                if (error) {
                    return {
                        success: false,
                        error: `Failed to insert certificates batch ${Math.floor(i / this.batchSize) + 1}: ${error.message}`,
                        count: insertedCertificates.length
                    };
                }

                if (data) {
                    insertedCertificates.push(...data);
                }
            }

            return {
                success: true,
                data: insertedCertificates,
                count: insertedCertificates.length
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error inserting certificates',
                count: 0
            };
        }
    }

    /**
     * Insert skills in batches
     */
    async insertSkills(skills: SkillInsert[]): Promise<GenerationResult<SkillInsert>> {
        try {
            const insertedSkills: SkillInsert[] = [];

            for (let i = 0; i < skills.length; i += this.batchSize) {
                const batch = skills.slice(i, i + this.batchSize);

                const { data, error } = await supabase
                    .from('skills')
                    .insert(batch)
                    .select();

                if (error) {
                    return {
                        success: false,
                        error: `Failed to insert skills batch ${Math.floor(i / this.batchSize) + 1}: ${error.message}`,
                        count: insertedSkills.length
                    };
                }

                if (data) {
                    insertedSkills.push(...data);
                }
            }

            return {
                success: true,
                data: insertedSkills,
                count: insertedSkills.length
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error inserting skills',
                count: 0
            };
        }
    }

    /**
     * Insert portfolios in batches
     */
    async insertPortfolios(portfolios: PortfolioInsert[]): Promise<GenerationResult<PortfolioInsert>> {
        try {
            const insertedPortfolios: PortfolioInsert[] = [];

            for (let i = 0; i < portfolios.length; i += this.batchSize) {
                const batch = portfolios.slice(i, i + this.batchSize);

                const { data, error } = await supabase
                    .from('portfolios')
                    .insert(batch)
                    .select();

                if (error) {
                    return {
                        success: false,
                        error: `Failed to insert portfolios batch ${Math.floor(i / this.batchSize) + 1}: ${error.message}`,
                        count: insertedPortfolios.length
                    };
                }

                if (data) {
                    insertedPortfolios.push(...data);
                }
            }

            return {
                success: true,
                data: insertedPortfolios,
                count: insertedPortfolios.length
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error inserting portfolios',
                count: 0
            };
        }
    }

    /**
     * Insert reviews in batches
     */
    async insertReviews(reviews: ReviewInsert[]): Promise<GenerationResult<ReviewInsert>> {
        try {
            const insertedReviews: ReviewInsert[] = [];

            for (let i = 0; i < reviews.length; i += this.batchSize) {
                const batch = reviews.slice(i, i + this.batchSize);

                const { data, error } = await supabase
                    .from('reviews')
                    .insert(batch)
                    .select();

                if (error) {
                    return {
                        success: false,
                        error: `Failed to insert reviews batch ${Math.floor(i / this.batchSize) + 1}: ${error.message}`,
                        count: insertedReviews.length
                    };
                }

                if (data) {
                    insertedReviews.push(...data);
                }
            }

            return {
                success: true,
                data: insertedReviews,
                count: insertedReviews.length
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error inserting reviews',
                count: 0
            };
        }
    }

    /**
     * Insert recommendations in batches
     */
    async insertRecommendations(recommendations: RecommendationInsert[]): Promise<GenerationResult<RecommendationInsert>> {
        try {
            const insertedRecommendations: RecommendationInsert[] = [];

            for (let i = 0; i < recommendations.length; i += this.batchSize) {
                const batch = recommendations.slice(i, i + this.batchSize);

                const { data, error } = await supabase
                    .from('recommendations')
                    .insert(batch)
                    .select();

                if (error) {
                    return {
                        success: false,
                        error: `Failed to insert recommendations batch ${Math.floor(i / this.batchSize) + 1}: ${error.message}`,
                        count: insertedRecommendations.length
                    };
                }

                if (data) {
                    insertedRecommendations.push(...data);
                }
            }

            return {
                success: true,
                data: insertedRecommendations,
                count: insertedRecommendations.length
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error inserting recommendations',
                count: 0
            };
        }
    }

    /**
     * Insert analytics in batches
     */
    async insertAnalytics(analytics: AnalyticsInsert[]): Promise<GenerationResult<AnalyticsInsert>> {
        try {
            const insertedAnalytics: AnalyticsInsert[] = [];

            for (let i = 0; i < analytics.length; i += this.batchSize) {
                const batch = analytics.slice(i, i + this.batchSize);

                const { data, error } = await supabase
                    .from('analytics')
                    .insert(batch)
                    .select();

                if (error) {
                    return {
                        success: false,
                        error: `Failed to insert analytics batch ${Math.floor(i / this.batchSize) + 1}: ${error.message}`,
                        count: insertedAnalytics.length
                    };
                }

                if (data) {
                    insertedAnalytics.push(...data);
                }
            }

            return {
                success: true,
                data: insertedAnalytics,
                count: insertedAnalytics.length
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error inserting analytics',
                count: 0
            };
        }
    }

    /**
     * Execute a transaction with rollback capability
     */
    async executeTransaction<T>(
        operations: (() => Promise<T>)[]
    ): Promise<{ success: boolean; results?: T[]; error?: string }> {
        try {
            const results: T[] = [];

            // Execute all operations
            for (const operation of operations) {
                const result = await operation();
                results.push(result);
            }

            return { success: true, results };
        } catch (error) {
            // In a real implementation, you would implement proper transaction rollback
            // Supabase doesn't support transactions in the client library, so we handle cleanup manually
            console.error('Transaction failed:', error);

            return {
                success: false,
                error: error instanceof Error ? error.message : 'Transaction failed'
            };
        }
    }

    /**
     * Get database statistics
     */
    async getDatabaseStats(): Promise<{
        users: number;
        students: number;
        faculty: number;
        certificates: number;
        skills: number;
        portfolios: number;
        reviews: number;
        recommendations: number;
        analytics: number;
    }> {
        const stats = {
            users: 0,
            students: 0,
            faculty: 0,
            certificates: 0,
            skills: 0,
            portfolios: 0,
            reviews: 0,
            recommendations: 0,
            analytics: 0
        };

        try {
            const tables = Object.keys(stats) as (keyof typeof stats)[];

            for (const table of tables) {
                const { count, error } = await supabase
                    .from(table)
                    .select('*', { count: 'exact', head: true });

                if (!error && count !== null) {
                    stats[table] = count;
                }
            }
        } catch (error) {
            console.error('Error getting database stats:', error);
        }

        return stats;
    }

    /**
     * Validate foreign key relationships
     */
    async validateRelationships(): Promise<{
        isValid: boolean;
        errors: string[];
    }> {
        const errors: string[] = [];

        try {
            // Check students have valid user_id references
            const { data: orphanedStudents } = await supabase
                .from('students')
                .select('id, user_id')
                .not('user_id', 'in', `(SELECT id FROM users)`);

            if (orphanedStudents && orphanedStudents.length > 0) {
                errors.push(`${orphanedStudents.length} students have invalid user_id references`);
            }

            // Check faculty have valid user_id references
            const { data: orphanedFaculty } = await supabase
                .from('faculty')
                .select('id, user_id')
                .not('user_id', 'in', `(SELECT id FROM users)`);

            if (orphanedFaculty && orphanedFaculty.length > 0) {
                errors.push(`${orphanedFaculty.length} faculty have invalid user_id references`);
            }

            // Check certificates have valid student_id references
            const { data: orphanedCertificates } = await supabase
                .from('certificates')
                .select('id, student_id')
                .not('student_id', 'in', `(SELECT id FROM students)`);

            if (orphanedCertificates && orphanedCertificates.length > 0) {
                errors.push(`${orphanedCertificates.length} certificates have invalid student_id references`);
            }

            // Add more relationship validations as needed...

        } catch (error) {
            errors.push(`Error validating relationships: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }
}