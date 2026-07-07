"use client";

import { LucideIcon } from "lucide-react";

interface AddonRowProps {
  title: string;
  description: string;
  annualPrice: number;
  icon: LucideIcon;
  isHighlighted?: boolean;
}

export function AddonRow({ title, description, annualPrice, icon: Icon, isHighlighted = false }: AddonRowProps) {
  const monthlyPrice = Math.round(annualPrice / 12);

  return (
    <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
        isHighlighted ? "bg-amber-100/90 text-amber-800" : "bg-gray-150 text-gray-700"
      }`}>
        <Icon className="w-5.5 h-5.5" />
      </div>
      <div className="flex-grow flex justify-between items-center">
        <div>
          <h4 className="font-bold text-gray-900">{title}</h4>
          <p className="text-xs text-gray-500">{description}</p>
        </div>
        <div className="text-right">
          <span className="text-lg font-extrabold text-gray-900">₹{annualPrice.toLocaleString("en-IN")}</span>
          <p className="text-[10px] text-gray-400 font-semibold">/annum</p>
          <p className={`mt-1 font-bold ${isHighlighted ? "text-xs text-amber-600 font-extrabold" : "text-[11px] text-gray-500"}`}>
            (₹{monthlyPrice.toLocaleString("en-IN")}/{isHighlighted ? "month" : "month eq."})
          </p>
        </div>
      </div>
    </div>
  );
}
