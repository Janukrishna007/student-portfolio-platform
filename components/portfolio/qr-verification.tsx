"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { verifyQRCode } from "@/lib/qr-generator"
import { CheckCircle, XCircle, QrCode, Search } from "lucide-react"

interface VerificationResult {
  isValid: boolean
  studentName?: string
  portfolioId?: string
  verifiedAt?: string
  message: string
}

export function QRVerification() {
  const [verificationHash, setVerificationHash] = useState("")
  const [result, setResult] = useState<VerificationResult | null>(null)
  const [loading, setLoading] = useState(false)

  const handleVerify = async () => {
    if (!verificationHash.trim()) return

    setLoading(true)

    // Simulate verification process
    setTimeout(() => {
      const mockStudentData = {
        name: "John Doe",
        portfolioId: "portfolio-123",
      }

      const isValid = verifyQRCode(verificationHash, mockStudentData)

      setResult({
        isValid,
        studentName: isValid ? mockStudentData.name : undefined,
        portfolioId: isValid ? mockStudentData.portfolioId : undefined,
        verifiedAt: isValid ? new Date().toLocaleString() : undefined,
        message: isValid
          ? "Portfolio verified successfully. All achievements are authentic and up-to-date."
          : "Invalid verification code. Please check the QR code and try again.",
      })

      setLoading(false)
    }, 1500)
  }

  const handleScanQR = () => {
    // In a real implementation, this would open camera for QR scanning
    alert("QR Scanner would open here. For demo, use verification hash: ABC123DEF456")
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 p-6">
      <Card>
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <QrCode className="w-8 h-8 text-purple-600" />
          </div>
          <CardTitle className="text-2xl">Portfolio Verification</CardTitle>
          <p className="text-gray-600">
            Verify the authenticity of student portfolios and achievements using QR codes or verification hashes.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex gap-4">
            <Button onClick={handleScanQR} className="flex-1 bg-purple-600 hover:bg-purple-700">
              <QrCode className="w-4 h-4 mr-2" />
              Scan QR Code
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">Or enter verification hash</span>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Input
                placeholder="Enter verification hash (e.g., ABC123DEF456)"
                value={verificationHash}
                onChange={(e) => setVerificationHash(e.target.value)}
                className="h-12"
              />
            </div>
            <Button
              onClick={handleVerify}
              disabled={!verificationHash.trim() || loading}
              className="w-full h-12 bg-transparent"
              variant="outline"
            >
              <Search className="w-4 h-4 mr-2" />
              {loading ? "Verifying..." : "Verify Portfolio"}
            </Button>
          </div>

          {result && (
            <Alert className={result.isValid ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
              <div className="flex items-center gap-2">
                {result.isValid ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
                <AlertDescription className={result.isValid ? "text-green-800" : "text-red-800"}>
                  {result.message}
                </AlertDescription>
              </div>
            </Alert>
          )}

          {result?.isValid && (
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4">
                <h3 className="font-semibold text-green-800 mb-3">Verification Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-green-700">Student Name:</span>
                    <span className="font-medium text-green-800">{result.studentName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-700">Portfolio ID:</span>
                    <span className="font-medium text-green-800">{result.portfolioId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-700">Verified At:</span>
                    <span className="font-medium text-green-800">{result.verifiedAt}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-700">Status:</span>
                    <Badge className="bg-green-100 text-green-800">Authentic</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">How Verification Works</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm text-gray-600">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-semibold text-purple-600">1</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">QR Code Generation</p>
                <p>Each portfolio generates a unique QR code with encrypted verification data.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-semibold text-purple-600">2</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Secure Verification</p>
                <p>Verification checks against our secure database to ensure authenticity.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-semibold text-purple-600">3</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Real-time Validation</p>
                <p>Get instant confirmation of portfolio authenticity and achievement verification.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
