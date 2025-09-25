"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/lib/auth"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const { login, loading } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const success = await login(email, password)
    if (success) {
      router.push("/dashboard")
    } else {
      setError("Invalid email or password")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-6xl bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px]">
          {/* Left side - Login Form */}
          <div className="p-12 flex flex-col justify-center">
            <div className="mb-8">
              <div className="flex items-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl flex items-center justify-center">
                  <span className="text-white font-bold text-2xl">PF</span>
                </div>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-3">Welcome Back</h1>
              <p className="text-gray-600 text-lg">Please enter login details below</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-medium text-base">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder=""
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-14 bg-gray-50 border-gray-200 rounded-xl focus:ring-purple-500 focus:border-purple-500 text-base"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 font-medium text-base">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder=""
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-14 bg-gray-50 border-gray-200 rounded-xl focus:ring-purple-500 focus:border-purple-500 text-base"
                  required
                />
              </div>

              <div className="flex justify-end">
                <button type="button" className="text-purple-600 hover:text-purple-700 font-medium">
                  Forget Password?
                </button>
              </div>

              {error && (
                <Alert variant="destructive" className="rounded-xl">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full h-14 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 text-base"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign in"}
              </Button>
            </form>

            <div className="mt-8 space-y-4">
              <div className="bg-purple-50 rounded-xl border border-purple-100 p-4">
                <h3 className="text-sm font-medium text-purple-800 mb-3">Test Credentials</h3>
                
                <div className="space-y-4">
                  <div className="bg-white p-3 rounded-lg border border-purple-100">
                    <h4 className="font-medium text-purple-700 mb-1">Admin Account</h4>
                    <div className="text-sm text-purple-600 space-y-1">
                      <p><span className="font-medium">Email:</span> admin@university.edu</p>
                      <p><span className="font-medium">Password:</span> password</p>
                    </div>
                  </div>
                  
                  <div className="bg-white p-3 rounded-lg border border-purple-100">
                    <h4 className="font-medium text-purple-700 mb-1">Faculty Account</h4>
                    <div className="text-sm text-purple-600 space-y-1">
                      <p><span className="font-medium">Email:</span> prof.smith@university.edu</p>
                      <p><span className="font-medium">Password:</span> password</p>
                    </div>
                  </div>
                  
                  <div className="bg-white p-3 rounded-lg border border-purple-100">
                    <h4 className="font-medium text-purple-700 mb-1">Student Account</h4>
                    <div className="text-sm text-purple-600 space-y-1">
                      <p><span className="font-medium">Email:</span> john.doe@university.edu</p>
                      <p><span className="font-medium">Password:</span> password</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                {"Don't have an account? "}
                <button className="text-purple-600 hover:text-purple-700 font-semibold">Sign up</button>
              </p>
            </div>
          </div>

          {/* Right side - Geometric Pattern */}
          <div className="hidden lg:block relative">
            <div
              className="w-full h-full bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url('/images/geometric-pattern.jpg')`,
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-purple-800/20"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
