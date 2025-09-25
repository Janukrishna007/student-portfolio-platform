import { LoginForm } from "@/components/auth/login-form";

export default function HomePage() {
  return (
    <div className="min-h-screen login-background flex items-center justify-center p-4 relative">
      {/* Overlay for better contrast */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-200/40 via-purple-100/30 to-purple-200/40"></div>

      <div className="relative z-10">
        <LoginForm />
      </div>
    </div>
  );
}
