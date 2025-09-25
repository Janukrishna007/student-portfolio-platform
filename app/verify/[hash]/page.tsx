import { QRVerification } from "@/components/portfolio/qr-verification"

interface VerifyPageProps {
  params: {
    hash: string
  }
}

export default function VerifyPage({ params }: VerifyPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 py-8">
      <QRVerification />
      <div className="text-center mt-8 text-sm text-gray-500">Verification Hash: {params.hash}</div>
    </div>
  )
}
