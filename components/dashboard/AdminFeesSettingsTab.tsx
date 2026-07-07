"use client";

import { GraduationCap, Calculator, Loader2 } from "lucide-react";

interface AdminFeesSettingsTabProps {
  editedFees: {
    classes: Record<string, number>;
    addons: {
      transport: number;
      dress: number;
      books: number;
    };
  };
  handleClassFeeChange: (className: string, value: string) => void;
  handleAddonFeeChange: (addonKey: "transport" | "dress" | "books", value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  actionLoading: boolean;
}

export function AdminFeesSettingsTab({
  editedFees,
  handleClassFeeChange,
  handleAddonFeeChange,
  onSubmit,
  actionLoading
}: AdminFeesSettingsTabProps) {
  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-4">
        <h2 className="text-xl font-bold">Standard Fees Configuration</h2>
        <p className="text-xs text-slate-400">Edit base tuition fees per class and optional addon pricing</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-8 max-w-4xl bg-slate-900/40 border border-slate-800 rounded-2xl p-6">
        
        {/* 1. Classes base tuition fees */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 border-b border-slate-850 pb-1 flex items-center gap-1.5">
            <GraduationCap className="w-4 h-4" /> Base Tuition Fees (per Annum)
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.keys(editedFees.classes).map((cls) => (
              <div key={cls} className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-400 uppercase">{cls}</label>
                <input
                  type="number"
                  value={editedFees.classes[cls]}
                  onChange={(e) => handleClassFeeChange(cls, e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-950/50 border border-slate-800 focus:border-amber-500 rounded-xl text-white outline-none text-xs font-mono"
                />
                <p className="text-[9px] text-slate-500 font-mono">
                  Monthly: approx. ₹{Math.round((editedFees.classes[cls] || 0) / 12)}/mo
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Optional facility fees */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 border-b border-slate-850 pb-1 flex items-center gap-1.5">
            <Calculator className="w-4 h-4" /> Add-on Facilities & Kits
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-semibold text-slate-400 uppercase">Transport Service Fee</label>
              <input
                type="number"
                value={editedFees.addons.transport}
                onChange={(e) => handleAddonFeeChange("transport", e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-950/50 border border-slate-800 focus:border-amber-500 rounded-xl text-white outline-none text-xs font-mono"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-semibold text-slate-400 uppercase">School Dress / Uniform Set</label>
              <input
                type="number"
                value={editedFees.addons.dress}
                onChange={(e) => handleAddonFeeChange("dress", e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-950/50 border border-slate-800 focus:border-amber-500 rounded-xl text-white outline-none text-xs font-mono"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-semibold text-slate-400 uppercase">Books & Stationery Kit</label>
              <input
                type="number"
                value={editedFees.addons.books}
                onChange={(e) => handleAddonFeeChange("books", e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-950/50 border border-slate-800 focus:border-amber-500 rounded-xl text-white outline-none text-xs font-mono"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={actionLoading}
          className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white rounded-xl text-xs font-bold shadow-lg cursor-pointer flex items-center justify-center gap-1.5"
        >
          {actionLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
          Update Standard Fees Catalog
        </button>
      </form>
    </div>
  );
}
