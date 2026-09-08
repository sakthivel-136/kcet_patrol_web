"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { getPatrolReport, PatrolReportItem } from "../api/report";
import { getCampuses } from "../api/campuses.api";
import ReportTable from "../components/reports/ReportTable";
import PatrolReportPDF from "../components/reports/PatrolReportPDF";
import { useAuthGuard } from "@/app/services/auth.guard";
import { motion } from "framer-motion";
import { getShifts } from "../api/shifts.api";
import { getSecurityUsers } from "../api/securityUsers.api";
import {
  Filter, Calendar, Shield, FileText, Download, CheckCircle2,
  AlertTriangle, UserCheck, Clock, ChevronDown, Sparkles,
  CalendarDays, Layers
} from "lucide-react";

// ================= TYPES =================
type Campus = {
  campus_code: string;
  campus_name: string;
  campus_address: string | null;
};

// ================= PAGE =================
export default function ReportDownloadPage() {
  const { authorized } = useAuthGuard({ allowedRoles: ['ADMIN', 'SUPERVISOR'] });
  const [adminName, setAdminName] = useState("");
  const FIXED_CAMPUS = "KCET01";

  const todayStr = useMemo(() => {
    const d = new Date();
    const offset = d.getTimezoneOffset() * 60000;
    return new Date(d.getTime() - offset).toISOString().slice(0, 10);
  }, []);

  const [reportDate, setReportDate] = useState(todayStr);
  const [endDate, setEndDate] = useState(todayStr);
  const [selectedMonth, setSelectedMonth] = useState(todayStr.slice(0, 7)); // YYYY-MM
  const [reportType, setReportType] = useState<"single" | "range" | "month">("single");
  const [activePreset, setActivePreset] = useState<"today" | "yesterday" | "thisWeek" | "thisMonth" | "custom">("today");

  const [report, setReport] = useState<PatrolReportItem[]>([]);
  const [shifts, setShifts] = useState<any[]>([]);
  const [secUsers, setSecUsers] = useState<any[]>([]);

  // ── ADVANCED FILTERS ──
  const [selectedGuard, setSelectedGuard] = useState("ALL");
  const [selectedRound, setSelectedRound] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");

  const [loading, setLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfTrigger, setPdfTrigger] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // ================= INITIAL LOAD =================
  useEffect(() => {
    if (authorized) {
      fetchReport();
    }
  }, [reportDate, endDate, selectedMonth, reportType, authorized]);

  // ================= LOAD ADMIN =================
  useEffect(() => {
    if (authorized) {
      const name = localStorage.getItem("adminName");
      if (name && name.trim() !== "") {
        setAdminName(name);
      }
    }
  }, [authorized]);

  // ================= FETCH =================
  const fetchReport = async () => {
    if (!authorized) return;

    setLoading(true);
    setError(null);
    setPdfTrigger(null);

    let start = reportDate;
    let end = reportDate;

    if (reportType === "range") {
      start = reportDate;
      end = endDate;
    } else if (reportType === "month") {
      const [year, month] = selectedMonth.split("-").map(Number);
      const lastDay = new Date(year, month, 0);
      const pad = (n: number) => String(n).padStart(2, "0");
      start = `${year}-${pad(month)}-01`;
      end = `${year}-${pad(month)}-${pad(lastDay.getDate())}`;
    }

    try {
      const [data, shiftsData, usersData] = await Promise.all([
        getPatrolReport(FIXED_CAMPUS, start, end),
        getShifts(),
        getSecurityUsers()
      ]);
      setReport(data || []);
      setShifts(shiftsData || []);
      setSecUsers(usersData || []);
      if (!data || data.length === 0) setError("No patrol records found for this timeframe.");
    } catch (err) {
      setError("Failed to fetch report data. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ================= PRESET DATE SHORTCUT HANDLER =================
  const setPresetDate = (type: "today" | "yesterday" | "thisWeek" | "thisMonth") => {
    setActivePreset(type);
    const now = new Date();
    const offset = now.getTimezoneOffset() * 60000;
    const localNow = new Date(now.getTime() - offset);
    const tStr = localNow.toISOString().slice(0, 10);

    if (type === "today") {
      setReportType("single");
      setReportDate(tStr);
      setEndDate(tStr);
    } else if (type === "yesterday") {
      setReportType("single");
      const yest = new Date(localNow.getTime() - 86400000);
      const yStr = yest.toISOString().slice(0, 10);
      setReportDate(yStr);
      setEndDate(yStr);
    } else if (type === "thisWeek") {
      setReportType("range");
      const day = localNow.getDay();
      const diffToMon = localNow.getDate() - day + (day === 0 ? -6 : 1);
      const mon = new Date(localNow.getFullYear(), localNow.getMonth(), diffToMon);
      const monStr = new Date(mon.getTime() - offset).toISOString().slice(0, 10);
      setReportDate(monStr);
      setEndDate(tStr); // Monday to Today
    } else if (type === "thisMonth") {
      setReportType("month");
      const mStr = tStr.slice(0, 7);
      setSelectedMonth(mStr);
      const firstDay = new Date(localNow.getFullYear(), localNow.getMonth(), 1);
      const firstStr = new Date(firstDay.getTime() - offset).toISOString().slice(0, 10);
      setReportDate(firstStr);
      setEndDate(tStr);
    }
  };

  // ================= PDF =================
  const handleDownloadPdf = () => {
    if (!report.length) return;
    setPdfLoading(true);
    setPdfTrigger(Date.now());
    setTimeout(() => setPdfLoading(false), 800);
  };

  // ================= AVAILABLE GUARDS =================
  const availableGuards = useMemo(() => {
    const setG = new Set<string>();
    secUsers.forEach(u => {
      if (u.security_name) setG.add(u.security_name.trim());
    });
    report.forEach((r) => {
      if (r.guard_name && r.guard_name !== "SYSTEM_MISSED") {
        r.guard_name.split(",").forEach((g) => setG.add(g.trim()));
      }
    });
    return Array.from(setG).sort();
  }, [secUsers, report]);

  // ================= HELPER: MATCH GUARD NAME FLEXIBLY =================
  const isMatchGuard = (guardName: string | null | undefined, selected: string) => {
    if (selected === "ALL") return true;
    if (!guardName) return false;
    if (guardName === "SYSTEM_MISSED") return true;
    const sLower = selected.toLowerCase().trim();
    const gLower = guardName.toLowerCase().trim();
    return gLower.includes(sLower) || sLower.includes(gLower);
  };

  // ================= CLEAN & FILTERED LOGS =================
  const cleanLogs = useMemo(() => {
    return report
      .filter((i) => {
        if (selectedGuard !== "ALL") {
          if (!isMatchGuard(i.guard_name, selectedGuard)) {
            return false;
          }
        }
        if (selectedRound !== "ALL" && i.round !== Number(selectedRound)) {
          return false;
        }
        if (selectedStatus !== "ALL" && i.status !== selectedStatus) {
          return false;
        }
        return true;
      })
      .map((i) => ({
        ...i,
        lat: i.lat ?? undefined,
        lon: i.lon ?? undefined,
        guard_name: i.guard_name ?? undefined,
      }));
  }, [report, selectedGuard, selectedRound, selectedStatus]);

  if (!authorized) {
    return <div className="p-6 text-slate-500 min-h-screen flex items-center justify-center">Checking access...</div>;
  }

  return (
    <div className="min-h-screen relative font-sans text-slate-900 selection:bg-purple-100 selection:text-purple-900">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10 space-y-6"
      >
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <p className="section-heading">Official Audit Reports</p>
            <h1 className="text-3xl font-extrabold tracking-tight text-purple-950">
              Patrol <span className="text-gradient">Logs & Documentation</span>
            </h1>
            <p className="mt-1 text-slate-500 text-sm">
              Generate official patrol reports, inspect guard compliance, and export PDF audits.
            </p>
          </div>

          <div className="flex items-center gap-2 px-3.5 py-2 glass-panel rounded-2xl text-xs font-semibold text-purple-900 border border-purple-100 shadow-sm">
            <Shield size={14} className="text-purple-600" />
            <span>Admin: {adminName || "Loading..."}</span>
          </div>
        </div>

        {/* CONTROLS (ULTRA-PREMIUM STYLED) */}
        <div className="glass-panel rounded-3xl p-6 space-y-5 border border-purple-100/80 shadow-xl shadow-purple-900/5">
          {error && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-semibold flex items-center gap-2">
              <AlertTriangle size={16} /> {error}
            </div>
          )}

          {/* Preset Pills & Report Type Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-purple-100/60 pb-4">
            {/* Mode selection buttons */}
            <div className="flex flex-wrap items-center gap-2">
              {[
                { id: "single", label: "One Day Report" },
                { id: "range", label: "Date Range Report" },
                { id: "month", label: "Month-wise Report" },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => { setReportType(t.id as any); setActivePreset("custom") }}
                  className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                    reportType === t.id
                      ? "btn-primary shadow-sm"
                      : "bg-white/80 text-slate-600 hover:bg-purple-50 hover:text-purple-700 border border-purple-100"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Glowing Preset Shortcut Pills */}
            <div className="flex flex-wrap items-center gap-2">
              {[
                { label: "Today", key: "today", icon: <Clock size={13} /> },
                { label: "Yesterday", key: "yesterday", icon: <Calendar size={13} /> },
                { label: "This Week", key: "thisWeek", icon: <CalendarDays size={13} /> },
                { label: "This Month", key: "thisMonth", icon: <Layers size={13} /> },
              ].map((preset) => {
                const isActive = activePreset === preset.key;
                return (
                  <motion.button
                    key={preset.key}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => setPresetDate(preset.key as any)}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                      isActive
                        ? "bg-gradient-to-r from-purple-600 to-violet-700 text-white shadow-md shadow-purple-500/30 ring-2 ring-purple-400/40"
                        : "bg-white/80 hover:bg-purple-50 text-slate-600 hover:text-purple-700 border border-purple-100"
                    }`}
                  >
                    {preset.icon}
                    {preset.label}
                  </motion.button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
            {/* DATE SELECTORS BASED ON TYPE */}
            {reportType === "single" && (
              <div className="md:col-span-3 space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-purple-400 block">
                  Patrol Date
                </label>
                <input
                  type="date"
                  className="input-field py-2.5 text-xs font-semibold text-purple-950 bg-white/90"
                  value={reportDate}
                  onChange={(e) => { setReportDate(e.target.value); setActivePreset("custom") }}
                />
              </div>
            )}

            {reportType === "range" && (
              <>
                <div className="md:col-span-3 space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-purple-400 block">
                    From Date
                  </label>
                  <input
                    type="date"
                    className="input-field py-2.5 text-xs font-semibold text-purple-950 bg-white/90"
                    value={reportDate}
                    onChange={(e) => { setReportDate(e.target.value); setActivePreset("custom") }}
                  />
                </div>
                <div className="md:col-span-3 space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-purple-400 block">
                    To Date
                  </label>
                  <input
                    type="date"
                    className="input-field py-2.5 text-xs font-semibold text-purple-950 bg-white/90"
                    value={endDate}
                    onChange={(e) => { setEndDate(e.target.value); setActivePreset("custom") }}
                  />
                </div>
              </>
            )}

            {reportType === "month" && (
              <div className="md:col-span-3 space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-purple-400 block">
                  Select Month
                </label>
                <input
                  type="month"
                  className="input-field py-2.5 text-xs font-semibold text-purple-950 bg-white/90"
                  value={selectedMonth}
                  onChange={(e) => { setSelectedMonth(e.target.value); setActivePreset("custom") }}
                />
              </div>
            )}

            {/* GUARD FILTER */}
            <div className="md:col-span-3 space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1">
                <UserCheck size={13} /> Officer
              </label>
              <div className="relative">
                <select
                  value={selectedGuard}
                  onChange={(e) => setSelectedGuard(e.target.value)}
                  className="input-field py-2.5 text-xs bg-white/90 cursor-pointer font-bold text-purple-950 pr-8 appearance-none"
                >
                  <option value="ALL">All Officers</option>
                  {availableGuards.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400 pointer-events-none" />
              </div>
            </div>

            {/* ROUND FILTER */}
            <div className="md:col-span-2 space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1">
                <Clock size={13} /> Round Slot
              </label>
              <div className="relative">
                <select
                  value={selectedRound}
                  onChange={(e) => setSelectedRound(e.target.value)}
                  className="input-field py-2.5 text-xs bg-white/90 cursor-pointer font-bold text-purple-950 pr-8 appearance-none"
                >
                  <option value="ALL">All Rounds</option>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((r) => (
                    <option key={r} value={r}>
                      Round {r}
                    </option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400 pointer-events-none" />
              </div>
            </div>

            {/* STATUS FILTER */}
            <div className="md:col-span-2 space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1">
                <CheckCircle2 size={13} /> Status
              </label>
              <div className="relative">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="input-field py-2.5 text-xs bg-white/90 cursor-pointer font-bold text-purple-950 pr-8 appearance-none"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="SUCCESS">Completed (Success)</option>
                  <option value="MISSED">Missed</option>
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400 pointer-events-none" />
              </div>
            </div>

            {/* ACTION BUTTON */}
            <div className="md:col-span-2 flex justify-end">
              <button
                onClick={handleDownloadPdf}
                disabled={pdfLoading || loading || cleanLogs.length === 0}
                className="btn-primary py-2.5 px-4 text-xs w-full flex items-center justify-center gap-1.5 disabled:opacity-50 shadow-md shadow-purple-500/20"
              >
                {pdfLoading ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Download size={14} /> Export PDF
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* REPORT TABLE */}
        <div className="glass-panel rounded-3xl p-6">
          {loading ? (
            <div className="flex flex-col gap-3 p-6">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="skeleton h-12 w-full" style={{ animationDelay: `${i * 0.1}s` }} />
              ))}
            </div>
          ) : (
            <ReportTable logs={cleanLogs} loading={loading} />
          )}
        </div>

        {/* PDF HIDDEN GENERATOR */}
        <div style={{ position: "absolute", top: "-9999px", left: "-9999px" }}>
          {pdfTrigger !== null && (
            <PatrolReportPDF
              key={pdfTrigger}
              logs={cleanLogs}
              shifts={shifts}
              campusCode={FIXED_CAMPUS}
              campusName="KCET Main Campus"
              campusAddress="Kamaraj College of Engineering and Technology"
              reportDate={reportDate}
              generatedBy={adminName}
            />
          )}
        </div>
      </motion.div>
    </div>
  );
}
