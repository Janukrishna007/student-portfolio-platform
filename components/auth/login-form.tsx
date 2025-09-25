"use client";

import type React from "react";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/lib/auth";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, loading } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const success = await login(email, password);
    if (success) {
      router.push("/dashboard");
    } else {
      setError("Invalid email or password");
    }
  };

  // Quick fill functions for demo credentials
  const fillAdmin = () => {
    setEmail("admin@university.edu");
    setPassword("password");
  };

  const fillFaculty = () => {
    setEmail("prof.smith@university.edu");
    setPassword("password");
  };

  const fillStudent = () => {
    setEmail("john.doe@university.edu");
    setPassword("password");
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px]">
          {/* Left side - Login Form */}
          <div className="p-8 lg:p-12 flex flex-col justify-center bg-white">
            {/* Logo */}
            <div className="mb-6">
              <div className="w-12 h-12 mb-6">
                <Image
                  src="/images/logo.png"
                  alt="Logo"
                  width={48}
                  height={48}
                  className="w-full h-full object-contain"
                />
              </div>

              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Welcome Back
              </h1>
              <p className="text-gray-500 text-sm mb-6">
                Please enter login details below
              </p>
            </div>

            {/* Demo Credentials Quick Access */}
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-3">Quick Demo Access:</p>
              <div className="flex gap-2">
                <Button
                  type="button"
                  onClick={fillAdmin}
                  className="text-xs px-3 py-1.5 h-auto bg-red-500 hover:bg-red-600 text-white rounded-md font-medium"
                >
                  Admin
                </Button>
                <Button
                  type="button"
                  onClick={fillFaculty}
                  className="text-xs px-3 py-1.5 h-auto bg-blue-500 hover:bg-blue-600 text-white rounded-md font-medium"
                >
                  Faculty
                </Button>
                <Button
                  type="button"
                  onClick={fillStudent}
                  className="text-xs px-3 py-1.5 h-auto bg-green-500 hover:bg-green-600 text-white rounded-md font-medium"
                >
                  Student
                </Button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label htmlFor="email" className="text-gray-700 text-sm block">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder=""
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 bg-gray-50 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                  required
                />
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="password"
                  className="text-gray-700 text-sm block"
                >
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder=""
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 bg-gray-50 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                  required
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  className="text-purple-600 hover:text-purple-700 text-sm"
                >
                  Forget Password?
                </button>
              </div>

              {error && (
                <Alert variant="destructive" className="rounded-lg">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full h-11 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-xl text-sm mt-6"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600 text-sm">
                {"Don't have an account? "}
                <button className="text-purple-600 hover:text-purple-700 font-medium">
                  Sign up
                </button>
              </p>
            </div>

            {/* Test Credentials - Collapsible */}
            <div className="mt-4">
              <details className="group">
                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700 list-none flex items-center">
                  <span className="mr-2">▶</span>
                  <span className="group-open:hidden">
                    View Test Credentials
                  </span>
                  <span className="hidden group-open:inline">
                    Hide Test Credentials
                  </span>
                </summary>
                <div className="mt-3 space-y-2 text-xs text-gray-600 bg-gray-50 p-3 rounded-lg border">
                  <div className="space-y-1">
                    <p className="font-semibold text-red-600">Admin:</p>
                    <p>admin@university.edu / password</p>
                  </div>
                  <div className="space-y-1">
                    <p className="font-semibold text-blue-600">Faculty:</p>
                    <p>prof.smith@university.edu / password</p>
                  </div>
                  <div className="space-y-1">
                    <p className="font-semibold text-green-600">Student:</p>
                    <p>john.doe@university.edu / password</p>
                  </div>
                </div>
              </details>
            </div>
          </div>

          {/* Right side - Decorative Image */}
          <div className="hidden lg:block relative bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-600">
            <div className="absolute inset-0">
              <Image
                src="/images/Login-side-img.png"
                alt="Login Side Image"
                fill
                className="object-cover"
                priority
              />
            </div>
            {/* Optional overlay for better text readability if needed */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-transparent"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
