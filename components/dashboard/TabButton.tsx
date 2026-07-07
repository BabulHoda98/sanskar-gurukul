"use client";

import { LucideIcon } from "lucide-react";

interface TabButtonProps {
  id: string;
  label: string;
  icon: LucideIcon;
  isActive: boolean;
  onClick: () => void;
  themeColor?: "amber" | "blue";
}

export function TabButton({ id, label, icon: Icon, isActive, onClick, themeColor = "amber" }: TabButtonProps) {
  const activeClass = themeColor === "blue"
    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/10"
    : "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md shadow-orange-500/10";

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-5 py-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
        isActive 
          ? activeClass 
          : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:text-slate-200 hover:bg-white dark:bg-slate-900"
      }`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );
}
