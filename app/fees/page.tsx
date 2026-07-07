"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  GraduationCap, Bus, ShieldCheck, HelpCircle, Loader2, Shirt, BookOpen
} from "lucide-react";
import { toast } from "react-hot-toast";

// Reusable Components
import { FeeCard } from "@/components/fees/FeeCard";
import { AddonRow } from "@/components/fees/AddonRow";
import { FeeCalculator } from "@/components/fees/FeeCalculator";
import api from "@/lib/api";

export default function FeeStructurePage() {
  const [feesConfig, setFeesConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [billingCycle, setBillingCycle] = useState<"ANNUAL" | "MONTHLY">("ANNUAL");

  useEffect(() => {
    async function fetchFees() {
      try {
        const res = await api.get("/api/public/fees-config");
        setFeesConfig(res.data);
      } catch (err) {
        console.error("Error fetching fees config:", err);
        // Fallback default config if API is offline
        const fallback = {
          classes: {
            "Nursery": 15000,
            "LKG": 18000,
            "UKG": 18000,
            "Class I": 22000,
            "Class II": 22000,
            "Class III": 25000,
            "Class IV": 25000,
            "Class V": 25000,
            "Class VI": 30000,
            "Class VII": 30000,
            "Class VIII": 32000
          },
          addons: {
            "transport": 12000,
            "dress": 3500,
            "books": 4000
          }
        };
        setFeesConfig(fallback);
        toast.error("Connecting to offline fees cache.");
      } finally {
        setLoading(false);
      }
    }
    fetchFees();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-amber-600 mb-2" />
        <p className="text-gray-500 font-medium">Loading fee catalog...</p>
      </div>
    );
  }

  return (
    <div className="py-16 bg-gray-50 min-h-screen font-sans">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold mb-4"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            100% Transparent Fee Structure
          </motion.div>
          <motion.h1 
            className="text-4xl md:text-5xl font-heading font-extrabold text-gray-900 mb-6 tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Fee Structure & Plans
          </motion.h1>
          <motion.p 
            className="text-lg text-gray-600 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            We offer premium education with customizable payment options. View basic plans, calculate customized packages, or schedule monthly/annual billing options.
          </motion.p>
        </div>

        {/* Billing Cycle Toggle */}
        <div className="flex justify-center mb-12">
          <div className="bg-white p-1.5 rounded-2xl border shadow-sm flex items-center gap-1">
            <button
              onClick={() => setBillingCycle("ANNUAL")}
              className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                billingCycle === "ANNUAL" 
                  ? "bg-amber-600 text-white shadow" 
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              Annual Payment
            </button>
            <button
              onClick={() => setBillingCycle("MONTHLY")}
              className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                billingCycle === "MONTHLY" 
                  ? "bg-amber-600 text-white shadow" 
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              Monthly Installments
            </button>
          </div>
        </div>

        {/* Main Tuition Fees Grid */}
        <div className="mb-20">
          <h2 className="text-2xl font-bold font-heading text-gray-900 mb-8 text-center md:text-left flex items-center justify-center md:justify-start gap-2">
            <GraduationCap className="w-6 h-6 text-amber-600" />
            Base Tuition Fee Schedule
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(feesConfig.classes).map(([className, annualFee]: [string, any], idx) => (
              <FeeCard
                key={className}
                className={className}
                annualFee={annualFee}
                billingCycle={billingCycle}
                idx={idx}
              />
            ))}
          </div>
        </div>

        {/* Addon Services Overview */}
        <div className="mb-20 grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Addons List */}
          <div className="lg:col-span-2 bg-white rounded-3xl border p-8 shadow-sm">
            <h3 className="text-xl font-bold font-heading text-gray-900 mb-6 flex items-center gap-2">
              <Bus className="w-5.5 h-5.5 text-amber-600" />
              Optional Addon Services (Annual Rates)
            </h3>
            
            <div className="space-y-6">
              <AddonRow
                title="GPS-enabled Transport"
                description="Pick-and-drop facility with live status tracking."
                annualPrice={feesConfig.addons.transport || 0}
                icon={Bus}
                isHighlighted={true}
              />
              <AddonRow
                title="Uniform Kits (Dress)"
                description="Standard, sports, and winter dress sets."
                annualPrice={feesConfig.addons.dress || 0}
                icon={Shirt}
              />
              <AddonRow
                title="Books & Educational Kit"
                description="All standard textbook sets, notebooks, and writing materials."
                annualPrice={feesConfig.addons.books || 0}
                icon={BookOpen}
              />
            </div>
          </div>

          {/* Interactive Fee Estimator */}
          <FeeCalculator
            classes={feesConfig.classes}
            addons={feesConfig.addons}
          />

        </div>

        {/* FAQs/Policies */}
        <div className="bg-white rounded-3xl border p-8 md:p-12 shadow-sm max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold font-heading text-gray-900 mb-8 text-center flex items-center justify-center gap-2">
            <HelpCircle className="w-6 h-6 text-amber-600" />
            Frequently Asked Questions
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-bold text-gray-900 mb-2">Can I switch payment cycles mid-term?</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                Yes. Parents can switch billing cycles between Annual and Monthly options at the start of any school billing term. Contact administrative staff.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-2">How do I receive monthly notifications?</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                Parents enrolled in the Monthly installment cycle receive automated payment reminders and links directly via WhatsApp on the 1st of every month.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-2">What payment options are accepted?</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                We support instant UPI QR Code payments, Bank Transfer, Card payment, and direct Cash payment at the school desk.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-2">Are addon charges refundable?</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                School uniforms and textbook packages are non-refundable once delivered. Transport service fees can be canceled or adjusted.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
