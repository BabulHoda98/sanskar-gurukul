"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, School, Loader2, Phone, FileDigit, ArrowLeft, Eye, EyeOff } from "lucide-react";

import api from "@/lib/api";

function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Forgot Password states
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotMobile, setForgotMobile] = useState("");
  const [forgotAadhaar, setForgotAadhaar] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await api.post("/api/auth/login", { email, password });
      const data = response.data;

      // Save token and user details to localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Redirect depending on user role
      if (data.user.role === "ADMIN") {
        router.push("/admin/dashboard");
      } else if (data.user.role === "EMPLOYEE") {
        router.push("/employee/dashboard");
      } else {
        router.push("/");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || err.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccessMessage("");

    if (forgotAadhaar.length !== 12) {
      setError("Aadhaar Card number must be exactly 12 digits.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await api.post("/api/auth/forgot-password", {
        email: forgotEmail,
        mobile: forgotMobile,
        aadhaarNumber: forgotAadhaar,
        newPassword: newPassword,
      });
      setSuccessMessage(response.data.message);
      setForgotEmail("");
      setForgotMobile("");
      setForgotAadhaar("");
      setNewPassword("");
      setTimeout(() => {
        setShowForgot(false);
        setSuccessMessage("");
      }, 3000);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || err.message || "Failed to reset password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-radial dark:from-slate-900 dark:to-slate-950 px-4 py-12 transition-colors duration-300 relative">
      <button
        onClick={() => document.documentElement.classList.toggle("dark")}
        className="absolute top-6 right-6 p-2.5 bg-white dark:bg-slate-800 rounded-full shadow-md text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors z-50"
        aria-label="Toggle Dark Mode"
      >
        <span className="dark:hidden text-lg">🌙</span>
        <span className="hidden dark:block text-lg">☀️</span>
      </button>

      <motion.div
        className="w-full max-w-md bg-white dark:bg-slate-900/60 backdrop-blur-xl rounded-lg p-8 border border-slate-200 dark:border-slate-800/80 shadow-2xl relative overflow-hidden"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Abstract Background Accents */}
        <div className="absolute -top-12 -left-12 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl" />

        {/* Brand / Logo */}
        <div className="flex flex-col items-center mb-8 relative z-10">
          <div className="p-3 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-lg shadow-lg mb-4">
            <School className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            {showForgot ? "Reset Password" : "Welcome Back"}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
            {showForgot ? "Verify details to recover your account" : "Sign in to access Gurukul Portal"}
          </p>
        </div>

        {error && (
          <motion.div
            className="mb-6 p-4 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm rounded-lg text-center"
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
          >
            {error}
          </motion.div>
        )}

        {successMessage && (
          <motion.div
            className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm rounded-lg text-center"
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
          >
            {successMessage}
          </motion.div>
        )}

        {!showForgot ? (
          <form onSubmit={handleLogin} className="space-y-5 relative z-10">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 h-5 w-5 text-slate-400 dark:text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@gurukul.com"
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 focus:border-blue-500/80 rounded-lg text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/10 transition-all text-sm"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Password</label>
                <button
                  type="button"
                  onClick={() => {
                    setShowForgot(true);
                    setError("");
                    setSuccessMessage("");
                  }}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors font-medium cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 h-5 w-5 text-slate-400 dark:text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-3 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 focus:border-blue-500/80 rounded-lg text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/10 transition-all text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-lg font-semibold shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 group transition-all cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleForgotPassword} className="space-y-4 relative z-10">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-3 h-5 w-5 text-slate-400 dark:text-slate-400" />
                <input
                  type="email"
                  required
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="name@gurukul.com"
                  className="w-full pl-12 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 focus:border-blue-500/80 rounded-lg text-slate-900 dark:text-white outline-none text-sm"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Registered Mobile</label>
              <div className="relative">
                <Phone className="absolute left-4 top-3 h-5 w-5 text-slate-400 dark:text-slate-400" />
                <input
                  type="tel"
                  required
                  value={forgotMobile}
                  onChange={(e) => setForgotMobile(e.target.value)}
                  placeholder="10-digit mobile"
                  className="w-full pl-12 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 focus:border-blue-500/80 rounded-lg text-slate-900 dark:text-white outline-none text-sm"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Aadhaar Card Number</label>
              <div className="relative">
                <FileDigit className="absolute left-4 top-3 h-5 w-5 text-slate-400 dark:text-slate-400" />
                <input
                  type="text"
                  maxLength={12}
                  required
                  value={forgotAadhaar}
                  onChange={(e) => setForgotAadhaar(e.target.value.replace(/\D/g, ""))}
                  placeholder="12-digit number"
                  className="w-full pl-12 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 focus:border-blue-500/80 rounded-lg text-slate-900 dark:text-white outline-none text-sm"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">New Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-3 h-5 w-5 text-slate-400 dark:text-slate-400" />
                <input
                  type={showNewPassword ? "text" : "password"}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full pl-12 pr-12 py-2.5 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 focus:border-blue-500/80 rounded-lg text-slate-900 dark:text-white outline-none text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-4 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer"
                >
                  {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowForgot(false);
                  setError("");
                  setSuccessMessage("");
                }}
                className="flex-1 py-3 border border-slate-300 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-[2] py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-lg font-semibold shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Reset Password"}
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
}

export default LoginPage;
