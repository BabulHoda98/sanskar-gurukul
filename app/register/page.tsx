"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { School, User, Phone, Mail, MapPin, FileDigit, FileText, Lock, Loader2, Upload } from "lucide-react";

import api from "@/lib/api";

function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    mobile: "",
    address: "",
    aadhaarNumber: "",
    panCard: "",
    role: "EMPLOYEE"
  });

  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [aadhaarPhoto, setAadhaarPhoto] = useState<File | null>(null);
  const [panPhoto, setPanPhoto] = useState<File | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setter: (file: File) => void) => {
    if (e.target.files && e.target.files[0]) {
      setter(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!profilePhoto || !aadhaarPhoto) {
      setError("Profile Photo and Aadhaar Photo are required uploads.");
      setIsLoading(false);
      return;
    }

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("password", formData.password);
      data.append("mobile", formData.mobile);
      data.append("address", formData.address);
      data.append("aadhaarNumber", formData.aadhaarNumber);
      data.append("role", formData.role);
      
      if (formData.panCard) data.append("panCard", formData.panCard);
      
      data.append("profilePhoto", profilePhoto);
      data.append("aadhaarPhoto", aadhaarPhoto);
      if (panPhoto) data.append("panPhoto", panPhoto);

      const response = await api.post("/api/auth/register", data);
      const resData = response.data;

      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred during registration.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4 py-16">
      <motion.div
        className="w-full max-w-3xl bg-slate-900/60 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-slate-800/80 shadow-2xl relative"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-600/10 rounded-full blur-3xl" />

        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-10">
          <div className="p-3 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl shadow-lg mb-4">
            <School className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight">Create Account</h2>
          <p className="text-slate-400 mt-2 text-sm">Register a new profile for Gurukul Ashram School</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm rounded-2xl text-center">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm rounded-2xl text-center">
            Registration successful! Redirecting to login page...
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Step 1: Personal Details */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 pb-2 border-b border-slate-800">1. Personal & Contact Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Full Name *</label>
                <div className="relative">
                  <User className="absolute left-4 top-3 text-slate-400 w-5 h-5" />
                  <input
                    type="text"
                    required
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter full name"
                    className="w-full pl-12 pr-4 py-2.5 bg-slate-950/50 border border-slate-800 focus:border-blue-500 rounded-2xl text-white outline-none focus:ring-2 focus:ring-blue-500/10 transition-all text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Mobile Number *</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-3 text-slate-400 w-5 h-5" />
                  <input
                    type="tel"
                    required
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    placeholder="10-digit mobile number"
                    className="w-full pl-12 pr-4 py-2.5 bg-slate-950/50 border border-slate-800 focus:border-blue-500 rounded-2xl text-white outline-none focus:ring-2 focus:ring-blue-500/10 transition-all text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Email Address *</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-3 text-slate-400 w-5 h-5" />
                  <input
                    type="email"
                    required
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="example@gurukul.com"
                    className="w-full pl-12 pr-4 py-2.5 bg-slate-950/50 border border-slate-800 focus:border-blue-500 rounded-2xl text-white outline-none focus:ring-2 focus:ring-blue-500/10 transition-all text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Password *</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-3 text-slate-400 w-5 h-5" />
                  <input
                    type="password"
                    required
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create secure password"
                    className="w-full pl-12 pr-4 py-2.5 bg-slate-950/50 border border-slate-800 focus:border-blue-500 rounded-2xl text-white outline-none focus:ring-2 focus:ring-blue-500/10 transition-all text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Registered Role</label>
                <div className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-800 rounded-2xl text-slate-400 text-sm font-semibold select-none">
                  Employee Account
                </div>
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Residential Address *</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-3.5 text-slate-400 w-5 h-5" />
                  <textarea
                    required
                    name="address"
                    rows={3}
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Full residential address details"
                    className="w-full pl-12 pr-4 py-2.5 bg-slate-950/50 border border-slate-800 focus:border-blue-500 rounded-2xl text-white outline-none focus:ring-2 focus:ring-blue-500/10 transition-all text-sm resize-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Step 2: Identification & Document Uploads */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 pb-2 border-b border-slate-800">2. Verification Documents</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Aadhaar Card Number *</label>
                <div className="relative">
                  <FileDigit className="absolute left-4 top-3 text-slate-400 w-5 h-5" />
                  <input
                    type="text"
                    required
                    name="aadhaarNumber"
                    value={formData.aadhaarNumber}
                    onChange={handleChange}
                    placeholder="12-digit Aadhaar number"
                    className="w-full pl-12 pr-4 py-2.5 bg-slate-950/50 border border-slate-800 focus:border-blue-500 rounded-2xl text-white outline-none focus:ring-2 focus:ring-blue-500/10 transition-all text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">PAN Card Number (Optional)</label>
                <div className="relative">
                  <FileText className="absolute left-4 top-3 text-slate-400 w-5 h-5" />
                  <input
                    type="text"
                    name="panCard"
                    value={formData.panCard}
                    onChange={handleChange}
                    placeholder="10-digit PAN details"
                    className="w-full pl-12 pr-4 py-2.5 bg-slate-950/50 border border-slate-800 focus:border-blue-500 rounded-2xl text-white outline-none focus:ring-2 focus:ring-blue-500/10 transition-all text-sm"
                  />
                </div>
              </div>

              {/* Upload 1: Profile Photo */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Profile Photo *</label>
                <div className="border-2 border-dashed border-slate-800 hover:border-blue-500/60 rounded-2xl p-4 transition-all text-center relative cursor-pointer bg-slate-950/20">
                  <input
                    type="file"
                    required
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, setProfilePhoto)}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <Upload className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                  <p className="text-xs text-slate-400">
                    {profilePhoto ? profilePhoto.name : "Click or drag your photo here"}
                  </p>
                </div>
              </div>

              {/* Upload 2: Aadhaar Card Photo */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Aadhaar Card Photo *</label>
                <div className="border-2 border-dashed border-slate-800 hover:border-blue-500/60 rounded-2xl p-4 transition-all text-center relative cursor-pointer bg-slate-950/20">
                  <input
                    type="file"
                    required
                    accept="image/*,application/pdf"
                    onChange={(e) => handleFileChange(e, setAadhaarPhoto)}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <Upload className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                  <p className="text-xs text-slate-400">
                    {aadhaarPhoto ? aadhaarPhoto.name : "Click or drag Aadhaar Card here"}
                  </p>
                </div>
              </div>

              {/* Upload 3: PAN Card Photo */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">PAN Card Photo (Optional)</label>
                <div className="border-2 border-dashed border-slate-800 hover:border-blue-500/60 rounded-2xl p-4 transition-all text-center relative cursor-pointer bg-slate-950/20">
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={(e) => handleFileChange(e, setPanPhoto)}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <Upload className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                  <p className="text-xs text-slate-400">
                    {panPhoto ? panPhoto.name : "Click or drag PAN Card here"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-4 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl font-bold shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Submit & Register"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

export default RegisterPage;
