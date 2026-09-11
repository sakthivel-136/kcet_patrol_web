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
import { getAllocations } from "../api/allocations.api";
import {
  Filter, Calendar, Shield, FileText, Download, CheckCircle2,
  AlertTriangle, UserCheck, Clock, ChevronDown, Sparkles,
  CalendarDays, Layers, Grid
} from "lucide-react";

// ================= TYPES =================
type Campus = {
  campus_code: string;
  campus_name: string;
  campus_address: string | null;
};

type WeekSegregation = {
  weekNum: number;
  label: string;
  startDate: string;
  endDate: string;
};

// ================= HELPER: CALCULATE SEGREGATED WEEKS OF MONTH =================
function getSegregatedWeeks(yearMonthStr: string): WeekSegregation[] {
  if (!yearMonthStr) return [];
  const [year, month] = yearMonthStr.split("-").map(Number);
  if (!year || !month) return [];

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const monthName = monthNames[month - 1] || "";
  const totalDays = new Date(year, month, 0).getDate();

  const weeks: WeekSegregation[] = [];
  let weekNum = 1;
  let startDay = 1;

  while (startDay <= totalDays) {
    const endDay = Math.min(startDay + 6, totalDays);
    const pad = (n: number) => String(n).padStart(2, "0");
    const startStr = `${year}-${pad(month)}-${pad(startDay)}`;
    const endStr = `${year}-${pad(month)}-${pad(endDay)}`;

    weeks.push({
      weekNum,
      label: `Week ${weekNum} (${monthName} ${pad(startDay)} - ${pad(endDay)}, ${year})`,
      startDate: startStr,
      endDate: endStr,
    });

    startDay = endDay + 1;
    weekNum++;
  }

  return weeks;
}

const MONTHS = [
  { value: "01", label: "January (01)" },
  { value: "02", label: "February (02)" },
  { value: "03", label: "March (03)" },
  { value: "04", label: "April (04)" },
  { value: "05", label: "May (05)" },
  { value: "06", label: "June (06)" },
  { value: "07", label: "July (07)" },
  { value: "08", label: "August (08)" },
  { value: "09", label: "September (09)" },
  { value: "10", label: "October (10)" },
  { value: "11", label: "November (11)" },
  { value: "12", label: "December (12)" },
];

