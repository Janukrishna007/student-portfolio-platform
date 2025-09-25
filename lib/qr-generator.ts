// QR Code generation and verification utilities
export interface QRData {
  studentId: string
  portfolioId: string
  verificationHash: string
  generatedAt: string
  expiresAt: string
}

export function generateVerificationHash(studentId: string, portfolioId: string): string {
  // In a real implementation, this would use a secure hash function
  const data = `${studentId}-${portfolioId}-${Date.now()}`
  return btoa(data)
    .replace(/[^a-zA-Z0-9]/g, "")
    .substring(0, 16)
}

export function generateQRData(studentId: string, portfolioId: string): QRData {
  const verificationHash = generateVerificationHash(studentId, portfolioId)
  const generatedAt = new Date().toISOString()
  const expiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() // 1 year

  return {
    studentId,
    portfolioId,
    verificationHash,
    generatedAt,
    expiresAt,
  }
}

export function generateQRCodeURL(qrData: QRData): string {
  const baseURL = typeof window !== "undefined" ? window.location.origin : "https://student-portal.edu"
  const verifyURL = `${baseURL}/verify/${qrData.verificationHash}`

  // Using QR Server API for QR code generation
  const qrCodeURL = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(verifyURL)}`
  return qrCodeURL
}

export function verifyQRCode(hash: string, studentData: any): boolean {
  // In a real implementation, this would verify against a secure database
  return hash && hash.length === 16 && studentData
}
