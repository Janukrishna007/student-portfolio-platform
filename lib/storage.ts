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
      // Ensure bucket exists first
      const bucketExists = await this.ensureBucketExists();
      if (!bucketExists) {
        return {
          url: "",
          path: "",
          error: "Storage bucket not available. Please contact support.",
        };
      }

      // Validate file type
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "application/pdf",
      ];

      if (!allowedTypes.includes(file.type)) {
        return {
          url: "",
          path: "",
          error:
            "Invalid file type. Only JPEG, PNG, and PDF files are allowed.",
        };
      }

      // Validate file size (5MB limit)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        return {
          url: "",
          path: "",
          error: "File size too large. Maximum size is 5MB.",
        };
      }

      // Clean filename and generate unique filename
      const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
      const fileExt = originalName.split(".").pop()?.toLowerCase();
      const timestamp = Date.now();
      const randomId = Math.random().toString(36).substring(2, 15);

      const fileName = certificateId
        ? `${certificateId}_${timestamp}.${fileExt}`
        : `${studentId}_${timestamp}_${randomId}.${fileExt}`;

      const filePath = `${studentId}/${fileName}`;

      console.log("Uploading to path:", filePath);

      // Upload file to Supabase Storage
      const { data, error } = await supabase.storage
        .from("certificates")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false, // Don't overwrite, create unique files
        });

      if (error) {
        console.error("Upload error:", error);

        // Handle specific error cases
        if (error.message.includes("already exists")) {
          // Try with a different filename
          const retryFileName = `${studentId}_${Date.now()}_${Math.random()
            .toString(36)
            .substring(2, 15)}.${fileExt}`;
          const retryPath = `${studentId}/${retryFileName}`;

          const { data: retryData, error: retryError } = await supabase.storage
            .from("certificates")
            .upload(retryPath, file, {
              cacheControl: "3600",
              upsert: false,
            });

          if (retryError) {
            return {
              url: "",
              path: "",
              error: `Upload failed: ${retryError.message}`,
            };
          }

          // Get public URL for retry
          const { data: retryPublicUrlData } = supabase.storage
            .from("certificates")
            .getPublicUrl(retryPath);

          return {
            url: retryPublicUrlData.publicUrl,
            path: retryPath,
          };
        }

        return {
          url: "",
          path: "",
          error: `Upload failed: ${error.message}`,
        };
      }

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from("certificates")
        .getPublicUrl(filePath);

      console.log("Upload successful:", {
        path: filePath,
        url: publicUrlData.publicUrl,
      });

      return {
        url: publicUrlData.publicUrl,
        path: filePath,
      };
    } catch (error) {
      console.error("Storage upload error:", error);
      return {
        url: "",
        path: "",
        error: "An unexpected error occurred during upload.",
      };
    }
  }

  /**
   * Delete certificate file from storage
   */
  async deleteCertificate(
    filePath: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.storage
        .from("certificates")
        .remove([filePath]);

      if (error) {
        console.error("Delete error:", error);
        return {
          success: false,
          error: `Delete failed: ${error.message}`,
        };
      }

      return { success: true };
    } catch (error) {
      console.error("Storage delete error:", error);
      return {
        success: false,
        error: "An unexpected error occurred during deletion.",
      };
    }
  }

  /**
   * Get signed URL for private file access
   */
  async getSignedUrl(
    filePath: string,
    expiresIn: number = 3600
  ): Promise<string | null> {
    try {
      const { data, error } = await supabase.storage
        .from("certificates")
        .createSignedUrl(filePath, expiresIn);

      if (error) {
        console.error("Signed URL error:", error);
        return null;
      }

      return data.signedUrl;
    } catch (error) {
      console.error("Storage signed URL error:", error);
      return null;
    }
  }

  /**
   * Check if bucket exists and create if needed
   */
  async ensureBucketExists(): Promise<boolean> {
    try {
      // Try to get bucket info
      const { data, error } = await supabase.storage.getBucket("certificates");

      if (error && error.message.includes("not found")) {
        // Create bucket if it doesn't exist
        const { error: createError } = await supabase.storage.createBucket(
          "certificates",
          {
            public: true,
            allowedMimeTypes: [
              "image/jpeg",
              "image/jpg",
              "image/png",
              "application/pdf",
            ],
            fileSizeLimit: 5242880, // 5MB
          }
        );

        if (createError) {
          console.error("Bucket creation error:", createError);
          return false;
        }

        console.log("Certificates bucket created successfully");
        return true;
      }

      return !error;
    } catch (error) {
      console.error("Bucket check error:", error);
      return false;
    }
  }
}

export const storageManager = StorageManager.getInstance();
