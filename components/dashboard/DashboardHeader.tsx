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
    <header className="bg-slate-900/60 backdrop-blur-md border-b border-slate-800 py-4 px-6 md:px-12 flex justify-between items-center sticky top-0 z-40">
      <div className="flex items-center gap-3">
        {onBackClick && (
          <button
            onClick={onBackClick}
            className="p-2 hover:bg-slate-800 rounded-xl transition-all mr-1 cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5 text-slate-300" />
          </button>
        )}
        <div className={`p-2 bg-gradient-to-tr ${gradientClass} rounded-xl shadow-md`}>
          <GraduationCap className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold">{consoleTitle}</h1>
          {userName && (
            <p className="text-xs text-slate-400">
              {roleName}: {userName}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {onPortalRedirectClick && portalRedirectLabel && (
          <button
            onClick={onPortalRedirectClick}
            className={`flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r ${gradientClass} hover:opacity-90 text-xs font-semibold rounded-xl text-white shadow-md cursor-pointer transition-all border border-transparent`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            {portalRedirectLabel}
          </button>
        )}
        {onLogoutClick && (
          <button
            onClick={onLogoutClick}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-850 hover:bg-slate-800 text-xs font-semibold rounded-xl text-rose-400 border border-slate-700/50 cursor-pointer transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            Logout
          </button>
        )}
      </div>
    </header>
  );
}
