"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import {
  User, Users, DollarSign, Clock, ShieldAlert, GraduationCap, PlusCircle,
  Search, Download, QrCode, ClipboardList, CheckCircle, ArrowUpRight, LogOut, Loader2, UserPlus, Upload, Calculator, Settings, Edit,
  Phone, Mail, MapPin, FileText, MessageSquare, LineChart, X, ArrowUpDown, ArrowUp, ArrowDown
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { TabButton } from "@/components/dashboard/TabButton";
import { AdminRolesTab } from "@/components/dashboard/AdminRolesTab";
import { AdminFeesSettingsTab } from "@/components/dashboard/AdminFeesSettingsTab";
import api, { API_URL } from "@/lib/api";

const StatsWidget = ({ title, daily, monthly, yearly, prefix = "" }: { title: string, daily: number | string, monthly: number | string, yearly: number | string, prefix?: string }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
    <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 p-4 rounded-lg text-center">
      <p className="text-[10px] uppercase font-bold text-slate-500">Today's {title}</p>
      <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">{prefix}{daily}</p>
    </div>
    <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 p-4 rounded-lg text-center">
      <p className="text-[10px] uppercase font-bold text-slate-500">This Month's {title}</p>
      <p className="text-xl font-bold text-amber-600 mt-1">{prefix}{monthly}</p>
    </div>
    <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 p-4 rounded-lg text-center">
      <p className="text-[10px] uppercase font-bold text-slate-500">This Year's {title}</p>
      <p className="text-xl font-bold text-emerald-600 mt-1">{prefix}{yearly}</p>
    </div>
  </div>
);

