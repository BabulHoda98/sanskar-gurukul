"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { 
  User, Phone, Mail, FileText, CheckCircle, XCircle, LogOut,
  Calendar, Clock, UserPlus, QrCode, CreditCard, DollarSign, Download, Plus, MapPin, ClipboardList, Loader2, GraduationCap, X
} from "lucide-react";

import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { TabButton } from "@/components/dashboard/TabButton";
import api, { API_URL } from "@/lib/api";

function EmployeeDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("inquiries"); // inquiries, payments, attendance, addEmployee
  const [token, setToken] = useState("");
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Inquiries State
  const [inquiries, setInquiries] = useState([]);
  const [selectedInquiry, setSelectedInquiry] = useState<any>(null);
  const [feedbackStatus, setFeedbackStatus] = useState("DONE");
  const [feedbackNotes, setFeedbackNotes] = useState("");

  // Attendance State
  const [attendanceLogs, setAttendanceLogs] = useState([]);
  const [attendanceStatus, setAttendanceStatus] = useState("PRESENT");
  const [attendanceNotes, setAttendanceNotes] = useState("");

  // Add Employee Form State
  const [empForm, setEmpForm] = useState({
    name: "", email: "", password: "", mobile: "", address: "", aadhaarNumber: "", panCard: "", age: ""
  });
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [aadhaarPhoto, setAadhaarPhoto] = useState<File | null>(null);
  const [panPhoto, setPanPhoto] = useState<File | null>(null);
  const [pastExperiencePhoto, setPastExperiencePhoto] = useState<File | null>(null);

  // QR and Payments State
  const [studentId, setStudentId] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("QR");
  const [txnId, setTxnId] = useState("");
  const [qrCodeData, setQrCodeData] = useState<any>(null);
  const [recordedPayment, setRecordedPayment] = useState<any>(null);
  const [payments, setPayments] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Load User and Token
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!storedToken || !storedUser) {
      router.push("/login");
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    if (parsedUser.role !== "EMPLOYEE" && parsedUser.role !== "ADMIN") {
      router.push("/login");
      return;
    }

    setToken(storedToken);
    setCurrentUser(parsedUser);
  }, []);

  // Fetch initial tab data
  useEffect(() => {
    if (!token) return;
    if (activeTab === "inquiries") fetchInquiries();
    if (activeTab === "attendance") fetchAttendance();
    if (activeTab === "payments") fetchPayments();
  }, [activeTab, token]);

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  // 1. Fetch Inquiries
  const fetchInquiries = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/api/employee/inquiries", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInquiries(response.data.inquiries);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Submit Inquiry Feedback
  const handleInquiryFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      await api.put(`/api/employee/inquiries/${selectedInquiry.id}/feedback`, {
        feedbackStatus,
        feedbackNotes
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      toast.success("Feedback updated successfully!");
      setSelectedInquiry(null);
      setFeedbackNotes("");
      fetchInquiries();
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update feedback.");
    } finally {
      setActionLoading(false);
    }
  };

  // 3. Log Attendance
  const handleLogAttendance = async () => {
    setActionLoading(true);
    try {
      const response = await api.post("/api/employee/attendance", {
        status: attendanceStatus,
        notes: attendanceNotes
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      toast.success(response.data.message);
      setAttendanceNotes("");
      fetchAttendance();
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to log attendance.");
    } finally {
      setActionLoading(false);
    }
  };

  // 4. Fetch Attendance Logs
  const fetchAttendance = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/api/employee/attendance", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAttendanceLogs(response.data.attendance);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // 5. Add Employee Form Submit
  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);

    if (!profilePhoto || !aadhaarPhoto) {
      toast.error("Both Profile Photo and Aadhaar Photo are required uploads.");
      setActionLoading(false);
      return;
    }

    try {
      const data = new FormData();
      Object.entries(empForm).forEach(([key, val]) => {
        data.append(key, val);
      });
      data.append("profilePhoto", profilePhoto);
      data.append("aadhaarPhoto", aadhaarPhoto);
      if (panPhoto) data.append("panPhoto", panPhoto);
      if (pastExperiencePhoto) data.append("pastExperiencePhoto", pastExperiencePhoto);

      await api.post("/api/employee/add-employee", data, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success("Employee added successfully!");
      setEmpForm({ name: "", email: "", password: "", mobile: "", address: "", aadhaarNumber: "", panCard: "", age: "" });
      setProfilePhoto(null);
      setAadhaarPhoto(null);
      setPanPhoto(null);
      setPastExperiencePhoto(null);
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to add employee.");
    } finally {
      setActionLoading(false);
    }
  };

  // 6. QR Pay Initiation
  const handleInitiateQR = async () => {
    setActionLoading(true);
    setQrCodeData(null);
    setRecordedPayment(null);
    try {
      const response = await api.post("/api/payments/qr-initiate", {
        studentId,
        amount: paymentAmount
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setQrCodeData(response.data);
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to initiate QR payment.");
    } finally {
      setActionLoading(false);
    }
  };

  // 7. Record Payment
  const handleRecordPayment = async () => {
    setActionLoading(true);
    try {
      const response = await api.post("/api/payments/record", {
        studentId,
        amount: paymentAmount,
        paymentMethod,
        transactionId: txnId
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      toast.success("Payment logged successfully!");
      setRecordedPayment(response.data.payment);
      setQrCodeData(null);
      setTxnId("");
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to record payment.");
    } finally {
      setActionLoading(false);
    }
  };

  // 8. Download/Print PDF receipt
  const printReceipt = (paymentId: string) => {
    // Open printable PDF stream in new window/tab
    window.open(`${API_URL}/api/payments/invoice/${paymentId}?token=${token}`, "_blank");
  };

  // 9. Fetch payments list for employee view
  const fetchPayments = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/api/payments", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPayments(response.data.payments);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // 10. Approve/Deny pending payments
  const handleUpdatePaymentStatus = async (paymentId: string, status: "COMPLETED" | "FAILED") => {
    setActionLoading(true);
    try {
      const response = await api.put(`/api/payments/${paymentId}/status`, {
        status
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = response.data;
      toast.success(data.message || `Payment has been successfully ${status === "COMPLETED" ? "approved" : "denied"}.`);
      
      // Trigger WhatsApp notification on payment approval
      if (status === "COMPLETED" && data.payment && data.payment.student) {
        const p = data.payment;
        const msg = `Dear Parent, the fee payment of ₹${p.amount} (Receipt No: ${p.receiptNumber}) for student ${p.student.name} (Enrollment ID: ${p.student.id}) has been APPROVED and successfully processed. Download your invoice PDF here: ${API_URL}/api/payments/invoice/${p.id}`;
        const encodedMsg = encodeURIComponent(msg);
        let phone = p.student.mobile.trim();
        if (phone.length === 10) {
          phone = "91" + phone;
        }
        const whatsappUrl = `https://wa.me/${phone}?text=${encodedMsg}`;
        window.open(whatsappUrl, "_blank");
      }

      fetchPayments();
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Error updating payment status.");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-16">
      {/* Reusable Console Header */}
      <DashboardHeader
        consoleTitle="Gurukul Employee Portal"
        userName={currentUser?.name}
        roleName="Staff Member"
        onPortalRedirectClick={() => router.push("/student-admission")}
        portalRedirectLabel="Admission Portal"
        onLogoutClick={handleLogout}
        themeColor="blue"
      />

      <div className="max-w-7xl mx-auto px-6 md:px-12 mt-8">
        {/* Reusable Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 bg-slate-900/40 p-1.5 border border-slate-800 rounded-2xl">
          {[
            { id: "inquiries", label: "Admission Inquiries", icon: FileText },
            { id: "payments", label: "QR Payment & Fees", icon: QrCode },
            { id: "attendance", label: "My Attendance", icon: Clock },
            { id: "addEmployee", label: "Add Employee", icon: UserPlus }
          ].map((tab) => (
            <TabButton
              key={tab.id}
              id={tab.id}
              label={tab.label}
              icon={tab.icon}
              isActive={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              themeColor="blue"
            />
          ))}
        </div>

        {/* Tab Contents */}
        <main className="bg-slate-900/30 border border-slate-800/80 rounded-3xl p-6 md:p-8 min-h-[500px]">
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-24">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-2" />
              <p className="text-sm text-slate-400">Loading data...</p>
            </div>
          )}

          {!isLoading && activeTab === "inquiries" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-slate-800">
                <div>
                  <h2 className="text-xl font-bold">Admission Inquiry Desk</h2>
                  <p className="text-xs text-slate-400">Review prospective student inquiries and record details</p>
                </div>
                <button 
                  onClick={fetchInquiries} 
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-xl border border-slate-700 cursor-pointer"
                >
                  Reload Inquiries
                </button>
              </div>

              {inquiries.length === 0 ? (
                <div className="text-center py-20 text-slate-500">No inquiries found in database.</div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left Column: List */}
                  <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                    {inquiries.map((inq: any) => (
                      <div
                        key={inq.id}
                        onClick={() => setSelectedInquiry(inq)}
                        className={`p-5 rounded-2xl border transition-all cursor-pointer ${selectedInquiry?.id === inq.id ? "bg-slate-800/50 border-blue-500/80" : "bg-slate-900/40 border-slate-800 hover:border-slate-700"}`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-sm text-white">{inq.studentName}</h4>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${inq.feedbackStatus === "DONE" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : inq.feedbackStatus === "NOT_DONE" ? "bg-rose-500/10 text-rose-400 border border-rose-500/20" : "bg-amber-500/10 text-amber-400 border border-amber-500/20"}`}>
                            {inq.feedbackStatus}
                          </span>
                        </div>
                        <div className="space-y-1 text-xs text-slate-400 mb-3">
                          <p className="flex items-center gap-1.5"><Phone className="w-3 h-3" /> {inq.mobile}</p>
                          <p className="flex items-center gap-1.5"><Mail className="w-3 h-3" /> {inq.email || "N/A"}</p>
                          <p className="flex items-center gap-1.5"><MapPin className="w-3 h-3" /> {inq.address}</p>
                        </div>
                        <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-900 text-xs text-slate-300 line-clamp-2">
                          {inq.inquiryDetails}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Right Column: Feedback Panel */}
                  <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 h-fit">
                    {selectedInquiry ? (
                      <form onSubmit={handleInquiryFeedback} className="space-y-5">
                        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                          <h3 className="font-bold text-sm text-white">
                            Record Feedback: {selectedInquiry.studentName}
                          </h3>
                          <button
                            type="button"
                            onClick={() => setSelectedInquiry(null)}
                            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                            aria-label="Close"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Feedback Status</label>
                          <div className="flex gap-2">
                            {["PENDING", "DONE", "NOT_DONE"].map((st) => (
                              <button
                                key={st}
                                type="button"
                                onClick={() => setFeedbackStatus(st)}
                                className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${feedbackStatus === st ? "bg-blue-600/10 border-blue-500 text-blue-400" : "bg-slate-950/30 border-slate-800 text-slate-400"}`}
                              >
                                {st}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Feedback Notes</label>
                          <textarea
                            required
                            rows={4}
                            value={feedbackNotes}
                            onChange={(e) => setFeedbackNotes(e.target.value)}
                            placeholder="Type progress feedback details here..."
                            className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-800 focus:border-blue-500 rounded-xl text-white outline-none text-xs resize-none"
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={actionLoading}
                          className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl text-xs font-bold text-white shadow-lg cursor-pointer flex items-center justify-center gap-1"
                        >
                          {actionLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                          Save Feedback Log
                        </button>
                      </form>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-20 text-slate-500 text-center">
                        <ClipboardList className="w-8 h-8 text-slate-700 mb-2" />
                        <p className="text-xs">Select an inquiry card from the left panel to update progress feedback details.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {!isLoading && activeTab === "payments" && (
            <div className="space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <h2 className="text-xl font-bold">QR Payment & Receipting</h2>
                <p className="text-xs text-slate-400">Generate deep-linked UPI QR codes or log payments directly</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Form Panel */}
                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-6">
                  <div className="space-y-4">
                    <h3 className="font-bold text-sm text-white">Payment Details</h3>
                    
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Student ID *</label>
                      <input
                        type="text"
                        value={studentId}
                        onChange={(e) => setStudentId(e.target.value)}
                        placeholder="Student ID"
                        className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-800 focus:border-blue-500 rounded-xl text-white outline-none text-xs"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Amount (INR) *</label>
                      <input
                        type="number"
                        value={paymentAmount}
                        onChange={(e) => setPaymentAmount(e.target.value)}
                        placeholder="Enter paid amount"
                        className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-800 focus:border-blue-500 rounded-xl text-white outline-none text-xs"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Payment Mode</label>
                      <div className="flex gap-2">
                        {["QR", "CASH", "CARD"].map((m) => (
                          <button
                            key={m}
                            type="button"
                            onClick={() => setPaymentMethod(m)}
                            className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${paymentMethod === m ? "bg-blue-600/10 border-blue-500 text-blue-400" : "bg-slate-950/30 border-slate-800 text-slate-400"}`}
                          >
                            {m}
                          </button>
                        ))}
                      </div>
                    </div>

                    {paymentMethod !== "CASH" && (
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Transaction/Ref ID</label>
                        <input
                          type="text"
                          value={txnId}
                          onChange={(e) => setTxnId(e.target.value)}
                          placeholder="Bank transaction ID reference"
                          className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-800 focus:border-blue-500 rounded-xl text-white outline-none text-xs"
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={handleInitiateQR}
                      disabled={actionLoading || !studentId || !paymentAmount}
                      className="flex-1 py-3 bg-slate-850 hover:bg-slate-800 border border-slate-750 rounded-xl text-xs font-bold text-white cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
                    >
                      <QrCode className="w-4 h-4" />
                      Show Pay QR
                    </button>

                    <button
                      onClick={handleRecordPayment}
                      disabled={actionLoading || !studentId || !paymentAmount}
                      className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl text-xs font-bold text-white shadow-lg cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
                    >
                      <DollarSign className="w-4 h-4" />
                      Record & Receipt
                    </button>
                  </div>
                </div>

                {/* Right Results Panel */}
                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center min-h-[300px]">
                  {qrCodeData && (
                    <div className="text-center space-y-4">
                      <h4 className="font-bold text-sm text-white">Scan QR to Pay</h4>
                      <p className="text-xs text-slate-400">Paying ₹{qrCodeData.amount} to {qrCodeData.studentName}</p>
                      
                      <div className="bg-white p-4 rounded-2xl w-48 h-48 mx-auto shadow-inner flex items-center justify-center border border-slate-200">
                        <img src={qrCodeData.qrBase64} alt="UPI Payment QR Code" className="w-full h-full" />
                      </div>
                      
                      <p className="text-[10px] text-slate-500 break-all font-mono select-all bg-slate-950/60 p-2 rounded-lg border border-slate-800 max-w-sm mx-auto">
                        {qrCodeData.upiUri}
                      </p>
                    </div>
                  )}

                  {recordedPayment && (
                    <div className="text-center space-y-4">
                      <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20 w-fit mx-auto">
                        <CheckCircle className="w-8 h-8" />
                      </div>
                      <h4 className="font-bold text-sm text-emerald-400">Payment Logged Successfully!</h4>
                      
                      <div className="bg-slate-950/60 p-4 rounded-xl text-xs text-left space-y-1.5 border border-slate-800 w-full max-w-xs mx-auto">
                        <p className="text-slate-400">Receipt: <span className="font-semibold text-white">{recordedPayment.receiptNumber}</span></p>
                        <p className="text-slate-400">Amount: <span className="font-semibold text-white">₹{recordedPayment.amount}</span></p>
                        <p className="text-slate-400">Mode: <span className="font-semibold text-white">{recordedPayment.paymentMethod}</span></p>
                      </div>

                      <button
                        onClick={() => printReceipt(recordedPayment.id)}
                        className="py-2.5 px-5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold cursor-pointer inline-flex items-center gap-1.5 shadow-md shadow-blue-600/10"
                      >
                        <Download className="w-4 h-4" />
                        Print/Download Invoice
                      </button>
                    </div>
                  )}

                  {!qrCodeData && !recordedPayment && (
                    <div className="text-slate-500 text-xs text-center space-y-2">
                      <QrCode className="w-10 h-10 text-slate-700 mx-auto" />
                      <p>Awaiting payment details. Fill the form on the left to generate a scan code or record receipts.</p>
                    </div>
                    )}
                  </div>
                </div>

              {/* Recent Payments Table */}
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 overflow-x-auto mt-8">
                <h3 className="font-bold text-xs text-slate-200 mb-4">Recent Payments Ledger</h3>
                {payments.length === 0 ? (
                  <div className="text-center py-10 text-slate-500 text-xs">No payments recorded.</div>
                ) : (
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400">
                        <th className="py-2.5">Receipt No.</th>
                        <th className="py-2.5">Student</th>
                        <th className="py-2.5">Amount</th>
                        <th className="py-2.5">Method</th>
                        <th className="py-2.5">Status</th>
                        <th className="py-2.5">Date</th>
                        <th className="py-2.5">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments.map((p: any) => (
                        <tr key={p.id} className="border-b border-slate-850">
                          <td className="py-2.5 font-semibold text-white">{p.receiptNumber}</td>
                          <td className="py-2.5">
                            <p className="font-medium text-slate-200">{p.student?.name}</p>
                            <p className="text-[9px] text-slate-500">{p.student?.email}</p>
                          </td>
                          <td className="py-2.5 font-bold text-white">₹{p.amount}</td>
                          <td className="py-2.5">
                            <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold ${p.paymentMethod === "QR" ? "bg-blue-600/10 text-blue-400" : p.paymentMethod === "CASH" ? "bg-amber-600/10 text-amber-400" : "bg-purple-600/10 text-purple-400"}`}>
                              {p.paymentMethod}
                            </span>
                          </td>
                          <td className="py-2.5">
                            <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold ${p.status === "COMPLETED" ? "bg-emerald-600/10 text-emerald-400" : p.status === "PENDING" ? "bg-yellow-600/10 text-yellow-400 animate-pulse" : "bg-rose-600/10 text-rose-400"}`}>
                              {p.status}
                            </span>
                          </td>
                          <td className="py-2.5 text-slate-400">{new Date(p.createdAt).toLocaleDateString()}</td>
                          <td className="py-2.5 flex items-center gap-2">
                            {p.status === "PENDING" ? (
                              <>
                                <button
                                  onClick={() => handleUpdatePaymentStatus(p.id, "COMPLETED")}
                                  className="px-2 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[9px] font-bold cursor-pointer transition-all"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleUpdatePaymentStatus(p.id, "FAILED")}
                                  className="px-2 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded text-[9px] font-bold cursor-pointer transition-all"
                                >
                                  Deny
                                </button>
                              </>
                            ) : (
                              <button
                                onClick={() => printReceipt(p.id)}
                                className="p-1.5 bg-slate-800 hover:bg-slate-750 rounded text-slate-300 hover:text-white cursor-pointer"
                                title="Download invoice"
                              >
                                <Download className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {!isLoading && activeTab === "attendance" && (
            <div className="space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <h2 className="text-xl font-bold">Attendance Logging</h2>
                <p className="text-xs text-slate-400">Log daily shift check-in / check-out times and audit history</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Panel: Log Form */}
                <div className="lg:col-span-1 bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-5 h-fit">
                  <h3 className="font-bold text-sm text-white">Clock In/Out</h3>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Select Status</label>
                    <select
                      value={attendanceStatus}
                      onChange={(e) => setAttendanceStatus(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-800 focus:border-blue-500 rounded-xl text-white outline-none text-xs"
                    >
                      <option value="PRESENT">Present</option>
                      <option value="LEAVE">Leave/On-Duty</option>
                      <option value="LATE">Late Clock-in</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Shift Notes</label>
                    <input
                      type="text"
                      value={attendanceNotes}
                      onChange={(e) => setAttendanceNotes(e.target.value)}
                      placeholder="Comment e.g. morning shift, off-site visit"
                      className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-800 focus:border-blue-500 rounded-xl text-white outline-none text-xs"
                    />
                  </div>

                  <button
                    onClick={handleLogAttendance}
                    disabled={actionLoading}
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl text-xs font-bold text-white shadow-lg cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    {actionLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Clock className="w-4 h-4" />}
                    Submit Shift Log
                  </button>
                </div>

                {/* Right Panel: Logs list */}
                <div className="lg:col-span-2 bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                  <h3 className="font-bold text-sm text-white mb-4">My Attendance Log</h3>
                  
                  {attendanceLogs.length === 0 ? (
                    <div className="text-center py-12 text-slate-500 text-xs">No attendance logs logged yet.</div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left">
                        <thead>
                          <tr className="border-b border-slate-800 text-slate-400">
                            <th className="py-2.5">Date</th>
                            <th className="py-2.5">Status</th>
                            <th className="py-2.5">Check In</th>
                            <th className="py-2.5">Check Out</th>
                            <th className="py-2.5">Notes</th>
                          </tr>
                        </thead>
                        <tbody>
                          {attendanceLogs.map((log: any) => (
                            <tr key={log.id} className="border-b border-slate-850">
                              <td className="py-2.5 font-medium">{new Date(log.date).toLocaleDateString()}</td>
                              <td className="py-2.5">
                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${log.status === "PRESENT" ? "bg-emerald-500/10 text-emerald-400" : log.status === "LATE" ? "bg-amber-500/10 text-amber-400" : "bg-slate-500/10 text-slate-400"}`}>
                                  {log.status}
                                </span>
                              </td>
                              <td className="py-2.5">{log.checkInTime ? new Date(log.checkInTime).toLocaleTimeString() : "-"}</td>
                              <td className="py-2.5">{log.checkOutTime ? new Date(log.checkOutTime).toLocaleTimeString() : "-"}</td>
                              <td className="py-2.5 text-slate-400 italic">{log.notes || "-"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {!isLoading && activeTab === "addEmployee" && (
            <div className="space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <h2 className="text-xl font-bold">Add Employee Account</h2>
                <p className="text-xs text-slate-400">Create new staff profiles in the school registry</p>
              </div>

              <form onSubmit={handleAddEmployee} className="space-y-6 max-w-4xl bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Full Name *</label>
                    <input
                      type="text" required name="name"
                      value={empForm.name} onChange={(e) => setEmpForm({...empForm, name: e.target.value})}
                      placeholder="Enter full name"
                      className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-800 focus:border-blue-500 rounded-xl text-white outline-none text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Email Address *</label>
                    <input
                      type="email" required name="email"
                      value={empForm.email} onChange={(e) => setEmpForm({...empForm, email: e.target.value})}
                      placeholder="employee@gurukul.com"
                      className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-800 focus:border-blue-500 rounded-xl text-white outline-none text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Password *</label>
                    <input
                      type="password" required name="password"
                      value={empForm.password} onChange={(e) => setEmpForm({...empForm, password: e.target.value})}
                      placeholder="Temporary password"
                      className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-800 focus:border-blue-500 rounded-xl text-white outline-none text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Mobile Number *</label>
                    <input
                      type="tel" required name="mobile"
                      value={empForm.mobile} onChange={(e) => setEmpForm({...empForm, mobile: e.target.value})}
                      placeholder="10-digit mobile"
                      className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-800 focus:border-blue-500 rounded-xl text-white outline-none text-xs"
                    />
                  </div>

                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Address *</label>
                    <textarea
                      required name="address" rows={2}
                      value={empForm.address} onChange={(e) => setEmpForm({...empForm, address: e.target.value})}
                      placeholder="Full residential address"
                      className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-800 focus:border-blue-500 rounded-xl text-white outline-none text-xs resize-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Aadhaar Card Number *</label>
                    <input
                      type="text" required name="aadhaarNumber"
                      value={empForm.aadhaarNumber} onChange={(e) => setEmpForm({...empForm, aadhaarNumber: e.target.value})}
                      placeholder="12-digit Aadhaar number"
                      className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-800 focus:border-blue-500 rounded-xl text-white outline-none text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">PAN Card Number (Optional)</label>
                    <input
                      type="text" name="panCard"
                      value={empForm.panCard} onChange={(e) => setEmpForm({...empForm, panCard: e.target.value})}
                      placeholder="10-digit PAN"
                      className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-800 focus:border-blue-500 rounded-xl text-white outline-none text-xs"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Profile Photo *</label>
                    <input
                      type="file" required accept="image/*"
                      onChange={(e) => { if (e.target.files) setProfilePhoto(e.target.files[0]); }}
                      className="w-full text-xs text-slate-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-slate-200 file:cursor-pointer"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Aadhaar Photo *</label>
                    <input
                      type="file" required accept="image/*"
                      onChange={(e) => { if (e.target.files) setAadhaarPhoto(e.target.files[0]); }}
                      className="w-full text-xs text-slate-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-slate-200 file:cursor-pointer"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">PAN Card Photo (Optional)</label>
                    <input
                      type="file" accept="image/*"
                      onChange={(e) => { if (e.target.files) setPanPhoto(e.target.files[0]); }}
                      className="w-full text-xs text-slate-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-slate-200 file:cursor-pointer"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Age (Optional)</label>
                    <input
                      type="number" name="age"
                      value={empForm.age} onChange={(e) => setEmpForm({ ...empForm, age: e.target.value })}
                      placeholder="Age"
                      className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-800 focus:border-blue-500 rounded-xl text-white outline-none text-xs"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Past Experience Upload (Optional)</label>
                    <input
                      type="file" accept="application/pdf,image/*"
                      onChange={(e) => { if (e.target.files) setPastExperiencePhoto(e.target.files[0]); }}
                      className="w-full text-xs text-slate-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-slate-200 file:cursor-pointer"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={actionLoading}
                  className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {actionLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                  Register Employee
                </button>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default EmployeeDashboard;
