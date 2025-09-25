import { supabase } from "./supabase";

export async function initializeStorage() {
  try {
    // Check if bucket exists
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.error("Error listing buckets:", bucketsError);
      return false;
    }

    const certificatesBucket = buckets?.find(bucket => bucket.name === 'certificates');
    
    if (!certificatesBucket) {
      // Create certificates bucket
      const { error: createError } = await supabase.storage.createBucket('certificates', {
        public: true,
        allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'],
        fileSizeLimit: 5242880, // 5MB
      });

      if (createError) {
        console.error("Error creating certificates bucket:", createError);
        return false;
      }

      console.log("✅ Certificates bucket created successfully");
    } else {
      console.log("✅ Certificates bucket already exists");
    }

    // Set up bucket policies (if needed)
    await setupStoragePolicies();

    return true;

  } catch (error) {
    console.error("Storage initialization error:", error);
    return false;
  }
}

async function setupStoragePolicies() {
  // In a real application, you might want to set up RLS policies for the storage bucket
  // For now, we'll rely on the bucket being public with proper authentication checks
  console.log("📝 Storage policies would be configured here in production");
}

// Run this function to initialize storage
export async function runStorageSetup() {
  console.log("🚀 Initializing Supabase Storage...");
  
  const success = await initializeStorage();
  
  if (success) {
    console.log("✅ Storage setup completed successfully!");
  } else {
    console.log("❌ Storage setup failed. Please check your Supabase configuration.");
  }
  
  return success;
}
