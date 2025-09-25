"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Search,
  FileText,
  Calendar,
  Building,
  Download,
  Trash2,
  CheckCircle,
  Clock,
  XCircle,
  Upload,
  ExternalLink,
} from "lucide-react";
import { CertificateUploadDialog } from "../portfolio/certificate-upload-dialog";
import { certificateService } from "@/lib/certificate-service";
import { ProfileService } from "@/lib/profile-service";
import { useToast } from "@/hooks/use-toast";
import type { Certificate } from "@/lib/types";

interface CertificateManagerProps {
  studentId?: string;
}

export function CertificateManager({ studentId }: CertificateManagerProps) {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [currentStudentId, setCurrentStudentId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    initializeComponent();
  }, [studentId]);

  useEffect(() => {
    if (currentStudentId) {
      loadCertificates();
    }
  }, [currentStudentId, searchTerm]);

  const initializeComponent = async () => {
    if (studentId) {
      setCurrentStudentId(studentId);
    } else {
      // Get current user's student ID
      const { user, profile } = await ProfileService.getCurrentUser();
      if (user && user.role === "student" && profile) {
        setCurrentStudentId(profile.id);
      }
    }
  };

  const loadCertificates = async () => {
    if (!currentStudentId) return;

    try {
      setLoading(true);

      let certificateList: Certificate[];

      if (searchTerm.trim()) {
        certificateList = await certificateService.searchCertificates(
          currentStudentId,
          searchTerm
        );
      } else {
        certificateList = await certificateService.getCertificatesByStudent(
          currentStudentId
        );
      }

      setCertificates(certificateList);
    } catch (error) {
      console.error("Error loading certificates:", error);
      toast({
        title: "Error",
        description: "Failed to load certificates",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCertificate = async (certificateId: string) => {
    try {
      const success = await certificateService.deleteCertificate(certificateId);

      if (success) {
        setCertificates((prev) =>
          prev.filter((cert) => cert.id !== certificateId)
        );
        toast({
          title: "Success",
          description: "Certificate deleted successfully",
        });
      } else {
        throw new Error("Delete operation failed");
      }
    } catch (error) {
      console.error("Error deleting certificate:", error);
      toast({
        title: "Error",
        description: "Failed to delete certificate",
        variant: "destructive",
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-orange-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "verified":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-orange-100 text-orange-800";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "academic":
        return "bg-blue-100 text-blue-800";
      case "professional":
        return "bg-purple-100 text-purple-800";
      case "skill":
        return "bg-green-100 text-green-800";
      case "achievement":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (!currentStudentId) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            No student profile found. Please complete your profile first.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Certificates</h2>
          <p className="text-muted-foreground">
            Manage your certificates and track verification status
          </p>
        </div>
        <Button onClick={() => setIsUploadDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Certificate
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search certificates by title or issuer..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{certificates.length}</p>
                <p className="text-sm text-muted-foreground">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">
                  {certificates.filter((c) => c.status === "verified").length}
                </p>
                <p className="text-sm text-muted-foreground">Verified</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-8 w-8 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">
                  {certificates.filter((c) => c.status === "pending").length}
                </p>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Upload className="h-8 w-8 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">
                  {certificates.filter((c) => c.certificate_url).length}
                </p>
                <p className="text-sm text-muted-foreground">With Files</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Certificates List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="flex space-x-2">
                    <div className="h-6 bg-gray-200 rounded w-16"></div>
                    <div className="h-6 bg-gray-200 rounded w-20"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : certificates.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              No certificates found
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm
                ? "No certificates match your search criteria."
                : "Start building your portfolio by adding your first certificate."}
            </p>
            {!searchTerm && (
              <Button onClick={() => setIsUploadDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Certificate
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {certificates.map((certificate) => (
            <Card
              key={certificate.id}
              className="hover:shadow-md transition-shadow"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-2 mb-1">
                      {certificate.title}
                    </CardTitle>
                    <CardDescription className="flex items-center text-sm">
                      <Building className="h-3 w-3 mr-1" />
                      {certificate.issuer}
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-1 ml-2">
                    {getStatusIcon(certificate.status)}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-3 w-3 mr-1" />
                    {formatDate(certificate.issue_date)}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Badge
                      variant="secondary"
                      className={getCategoryColor(certificate.category)}
                    >
                      {certificate.category}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={getStatusColor(certificate.status)}
                    >
                      {certificate.status}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex space-x-2">
                      {certificate.certificate_url && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            window.open(certificate.certificate_url!, "_blank")
                          }
                        >
                          <ExternalLink className="h-3 w-3 mr-1" />
                          View
                        </Button>
                      )}
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteCertificate(certificate.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Upload Dialog */}
      <CertificateUploadDialog
        isOpen={isUploadDialogOpen}
        onClose={() => setIsUploadDialogOpen(false)}
        studentId={currentStudentId}
        onUploadSuccess={() => {
          loadCertificates();
          setIsUploadDialogOpen(false);
        }}
      />
    </div>
  );
}
