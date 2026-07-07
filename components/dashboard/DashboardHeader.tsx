"use client";

import { GraduationCap, LogOut, ArrowLeft } from "lucide-react";

interface DashboardHeaderProps {
  consoleTitle: string;
  userName?: string;
  roleName?: string;
  onPortalRedirectClick?: () => void;
  portalRedirectLabel?: string;
  onLogoutClick?: () => void;
  onBackClick?: () => void;
  themeColor?: "amber" | "blue";
}

export function DashboardHeader({
  consoleTitle,
  userName,
  roleName = "User",
  onPortalRedirectClick,
  portalRedirectLabel,
  onLogoutClick,
  onBackClick,
  themeColor = "amber"
}: DashboardHeaderProps) {
  const gradientClass = themeColor === "blue" 
    ? "from-blue-600 to-indigo-600 shadow-blue-600/10" 
    : "from-amber-500 to-orange-600 shadow-amber-500/10";

  return (
    <header className="bg-white dark:bg-slate-900/60 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 py-4 px-4 md:px-6 flex justify-between items-center sticky top-0 z-40">
      <div className="flex items-center gap-3">
        {onBackClick && (
          <button
            onClick={onBackClick}
            className="p-2 hover:bg-slate-100 dark:bg-slate-800 rounded-lg transition-all mr-1 cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5 text-slate-700 dark:text-slate-300" />
          </button>
        )}
        <div className={`p-2 bg-gradient-to-tr ${gradientClass} rounded-lg shadow-md`}>
          <GraduationCap className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold">{consoleTitle}</h1>
          {userName && (
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {roleName}: {userName}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {onPortalRedirectClick && portalRedirectLabel && (
          <button
            onClick={onPortalRedirectClick}
            className={`flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r ${gradientClass} hover:opacity-90 text-xs font-semibold rounded-lg text-white shadow-md cursor-pointer transition-all border border-transparent`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            {portalRedirectLabel}
          </button>
        )}
        <button
          onClick={() => document.documentElement.classList.toggle("dark")}
          className="w-[34px] h-[34px] flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shadow-sm border border-slate-200 dark:border-slate-700/50 cursor-pointer"
          aria-label="Toggle Dark Mode"
        >
          <span className="dark:hidden text-xs">🌙</span>
          <span className="hidden dark:block text-xs">☀️</span>
        </button>
        {onLogoutClick && (
          <button
            onClick={onLogoutClick}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 dark:bg-slate-850 hover:bg-slate-100 dark:bg-slate-800 text-xs font-semibold rounded-lg text-rose-400 border border-slate-200 dark:border-slate-300 dark:border-slate-700/50 cursor-pointer transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            Logout
          </button>
        )}
      </div>
    </header>
  );
}
