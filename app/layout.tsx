import type { Metadata } from "next"
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from "@vercel/analytics/next"
import { AuthProvider } from "@/lib/auth"
import { Suspense } from "react"
import "./globals.css"

// Combine the class names for the body
const fontClasses = `${GeistSans.variable} ${GeistMono.variable} ${GeistSans.className}`

export const metadata: Metadata = {
  title: "Student Achievement Portal",
  description: "Comprehensive digital platform for managing student achievements and institutional compliance",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={fontClasses}>
      <body className="antialiased">
        <Suspense fallback={<div>Loading...</div>}>
          <AuthProvider>{children}</AuthProvider>
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