const YEARS = Array.from({ length: 11 }, (_, i) => 2024 + i);

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
  const [selectedWeekIndex, setSelectedWeekIndex] = useState<number>(0);
  const [reportType, setReportType] = useState<"single" | "range" | "weekly" | "month">("single");

  const currentYear = useMemo(() => {
    return selectedMonth ? selectedMonth.split("-")[0] : String(new Date().getFullYear());
  }, [selectedMonth]);

  const currentMonthNum = useMemo(() => {
    return selectedMonth ? selectedMonth.split("-")[1] : String(new Date().getMonth() + 1).padStart(2, "0");
  }, [selectedMonth]);

  const handleYearMonthChange = (year: string, monthVal: string) => {
    setSelectedMonth(`${year}-${monthVal}`);
    setSelectedWeekIndex(0);
  };

  const [report, setReport] = useState<PatrolReportItem[]>([]);
  const [shifts, setShifts] = useState<any[]>([]);
  const [secUsers, setSecUsers] = useState<any[]>([]);
  const [allocations, setAllocations] = useState<any[]>([]);

  // ── ADVANCED FILTERS ──
  const [selectedGuard, setSelectedGuard] = useState("ALL");
  const [selectedRound, setSelectedRound] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");

  const [loading, setLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfTrigger, setPdfTrigger] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // ================= CALCULATED SEGREGATED WEEKS FOR SELECTED MONTH =================
  const monthWeeks = useMemo(() => {
    return getSegregatedWeeks(selectedMonth);
  }, [selectedMonth]);

  // Sync dates when week selection or month changes in "weekly" mode
  useEffect(() => {
    if (reportType === "weekly" && monthWeeks.length > 0) {
      const idx = Math.min(selectedWeekIndex, monthWeeks.length - 1);
      const w = monthWeeks[idx];
      if (w) {
        setReportDate(w.startDate);
        setEndDate(w.endDate);
      }
    }
  }, [reportType, selectedMonth, selectedWeekIndex, monthWeeks]);

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

    if (reportType === "range" || reportType === "weekly") {
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
      const [data, shiftsData, usersData, allocsData] = await Promise.all([
        getPatrolReport(FIXED_CAMPUS, start, end),
        getShifts(),
        getSecurityUsers(),
        getAllocations()
      ]);
      setReport(data || []);
      setShifts(shiftsData || []);
      setSecUsers(usersData || []);
      setAllocations(allocsData || []);
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

  const ROUND_TIMES_LIST = [
    '00:45', '02:45', '04:45', '06:45', '08:45', '10:45',
    '12:45', '14:45', '16:45', '18:45', '20:45', '22:45'
  ];

  // ================= HELPER: DYNAMIC SHIFT GUARD RESOLUTION =================
  const resolveShiftGuardNames = (roundNo: number): string[] => {
    if (roundNo < 1 || roundNo > ROUND_TIMES_LIST.length) return [];
    const roundTimeStr = ROUND_TIMES_LIST[roundNo - 1];
    const [rH, rM] = roundTimeStr.split(":").map(Number);
    const roundMins = rH * 60 + rM;

    const matchingShift = shifts.find((s) => {
      if (!s.start_time || !s.end_time) return false;
      const [sH, sM] = s.start_time.split(":").map(Number);
      const [eH, eM] = s.end_time.split(":").map(Number);
      const startMins = sH * 60 + sM;
      let endMins = eH * 60 + eM;
      if (endMins <= startMins) {
        return roundMins >= startMins || roundMins < endMins;
      }
      return roundMins >= startMins && roundMins < endMins;
    });

    if (!matchingShift) return [];

    const shiftAllocs = allocations.filter(
      (a) => a.shift_id === matchingShift.shift_id && a.guard_id !== "CLEAR"
    );

    const names: string[] = [];
    shiftAllocs.forEach((a) => {
      const user = secUsers.find(
        (u) =>
          u.security_id === a.guard_id ||
          (u.security_name && u.security_name.trim() === a.guard_id.trim())
      );
      if (user && user.security_name && user.security_name.toUpperCase() !== "SYSTEM_MISSED") {
        names.push(user.security_name.trim());
      } else if (a.guard_id && a.guard_id.toUpperCase() !== "SYSTEM_MISSED") {
        names.push(a.guard_id.trim());
      }
    });

    return Array.from(new Set(names));
  };

  // ================= AVAILABLE GUARDS =================
  const availableGuards = useMemo(() => {
    const setG = new Set<string>();
    secUsers.forEach(u => {
      if (u.security_name && u.security_name.toUpperCase() !== "SYSTEM_MISSED") {
        setG.add(u.security_name.trim());
      }
    });
    report.forEach((r) => {
      if (r.guard_name && r.guard_name.toUpperCase() !== "SYSTEM_MISSED") {
        r.guard_name.split(",").forEach((g) => {
          if (g.toUpperCase() !== "SYSTEM_MISSED") setG.add(g.trim());
        });
      }
      const shiftGuards = resolveShiftGuardNames(r.round);
      shiftGuards.forEach(g => setG.add(g));
    });
    return Array.from(setG).sort();
  }, [secUsers, report, shifts, allocations]);

  // ================= CLEAN & FILTERED LOGS =================
  const cleanLogs = useMemo(() => {
    return report
      .filter((i) => {
        if (selectedGuard !== "ALL") {
          const sLower = selectedGuard.toLowerCase().trim();
          let match = false;
          if (i.guard_name && i.guard_name.toUpperCase() !== "SYSTEM_MISSED") {
            if (i.guard_name.toLowerCase().trim().includes(sLower)) match = true;
          }
          const shiftGuards = resolveShiftGuardNames(i.round);
          if (shiftGuards.some((g) => g.toLowerCase().trim().includes(sLower))) match = true;
          if (!match) return false;
        }
        if (selectedRound !== "ALL" && i.round !== Number(selectedRound)) {
          return false;
        }
        if (selectedStatus !== "ALL" && i.status !== selectedStatus) {
          return false;
        }
        return true;
      })
      .map((i) => {
        let gName = i.guard_name;
        if (!gName || gName.toUpperCase() === "SYSTEM_MISSED") {
          const shiftGuards = resolveShiftGuardNames(i.round);
          if (shiftGuards.length > 0) {
            gName = shiftGuards.join(", ");
          } else {
            gName = "-";
          }
        }
        return {
          ...i,
          lat: i.lat ?? undefined,
          lon: i.lon ?? undefined,
          guard_name: gName,
        };
      });
  }, [report, selectedGuard, selectedRound, selectedStatus, shifts, allocations, secUsers]);

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
              Generate official single-day, date-range, segregated weekly, or monthly PDF audit reports.
            </p>
          </div>

          <div className="flex items-center gap-2 px-3.5 py-2 glass-panel rounded-2xl text-xs font-semibold text-purple-900 border border-purple-100 shadow-sm">
            <Shield size={14} className="text-purple-600" />
            <span>Admin: {adminName || "Loading..."}</span>
          </div>
        </div>

        {/* CONTROLS */}
        <div className="glass-panel rounded-3xl p-6 space-y-5 border border-purple-100/80 shadow-xl shadow-purple-900/5">
          {error && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-semibold flex items-center gap-2">
              <AlertTriangle size={16} /> {error}
            </div>
          )}

          {/* Toggle buttons for Report Type Modes */}
          <div data-tour="report-dates" className="flex flex-wrap items-center gap-2 border-b border-purple-100/60 pb-4">
            {[
              { id: "single", label: "Single Day Report" },
              { id: "range", label: "Custom Date Range" },
              { id: "weekly", label: "Weekly Segregated Report" },
              { id: "month", label: "Full Month Report" },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setReportType(t.id as any)}
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

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
            {/* SINGLE DAY MODE */}
            {reportType === "single" && (
              <div className="md:col-span-3 space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-purple-400 block">
                  Select Specific Date
                </label>
                <input
                  type="date"
                  className="input-field py-2.5 text-xs font-semibold text-purple-950 bg-white/90"
                  value={reportDate}
                  onChange={(e) => { setReportDate(e.target.value); setEndDate(e.target.value); }}
                />
              </div>
            )}

            {/* CUSTOM RANGE MODE */}
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
                    onChange={(e) => setReportDate(e.target.value)}
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
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </>
            )}

            {/* WEEKLY SEGREGATED REPORT MODE */}
            {reportType === "weekly" && (
              <>
                <div className="md:col-span-4 glass-panel p-3.5 rounded-2xl border border-purple-100/80 space-y-2.5 bg-purple-50/30">
                  <p className="text-[11px] font-extrabold uppercase tracking-widest text-purple-700 flex items-center gap-1.5 border-b border-purple-100/80 pb-2">
                    <CalendarDays size={14} className="text-purple-600" /> Month Selection (Year Top, Month Below)
                  </p>

                  <div className="space-y-2">
                    {/* Top: Select Year */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                        <Calendar size={12} /> Select Year (Top)
                      </label>
                      <div className="relative">
                        <select
                          value={currentYear}
                          onChange={(e) => handleYearMonthChange(e.target.value, currentMonthNum)}
                          className="input-field py-2 text-xs bg-white/95 cursor-pointer font-bold text-purple-950 pr-8 appearance-none shadow-sm"
                        >
                          {YEARS.map((y) => (
                            <option key={y} value={y}>
                              {y}
                            </option>
                          ))}
                        </select>
                        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400 pointer-events-none" />
                      </div>
                    </div>

                    {/* Below: Select Month Dropdown */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                        <CalendarDays size={12} /> Select Month (Below)
                      </label>
                      <div className="relative">
                        <select
                          value={currentMonthNum}
                          onChange={(e) => handleYearMonthChange(currentYear, e.target.value)}
                          className="input-field py-2 text-xs bg-white/95 cursor-pointer font-bold text-purple-950 pr-8 appearance-none shadow-sm"
                        >
                          {MONTHS.map((m) => (
                            <option key={m.value} value={m.value}>
                              {m.label}
                            </option>
                          ))}
                        </select>
                        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-4 space-y-1.5 self-end">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1">
                    <Grid size={13} /> Segregated Week of Month
                  </label>
                  <div className="relative">
                    <select
                      value={selectedWeekIndex}
                      onChange={(e) => setSelectedWeekIndex(Number(e.target.value))}
                      className="input-field py-2.5 text-xs bg-white/90 cursor-pointer font-bold text-purple-950 pr-8 appearance-none"
                    >
                      {monthWeeks.map((w, idx) => (
                        <option key={idx} value={idx}>
                          {w.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400 pointer-events-none" />
                  </div>
                </div>
              </>
            )}

            {/* MONTH-WISE MODE */}
            {reportType === "month" && (
              <div className="md:col-span-4 glass-panel p-3.5 rounded-2xl border border-purple-100/80 space-y-2.5 bg-purple-50/30">
                <p className="text-[11px] font-extrabold uppercase tracking-widest text-purple-700 flex items-center gap-1.5 border-b border-purple-100/80 pb-2">
                  <CalendarDays size={14} className="text-purple-600" /> Month Selection (Year Top, Month Below)
                </p>

                <div className="space-y-2">
                  {/* Top: Select Year */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                      <Calendar size={12} /> Select Year (Top)
                    </label>
                    <div className="relative">
                      <select
                        value={currentYear}
                        onChange={(e) => handleYearMonthChange(e.target.value, currentMonthNum)}
                        className="input-field py-2 text-xs bg-white/95 cursor-pointer font-bold text-purple-950 pr-8 appearance-none shadow-sm"
                      >
                        {YEARS.map((y) => (
                          <option key={y} value={y}>
                            {y}
                          </option>
                        ))}
                      </select>
                      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Below: Select Month Dropdown */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                      <CalendarDays size={12} /> Select Month (Below)
                    </label>
                    <div className="relative">
                      <select
                        value={currentMonthNum}
                        onChange={(e) => handleYearMonthChange(currentYear, e.target.value)}
                        className="input-field py-2 text-xs bg-white/95 cursor-pointer font-bold text-purple-950 pr-8 appearance-none shadow-sm"
                      >
                        {MONTHS.map((m) => (
                          <option key={m.value} value={m.value}>
                            {m.label}
                          </option>
                        ))}
                      </select>
                      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* GUARD FILTER */}
            <div data-tour="report-filters" className="md:col-span-3 space-y-1.5">
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
                data-tour="report-download-btn"
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
        <div data-tour="report-table" className="glass-panel rounded-3xl p-6">
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
