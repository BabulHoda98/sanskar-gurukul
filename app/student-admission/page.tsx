"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap, User, Phone, Mail, FileDigit, Building,
  MapPin, ShieldAlert, ArrowLeft, Loader2, CheckCircle, Calculator, Info,
  QrCode, Landmark, DollarSign, Download, Upload, CheckCircle2, AlertCircle, X,
  MessageSquare
} from "lucide-react";

import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import api, { API_URL } from "@/lib/api";

function StudentAdmissionPage() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Fees Configuration State
  const [feesConfig, setFeesConfig] = useState<any>({
    classes: {},
    addons: { transport: 0, dress: 0, books: 0 }
  });

  // Form Fields State
  const [studentForm, setStudentForm] = useState({
    studentName: "",
    studentAadhaar: "",
    selectedClass: "",
    parentName: "",
    parentPhone: "",
    parentEmail: "",
    parentAddress: "",
    parentBusiness: "",
    studentDob: "",
    bloodGroup: "",
    gender: "",
    fatherAadhar: "",
    motherAadhar: "",
    parentAlternatePhone: "",
    paymentCycle: "ANNUAL"
  });

  const [studentPhoto, setStudentPhoto] = useState<File | null>(null);
  const [fatherAadharFile, setFatherAadharFile] = useState<File | null>(null);
  const [motherAadharFile, setMotherAadharFile] = useState<File | null>(null);

  // Service Options State
  const [services, setServices] = useState({
    transport: false,
    dress: false,
    books: false
  });

  // Modal Flow States
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [enrolledStudent, setEnrolledStudent] = useState<any>(null);
  const [paymentOption, setPaymentOption] = useState<"SELECT" | "CASH" | "QR">("SELECT");
  const [qrCodeData, setQrCodeData] = useState<any>(null);
  const [txnId, setTxnId] = useState("");
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [recordedPayment, setRecordedPayment] = useState<any>(null);

  // Saved Parent info for WhatsApp redirection after reset
  const [savedParentPhone, setSavedParentPhone] = useState("");
  const [savedClass, setSavedClass] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Authenticate Admin/Employee and fetch fee configuration
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!storedToken || !storedUser) {
      router.push("/login");
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    if (parsedUser.role !== "ADMIN") {
      toast.error("Access Denied. Admin login required.");
      router.push("/login");
      return;
    }

    setToken(storedToken);
    setCurrentUser(parsedUser);
    fetchFeesConfig();
  }, []);

  const fetchFeesConfig = async () => {
    try {
      const res = await api.get("/api/public/fees-config");
      setFeesConfig(res.data);
    } catch (err) {
      console.error("Error fetching fees configuration:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Live Calculations
  const classFee = feesConfig.classes[studentForm.selectedClass] || 0;
  const transportFee = services.transport ? feesConfig.addons.transport : 0;
  const dressFee = services.dress ? feesConfig.addons.dress : 0;
  const booksFee = services.books ? feesConfig.addons.books : 0;
  const totalFees = classFee + transportFee + dressFee + booksFee;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === "studentAadhaar" || name === "fatherAadhar" || name === "motherAadhar") {
      const onlyNums = value.replace(/[^0-9]/g, "");
      if (onlyNums.length > 12) return;
      setStudentForm({ ...studentForm, [name]: onlyNums });
      return;
    }

    setStudentForm({ ...studentForm, [name]: value });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setServices({ ...services, [e.target.name]: e.target.checked });
  };

  // 1. Submit Registration Form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);

    if (studentForm.studentAadhaar.length !== 12) {
      toast.error("Aadhaar Card number must be exactly 12 digits.");
      setActionLoading(false);
      return;
    }

    if (studentForm.fatherAadhar && studentForm.fatherAadhar.length !== 12) {
      toast.error("Father's Aadhaar Card number must be exactly 12 digits.");
      setActionLoading(false);
      return;
    }

    if (studentForm.motherAadhar && studentForm.motherAadhar.length !== 12) {
      toast.error("Mother's Aadhaar Card number must be exactly 12 digits.");
      setActionLoading(false);
      return;
    }

    try {
      // Build clean combined details for student record
      const fullAddress = `
[Parent Name]: ${studentForm.parentName}
[Parent Phone]: ${studentForm.parentPhone}
[Parent Email]: ${studentForm.parentEmail}
[Parent Address]: ${studentForm.parentAddress}
[Parent Business]: ${studentForm.parentBusiness}
[Aadhaar]: ${studentForm.studentAadhaar}
[Services]: Transport: ${services.transport ? "Yes" : "No"}, Uniform Dress: ${services.dress ? "Yes" : "No"}, Books/Kit: ${services.books ? "Yes" : "No"}
      `.trim();

      const data = new FormData();
      data.append("name", studentForm.studentName);
      data.append("email", studentForm.parentEmail);
      data.append("mobile", studentForm.parentPhone);
      data.append("address", fullAddress);
      data.append("totalFees", totalFees.toString());
      data.append("dob", studentForm.studentDob);
      data.append("bloodGroup", studentForm.bloodGroup);
      data.append("gender", studentForm.gender);
      data.append("fatherAadhar", studentForm.fatherAadhar);
      data.append("motherAadhar", studentForm.motherAadhar);
      data.append("parentAlternatePhone", studentForm.parentAlternatePhone);
      data.append("paymentCycle", studentForm.paymentCycle);
      if (studentPhoto) {
        data.append("photo", studentPhoto);
      }
      if (fatherAadharFile) {
        data.append("fatherAadharFile", fatherAadharFile);
      }
      if (motherAadharFile) {
        data.append("motherAadharFile", motherAadharFile);
      }

      const response = await api.post("/api/admin/students", data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const resData = response.data;
      if (response.status === 200 || response.status === 201) {
        setEnrolledStudent(resData.student);
        setSavedParentPhone(studentForm.parentPhone);
        setSavedClass(studentForm.selectedClass);
        setShowPaymentModal(true); // Open payment selector
        setPaymentOption("SELECT");
        setQrCodeData(null);
        setTxnId("");
        setScreenshotFile(null);
        setRecordedPayment(null);

        // Reset original form
        setStudentForm({
          studentName: "",
          studentAadhaar: "",
          selectedClass: "",
          parentName: "",
          parentPhone: "",
          parentEmail: "",
          parentAddress: "",
          parentBusiness: "",
          studentDob: "",
          bloodGroup: "",
          gender: "",
          fatherAadhar: "",
          motherAadhar: "",
          parentAlternatePhone: "",
          paymentCycle: "ANNUAL"
        });
        setStudentPhoto(null);
        setFatherAadharFile(null);
        setMotherAadharFile(null);
        setServices({ transport: false, dress: false, books: false });
      } else {
        toast.error(resData.message || "Failed to submit student admission.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong during admission submission.");
    } finally {
      setActionLoading(false);
    }
  };

  // 2. Load UPI QR
  const fetchQRForAdmission = async () => {
    setActionLoading(true);
    try {
      const isMonthly = enrolledStudent.paymentCycle === "MONTHLY";
      const dueAmount = isMonthly ? Math.round(enrolledStudent.totalFees / 12) : enrolledStudent.totalFees;
      const response = await api.post("/api/admin/payments/qr-initiate", {
        studentId: enrolledStudent.id,
        amount: dueAmount
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setQrCodeData(response.data);
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to generate QR payment link.");
    } finally {
      setActionLoading(false);
    }
  };

  // 3. Confirm payment record on backend
  const handleConfirmQRPayment = async () => {
    setActionLoading(true);
    try {
      const isMonthly = enrolledStudent.paymentCycle === "MONTHLY";
      const dueAmount = isMonthly ? Math.round(enrolledStudent.totalFees / 12) : enrolledStudent.totalFees;
      const response = await api.post("/api/admin/payments/record", {
        studentId: enrolledStudent.id,
        amount: dueAmount,
        paymentMethod: "QR",
        transactionId: txnId
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setRecordedPayment(response.data.payment);
      toast.success("QR Payment recorded successfully!");
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to record payment.");
    } finally {
      setActionLoading(false);
    }
  };

  // 4. Download PDF
  const printReceipt = (paymentId: string) => {
    window.open(`${API_URL}/api/payments/invoice/${paymentId}?token=${token}`, "_blank");
  };

  // 4.1. Initiate Cash payment record (defaults to PENDING status)
  const handleInitiateCashPayment = async () => {
    setActionLoading(true);
    try {
      const response = await api.post("/api/payments/record", {
        studentId: enrolledStudent.id,
        amount: enrolledStudent.totalFees,
        paymentMethod: "CASH",
        status: "PENDING"
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setRecordedPayment(response.data.payment);
      setPaymentOption("CASH");
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to log cash payment request.");
    } finally {
      setActionLoading(false);
    }
  };

  // 5. Send WhatsApp Redirection
  const sendWhatsAppNotification = (isCash = false) => {
    if (!enrolledStudent) return;

    let phone = savedParentPhone.trim();
    if (!phone) {
      toast.error("Parent contact phone not registered.");
      return;
    }

    if (phone.length === 10) {
      phone = "91" + phone;
    }

    let message = "";
    const isMonthly = enrolledStudent.paymentCycle === "MONTHLY";
    const planText = isMonthly ? "Monthly Installment Plan" : "Annual Plan";
    const dueAmount = isMonthly ? Math.round(enrolledStudent.totalFees / 12) : enrolledStudent.totalFees;

    if (isCash) {
      message = `Dear Parent, Admission registration for your child *${enrolledStudent.name}* in Class *${savedClass}* at Sanskar Gurukul School is registered.

Billing Plan: *${planText}*
Enrollment ID: *${enrolledStudent.id}*
Total Fee: *₹${enrolledStudent.totalFees}*
Initial Amount Due: *₹${dueAmount}*
Status: *Pending Office Cash Audit*

Please visit the school office to deposit cash and confirm. Thank you!`;
    } else {
      message = `Dear Parent, Admission for your child *${enrolledStudent.name}* in Class *${savedClass}* at Sanskar Gurukul School is confirmed!

Billing Plan: *${planText}*
Enrollment ID: *${enrolledStudent.id}*
Paid Amount: *₹${dueAmount}*
Receipt No: *${recordedPayment?.receiptNumber || "Pending Audit"}*

Thank you for choosing Gurukul!`;
    }

    const encodedText = encodeURIComponent(message);
    const url = `https://wa.me/${phone}?text=${encodedText}`;
    window.open(url, "_blank");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center text-slate-900 dark:text-slate-100">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500 mb-2" />
        <p className="text-sm text-slate-500 dark:text-slate-400">Loading enrollment console...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-20 relative overflow-x-hidden">

      {/* Reusable Console Header */}
      <DashboardHeader
        consoleTitle="Gurukul Admission & Fees Portal"
        userName={currentUser?.name}
        roleName="Registered Staff Operator"
        onBackClick={() => router.push(currentUser?.role === "ADMIN" ? "/admin/dashboard" : "/employee/dashboard")}
        themeColor="amber"
      />

      <div className="w-full mx-auto px-0 mt-0">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">

          {/* Main Form Fields */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              className="bg-white dark:bg-slate-900/40 border-y md:border border-slate-200 dark:border-slate-800 rounded-lg p-6 md:p-8"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="text-xl font-bold mb-1">New Student Enrollment Form</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">Complete both sections to initialize a new student record and generate their fee schedule.</p>

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Part 1: Student Data */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
                    <User className="w-4 h-4" /> 1. Student Personal Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Student Full Name *</label>
                      <input
                        type="text" required name="studentName"
                        value={studentForm.studentName} onChange={handleInputChange}
                        placeholder="Enter full name"
                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 focus:border-amber-500 rounded-xl text-slate-900 dark:text-white outline-none text-xs"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Aadhaar Card Number *</label>
                      <input
                        type="text" required name="studentAadhaar" maxLength={12}
                        value={studentForm.studentAadhaar} onChange={handleInputChange}
                        placeholder="12-digit Aadhaar"
                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 focus:border-amber-500 rounded-xl text-slate-900 dark:text-white outline-none text-xs"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Gender *</label>
                      <select
                        required name="gender"
                        value={studentForm.gender} onChange={handleInputChange}
                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 focus:border-amber-500 rounded-xl text-slate-900 dark:text-white outline-none text-xs"
                      >
                        <option value="">Select Gender</option>
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                        <option value="OTHER">Other</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Date of Birth *</label>
                      <input
                        type="date" required name="studentDob"
                        value={studentForm.studentDob} onChange={handleInputChange}
                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 focus:border-amber-500 rounded-xl text-slate-900 dark:text-white outline-none text-xs text-slate-700 dark:text-slate-300"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Blood Group</label>
                      <select
                        name="bloodGroup"
                        value={studentForm.bloodGroup} onChange={handleInputChange}
                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 focus:border-amber-500 rounded-xl text-slate-900 dark:text-white outline-none text-xs"
                      >
                        <option value="">Select Blood Group</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">User's Profile</label>
                      <div className="flex flex-row items-center gap-3">
                        <div className="w-10 h-10 shrink-0 bg-[radial-gradient(circle_at_center,_#ffffff_0%,_#e5e7eb_100%)] dark:bg-[radial-gradient(circle_at_center,_#334155_0%,_#0f172a_100%)] flex items-center justify-center overflow-hidden border border-slate-200 dark:border-slate-800 rounded">
                          {studentPhoto ? (
                            <img src={URL.createObjectURL(studentPhoto)} alt="Profile" className="w-full h-full object-cover" />
                          ) : (
                            <svg viewBox="0 0 24 24" fill="#4A86B9" className="w-6 h-6 translate-y-0.5">
                              <path d="M12 12c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm0 2c-3.33 0-10 1.67-10 5v3h20v-3c0-3.33-6.67-5-10-5z" />
                            </svg>
                          )}
                        </div>

                        <div className="flex-1 flex flex-row items-center gap-2">
                          <input
                            type="file" accept="image/*"
                            onChange={(e) => { if (e.target.files) setStudentPhoto(e.target.files[0]); }}
                            className="block w-full text-[10px] text-slate-900 dark:text-slate-300
                              file:mr-2 file:py-1 file:px-2
                              file:border file:border-slate-300 dark:file:border-slate-600
                              file:text-[10px] file:bg-slate-50 dark:file:bg-slate-800
                              file:text-slate-900 dark:file:text-slate-200
                              hover:file:bg-slate-100 dark:hover:file:bg-slate-700
                              cursor-pointer"
                          />
                          <button type="button" className="px-3 py-1 border border-yellow-400 rounded-md text-[10px] text-slate-900 dark:text-slate-100 font-bold hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-colors whitespace-nowrap">
                            Upload
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Admission for Class *</label>
                      <select
                        required name="selectedClass"
                        value={studentForm.selectedClass} onChange={handleInputChange}
                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 focus:border-amber-500 rounded-xl text-slate-900 dark:text-white outline-none text-xs"
                      >
                        <option value="">Select Class level</option>
                        {Object.keys(feesConfig.classes).map((cls) => (
                          <option key={cls} value={cls}>
                            {cls} (Annual: ₹{feesConfig.classes[cls]} | Monthly: approx. ₹{Math.round(feesConfig.classes[cls] / 12)}/mo)
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Billing Plan Frequency *</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <label className={`flex items-center gap-3 px-4 py-3 bg-slate-50 dark:bg-slate-950/40 border rounded-xl cursor-pointer transition-all ${studentForm.paymentCycle === "ANNUAL" ? "border-amber-500 bg-amber-500/5 text-amber-400" : "border-slate-200 dark:border-slate-800 hover:border-slate-700 text-slate-700 dark:text-slate-300"}`}>
                          <input
                            type="radio" name="paymentCycle" value="ANNUAL"
                            checked={studentForm.paymentCycle === "ANNUAL"}
                            onChange={handleInputChange}
                            className="text-amber-500 focus:ring-amber-500 h-4 w-4 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 cursor-pointer"
                          />
                          <div className="text-xs">
                            <p className="font-bold">Annual Plan</p>
                            <p className="text-[10px] text-slate-500">Pay full academic fees upfront</p>
                          </div>
                        </label>
                        <label className={`flex items-center gap-3 px-4 py-3 bg-slate-50 dark:bg-slate-950/40 border rounded-xl cursor-pointer transition-all ${studentForm.paymentCycle === "MONTHLY" ? "border-amber-500 bg-amber-500/5 text-amber-400" : "border-slate-200 dark:border-slate-800 hover:border-slate-700 text-slate-700 dark:text-slate-300"}`}>
                          <input
                            type="radio" name="paymentCycle" value="MONTHLY"
                            checked={studentForm.paymentCycle === "MONTHLY"}
                            onChange={handleInputChange}
                            className="text-amber-500 focus:ring-amber-500 h-4 w-4 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 cursor-pointer"
                          />
                          <div className="text-xs">
                            <p className="font-bold">Monthly Installment Plan</p>
                            <p className="text-[10px] text-slate-500">Pay 1/12th of academic fees monthly</p>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Part 2: Parent Data */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
                    <Building className="w-4 h-4" /> 2. Parent / Guardian Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Parent/Guardian Name *</label>
                      <input
                        type="text" required name="parentName"
                        value={studentForm.parentName} onChange={handleInputChange}
                        placeholder="Parent full name"
                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 focus:border-amber-500 rounded-xl text-slate-900 dark:text-white outline-none text-xs"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Business / Occupation *</label>
                      <input
                        type="text" required name="parentBusiness"
                        value={studentForm.parentBusiness} onChange={handleInputChange}
                        placeholder="e.g. Business Owner, Teacher"
                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 focus:border-amber-500 rounded-xl text-slate-900 dark:text-white outline-none text-xs"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Parent WhatsApp Mobile *</label>
                      <input
                        type="tel" required name="parentPhone"
                        value={studentForm.parentPhone} onChange={handleInputChange}
                        placeholder="WhatsApp contact (e.g. 9876543210)"
                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 focus:border-amber-500 rounded-xl text-slate-900 dark:text-white outline-none text-xs"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Parent Alternate Phone Number</label>
                      <input
                        type="tel" name="parentAlternatePhone"
                        value={studentForm.parentAlternatePhone} onChange={handleInputChange}
                        placeholder="Alternate contact number"
                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 focus:border-amber-500 rounded-xl text-slate-900 dark:text-white outline-none text-xs"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Father's Aadhaar Card (Optional)</label>
                      <input
                        type="text" name="fatherAadhar" maxLength={12}
                        value={studentForm.fatherAadhar} onChange={handleInputChange}
                        placeholder="12-digit Aadhaar"
                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 focus:border-amber-500 rounded-xl text-slate-900 dark:text-white outline-none text-xs"
                      />
                      <input
                        type="file" accept="image/*,.pdf"
                        onChange={(e) => { if (e.target.files) setFatherAadharFile(e.target.files[0]); }}
                        className="block w-full text-[10px] text-slate-900 dark:text-slate-300 mt-2
                          file:mr-2 file:py-1 file:px-2
                          file:border file:border-slate-300 dark:file:border-slate-600
                          file:text-[10px] file:bg-slate-50 dark:file:bg-slate-800
                          file:text-slate-900 dark:file:text-slate-200
                          hover:file:bg-slate-100 dark:hover:file:bg-slate-700
                          cursor-pointer"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Mother's Aadhaar Card (Optional)</label>
                      <input
                        type="text" name="motherAadhar" maxLength={12}
                        value={studentForm.motherAadhar} onChange={handleInputChange}
                        placeholder="12-digit Aadhaar"
                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 focus:border-amber-500 rounded-xl text-slate-900 dark:text-white outline-none text-xs"
                      />
                      <input
                        type="file" accept="image/*,.pdf"
                        onChange={(e) => { if (e.target.files) setMotherAadharFile(e.target.files[0]); }}
                        className="block w-full text-[10px] text-slate-900 dark:text-slate-300 mt-2
                          file:mr-2 file:py-1 file:px-2
                          file:border file:border-slate-300 dark:file:border-slate-600
                          file:text-[10px] file:bg-slate-50 dark:file:bg-slate-800
                          file:text-slate-900 dark:file:text-slate-200
                          hover:file:bg-slate-100 dark:hover:file:bg-slate-700
                          cursor-pointer"
                      />
                    </div>

                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Parent Email Address (Optional)</label>
                      <input
                        type="email" name="parentEmail"
                        value={studentForm.parentEmail} onChange={handleInputChange}
                        placeholder="parent@example.com"
                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 focus:border-amber-500 rounded-xl text-slate-900 dark:text-white outline-none text-xs"
                      />
                    </div>

                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Residential Address *</label>
                      <textarea
                        required name="parentAddress" rows={3}
                        value={studentForm.parentAddress} onChange={handleInputChange}
                        placeholder="Full home/office address details"
                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 focus:border-amber-500 rounded-xl text-slate-900 dark:text-white outline-none text-xs resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-orange-500/10 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                  Register & Complete Admission
                </button>
              </form>
            </motion.div>
          </div>

          {/* Pricing Config / Live Calculator Panel */}
          <div className="lg:col-span-1 space-y-6">

            {/* 1. Live Calculator */}
            <div className="bg-white dark:bg-slate-900/50 border-y md:border border-slate-200 dark:border-slate-800 rounded-lg p-6 space-y-5">
              <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <Calculator className="w-4 h-4 text-amber-500" /> Fees Live Calculator
              </h3>

              <div className="space-y-4">
                {/* Checkboxes */}
                <div className="bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-850 p-4 rounded-2xl space-y-3">
                  <p className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wide mb-1">Optional Facilities / Add-ons</p>

                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox" name="transport"
                      checked={services.transport} onChange={handleCheckboxChange}
                      className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                    />
                    <div className="text-xs">
                      <p className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-amber-400 transition-colors">Transport Service</p>
                      <p className="text-[10px] text-slate-500">+₹{feesConfig.addons.transport} / annum</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox" name="dress"
                      checked={services.dress} onChange={handleCheckboxChange}
                      className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                    />
                    <div className="text-xs">
                      <p className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-amber-400 transition-colors">School Dress / Uniform</p>
                      <p className="text-[10px] text-slate-500">+₹{feesConfig.addons.dress} / set</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox" name="books"
                      checked={services.books} onChange={handleCheckboxChange}
                      className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                    />
                    <div className="text-xs">
                      <p className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-amber-400 transition-colors">Books & Study Materials</p>
                      <p className="text-[10px] text-slate-500">+₹{feesConfig.addons.books} / year</p>
                    </div>
                  </label>
                </div>

                {/* Calculation Breakdown */}
                <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-850">
                  <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span>Base Tuition Fee:</span>
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                      ₹{classFee} / yr (approx. ₹{Math.round(classFee / 12)} / mo)
                    </span>
                  </div>
                  {services.transport && (
                    <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                      <span>Transport Service:</span>
                      <span className="font-mono font-bold text-slate-800 dark:text-slate-200">₹{feesConfig.addons.transport}</span>
                    </div>
                  )}
                  {services.dress && (
                    <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                      <span>School Uniform:</span>
                      <span className="font-mono font-bold text-slate-800 dark:text-slate-200">₹{feesConfig.addons.dress}</span>
                    </div>
                  )}
                  {services.books && (
                    <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                      <span>Books & Kit:</span>
                      <span className="font-mono font-bold text-slate-800 dark:text-slate-200">₹{feesConfig.addons.books}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center text-sm font-bold text-white pt-3 border-t border-dashed border-slate-200 dark:border-slate-800">
                    <span className="text-amber-400 uppercase tracking-wider text-xs">Total Academic Fee:</span>
                    <span className="text-lg text-emerald-400 font-mono">
                      ₹{totalFees} / yr (approx. ₹{Math.round(totalFees / 12)} / mo)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Helper Info */}
            <div className="bg-white dark:bg-slate-900/30 border-y md:border border-slate-200 dark:border-slate-800/80 rounded-lg p-5 text-xs text-slate-500 dark:text-slate-400 flex gap-3">
              <Info className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
              <p>The total fee balance is automatically debited to the student's ledger. Payments can be accepted via UPI QR code or recorded manually from the operator console.</p>
            </div>

          </div>
        </div>
      </div>

      {/* Post-Admission Payment Selection Modal */}
      <AnimatePresence>
        {showPaymentModal && enrolledStudent && (
          <div className="fixed inset-0 bg-slate-900/40 dark:bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <motion.div
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 w-full max-w-lg shadow-2xl relative"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >

              <button
                onClick={() => setShowPaymentModal(false)}
                className="absolute top-4 right-4 p-2 bg-slate-200 dark:bg-slate-850 hover:bg-slate-100 dark:bg-slate-800 rounded-full cursor-pointer text-slate-500 dark:text-slate-400 hover:text-white transition-all"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="text-center space-y-2 mb-6">
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-full w-fit mx-auto text-emerald-400">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white">Admission Record Created</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Student {enrolledStudent.name} enrolled for Class {savedClass || "Selected Level"}
                </p>
                <p className="text-sm font-bold text-amber-400">Total Fees: ₹{enrolledStudent.totalFees} {enrolledStudent.paymentCycle === "MONTHLY" && `(Monthly plan: ₹${Math.round(enrolledStudent.totalFees / 12)} / mo)`}</p>
              </div>

              {/* Step 1: SELECT METHOD */}
              {paymentOption === "SELECT" && (
                <div className="space-y-4">
                  <p className="text-xs text-center text-slate-700 dark:text-slate-300 mb-4">Select the preferred payment method to handle initial academic fees:</p>

                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={handleInitiateCashPayment}
                      className="p-5 bg-slate-50 dark:bg-slate-950/60 hover:bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-amber-500/60 rounded-2xl flex flex-col items-center justify-center gap-3 transition-all cursor-pointer group"
                    >
                      <DollarSign className="w-8 h-8 text-amber-500 group-hover:scale-110 transition-transform" />
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Pay by Cash</span>
                    </button>

                    <button
                      onClick={() => {
                        setPaymentOption("QR");
                        fetchQRForAdmission();
                      }}
                      className="p-5 bg-slate-50 dark:bg-slate-950/60 hover:bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-blue-500/60 rounded-2xl flex flex-col items-center justify-center gap-3 transition-all cursor-pointer group"
                    >
                      <QrCode className="w-8 h-8 text-blue-500 group-hover:scale-110 transition-transform" />
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">UPI QR Payment</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: CASH flow details */}
              {paymentOption === "CASH" && (
                <div className="space-y-6 text-center">
                  <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-2xl text-amber-400 text-xs flex gap-3 text-left">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold uppercase tracking-wider mb-1">Office Notice</p>
                      <p>First visit school, then approve fees paid.</p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Submit the invoice cash physical slip to the reception desk. Once cash is audited, the admin console will approve and update payment logs.
                  </p>

                  <div className="flex gap-3">
                    <button
                      onClick={() => sendWhatsAppNotification(true)}
                      className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 font-bold rounded-xl text-xs cursor-pointer border border-slate-750 flex items-center justify-center gap-1.5 transition-all"
                    >
                      <MessageSquare className="w-4 h-4 text-emerald-400" /> Notify Parent
                    </button>
                    <button
                      onClick={() => setShowPaymentModal(false)}
                      className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold rounded-xl text-xs cursor-pointer shadow-lg hover:from-amber-400 hover:to-orange-500 transition-all"
                    >
                      Done & Close
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: UPI QR flow details */}
              {paymentOption === "QR" && (
                <div className="space-y-6">
                  {actionLoading ? (
                    <div className="flex flex-col items-center justify-center py-10">
                      <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-2" />
                      <p className="text-xs text-slate-500 dark:text-slate-400">Generating UPI payment QR code...</p>
                    </div>
                  ) : qrCodeData ? (
                    <div className="space-y-5">
                      {!recordedPayment ? (
                        <>
                          <div className="bg-white p-3.5 rounded-2xl w-40 h-40 mx-auto shadow-inner flex items-center justify-center border border-slate-200">
                            <img src={qrCodeData.qrBase64} alt="UPI QR" className="w-full h-full" />
                          </div>

                          <div className="text-center space-y-1.5">
                            <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Scan QR Code to pay ₹{qrCodeData.amount}</p>
                            <p className="text-[10px] text-slate-500 font-mono select-all bg-slate-50 dark:bg-slate-950/60 p-2 rounded-lg border border-slate-200 dark:border-slate-800 break-all max-w-sm mx-auto">
                              {qrCodeData.upiUri}
                            </p>
                          </div>

                          {/* Screenshot file upload & transaction ID verification */}
                          <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-850">
                            <div className="space-y-1">
                              <label className="text-[9px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Transaction ID / UTR *</label>
                              <input
                                type="text"
                                required
                                value={txnId}
                                onChange={(e) => setTxnId(e.target.value)}
                                placeholder="Enter 12-digit transaction ID"
                                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 focus:border-blue-500 rounded-xl text-slate-900 dark:text-white outline-none text-xs"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-[9px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Upload QR Payment Receipt screenshot</label>
                              <div className="w-full flex items-center justify-between gap-3 px-3 py-2 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl">
                                <span className="text-[10px] text-slate-500 truncate">
                                  {screenshotFile ? screenshotFile.name : "Choose file..."}
                                </span>
                                <label className="py-1.5 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-750 text-white rounded-lg text-[9px] font-bold cursor-pointer inline-flex items-center gap-1">
                                  <Upload className="w-3 h-3" /> Select
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => { if (e.target.files) setScreenshotFile(e.target.files[0]); }}
                                    className="hidden"
                                  />
                                </label>
                              </div>
                            </div>

                            <button
                              onClick={handleConfirmQRPayment}
                              disabled={actionLoading || !txnId}
                              className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl text-xs cursor-pointer shadow-lg hover:from-blue-500 hover:to-indigo-500 transition-all flex items-center justify-center gap-1.5"
                            >
                              Verify & Approve Payment
                            </button>
                          </div>
                        </>
                      ) : (
                        <div className="text-center space-y-4 py-4">
                          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20 w-fit mx-auto">
                            <CheckCircle className="w-8 h-8" />
                          </div>
                          <h4 className="font-bold text-sm text-emerald-400">QR Payment verified successfully!</h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400">Receipt reference: {recordedPayment.receiptNumber}</p>

                          <div className="space-y-2 pt-2">
                            <button
                              onClick={() => printReceipt(recordedPayment.id)}
                              className="w-full py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold cursor-pointer inline-flex items-center justify-center gap-1.5 transition-all"
                            >
                              <Download className="w-4 h-4" /> Download PDF Receipt
                            </button>

                            <button
                              onClick={() => sendWhatsAppNotification(false)}
                              className="w-full py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold cursor-pointer inline-flex items-center justify-center gap-1.5 transition-all border border-slate-750"
                            >
                              <MessageSquare className="w-4 h-4 text-emerald-400" /> Share receipt on WhatsApp
                            </button>

                            <button
                              onClick={() => setShowPaymentModal(false)}
                              className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold cursor-pointer shadow-md"
                            >
                              Finish & Close
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center text-slate-500 py-10 text-xs">Error generating QR payment link.</div>
                  )}
                </div>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default StudentAdmissionPage;
