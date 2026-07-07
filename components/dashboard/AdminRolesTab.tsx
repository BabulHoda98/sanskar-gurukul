"use client";

import { Loader2 } from "lucide-react";

interface AdminRolesTabProps {
  roleForm: { userId: string; role: string };
  setRoleForm: (form: { userId: string; role: string }) => void;
  onSubmit: (e: React.FormEvent) => void;
  actionLoading: boolean;
}

export function AdminRolesTab({ roleForm, setRoleForm, onSubmit, actionLoading }: AdminRolesTabProps) {
  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
        <h2 className="text-xl font-bold">Access Control & Role Elevation</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">Update system clearances and elevate employee roles</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-6 w-full bg-white/80 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-lg p-6">
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">User ID (UUID) *</label>
            <input
              type="text" required
              value={roleForm.userId}
              onChange={(e) => setRoleForm({ ...roleForm, userId: e.target.value })}
              placeholder="Enter user UUID to update"
              className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-200 dark:border-slate-800 focus:border-amber-500 rounded-lg text-white outline-none text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Assign Role Clearance</label>
            <select
              value={roleForm.role}
              onChange={(e) => setRoleForm({ ...roleForm, role: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-200 dark:border-slate-800 focus:border-amber-500 rounded-lg text-white outline-none text-xs"
            >
              <option value="EMPLOYEE">Employee Role</option>
              <option value="ADMIN">Admin Clearance</option>
              <option value="STUDENT">Student Profile</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={actionLoading}
          className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white rounded-lg text-xs font-bold shadow-lg cursor-pointer flex items-center justify-center gap-1.5"
        >
          {actionLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
          Elevate Clearance Level
        </button>
      </form>
    </div>
  );
}
