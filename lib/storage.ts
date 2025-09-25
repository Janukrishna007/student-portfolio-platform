import { supabase } from "./supabase";

export interface UploadResult {
  url: string;
  path: string;
  error?: string;
}

export class StorageManager {
  private static instance: StorageManager;
  
  static getInstance(): StorageManager {
    if (!StorageManager.instance) {
      StorageManager.instance = new StorageManager();
    }
    return StorageManager.instance;
  }

  /**
   * Upload certificate file to Supabase Storage
   */
  async uploadCertificate(
    file: File,
    studentId: string,
    certificateId?: string
  ): Promise<UploadResult> {
    try {
      // Validate file type
      const allowedTypes = [
        'image/jpeg',
        'image/jpg', 
        'image/png',
        'application/pdf'
      ];
      
      if (!allowedTypes.includes(file.type)) {
        return {
          url: '',
          path: '',
          error: 'Invalid file type. Only JPEG, PNG, and PDF files are allowed.'
        };
      }

      // Validate file size (5MB limit)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        return {
          url: '',
          path: '',
          error: 'File size too large. Maximum size is 5MB.'
        };
      }

      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = certificateId 
        ? `${certificateId}.${fileExt}`
        : `${studentId}_${Date.now()}.${fileExt}`;
      
      const filePath = `certificates/${studentId}/${fileName}`;

      // Upload file to Supabase Storage
      const { data, error } = await supabase.storage
        .from('certificates')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true, // Allow overwriting existing files
        });

      if (error) {
        console.error('Upload error:', error);
        return {
          url: '',
          path: '',
          error: `Upload failed: ${error.message}`
        };
      }

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('certificates')
        .getPublicUrl(filePath);

      return {
        url: publicUrlData.publicUrl,
        path: filePath,
      };

    } catch (error) {
      console.error('Storage upload error:', error);
      return {
        url: '',
        path: '',
        error: 'An unexpected error occurred during upload.'
      };
    }
  }

  /**
   * Delete certificate file from storage
   */
  async deleteCertificate(filePath: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.storage
        .from('certificates')
        .remove([filePath]);

      if (error) {
        console.error('Delete error:', error);
        return {
          success: false,
          error: `Delete failed: ${error.message}`
        };
      }

      return { success: true };

    } catch (error) {
      console.error('Storage delete error:', error);
      return {
        success: false,
        error: 'An unexpected error occurred during deletion.'
      };
    }
  }

  /**
   * Get signed URL for private file access
   */
  async getSignedUrl(filePath: string, expiresIn: number = 3600): Promise<string | null> {
    try {
      const { data, error } = await supabase.storage
        .from('certificates')
        .createSignedUrl(filePath, expiresIn);

      if (error) {
        console.error('Signed URL error:', error);
        return null;
      }

      return data.signedUrl;

    } catch (error) {
      console.error('Storage signed URL error:', error);
      return null;
    }
  }

  /**
   * Check if bucket exists and create if needed
   */
  async ensureBucketExists(): Promise<boolean> {
    try {
      // Try to get bucket info
      const { data, error } = await supabase.storage.getBucket('certificates');
      
      if (error && error.message.includes('not found')) {
        // Create bucket if it doesn't exist
        const { error: createError } = await supabase.storage.createBucket('certificates', {
          public: true,
          allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'],
          fileSizeLimit: 5242880, // 5MB
        });

        if (createError) {
          console.error('Bucket creation error:', createError);
          return false;
        }
        
        console.log('Certificates bucket created successfully');
        return true;
      }

      return !error;

    } catch (error) {
      console.error('Bucket check error:', error);
      return false;
    }
  }
}

export const storageManager = StorageManager.getInstance();
