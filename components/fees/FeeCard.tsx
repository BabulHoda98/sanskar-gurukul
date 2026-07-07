"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface FeeCardProps {
  className: string;
  annualFee: number;
  billingCycle: "ANNUAL" | "MONTHLY";
  idx: number;
}

export function FeeCard({ className, annualFee, billingCycle, idx }: FeeCardProps) {
  const displayFee = billingCycle === "ANNUAL" ? annualFee : Math.round(annualFee / 12);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: idx * 0.05 }}
      className="bg-white rounded-2xl border border-gray-200/80 shadow-sm hover:shadow-md transition-all p-6 relative overflow-hidden group flex flex-col justify-between"
    >
      <div>
        <div className="flex justify-between items-start mb-4">
          <span className="font-heading font-extrabold text-lg text-gray-900">{className}</span>
          <span className="px-2.5 py-1 bg-amber-50 border border-amber-100 rounded-lg text-xs font-semibold text-amber-800 uppercase tracking-wider">
            {billingCycle === "ANNUAL" ? "Annual" : "Monthly"}
          </span>
        </div>

        <div className="mt-4 flex items-baseline">
          <span className="text-3xl font-extrabold text-gray-900 tracking-tight">
            ₹{displayFee.toLocaleString("en-IN")}
          </span>
          <span className="ml-1 text-sm text-gray-500 font-medium">
            /{billingCycle === "ANNUAL" ? "annum" : "month"}
          </span>
        </div>

        {billingCycle === "MONTHLY" && (
          <p className="text-[11px] text-gray-400 mt-1">
            (Annual total: ₹{annualFee.toLocaleString("en-IN")})
          </p>
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 font-medium">
        <span>CBSE Pattern Curriculum</span>
        <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:translate-x-1 transition-transform" />
      </div>
    </motion.div>
  );
}
