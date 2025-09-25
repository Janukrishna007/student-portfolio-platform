"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Upload, FileText, AlertCircle, CheckCircle } from "lucide-react";
import { storageManager } from "@/lib/storage";
import { certificateService, type CertificateData } from "@/lib/certificate-service";

interface CertificateUploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  studentId: string;
  onUploadSuccess: () => void;
}

export function CertificateUploadDialog({
  isOpen,
  onClose,
  studentId,
  onUploadSuccess,
}: CertificateUploadDialogProps) {
  const [formData, setFormData] = useState<Partial<CertificateData>>({
    title: "",
    issuer: "",
    issue_date: "",
    category: "professional",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        setError('Invalid file type. Only JPEG, PNG, and PDF files are allowed.');
        return;
      }

      // Validate file size (5MB limit)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        setError('File size too large. Maximum size is 5MB.');
        return;
      }

      setSelectedFile(file);
      setError("");
    }
  };

  const handleInputChange = (field: keyof CertificateData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setError("");
  };

  const validateForm = (): boolean => {
    if (!formData.title?.trim()) {
      setError("Certificate title is required");
      return false;
    }
    if (!formData.issuer?.trim()) {
      setError("Issuer name is required");
      return false;
    }
    if (!formData.issue_date) {
      setError("Issue date is required");
      return false;
    }
    if (!formData.category) {
      setError("Category is required");
      return false;
    }
    return true;
  };

  const handleUpload = async () => {
    if (!validateForm()) return;

    setUploading(true);
    setUploadProgress("Creating certificate entry...");

    try {
      // First create the certificate entry in database
      const certificateData: CertificateData = {
        student_id: studentId,
        title: formData.title!,
        issuer: formData.issuer!,
        issue_date: formData.issue_date!,
        category: formData.category!,
        status: "pending"
      };

      const certificate = await certificateService.createCertificate(certificateData);
      
      if (!certificate) {
        throw new Error("Failed to create certificate entry");
      }

      // Upload file if provided
      if (selectedFile) {
        setUploadProgress("Uploading certificate file...");
        
        const uploadResult = await storageManager.uploadCertificate(
          selectedFile,
          studentId,
          certificate.id
        );

        if (uploadResult.error) {
          throw new Error(uploadResult.error);
        }

        // Update certificate with file URL
        setUploadProgress("Updating certificate record...");
        const updateSuccess = await certificateService.updateCertificateUrl(
          certificate.id,
          uploadResult.url
        );

        if (!updateSuccess) {
          throw new Error("Failed to update certificate with file URL");
        }
      }

      setUploadProgress("Upload completed successfully!");
      
      // Reset form and close dialog
      setTimeout(() => {
        resetForm();
        onClose();
        onUploadSuccess();
      }, 1500);

    } catch (error) {
      console.error("Upload error:", error);
      setError(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      issuer: "",
      issue_date: "",
      category: "professional",
    });
    setSelectedFile(null);
    setError("");
    setUploadProgress("");
  };

  const handleClose = () => {
    if (!uploading) {
      resetForm();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Upload Certificate</DialogTitle>
          <DialogDescription>
            Add a new certificate to your portfolio. Fill in the details and optionally upload the certificate file.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Certificate Title */}
          <div className="grid gap-2">
            <Label htmlFor="title">Certificate Title</Label>
            <Input
              id="title"
              placeholder="e.g., Google UX Design Certificate"
              value={formData.title || ""}
              onChange={(e) => handleInputChange("title", e.target.value)}
              disabled={uploading}
            />
          </div>

          {/* Issuer */}
          <div className="grid gap-2">
            <Label htmlFor="issuer">Issuing Organization</Label>
            <Input
              id="issuer"
              placeholder="e.g., Google (via Coursera)"
              value={formData.issuer || ""}
              onChange={(e) => handleInputChange("issuer", e.target.value)}
              disabled={uploading}
            />
          </div>

          {/* Issue Date */}
          <div className="grid gap-2">
            <Label htmlFor="issue_date">Issue Date</Label>
            <Input
              id="issue_date"
              type="date"
              value={formData.issue_date || ""}
              onChange={(e) => handleInputChange("issue_date", e.target.value)}
              disabled={uploading}
            />
          </div>

          {/* Category */}
          <div className="grid gap-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category || "professional"}
              onValueChange={(value) => handleInputChange("category", value)}
              disabled={uploading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="academic">Academic</SelectItem>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="skill">Skill-based</SelectItem>
                <SelectItem value="achievement">Achievement</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* File Upload */}
          <div className="grid gap-2">
            <Label htmlFor="file">Certificate File (Optional)</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              <input
                id="file"
                type="file"
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={handleFileSelect}
                disabled={uploading}
                className="hidden"
              />
              <label
                htmlFor="file"
                className={`flex flex-col items-center justify-center cursor-pointer ${
                  uploading ? "cursor-not-allowed opacity-50" : ""
                }`}
              >
                {selectedFile ? (
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <FileText className="w-4 h-4" />
                    <span>{selectedFile.name}</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-gray-500">
                    <Upload className="w-6 h-6" />
                    <span className="text-sm">Click to upload file</span>
                    <span className="text-xs">JPG, PNG, PDF (max 5MB)</span>
                  </div>
                )}
              </label>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}

          {/* Upload Progress */}
          {uploadProgress && (
            <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 p-3 rounded-lg">
              <CheckCircle className="w-4 h-4" />
              <span>{uploadProgress}</span>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={uploading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={uploading || !formData.title || !formData.issuer || !formData.issue_date}
          >
            {uploading ? "Uploading..." : "Upload Certificate"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
