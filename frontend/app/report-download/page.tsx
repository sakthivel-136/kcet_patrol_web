"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { getPatrolReport, PatrolReportItem } from "../api/report";
import { getCampuses } from "../api/campuses.api";
import ReportTable from "../components/reports/ReportTable";
import PatrolReportPDF from "../components/reports/PatrolReportPDF";
import { useAuthGuard } from "@/app/services/auth.guard";
import { motion } from "framer-motion";
import { getShifts } from "../api/shifts.api";
import { Filter, Calendar, Shield, FileText, Download, CheckCircle2, AlertTriangle, User } from "lucide-react";

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

  const today = new Date().toISOString().slice(0, 10);
  const [reportDate, setReportDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [selectedMonth, setSelectedMonth] = useState(today.slice(0, 7)); // YYYY-MM
  const [reportType, setReportType] = useState<"single" | "range" | "month">("single");
  const [report, setReport] = useState<PatrolReportItem[]>([]);
  const [shifts, setShifts] = useState<any[]>([]);

  // ── ADVANCED FILTERS ──
  const [selectedGuard, setSelectedGuard] = useState("ALL");
  const [selectedRound, setSelectedRound] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");

  const [loading, setLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfTrigger, setPdfTrigger] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const printRef = useRef<HTMLDivElement>(null);

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
      const [data, shiftsData] = await Promise.all([
        getPatrolReport(FIXED_CAMPUS, start, end),
        getShifts()
      ]);
      setReport(data || []);
      setShifts(shiftsData || []);
      if (!data || data.length === 0) setError("No patrol records found for this timeframe.");
    } catch (err) {
      setError("Failed to fetch report data. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
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
    report.forEach((r) => {
      if (r.guard_name && r.guard_name !== "SYSTEM_MISSED") {
        r.guard_name.split(",").forEach((g) => setG.add(g.trim()));
      }
    });
    return Array.from(setG).sort();
  }, [report]);

  // ================= CLEAN & FILTERED LOGS =================
  const cleanLogs = useMemo(() => {
    return report
      .filter((i) => {
        if (selectedGuard !== "ALL") {
          if (!i.guard_name || !i.guard_name.toLowerCase().includes(selectedGuard.toLowerCase())) {
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

          <div className="flex items-center gap-2 px-3.5 py-2 glass-panel rounded-xl text-xs font-semibold text-purple-900">
            <Shield size={14} className="text-purple-600" />
            <span>Admin: {adminName || "Loading..."}</span>
          </div>
        </div>

        {/* CONTROLS */}
        <div className="glass-panel rounded-3xl p-6 space-y-5">
          {error && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-semibold flex items-center gap-2">
              <AlertTriangle size={16} /> {error}
            </div>
          )}

          {/* Toggle buttons for Report Type */}
          <div className="flex flex-wrap items-center gap-2 border-b border-purple-100/60 pb-4">
            {[
              { id: "single", label: "One Day Report" },
              { id: "range", label: "Date Range Report" },
              { id: "month", label: "Month-wise Report" },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setReportType(t.id as any)}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                  reportType === t.id
                    ? "btn-primary shadow-sm"
                    : "bg-purple-50 text-slate-600 hover:bg-purple-100 hover:text-purple-700"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
            {/* DATE SELECTORS BASED ON TYPE */}
            {reportType === "single" && (
              <div className="md:col-span-3">
                <label className="text-[11px] font-bold uppercase tracking-wider text-purple-400 mb-1 block">
                  Patrol Date
                </label>
                <input
                  type="date"
                  className="input-field py-2 text-xs"
                  value={reportDate}
                  onChange={(e) => setReportDate(e.target.value)}
                />
              </div>
            )}

            {reportType === "range" && (
              <>
                <div className="md:col-span-3">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-purple-400 mb-1 block">
                    From Date
                  </label>
                  <input
                    type="date"
                    className="input-field py-2 text-xs"
                    value={reportDate}
                    onChange={(e) => setReportDate(e.target.value)}
                  />
                </div>
                <div className="md:col-span-3">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-purple-400 mb-1 block">
                    To Date
                  </label>
                  <input
                    type="date"
                    className="input-field py-2 text-xs"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </>
            )}

            {reportType === "month" && (
              <div className="md:col-span-3">
                <label className="text-[11px] font-bold uppercase tracking-wider text-purple-400 mb-1 block">
                  Select Month
                </label>
                <input
                  type="month"
                  className="input-field py-2 text-xs"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                />
              </div>
            )}

            {/* GUARD FILTER */}
            <div className="md:col-span-3">
              <label className="text-[11px] font-bold uppercase tracking-wider text-purple-400 mb-1 block">
                Security Officer
              </label>
              <select
                value={selectedGuard}
                onChange={(e) => setSelectedGuard(e.target.value)}
                className="input-field py-2 text-xs bg-white"
              >
                <option value="ALL">All Officers</option>
                {availableGuards.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>

            {/* ROUND FILTER */}
            <div className="md:col-span-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-purple-400 mb-1 block">
                Round Slot
              </label>
              <select
                value={selectedRound}
                onChange={(e) => setSelectedRound(e.target.value)}
                className="input-field py-2 text-xs bg-white"
              >
                <option value="ALL">All Rounds</option>
                {Array.from({ length: 12 }, (_, i) => i + 1).map((r) => (
                  <option key={r} value={r}>
                    Round {r}
                  </option>
                ))}
              </select>
            </div>

            {/* STATUS FILTER */}
            <div className="md:col-span-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-purple-400 mb-1 block">
                Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="input-field py-2 text-xs bg-white"
              >
                <option value="ALL">All Statuses</option>
                <option value="SUCCESS">Completed (Success)</option>
                <option value="MISSED">Missed</option>
              </select>
            </div>

            {/* ACTION BUTTON */}
            <div className="md:col-span-2 flex justify-end">
              <button
                onClick={handleDownloadPdf}
                disabled={pdfLoading || loading || cleanLogs.length === 0}
                className="btn-primary py-2 px-4 text-xs w-full flex items-center justify-center gap-1.5 disabled:opacity-50"
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
