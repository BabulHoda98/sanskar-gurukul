"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, School, Loader2, Phone, FileDigit, ArrowLeft } from "lucide-react";

import api from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Forgot Password states
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotMobile, setForgotMobile] = useState("");
  const [forgotAadhaar, setForgotAadhaar] = useState("");
  const [newPassword, setNewPassword] = useState("");
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
    <div className="min-h-screen flex items-center justify-center bg-radial from-slate-900 to-slate-950 px-4 py-12">
      <motion.div
        className="w-full max-w-md bg-slate-900/60 backdrop-blur-xl rounded-3xl p-8 border border-slate-800/80 shadow-2xl relative overflow-hidden"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Abstract Background Accents */}
        <div className="absolute -top-12 -left-12 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl" />

        {/* Brand / Logo */}
        <div className="flex flex-col items-center mb-8 relative z-10">
          <div className="p-3 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl shadow-lg mb-4">
            <School className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            {showForgot ? "Reset Password" : "Welcome Back"}
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            {showForgot ? "Verify details to recover your account" : "Sign in to access Gurukul Portal"}
          </p>
        </div>

        {error && (
          <motion.div
            className="mb-6 p-4 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm rounded-2xl text-center"
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
          >
            {error}
          </motion.div>
        )}

        {successMessage && (
          <motion.div
            className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm rounded-2xl text-center"
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
          >
            {successMessage}
          </motion.div>
        )}

        {!showForgot ? (
          <form onSubmit={handleLogin} className="space-y-5 relative z-10">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@gurukul.com"
                  className="w-full pl-12 pr-4 py-3 bg-slate-950/50 border border-slate-800 focus:border-blue-500/80 rounded-2xl text-white outline-none focus:ring-2 focus:ring-blue-500/10 transition-all text-sm"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Password</label>
                <button
                  type="button"
                  onClick={() => {
                    setShowForgot(true);
                    setError("");
                    setSuccessMessage("");
                  }}
                  className="text-xs text-blue-400 hover:text-blue-300 transition-colors font-medium cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-3 bg-slate-950/50 border border-slate-800 focus:border-blue-500/80 rounded-2xl text-white outline-none focus:ring-2 focus:ring-blue-500/10 transition-all text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl font-semibold shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 group transition-all cursor-pointer disabled:opacity-50"
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
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-3 h-5 w-5 text-slate-400" />
                <input
                  type="email"
                  required
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="name@gurukul.com"
                  className="w-full pl-12 pr-4 py-2.5 bg-slate-950/50 border border-slate-800 focus:border-blue-500/80 rounded-2xl text-white outline-none text-sm"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Registered Mobile</label>
              <div className="relative">
                <Phone className="absolute left-4 top-3 h-5 w-5 text-slate-400" />
                <input
                  type="tel"
                  required
                  value={forgotMobile}
                  onChange={(e) => setForgotMobile(e.target.value)}
                  placeholder="10-digit mobile"
                  className="w-full pl-12 pr-4 py-2.5 bg-slate-950/50 border border-slate-800 focus:border-blue-500/80 rounded-2xl text-white outline-none text-sm"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Aadhaar Card Number</label>
              <div className="relative">
                <FileDigit className="absolute left-4 top-3 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  maxLength={12}
                  required
                  value={forgotAadhaar}
                  onChange={(e) => setForgotAadhaar(e.target.value.replace(/\D/g, ""))}
                  placeholder="12-digit number"
                  className="w-full pl-12 pr-4 py-2.5 bg-slate-950/50 border border-slate-800 focus:border-blue-500/80 rounded-2xl text-white outline-none text-sm"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">New Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-3 h-5 w-5 text-slate-400" />
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full pl-12 pr-4 py-2.5 bg-slate-950/50 border border-slate-800 focus:border-blue-500/80 rounded-2xl text-white outline-none text-sm"
                />
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
                className="flex-1 py-3 border border-slate-800 hover:bg-slate-850 text-slate-300 rounded-2xl font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-[2] py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl font-semibold shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
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
