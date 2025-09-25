import { supabase } from "./supabase";
import type { Database } from "./supabase";

type Certificate = Database['public']['Tables']['certificates']['Row'];
type CertificateInsert = Database['public']['Tables']['certificates']['Insert'];
type CertificateUpdate = Database['public']['Tables']['certificates']['Update'];

export interface CertificateData {
  id?: string;
  student_id: string;
  title: string;
  issuer: string;
  issue_date: string;
  certificate_url?: string | null;
  category: "academic" | "professional" | "skill" | "achievement";
  status?: "pending" | "verified" | "rejected";
}

export class CertificateService {
  private static instance: CertificateService;
  
  static getInstance(): CertificateService {
    if (!CertificateService.instance) {
      CertificateService.instance = new CertificateService();
    }
    return CertificateService.instance;
  }

  /**
   * Create a new certificate entry
   */
  async createCertificate(certificateData: CertificateData): Promise<Certificate | null> {
    try {
      const { data, error } = await supabase
        .from('certificates')
        .insert({
          student_id: certificateData.student_id,
          title: certificateData.title,
          issuer: certificateData.issuer,
          issue_date: certificateData.issue_date,
          certificate_url: certificateData.certificate_url,
          category: certificateData.category,
          status: certificateData.status || 'pending'
        })
        .select()
        .single();

      if (error) {
        console.error('Certificate creation error:', error);
        return null;
      }

      return data;

    } catch (error) {
      console.error('Certificate service error:', error);
      return null;
    }
  }

  /**
   * Update certificate with file URL
   */
  async updateCertificateUrl(certificateId: string, certificateUrl: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('certificates')
        .update({ 
          certificate_url: certificateUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', certificateId);

      if (error) {
        console.error('Certificate URL update error:', error);
        return false;
      }

      return true;

    } catch (error) {
      console.error('Certificate update service error:', error);
      return false;
    }
  }

  /**
   * Get all certificates for a student
   */
  async getCertificatesByStudent(studentId: string): Promise<Certificate[]> {
    try {
      const { data, error } = await supabase
        .from('certificates')
        .select('*')
        .eq('student_id', studentId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Certificates fetch error:', error);
        return [];
      }

      return data || [];

    } catch (error) {
      console.error('Certificates service error:', error);
      return [];
    }
  }

  /**
   * Delete a certificate
   */
  async deleteCertificate(certificateId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('certificates')
        .delete()
        .eq('id', certificateId);

      if (error) {
        console.error('Certificate deletion error:', error);
        return false;
      }

      return true;

    } catch (error) {
      console.error('Certificate delete service error:', error);
      return false;
    }
  }

  /**
   * Update certificate status (for admin/faculty use)
   */
  async updateCertificateStatus(
    certificateId: string, 
    status: "pending" | "verified" | "rejected"
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('certificates')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', certificateId);

      if (error) {
        console.error('Certificate status update error:', error);
        return false;
      }

      return true;

    } catch (error) {
      console.error('Certificate status service error:', error);
      return false;
    }
  }

  /**
   * Search certificates by title or issuer
   */
  async searchCertificates(studentId: string, searchTerm: string): Promise<Certificate[]> {
    try {
      const { data, error } = await supabase
        .from('certificates')
        .select('*')
        .eq('student_id', studentId)
        .or(`title.ilike.%${searchTerm}%,issuer.ilike.%${searchTerm}%`)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Certificate search error:', error);
        return [];
      }

      return data || [];

    } catch (error) {
      console.error('Certificate search service error:', error);
      return [];
    }
  }
}

export const certificateService = CertificateService.getInstance();