function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview"); // overview, students, enroll, addEmployee, payments, attendance, roles, feesSettings
  const [token, setToken] = useState("");
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Lists Data
  const [students, setStudents] = useState([]);
  const [payments, setPayments] = useState([]);
  const [attendances, setAttendances] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [dashboardStats, setDashboardStats] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("ALL");
  const [cycleFilter, setCycleFilter] = useState("ALL"); // ALL, MONTHLY, ANNUAL

  // Inquiries State
  const [inquiries, setInquiries] = useState([]);
  const [selectedInquiry, setSelectedInquiry] = useState<any>(null);
  const [feedbackStatus, setFeedbackStatus] = useState("DONE");
  const [feedbackNotes, setFeedbackNotes] = useState("");

  // Fees Configuration State
  const [feesConfig, setFeesConfig] = useState<any>({
    classes: {},
    addons: { transport: 0, dress: 0, books: 0 }
  });

  // Enroll Form State (Dynamic class & checkboxes)
  const [enrollForm, setEnrollForm] = useState({
    name: "",
    email: "",
    mobile: "",
    studentAadhaar: "",
    selectedClass: "",
    parentName: "",
    parentAddress: "",
    parentBusiness: ""
  });

  const [services, setServices] = useState({
    transport: false,
    dress: false,
    books: false
  });

  // Fee rates settings editor state
  const [editedFees, setEditedFees] = useState<any>({
    classes: {},
    addons: { transport: 0, dress: 0, books: 0 }
  });

  // Role Assignment State
  const [roleForm, setRoleForm] = useState({
    userId: "", role: "EMPLOYEE"
  });

  // Direct Payment Form State
  const [studentId, setStudentId] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [txnId, setTxnId] = useState("");
  const [qrCodeData, setQrCodeData] = useState<any>(null);
  const [recordedPayment, setRecordedPayment] = useState<any>(null);

  // Add Employee Form State
  const [empForm, setEmpForm] = useState({
    name: "", email: "", password: "", mobile: "", address: "", aadhaarNumber: "", panCard: "", age: ""
  });
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [aadhaarPhoto, setAadhaarPhoto] = useState<File | null>(null);
  const [panPhoto, setPanPhoto] = useState<File | null>(null);
  const [pastExperiencePhoto, setPastExperiencePhoto] = useState<File | null>(null);

  // Admin Mark Attendance Form State
  const [attendanceForm, setAttendanceForm] = useState({
    employeeId: "",
    status: "PRESENT",
    notes: ""
  });

  const [isLoading, setIsLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Expandable student transaction histories
  const [expandedStudentId, setExpandedStudentId] = useState<string | null>(null);

  // Search state for Transaction Registry
  const [paymentSearchQuery, setPaymentSearchQuery] = useState("");
  const [paymentSearchDate, setPaymentSearchDate] = useState("");
  const [paymentSortField, setPaymentSortField] = useState<string | null>("Date");
  const [paymentSortOrder, setPaymentSortOrder] = useState<"asc" | "desc">("desc");

  const handlePaymentSort = (field: string) => {
    if (paymentSortField === field) {
      setPaymentSortOrder(paymentSortOrder === "asc" ? "desc" : "asc");
    } else {
      setPaymentSortField(field);
      setPaymentSortOrder("asc");
    }
  };

  // Authenticate Admin & Fetch configurations
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

  // Fetch Tab Specific Data
  useEffect(() => {
    if (!token) return;
    if (activeTab === "overview") {
      fetchDashboardStats();
    }
    if (activeTab === "students") fetchStudents();
    if (activeTab === "payments") fetchPayments();
    if (activeTab === "attendance") { fetchAttendances(); fetchEmployees(); }
    if (activeTab === "inquiries") fetchInquiries();
  }, [activeTab, token, paymentFilter]);

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  // Fetch standard fees configuration
  const fetchFeesConfig = async () => {
    try {
      const res = await api.get("/api/public/fees-config");
      setFeesConfig(res.data);
      setEditedFees(res.data);
    } catch (err) {
      console.error("Error loading fees config:", err);
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setServices({ ...services, [servicesKey(e.target.name)]: e.target.checked });
  };

  const servicesKey = (name: string): "transport" | "dress" | "books" => {
    return name as "transport" | "dress" | "books";
  };

  // Fetch Inquiries
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

  // Submit Inquiry Feedback
  const handleInquiryFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInquiry) return;
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

      toast.success("Feedback log updated successfully!");
      setSelectedInquiry(null);
      setFeedbackNotes("");
      fetchInquiries();
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Something went wrong saving inquiry feedback.");
    } finally {
      setActionLoading(false);
    }
  };

  // 1. Fetch Students
  const fetchStudents = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/api/admin/students", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStudents(response.data.students);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Fetch Payments
  const fetchPayments = async () => {
    setIsLoading(true);
    try {
      const url = paymentFilter === "ALL"
        ? "/api/admin/payments"
        : `/api/admin/payments?method=${paymentFilter}`;

      const response = await api.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPayments(response.data.payments);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Fetch Attendances
  const fetchAttendances = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/api/admin/attendance", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAttendances(response.data.attendances);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch Dashboard Stats from API
  const fetchDashboardStats = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/api/admin/dashboard-stats", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDashboardStats(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch Employees List for Dropdowns
  const fetchEmployees = async () => {
    try {
      const response = await api.get("/api/admin/employees", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEmployees(response.data.employees);
    } catch (err) {
      console.error(err);
    }
  };

  // Dynamic calculated fees for enrollment preview
  const classFee = feesConfig.classes[enrollForm.selectedClass] || 0;
  const transportFee = services.transport ? feesConfig.addons.transport : 0;
  const dressFee = services.dress ? feesConfig.addons.dress : 0;
  const booksFee = services.books ? feesConfig.addons.books : 0;
  const calculatedTotalFees = classFee + transportFee + dressFee + booksFee;

  // 4. Enroll Student
  const handleEnrollStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);

    if (enrollForm.studentAadhaar.length !== 12) {
      toast.error("Aadhaar Card number must be exactly 12 digits.");
      setActionLoading(false);
      return;
    }

    try {
      const fullAddress = `
[Parent Address]: ${enrollForm.parentAddress}
[Parent Business]: ${enrollForm.parentBusiness}
[Aadhaar]: ${enrollForm.studentAadhaar}
[Services]: Transport: ${services.transport ? "Yes" : "No"}, Uniform Dress: ${services.dress ? "Yes" : "No"}, Books/Kit: ${services.books ? "Yes" : "No"}
      `.trim();

      const response = await api.post("/api/admin/students", {
        name: enrollForm.name,
        email: enrollForm.email,
        mobile: enrollForm.mobile,
        address: fullAddress,
        totalFees: calculatedTotalFees
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      toast.success("Student enrolled successfully!");
      setEnrollForm({
        name: "", email: "", mobile: "", studentAadhaar: "", selectedClass: "", parentName: "", parentAddress: "", parentBusiness: ""
      });
      setServices({ transport: false, dress: false, books: false });
      fetchStudents();
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "An error occurred during student enrollment.");
    } finally {
      setActionLoading(false);
    }
  };

  // 5. Change/Assign Roles
  const handleAssignRole = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      await api.put("/api/admin/assign-role", roleForm, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      toast.success("User role updated successfully!");
      setRoleForm({ userId: "", role: "EMPLOYEE" });
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update role.");
    } finally {
      setActionLoading(false);
    }
  };

  // 6. Direct Payment Intake (QR generation)
  const handleAdminInitiateQR = async () => {
    setActionLoading(true);
    setQrCodeData(null);
    setRecordedPayment(null);
    try {
      const response = await api.post("/api/admin/payments/qr-initiate", {
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
      toast.error(err.response?.data?.message || "Failed to initiate payment.");
    } finally {
      setActionLoading(false);
    }
  };

  // 7. Direct Payment Record
  const handleAdminRecordPayment = async () => {
    setActionLoading(true);
    try {
      const response = await api.post("/api/admin/payments/record", {
        studentId,
        amount: paymentAmount,
        paymentMethod,
        transactionId: txnId
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      toast.success("Payment recorded successfully!");
      setRecordedPayment(response.data.payment);
      setQrCodeData(null);
      setTxnId("");
      fetchStudents();
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to record payment.");
    } finally {
      setActionLoading(false);
    }
  };

  // 8. Add Employee Form Submit
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

      await api.post("/api/admin/employees", data, {
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

  // 8.5 Admin Mark Attendance
  const handleMarkAttendance = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      await api.post("/api/admin/attendance", attendanceForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Attendance marked successfully!");
      setAttendanceForm({ employeeId: "", status: "PRESENT", notes: "" });
      fetchAttendances();
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to mark attendance.");
    } finally {
      setActionLoading(false);
    }
  };

  // 9. Update Fees Configuration
  const handleUpdateFeesConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      await api.post("/api/admin/fees-config", editedFees, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      toast.success("Standard fees updated successfully!");
      fetchFeesConfig();
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update fees.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleClassFeeChange = (clsName: string, value: string) => {
    setEditedFees({
      ...editedFees,
      classes: {
        ...editedFees.classes,
        [clsName]: parseFloat(value) || 0
      }
    });
  };

  const handleAddonFeeChange = (addonName: string, value: string) => {
    setEditedFees({
      ...editedFees,
      addons: {
        ...editedFees.addons,
        [addonName]: parseFloat(value) || 0
      }
    });
  };

  // 10. Stream PDF Invoice
  const printReceipt = (paymentId: string) => {
    window.open(`${API_URL}/api/payments/invoice/${paymentId}?token=${token}`, "_blank");
  };

  // 11. Approve/Deny pending payments
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

  const filteredStudents = students.filter((st: any) => {
    const matchesSearch = st.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      st.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      st.mobile.includes(searchQuery);
    const matchesCycle = cycleFilter === "ALL" || st.paymentCycle === cycleFilter;
    return matchesSearch && matchesCycle;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-16">
      {/* Top Header */}
      {/* Reusable Console Header */}
      <DashboardHeader
        consoleTitle="Gurukul Admin Console"
        userName={currentUser?.name}
        roleName="Administrator"
        onPortalRedirectClick={() => router.push("/student-admission")}
        portalRedirectLabel="Admission Portal"
        onLogoutClick={handleLogout}
      />

      <div className="w-full px-0 mt-0">
        {/* Reusable Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-2 bg-white/80 dark:bg-slate-900/40 p-1.5 border border-slate-200 dark:border-slate-800 rounded-lg">
          {[
            { id: "overview", label: "Dashboard Overview", icon: LineChart },
            { id: "students", label: "Student Ledger", icon: Users },
            { id: "inquiries", label: "Admission Inquiries", icon: FileText },
            { id: "enroll", label: "Enroll Student", icon: PlusCircle },
            { id: "addEmployee", label: "Add Employee", icon: UserPlus },
            { id: "payments", label: "Financial Records", icon: DollarSign },
            { id: "attendance", label: "Staff Attendance Logs", icon: Clock },
            { id: "roles", label: "Access & Roles", icon: ShieldAlert },
            { id: "feesSettings", label: "Fee Settings", icon: Settings }
          ].map((tab) => (
            <TabButton
              key={tab.id}
              id={tab.id}
              label={tab.label}
              icon={tab.icon}
              isActive={activeTab === tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setQrCodeData(null);
                setRecordedPayment(null);
                setStudentId("");
                setPaymentAmount("");
              }}
            />
          ))}
        </div>

        {/* Dashboard Panels */}
        <main className="bg-slate-900/30 border border-slate-200 dark:border-slate-800/80 rounded-lg p-6 md:p-8 min-h-[500px]">
          {isLoading && (
            <div className="space-y-4 py-4 w-full">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-full bg-white/50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-lg p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 animate-pulse">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-800 shrink-0"></div>
                    <div className="space-y-3">
                      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-48"></div>
                      <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-32"></div>
                      <div className="flex gap-2 mt-2">
                        <div className="h-6 w-16 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
                        <div className="h-6 w-20 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-4 md:mt-0">
                    <div className="h-9 w-24 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
                    <div className="h-9 w-24 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!isLoading && activeTab === "overview" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <h2 className="text-xl font-bold">Dashboard Overview</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">High-level summary of enrollments, revenue, and attendance</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <StatsWidget title="Enrollments" daily={dashboardStats?.students?.daily || 0} monthly={dashboardStats?.students?.monthly || 0} yearly={dashboardStats?.students?.yearly || 0} />
                <StatsWidget title="Revenue" prefix="₹" daily={(dashboardStats?.revenue?.daily || 0).toLocaleString()} monthly={(dashboardStats?.revenue?.monthly || 0).toLocaleString()} yearly={(dashboardStats?.revenue?.yearly || 0).toLocaleString()} />
                <StatsWidget title="Present Staff" daily={dashboardStats?.attendance?.daily || 0} monthly={dashboardStats?.attendance?.monthly || 0} yearly={dashboardStats?.attendance?.yearly || 0} />
              </div>

              <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-lg p-6 mt-8">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-6">Monthly Revenue Graph ({new Date().getFullYear()})</h3>
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dashboardStats?.graphData || []}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#64748b" }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#64748b" }} tickFormatter={(value) => `₹${value}`} dx={-10} />
                      <Tooltip
                        cursor={{ fill: '#f1f5f9', opacity: 0.1 }}
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px', color: '#fff' }}
                        itemStyle={{ color: '#fbbf24', fontWeight: 'bold' }}
                        formatter={(value: any) => [`₹${value.toLocaleString()}`, "Revenue"]}
                      />
                      <Bar dataKey="revenue" fill="#fbbf24" radius={[4, 4, 0, 0]} maxBarSize={50} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {!isLoading && activeTab === "inquiries" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <h2 className="text-xl font-bold">Admission Inquiry Desk</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Review prospective student inquiries and record details</p>
                </div>
                <button
                  onClick={fetchInquiries}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:bg-slate-700 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 cursor-pointer"
                >
                  Reload Inquiries
                </button>
              </div>

              {inquiries.length === 0 ? (
                <div className="text-center py-20 text-slate-500 dark:text-slate-500">No inquiries found in database.</div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left Column: List */}
                  <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                    {inquiries.map((inq: any) => (
                      <div
                        key={inq.id}
                        onClick={() => {
                          setSelectedInquiry(inq);
                          setFeedbackStatus(inq.feedbackStatus || "DONE");
                          setFeedbackNotes(inq.feedbackNotes || "");
                        }}
                        className={`p-5 rounded-lg border transition-all cursor-pointer ${selectedInquiry?.id === inq.id ? "bg-slate-100 dark:bg-slate-800/50 border-amber-500/80" : "bg-white/80 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:border-slate-700"}`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-sm text-slate-900 dark:text-white">{inq.studentName}</h4>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${inq.feedbackStatus === "DONE" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : inq.feedbackStatus === "NOT_DONE" ? "bg-rose-500/10 text-rose-400 border border-rose-500/20" : "bg-amber-500/10 text-amber-400 border border-amber-500/20"}`}>
                            {inq.feedbackStatus}
                          </span>
                        </div>
                        <div className="space-y-1 text-xs text-slate-500 dark:text-slate-400 mb-3">
                          <p className="flex items-center gap-1.5"><Phone className="w-3 h-3 text-amber-500" /> {inq.mobile}</p>
                          <p className="flex items-center gap-1.5"><Mail className="w-3 h-3 text-amber-500" /> {inq.email || "N/A"}</p>
                          <p className="flex items-center gap-1.5"><MapPin className="w-3 h-3 text-amber-500" /> {inq.address}</p>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-950/40 p-3 rounded-lg border border-slate-900 text-xs text-slate-700 dark:text-slate-300 line-clamp-2">
                          {inq.inquiryDetails}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Right Column: Feedback Panel */}
                  <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-lg p-6 h-fit">
                    {selectedInquiry ? (
                      <form onSubmit={handleInquiryFeedback} className="space-y-5">
                        <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3">
                          <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                            Record Feedback: {selectedInquiry.studentName}
                          </h3>
                          <button
                            type="button"
                            onClick={() => setSelectedInquiry(null)}
                            className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors cursor-pointer"
                            aria-label="Close"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Feedback Status</label>
                          <div className="flex gap-2">
                            {["PENDING", "DONE", "NOT_DONE"].map((st) => (
                              <button
                                key={st}
                                type="button"
                                onClick={() => setFeedbackStatus(st)}
                                className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-all cursor-pointer ${feedbackStatus === st ? "bg-amber-600/10 border-amber-500 text-amber-400" : "bg-slate-950/30 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400"}`}
                              >
                                {st}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Feedback Notes</label>
                          <textarea
                            required
                            rows={4}
                            value={feedbackNotes}
                            onChange={(e) => setFeedbackNotes(e.target.value)}
                            placeholder="Type progress feedback details here..."
                            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 focus:border-amber-500 rounded-lg text-slate-900 dark:text-white outline-none text-xs resize-none"
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={actionLoading}
                          className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 rounded-lg text-xs font-bold text-white shadow-lg cursor-pointer flex items-center justify-center gap-1"
                        >
                          {actionLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                          Save Feedback Log
                        </button>
                      </form>
                    ) : (
                      <div className="text-center py-12 text-slate-500 dark:text-slate-500 text-xs">
                        Select an inquiry from the list to log feedback and update its status.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {!isLoading && activeTab === "students" && (
            <div className="space-y-0">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 pb-4">
                <div>
                  <h2 className="text-xl font-bold">Student Ledger Registry</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">View enrolled students, fee status summaries, and detailed payment history records</p>
                </div>
                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                  <div className="flex bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-0.5">
                    <button
                      onClick={() => setCycleFilter("ALL")}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-colors cursor-pointer ${cycleFilter === "ALL" ? "bg-amber-600 text-white" : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:text-slate-200"}`}
                    >
                      All Cycles
                    </button>
                    <button
                      onClick={() => setCycleFilter("MONTHLY")}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-colors cursor-pointer ${cycleFilter === "MONTHLY" ? "bg-amber-600 text-white" : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:text-slate-200"}`}
                    >
                      Monthly
                    </button>
                    <button
                      onClick={() => setCycleFilter("ANNUAL")}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-colors cursor-pointer ${cycleFilter === "ANNUAL" ? "bg-amber-600 text-white" : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:text-slate-200"}`}
                    >
                      Annual
                    </button>
                  </div>
                  <div className="relative w-full md:w-56">
                    <Search className="absolute left-3.5 top-2.5 text-slate-500 dark:text-slate-400 w-3.5 h-3.5" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search name, email, phone..."
                      className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 focus:border-amber-500 rounded-lg text-xs text-slate-900 dark:text-white outline-none"
                    />
                  </div>
                </div>
              </div>

              {filteredStudents.length === 0 ? (
                <div className="text-center py-20 text-slate-500 dark:text-slate-500 text-sm">No student records match search filter.</div>
              ) : (
                <div className="space-y-4">
                  {filteredStudents.map((st: any) => (
                    <div
                      key={st.id}
                      className="bg-white/80 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/70 rounded-lg overflow-hidden transition-all"
                    >
                      {/* Top Header Card */}
                      <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-start gap-4">
                          {st.photo ? (
                            <img src={`${API_URL}${st.photo}`} alt={st.name} className="w-12 h-12 rounded-full object-cover border border-slate-200 dark:border-slate-800 shrink-0" />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-slate-950/60 flex items-center justify-center border border-slate-200 dark:border-slate-800 shrink-0">
                              <User className="w-6 h-6 text-slate-500 dark:text-slate-400" />
                            </div>
                          )}
                          <div>
                            <h3 className="font-bold text-sm text-slate-900 dark:text-white">{st.name}</h3>
                            <p className="text-[10px] text-slate-500 dark:text-slate-500 mt-0.5 font-mono select-all">UUID: {st.id}</p>
                            <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-slate-500 dark:text-slate-400 mt-2">
                              <span>Mobile: {st.mobile}</span>
                              {st.parentAlternatePhone && <span>Alt Mobile: {st.parentAlternatePhone}</span>}
                              <span>Email: {st.email}</span>
                              {st.gender && <span>Gender: {st.gender}</span>}
                              {st.dob && <span>DOB: {st.dob}</span>}
                              {st.bloodGroup && <span>Blood Group: {st.bloodGroup}</span>}
                              {st.fatherAadhar && <span>Father Aadhaar: {st.fatherAadhar}</span>}
                              {st.motherAadhar && <span>Mother Aadhaar: {st.motherAadhar}</span>}
                              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-slate-950/60 text-amber-400 border border-slate-200 dark:border-slate-800">
                                Plan: {st.paymentCycle === "MONTHLY" ? "Monthly" : "Annual"}
                              </span>
                              {st.paymentCycle === "MONTHLY" ? (() => {
                                const monthlyAmt = Math.round(st.totalFees / 12);
                                const monthsPaid = monthlyAmt > 0 ? Math.floor(st.paidFees / monthlyAmt) : 0;
                                const monthsUnpaid = 12 - monthsPaid;
                                return (
                                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-slate-950/60 text-emerald-400 border border-slate-200 dark:border-slate-800">
                                    Paid: {monthsPaid} Months | Unpaid: {monthsUnpaid} Months
                                  </span>
                                );
                              })() : (
                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold bg-slate-950/60 border ${st.pendingFees === 0 ? "text-emerald-400 border-emerald-500/20" : "text-rose-400 border-rose-500/20"}`}>
                                  Status: {st.pendingFees === 0 ? "Fully Paid" : "Balance Due"}
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 mt-2 bg-slate-50 dark:bg-slate-950/40 p-2.5 rounded-lg border border-slate-850/50 max-w-2xl">
                              <span className="text-[9px] font-bold uppercase tracking-wider text-amber-500 block mb-1">Registration Details & Facilities:</span>
                              <p className="whitespace-pre-line text-slate-700 dark:text-slate-300 leading-relaxed font-mono text-[10px]">{st.address}</p>
                            </div>
                          </div>
                        </div>

                        {/* Fee Status metrics */}
                        <div className="flex gap-3 text-center">
                          <div className="bg-slate-100 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-850 px-3 py-2 rounded-lg min-w-[80px]">
                            <p className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase">Total</p>
                            <p className="text-xs font-bold text-slate-900 dark:text-slate-200 mt-0.5">₹{st.totalFees}</p>
                          </div>
                          <div className="bg-emerald-50 dark:bg-slate-950/60 border border-emerald-100 dark:border-slate-850 px-3 py-2 rounded-lg min-w-[80px]">
                            <p className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">Paid</p>
                            <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">₹{st.paidFees}</p>
                          </div>
                          <div className={`px-3 py-2 rounded-lg min-w-[80px] border ${Number(st.pendingFees) === 0 ? "bg-slate-100 dark:bg-slate-950/60 border-slate-200 dark:border-slate-850" : "bg-amber-50 dark:bg-slate-950/60 border-amber-100 dark:border-slate-850"}`}>
                            <p className={`text-[9px] font-bold uppercase ${Number(st.pendingFees) === 0 ? "text-slate-500 dark:text-slate-400" : "text-amber-600 dark:text-amber-400"}`}>Pending</p>
                            <p className={`text-xs font-bold mt-0.5 ${Number(st.pendingFees) === 0 ? "text-slate-900 dark:text-slate-200" : "text-amber-600 dark:text-amber-400"}`}>₹{st.pendingFees}</p>
                          </div>
                          <button
                            onClick={() => {
                              const amount = st.paymentCycle === "MONTHLY"
                                ? Math.round(st.totalFees / 12)
                                : st.pendingFees;
                              const cycleText = st.paymentCycle === "MONTHLY" ? "monthly tuition fee installment" : "outstanding annual tuition fee balance";
                              const msg = `Dear Parent, this is a tuition fee reminder for your ward *${st.name}* (ID: *${st.id}*) at Sanskar Gurukul School. The ${cycleText} amount due is *₹${amount}*. Please complete the payment online or visit the school office. Thank you!`;
                              let phone = st.mobile.trim();
                              if (phone.length === 10) phone = "91" + phone;
                              const url = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
                              window.open(url, "_blank");
                            }}
                            className="px-4 py-2 bg-[#25D366] hover:bg-[#128C7E] rounded-lg text-[11px] font-bold text-white cursor-pointer flex items-center justify-center gap-1.5 transition-all shadow-md shadow-[#25D366]/20 border border-transparent"
                            title={`Send ${st.paymentCycle.toLowerCase()} fee reminder notification via WhatsApp`}
                          >
                            <MessageSquare className="w-3.5 h-3.5" /> WhatsApp
                          </button>
                          <button
                            onClick={() => setExpandedStudentId(expandedStudentId === st.id ? null : st.id)}
                            className="px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:bg-slate-700 rounded-lg text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer"
                          >
                            {expandedStudentId === st.id ? "Hide Payments" : "View Payments"}
                          </button>
                        </div>
                      </div>

                      {/* Expandable payments list */}
                      {expandedStudentId === st.id && (
                        <div className="bg-slate-50 dark:bg-slate-950/40 border-t border-slate-850 p-6 space-y-6">
                          {/* Visual Fee Plan Breakdown */}
                          <div className="space-y-3">
                            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Fee Registry Breakdown Schedule ({st.paymentCycle})</h4>

                            {st.paymentCycle === "MONTHLY" ? (() => {
                              const monthlyAmt = Math.round(st.totalFees / 12);
                              const fullMonthsPaid = monthlyAmt > 0 ? Math.floor(st.paidFees / monthlyAmt) : 0;
                              const partialAmt = monthlyAmt > 0 ? st.paidFees % monthlyAmt : 0;
                              const months = ["April", "May", "June", "July", "August", "September", "October", "November", "December", "January", "February", "March"];

                              return (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                                  {months.map((m, idx) => {
                                    let status = "UNPAID";
                                    let details = `Due: ₹${monthlyAmt}`;
                                    let bgStyle = "bg-rose-500/10 border-rose-500/20 text-rose-400";

                                    if (idx < fullMonthsPaid) {
                                      status = "PAID";
                                      details = `Paid: ₹${monthlyAmt}`;
                                      bgStyle = "bg-emerald-500/10 border-emerald-500/20 text-emerald-400";
                                    } else if (idx === fullMonthsPaid && partialAmt > 0) {
                                      status = "PARTIAL";
                                      details = `Paid: ₹${partialAmt} | Due: ₹${monthlyAmt - partialAmt}`;
                                      bgStyle = "bg-amber-500/10 border-amber-500/20 text-amber-400";
                                    }

                                    return (
                                      <div key={m} className={`p-3 border rounded-lg flex flex-col justify-between ${bgStyle} h-20 transition-all hover:scale-[1.02]`}>
                                        <div className="flex justify-between items-start">
                                          <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase">{m}</span>
                                          <span className="text-[8px] font-extrabold px-1.5 py-0.5 rounded-full bg-slate-950/60 uppercase">
                                            {status}
                                          </span>
                                        </div>
                                        <span className="text-[10px] font-mono leading-none">{details}</span>
                                      </div>
                                    );
                                  })}
                                </div>
                              );
                            })() : (
                              <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-lg p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <div className="space-y-1">
                                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest block">Annual Fee Status</span>
                                  <h5 className="text-sm font-bold text-slate-900 dark:text-white">Full Academic Year Plan</h5>
                                  <p className="text-xs text-slate-500 dark:text-slate-400">Standard single-payment configuration</p>
                                </div>
                                <div className="flex gap-4 flex-wrap">
                                  <div className="bg-slate-50 dark:bg-slate-950/50 px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-800 text-center min-w-[100px]">
                                    <p className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase">Annual Fee</p>
                                    <p className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">₹{st.totalFees}</p>
                                  </div>
                                  <div className="bg-emerald-50 dark:bg-slate-950/50 px-3.5 py-2 rounded-lg border border-emerald-100 dark:border-slate-800 text-center min-w-[100px]">
                                    <p className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">Amount Paid</p>
                                    <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">₹{st.paidFees}</p>
                                  </div>
                                  <div className={`px-3.5 py-2 rounded-lg border text-center min-w-[100px] ${Number(st.pendingFees) === 0 ? "bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800" : "bg-amber-50 dark:bg-slate-950/50 border-amber-100 dark:border-slate-800"}`}>
                                    <p className={`text-[9px] font-bold uppercase ${Number(st.pendingFees) === 0 ? "text-slate-500 dark:text-slate-400" : "text-amber-600 dark:text-amber-400"}`}>Remaining Due</p>
                                    <p className={`text-xs font-bold mt-0.5 ${Number(st.pendingFees) === 0 ? "text-slate-900 dark:text-white" : "text-amber-600 dark:text-amber-400"}`}>₹{st.pendingFees}</p>
                                  </div>
                                </div>
                                <div className="px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800">
                                  <span className={`text-[10px] font-extrabold uppercase px-2 py-1 rounded-full ${st.pendingFees === 0 ? "bg-emerald-600/10 text-emerald-400 border border-emerald-500/20" : "bg-rose-600/10 text-rose-400 border border-rose-500/20"}`}>
                                    {st.pendingFees === 0 ? "Fully Paid" : "Unpaid Balance Due"}
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Payment Log History List */}
                          <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-slate-800/60">
                            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Transaction Receipt History Logs</h4>
                            {!st.payments || st.payments.length === 0 ? (
                              <p className="text-slate-500 dark:text-slate-500 text-xs italic">No transactions have been recorded or approved for this student yet.</p>
                            ) : (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {st.payments.map((p: any) => (
                                  <div key={p.id} className="flex justify-between items-center bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 p-3.5 rounded-lg hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
                                    <div className="space-y-1">
                                      <div className="flex items-center gap-2">
                                        <span className="text-xs font-bold text-slate-900 dark:text-white">₹{p.amount}</span>
                                        <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold ${p.paymentMethod === "QR" ? "bg-blue-50 dark:bg-blue-600/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/10" : p.paymentMethod === "CASH" ? "bg-amber-50 dark:bg-amber-600/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/10" : "bg-purple-50 dark:bg-purple-600/10 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-500/10"}`}>
                                          {p.paymentMethod}
                                        </span>
                                        <span className={`px-1.5 py-0.5 rounded-full text-[8px] font-extrabold ${p.status === "COMPLETED" ? "bg-emerald-50 dark:bg-emerald-600/10 text-emerald-600 dark:text-emerald-400" : "bg-rose-50 dark:bg-rose-600/10 text-rose-600 dark:text-rose-400"}`}>
                                          {p.status}
                                        </span>
                                      </div>
                                      <p className="text-[10px] mt-1.5">
                                        <span className="text-slate-500 dark:text-slate-400">Receipt:</span> <span className="font-semibold text-slate-700 dark:text-slate-200">{p.receiptNumber}</span>
                                        <span className="text-slate-300 dark:text-slate-600 mx-1.5">|</span>
                                        <span className="text-slate-600 dark:text-slate-400">{new Date(p.createdAt).toLocaleString()}</span>
                                      </p>
                                      {p.transactionId && (
                                        <p className="text-[9px] font-mono mt-0.5">
                                          <span className="text-slate-400 dark:text-slate-500">Ref ID:</span> <span className="font-semibold text-slate-600 dark:text-slate-300">{p.transactionId}</span>
                                        </p>
                                      )}
                                    </div>

                                    {p.status === "COMPLETED" && (
                                      <button
                                        onClick={() => printReceipt(p.id)}
                                        className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white cursor-pointer transition-colors border border-slate-200 dark:border-slate-700/50 shadow-sm"
                                        title="Print Invoice"
                                      >
                                        <Download className="w-3.5 h-3.5" />
                                      </button>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {!isLoading && activeTab === "enroll" && (
            <div className="max-w-xl mx-auto text-center py-16 space-y-6">
              <div className="p-4 bg-gradient-to-tr from-amber-500 to-orange-600 rounded-lg w-fit mx-auto shadow-lg shadow-orange-500/10">
                <GraduationCap className="w-10 h-10 text-white" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Gurukul Admission & Fees Portal</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Launch the dedicated student enrollment portal to register details, select classes, choose optional facilities, and process QR or Cash payments.</p>
              </div>
              <button
                onClick={() => router.push("/student-admission")}
                className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-bold rounded-lg text-xs shadow-lg shadow-orange-500/20 cursor-pointer transition-all inline-flex items-center gap-2 border border-transparent"
              >
                Launch Admission Console <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {!isLoading && activeTab === "addEmployee" && (
            <div className="space-y-6">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
                <h2 className="text-xl font-bold">Add Employee Account</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Create new staff profiles in the school registry</p>
              </div>

              <form onSubmit={handleAddEmployee} className="space-y-6 w-full bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Full Name *</label>
                    <input
                      type="text" required name="name"
                      value={empForm.name} onChange={(e) => setEmpForm({ ...empForm, name: e.target.value })}
                      placeholder="Enter full name"
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 focus:border-amber-500 rounded-lg text-slate-900 dark:text-white outline-none text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Email Address *</label>
                    <input
                      type="email" required name="email"
                      value={empForm.email} onChange={(e) => setEmpForm({ ...empForm, email: e.target.value })}
                      placeholder="employee@gurukul.com"
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 focus:border-amber-500 rounded-lg text-slate-900 dark:text-white outline-none text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Password *</label>
                    <input
                      type="password" required name="password"
                      value={empForm.password} onChange={(e) => setEmpForm({ ...empForm, password: e.target.value })}
                      placeholder="Temporary password"
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 focus:border-amber-500 rounded-lg text-slate-900 dark:text-white outline-none text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Mobile Number *</label>
                    <input
                      type="tel" required name="mobile"
                      value={empForm.mobile} onChange={(e) => setEmpForm({ ...empForm, mobile: e.target.value })}
                      placeholder="10-digit mobile"
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 focus:border-amber-500 rounded-lg text-slate-900 dark:text-white outline-none text-xs"
                    />
                  </div>

                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Address *</label>
                    <textarea
                      required name="address" rows={2}
                      value={empForm.address} onChange={(e) => setEmpForm({ ...empForm, address: e.target.value })}
                      placeholder="Full residential address"
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 focus:border-amber-500 rounded-lg text-slate-900 dark:text-white outline-none text-xs resize-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Aadhaar Card Number *</label>
                    <input
                      type="text" required name="aadhaarNumber"
                      value={empForm.aadhaarNumber} onChange={(e) => setEmpForm({ ...empForm, aadhaarNumber: e.target.value })}
                      placeholder="12-digit Aadhaar number"
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 focus:border-amber-500 rounded-lg text-slate-900 dark:text-white outline-none text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">PAN Card Number (Optional)</label>
                    <input
                      type="text" name="panCard"
                      value={empForm.panCard} onChange={(e) => setEmpForm({ ...empForm, panCard: e.target.value })}
                      placeholder="10-digit PAN"
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 focus:border-amber-500 rounded-lg text-slate-900 dark:text-white outline-none text-xs"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Profile Photo *</label>
                    <input
                      type="file" required accept="image/*"
                      onChange={(e) => { if (e.target.files) setProfilePhoto(e.target.files[0]); }}
                      className="w-full text-xs text-slate-500 dark:text-slate-400 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-100 dark:bg-slate-800 file:text-slate-800 dark:text-slate-200 file:cursor-pointer"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Aadhaar Photo *</label>
                    <input
                      type="file" required accept="image/*"
                      onChange={(e) => { if (e.target.files) setAadhaarPhoto(e.target.files[0]); }}
                      className="w-full text-xs text-slate-500 dark:text-slate-400 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-100 dark:bg-slate-800 file:text-slate-800 dark:text-slate-200 file:cursor-pointer"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">PAN Card Photo (Optional)</label>
                    <input
                      type="file" accept="image/*"
                      onChange={(e) => { if (e.target.files) setPanPhoto(e.target.files[0]); }}
                      className="w-full text-xs text-slate-500 dark:text-slate-400 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-100 dark:bg-slate-800 file:text-slate-800 dark:text-slate-200 file:cursor-pointer"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Age (Optional)</label>
                    <input
                      type="number" name="age"
                      value={empForm.age} onChange={(e) => setEmpForm({ ...empForm, age: e.target.value })}
                      placeholder="Age"
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 focus:border-amber-500 rounded-lg text-slate-900 dark:text-white outline-none text-xs"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Past Experience Upload (Optional)</label>
                    <input
                      type="file" accept="application/pdf,image/*"
                      onChange={(e) => { if (e.target.files) setPastExperiencePhoto(e.target.files[0]); }}
                      className="w-full text-xs text-slate-500 dark:text-slate-400 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-100 dark:bg-slate-800 file:text-slate-800 dark:text-slate-200 file:cursor-pointer"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={actionLoading}
                  className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white rounded-lg text-xs font-bold shadow-lg cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {actionLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                  Register Employee
                </button>
              </form>
            </div>
          )}

          {!isLoading && activeTab === "payments" && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <h2 className="text-xl font-bold">Financial Records</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Logs of all QR, Cash, and Card fee payments received system-wide</p>
                </div>

                {/* Filters */}
                <div className="flex gap-1.5 bg-slate-50 dark:bg-slate-950/40 p-1 border border-slate-200 dark:border-slate-800 rounded-lg w-fit">
                  {["ALL", "QR", "CASH", "CARD"].map((m) => (
                    <button
                      key={m}
                      onClick={() => setPaymentFilter(m)}
                      className={`px-3.5 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${paymentFilter === m ? "bg-slate-100 dark:bg-slate-800 text-amber-400" : "text-slate-500 dark:text-slate-400"}`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* Direct administrative payments form */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form Intake */}
                <div className="lg:col-span-1 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-lg p-5 space-y-4 h-fit">
                  <h3 className="font-bold text-xs text-slate-800 dark:text-slate-200">Take/Record a Payment</h3>

                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Student ID *</label>
                    <input
                      type="text"
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                      placeholder="Student ID"
                      className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 focus:border-amber-500 rounded-lg text-slate-900 dark:text-white outline-none text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Amount (INR) *</label>
                    <input
                      type="number"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      placeholder="Amount to pay"
                      className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 focus:border-amber-500 rounded-lg text-slate-900 dark:text-white outline-none text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Method</label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 focus:border-amber-500 rounded-lg text-slate-900 dark:text-white outline-none text-xs"
                    >
                      <option value="QR">UPI QR Code</option>
                      <option value="CASH">Cash Payment</option>
                      <option value="CARD">Card Payment</option>
                    </select>
                  </div>

                  {paymentMethod !== "CASH" && (
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Ref / Txn ID</label>
                      <input
                        type="text"
                        value={txnId}
                        onChange={(e) => setTxnId(e.target.value)}
                        placeholder="Txn transaction ref"
                        className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 focus:border-amber-500 rounded-lg text-slate-900 dark:text-white outline-none text-xs"
                      />
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={handleAdminInitiateQR}
                      disabled={actionLoading || !studentId || !paymentAmount}
                      className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-850 hover:bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg text-[10px] font-bold cursor-pointer"
                    >
                      Show QR
                    </button>
                    <button
                      onClick={handleAdminRecordPayment}
                      disabled={actionLoading || !studentId || !paymentAmount}
                      className="flex-1 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white rounded-lg text-[10px] font-bold cursor-pointer shadow-md shadow-orange-500/10"
                    >
                      Record Pay
                    </button>
                  </div>

                  {/* Render QR inside admin panel */}
                  {qrCodeData && (
                    <div className="border border-slate-850 rounded-lg p-3 bg-slate-950/60 text-center space-y-2.5">
                      <p className="text-[10px] text-slate-700 dark:text-slate-300">Scan QR Code (₹{qrCodeData.amount})</p>
                      <div className="bg-white p-2.5 rounded-lg w-32 h-32 mx-auto">
                        <img src={qrCodeData.qrBase64} alt="UPI QR" className="w-full h-full" />
                      </div>
                    </div>
                  )}

                  {recordedPayment && (
                    <div className="border border-emerald-500/20 rounded-lg p-3 bg-emerald-500/5 text-center space-y-2">
                      <p className="text-[10px] text-emerald-400">Payment Logged: {recordedPayment.receiptNumber}</p>
                      <button
                        onClick={() => printReceipt(recordedPayment.id)}
                        className="py-1.5 px-3 bg-blue-600 text-white rounded-lg text-[9px] font-bold cursor-pointer inline-flex items-center gap-1"
                      >
                        <Download className="w-3 h-3" /> Get PDF
                      </button>
                    </div>
                  )}
                </div>

                {/* Payments Table */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-lg p-5 overflow-x-auto">
                  <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
                    <h3 className="font-bold text-xs text-slate-800 dark:text-slate-200 whitespace-nowrap flex-shrink-0">Transaction Registry</h3>
                    
                    <div className="flex-grow w-full">
                      <input
                        type="text"
                        placeholder="Search transactions..."
                        value={paymentSearchQuery}
                        onChange={(e) => setPaymentSearchQuery(e.target.value)}
                        className="px-3 py-1.5 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 focus:border-amber-500 rounded-lg text-slate-900 dark:text-white outline-none text-[10px] w-full"
                      />
                    </div>

                    <div className="flex-shrink-0 whitespace-nowrap">
                      <input
                        type="date"
                        value={paymentSearchDate}
                        onChange={(e) => setPaymentSearchDate(e.target.value)}
                        className="px-3 py-1.5 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 focus:border-amber-500 rounded-lg text-slate-900 dark:text-white outline-none text-[10px] uppercase font-mono w-full md:w-auto"
                      />
                    </div>
                  </div>
                  {(() => {
                    const filtered = payments.filter((p: any) => {
                      const matchQuery = !paymentSearchQuery || 
                        p.receiptNumber?.toLowerCase().includes(paymentSearchQuery.toLowerCase()) || 
                        p.student?.name?.toLowerCase().includes(paymentSearchQuery.toLowerCase()) ||
                        p.student?.email?.toLowerCase().includes(paymentSearchQuery.toLowerCase()) ||
                        p.student?.id?.toLowerCase().includes(paymentSearchQuery.toLowerCase()) ||
                        p.studentId?.toLowerCase().includes(paymentSearchQuery.toLowerCase());
                      const matchDate = !paymentSearchDate || 
                        (p.createdAt && new Date(p.createdAt).toISOString().split('T')[0] === paymentSearchDate);
                      return matchQuery && matchDate;
                    });

                    const sorted = [...filtered].sort((a: any, b: any) => {
                      if (!paymentSortField) return 0;
                      let aVal = a[paymentSortField] || "";
                      let bVal = b[paymentSortField] || "";
                      
                      if (paymentSortField === "Student") {
                        aVal = a.student?.name || "";
                        bVal = b.student?.name || "";
                      } else if (paymentSortField === "Date") {
                        aVal = new Date(a.createdAt).getTime();
                        bVal = new Date(b.createdAt).getTime();
                      } else if (paymentSortField === "Amount") {
                        aVal = Number(a.amount) || 0;
                        bVal = Number(b.amount) || 0;
                      } else if (paymentSortField === "Receipt No.") {
                        aVal = a.receiptNumber || "";
                        bVal = b.receiptNumber || "";
                      } else if (paymentSortField === "Method") {
                        aVal = a.paymentMethod || "";
                        bVal = b.paymentMethod || "";
                      } else if (paymentSortField === "Status") {
                        aVal = a.status || "";
                        bVal = b.status || "";
                      }

                      if (aVal < bVal) return paymentSortOrder === "asc" ? -1 : 1;
                      if (aVal > bVal) return paymentSortOrder === "asc" ? 1 : -1;
                      return 0;
                    });

                    if (sorted.length === 0) {
                      return <div className="text-center py-16 text-slate-500 dark:text-slate-500 text-xs">No payment logs found.</div>;
                    }

                    const SortIcon = ({ field }: { field: string }) => {
                      if (paymentSortField !== field) return <ArrowUpDown className="w-3 h-3 text-slate-400 opacity-50 ml-1" />;
                      return paymentSortOrder === "asc" ? <ArrowUp className="w-3 h-3 text-amber-500 ml-1" /> : <ArrowDown className="w-3 h-3 text-amber-500 ml-1" />;
                    };

                    return (
                      <table className="w-full text-[11px] text-left">
                        <thead>
                          <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 select-none">
                            <th className="py-2.5 cursor-pointer hover:text-slate-700 dark:hover:text-slate-200 transition-colors" onClick={() => handlePaymentSort("Receipt No.")}>
                              <div className="flex items-center">Receipt No. <SortIcon field="Receipt No." /></div>
                            </th>
                            <th className="py-2.5 cursor-pointer hover:text-slate-700 dark:hover:text-slate-200 transition-colors" onClick={() => handlePaymentSort("Student")}>
                              <div className="flex items-center">Student <SortIcon field="Student" /></div>
                            </th>
                            <th className="py-2.5 cursor-pointer hover:text-slate-700 dark:hover:text-slate-200 transition-colors" onClick={() => handlePaymentSort("Amount")}>
                              <div className="flex items-center">Amount <SortIcon field="Amount" /></div>
                            </th>
                            <th className="py-2.5 cursor-pointer hover:text-slate-700 dark:hover:text-slate-200 transition-colors" onClick={() => handlePaymentSort("Method")}>
                              <div className="flex items-center">Method <SortIcon field="Method" /></div>
                            </th>
                            <th className="py-2.5 cursor-pointer hover:text-slate-700 dark:hover:text-slate-200 transition-colors" onClick={() => handlePaymentSort("Status")}>
                              <div className="flex items-center">Status <SortIcon field="Status" /></div>
                            </th>
                            <th className="py-2.5 cursor-pointer hover:text-slate-700 dark:hover:text-slate-200 transition-colors" onClick={() => handlePaymentSort("Date")}>
                              <div className="flex items-center">Date <SortIcon field="Date" /></div>
                            </th>
                            <th className="py-2.5">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sorted.map((p: any) => (
                            <tr key={p.id} className="border-b border-slate-850">
                            <td className="py-2.5 font-semibold text-slate-900 dark:text-white">{p.receiptNumber}</td>
                            <td className="py-2.5">
                              <p className="font-medium text-slate-800 dark:text-slate-200">{p.student?.name}</p>
                              <p className="text-[9px] text-slate-500 dark:text-slate-500">{p.student?.email}</p>
                            </td>
                            <td className="py-2.5 font-bold text-slate-900 dark:text-white">₹{p.amount}</td>
                            <td className="py-2.5">
                              <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold ${p.paymentMethod === "QR" ? "bg-blue-50 dark:bg-blue-600/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-transparent" : p.paymentMethod === "CASH" ? "bg-amber-50 dark:bg-amber-600/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-transparent" : "bg-purple-50 dark:bg-purple-600/10 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-transparent"}`}>
                                {p.paymentMethod}
                              </span>
                            </td>
                            <td className="py-2.5">
                              <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold ${p.status === "COMPLETED" ? "bg-emerald-50 dark:bg-emerald-600/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-transparent" : p.status === "PENDING" ? "bg-yellow-50 dark:bg-yellow-600/10 text-yellow-600 dark:text-yellow-400 border border-yellow-200 dark:border-transparent animate-pulse" : "bg-rose-50 dark:bg-rose-600/10 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-transparent"}`}>
                                {p.status}
                              </span>
                            </td>
                            <td className="py-2.5 text-slate-500 dark:text-slate-400 font-mono text-[10px]">
                              {`${String(new Date(p.createdAt).getDate()).padStart(2, '0')}-${String(new Date(p.createdAt).getMonth() + 1).padStart(2, '0')}-${new Date(p.createdAt).getFullYear()}`}
                            </td>
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
                                  className="p-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-750 rounded text-slate-700 dark:text-slate-300 hover:text-white cursor-pointer"
                                  title="Download invoice"
                                >
                                  <Download className="w-3 h-3" />
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      </table>
                    );
                  })()}
                </div>
              </div>
            </div>
          )}

          {!isLoading && activeTab === "attendance" && (
            <div className="space-y-6">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
                <h2 className="text-xl font-bold">Staff Attendance Auditor</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">View check-in and check-out tracking for all employees, and mark attendance manually.</p>
              </div>

              {/* Admin Attendance Marker Form */}
              <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-lg p-5">
                <h3 className="font-bold text-xs text-slate-800 dark:text-slate-200 mb-3">Mark Staff Attendance</h3>
                <form onSubmit={handleMarkAttendance} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Employee Name / Email</label>
                    <select
                      required
                      value={attendanceForm.employeeId}
                      onChange={(e) => setAttendanceForm({ ...attendanceForm, employeeId: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 focus:border-amber-500 rounded-lg text-xs outline-none"
                    >
                      <option value="" disabled>Select Employee...</option>
                      {employees.map((emp: any) => (
                        <option key={emp.id} value={emp.id}>
                          {emp.name} ({emp.email})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Status</label>
                    <select
                      value={attendanceForm.status}
                      onChange={(e) => setAttendanceForm({ ...attendanceForm, status: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 focus:border-amber-500 rounded-lg text-xs outline-none"
                    >
                      <option value="PRESENT">PRESENT</option>
                      <option value="ABSENT">ABSENT</option>
                      <option value="LEAVE">LEAVE</option>
                      <option value="LATE">LATE</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Notes (Optional)</label>
                    <input
                      type="text"
                      value={attendanceForm.notes}
                      onChange={(e) => setAttendanceForm({ ...attendanceForm, notes: e.target.value })}
                      placeholder="Reason for absence..."
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 focus:border-amber-500 rounded-lg text-xs outline-none"
                    />
                  </div>
                  <button
                    type="submit" disabled={actionLoading}
                    className="w-full py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 text-white rounded-lg text-xs font-bold shadow cursor-pointer flex justify-center items-center"
                  >
                    {actionLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Mark Record"}
                  </button>
                </form>
              </div>

              <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-lg p-5 overflow-x-auto">
                {attendances.length === 0 ? (
                  <div className="text-center py-16 text-slate-500 dark:text-slate-500 text-xs">No employee attendances recorded.</div>
                ) : (
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                        <th className="py-2.5">Employee Name</th>
                        <th className="py-2.5">Email</th>
                        <th className="py-2.5">Date</th>
                        <th className="py-2.5">Status</th>
                        <th className="py-2.5">Clock In</th>
                        <th className="py-2.5">Clock Out</th>
                        <th className="py-2.5">Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendances.map((log: any) => (
                        <tr key={log.id} className="border-b border-slate-850">
                          <td className="py-2.5">
                            <p className="font-bold text-slate-900 dark:text-white">{log.employee?.name}</p>
                            <p className="text-[9px] font-mono text-slate-500 mt-0.5 select-all">ID: {log.employee?.id}</p>
                          </td>
                          <td className="py-2.5 text-slate-500 dark:text-slate-400">{log.employee?.email}</td>
                          <td className="py-2.5 font-medium">{new Date(log.date).toLocaleDateString()}</td>
                          <td className="py-2.5">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${log.status === "PRESENT" ? "bg-emerald-500/10 text-emerald-400" : log.status === "LATE" ? "bg-amber-500/10 text-amber-400" : "bg-slate-500/10 text-slate-500 dark:text-slate-400"}`}>
                              {log.status}
                            </span>
                          </td>
                          <td className="py-2.5">{log.checkInTime ? new Date(log.checkInTime).toLocaleTimeString() : "-"}</td>
                          <td className="py-2.5">{log.checkOutTime ? new Date(log.checkOutTime).toLocaleTimeString() : "-"}</td>
                          <td className="py-2.5 text-slate-500 dark:text-slate-400 italic">{log.notes || "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {!isLoading && activeTab === "roles" && (
            <AdminRolesTab
              roleForm={roleForm}
              setRoleForm={setRoleForm}
              onSubmit={handleAssignRole}
              actionLoading={actionLoading}
            />
          )}

          {!isLoading && activeTab === "feesSettings" && (
            <AdminFeesSettingsTab
              editedFees={editedFees}
              handleClassFeeChange={handleClassFeeChange}
              handleAddonFeeChange={handleAddonFeeChange}
              onSubmit={handleUpdateFeesConfig}
              actionLoading={actionLoading}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;
