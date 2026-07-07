"use client";

import { useState, useEffect } from "react";
import { Calculator, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface FeeCalculatorProps {
  classes: Record<string, number>;
  addons: {
    transport: number;
    dress: number;
    books: number;
  };
}

export function FeeCalculator({ classes, addons }: FeeCalculatorProps) {
  const classList = Object.keys(classes);
  const [calcClass, setCalcClass] = useState("");
  const [calcTransport, setCalcTransport] = useState(false);
  const [calcDress, setCalcDress] = useState(false);
  const [calcBooks, setCalcBooks] = useState(false);

  useEffect(() => {
    if (classList.length > 0 && !calcClass) {
      setCalcClass(classList[0]);
    }
  }, [classList, calcClass]);

  const tuitionValue = classes[calcClass] || 0;
  const addonValues = {
    transport: calcTransport ? (addons.transport || 0) : 0,
    dress: calcDress ? (addons.dress || 0) : 0,
    books: calcBooks ? (addons.books || 0) : 0,
  };
  const totalAddons = addonValues.transport + addonValues.dress + addonValues.books;
  const grandTotalAnnual = tuitionValue + totalAddons;

  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-slate-100 rounded-3xl p-8 shadow-xl flex flex-col justify-between border border-slate-800">
      <div>
        <div className="flex items-center gap-2 mb-6">
          <Calculator className="w-5.5 h-5.5 text-amber-500" />
          <h3 className="text-xl font-bold font-heading text-white">Fee Estimator</h3>
        </div>

        {/* Class Dropdown */}
        <div className="mb-4">
          <label className="block text-xs text-slate-400 font-semibold uppercase tracking-wider mb-2">Select Student Class</label>
          <select
            value={calcClass}
            onChange={(e) => setCalcClass(e.target.value)}
            className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-2.5 text-sm font-semibold text-white focus:outline-none focus:border-amber-500 transition-colors"
          >
            {classList.map((cls) => (
              <option key={cls} value={cls} className="bg-slate-900 text-slate-100">{cls}</option>
            ))}
          </select>
        </div>

        {/* Addon Checkboxes */}
        <div className="space-y-3 mb-6 pt-2">
          <label className="block text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">Addon Services</label>
          
          <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-850/40 border border-slate-800/60 hover:bg-slate-800/40 transition-colors cursor-pointer select-none">
            <input
              type="checkbox"
              checked={calcTransport}
              onChange={(e) => setCalcTransport(e.target.checked)}
              className="accent-amber-500 w-4 h-4 rounded"
            />
            <div>
              <span className="text-sm font-semibold block text-slate-200">School Bus Transport</span>
              <span className="text-[11px] text-slate-400">+₹{(addons.transport || 0).toLocaleString("en-IN")}/yr</span>
            </div>
          </label>

          <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-850/40 border border-slate-800/60 hover:bg-slate-800/40 transition-colors cursor-pointer select-none">
            <input
              type="checkbox"
              checked={calcDress}
              onChange={(e) => setCalcDress(e.target.checked)}
              className="accent-amber-500 w-4 h-4 rounded"
            />
            <div>
              <span className="text-sm font-semibold block text-slate-200">Uniforms Kit</span>
              <span className="text-[11px] text-slate-400">+₹{(addons.dress || 0).toLocaleString("en-IN")}/yr</span>
            </div>
          </label>

          <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-850/40 border border-slate-800/60 hover:bg-slate-800/40 transition-colors cursor-pointer select-none">
            <input
              type="checkbox"
              checked={calcBooks}
              onChange={(e) => setCalcBooks(e.target.checked)}
              className="accent-amber-500 w-4 h-4 rounded"
            />
            <div>
              <span className="text-sm font-semibold block text-slate-200">Books & Kit</span>
              <span className="text-[11px] text-slate-400">+₹{(addons.books || 0).toLocaleString("en-IN")}/yr</span>
            </div>
          </label>
        </div>
      </div>

      {/* Calculations Display */}
      <div className="pt-6 border-t border-slate-800">
        <div className="flex justify-between items-baseline mb-2">
          <span className="text-xs text-slate-400 font-semibold uppercase">Annual Total</span>
          <span className="text-lg font-bold text-slate-200">₹{grandTotalAnnual.toLocaleString("en-IN")}</span>
        </div>
        <div className="flex justify-between items-baseline mb-6">
          <span className="text-xs text-amber-400 font-semibold uppercase">Monthly Installment</span>
          <span className="text-2xl font-extrabold text-amber-500">₹{Math.round(grandTotalAnnual / 12).toLocaleString("en-IN")}<span className="text-xs text-slate-400 font-medium">/mo</span></span>
        </div>

        <Button asChild className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 rounded-xl shadow-lg shadow-amber-900/25 flex items-center justify-center gap-2">
          <Link href="/admission">
            Apply Online Now
            <ChevronRight className="w-4 h-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
