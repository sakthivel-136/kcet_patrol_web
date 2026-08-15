"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { getPatrolReport, PatrolReportItem } from "../api/report";
import { getCampuses } from "../api/campuses.api";
import ReportTable from "../components/reports/ReportTable";
import PatrolReportPDF from "../components/reports/PatrolReportPDF";
import { useAuthGuard } from "@/app/services/auth.guard";
import { motion } from "framer-motion";

import { getShifts } from "../api/shifts.api";

// ================= TYPES =================
type Campus = {
  campus_code: string;
  campus_name: string;
  campus_address: string | null;
};

// ================= ICONS (SVG) =================
const IconCampus = () => (
  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const IconCalendar = () => (
  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const IconDownload = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);

const IconSpinner = () => (
  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
    </path>
  </svg>
);

// ================= PAGE =================
export default function ReportDownloadPage() {
  const { authorized } = useAuthGuard({ allowedRoles: ['ADMIN', 'SUPERVISOR'] });
  const [adminName, setAdminName] = useState("");
  const FIXED_CAMPUS = "KCET01";
  
  const [reportDate, setReportDate] = useState(new Date().toISOString().slice(0, 10));
  const [endDate, setEndDate] = useState(new Date().toISOString().slice(0, 10));
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM
  const [reportType, setReportType] = useState<"single" | "range" | "month">("single");
  const [report, setReport] = useState<PatrolReportItem[]>([]);
  const [shifts, setShifts] = useState<any[]>([]);

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
      const lastDay = new Date(year, month, 0); // last day of current month
      const pad = (n: number) => String(n).padStart(2, "0");
      start = `${year}-${pad(month)}-01`;
      end = `${year}-${pad(month)}-${pad(lastDay.getDate())}`;
    }

    try {
      const [data, shiftsData] = await Promise.all([
        getPatrolReport(FIXED_CAMPUS, start, end),
        getShifts()
      ]);
      setReport(data);
      setShifts(shiftsData);
      if (data.length === 0) setError("No patrol records found for this timeframe.");
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

  // ================= CLEAN =================
  const cleanLogs = useMemo(() => {
    return report.map((i) => ({
      ...i,
      lat: i.lat ?? undefined,
      lon: i.lon ?? undefined,
      guard_name: i.guard_name ?? undefined,
    }));
  }, [report]);

  if (!authorized) {
    return <div className="p-6 text-slate-500 min-h-screen flex items-center justify-center">Checking access...</div>;
  }

  return (
    <div className="min-h-screen relative font-sans text-slate-900">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10"
      >

        {/* HEADER */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Patrol Reports</h1>
            <p className="mt-2 text-slate-500">
              View logs and generate official patrol documentation.
            </p>
          </div>

          <div className="flex items-center gap-3 px-4 py-2 glass-panel rounded-xl">
            <div className="w-2 h-2 rounded-full bg-amber-500"></div>
            <span className="text-sm font-medium text-slate-600">
              Admin: {adminName || "Loading..."}
            </span>
          </div>
        </div>

        {/* CONTROLS */}
        <div className="glass-panel rounded-3xl p-6 mb-6">
          {error && (
            <div className="mb-4 p-4 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Toggle buttons for Report Type */}
          <div className="flex gap-2 mb-6 border-b pb-4">
            <button
              onClick={() => setReportType("single")}
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
                reportType === "single"
                  ? "bg-purple-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              One Day Report
            </button>
            <button
              onClick={() => setReportType("range")}
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
                reportType === "range"
                  ? "bg-purple-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Date Range Report
            </button>
            <button
              onClick={() => setReportType("month")}
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
                reportType === "month"
                  ? "bg-purple-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Month-wise Report
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">

            {/* DATE SELECTORS BASED ON TYPE */}
            {reportType === "single" && (
              <div className="md:col-span-4">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Patrol Date
                </label>
                <input
                  type="date"
                  className="w-full mt-2 pl-3 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg"
                  value={reportDate}
                  onChange={(e) => setReportDate(e.target.value)}
                />
              </div>
            )}

            {reportType === "range" && (
              <>
                <div className="md:col-span-3">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    From Date
                  </label>
                  <input
                    type="date"
                    className="w-full mt-2 pl-3 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg"
                    value={reportDate}
                    onChange={(e) => setReportDate(e.target.value)}
                  />
                </div>
                <div className="md:col-span-3">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    To Date
                  </label>
                  <input
                    type="date"
                    className="w-full mt-2 pl-3 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </>
            )}

            {reportType === "month" && (
              <div className="md:col-span-4">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Select Month
                </label>
                <input
                  type="month"
                  className="w-full mt-2 pl-3 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                />
              </div>
            )}

            {/* BUTTONS */}
            <div className="md:col-span-3 flex gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={fetchReport}
                disabled={loading}
                className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg flex items-center justify-center"
              >
                {loading ? <IconSpinner /> : "View Report"}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDownloadPdf}
                disabled={!report.length || pdfLoading || loading}
                className="flex-1 bg-amber-600 hover:bg-amber-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold py-2.5 px-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                {pdfLoading ? <IconSpinner /> : <><IconDownload /><span>Download PDF</span></>}
              </motion.button>
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div className="glass-panel rounded-3xl overflow-hidden min-h-[400px]">
          {!loading && cleanLogs.length > 0 && (
            <div ref={printRef}>
              <div className="border-b border-slate-100 px-6 py-4 bg-slate-50/50">
                <h3 className="font-semibold text-slate-800">Report Data</h3>
              </div>
              <ReportTable logs={cleanLogs} loading={loading} />
            </div>
          )}
        </div>

        {/* PDF */}
        {pdfTrigger && cleanLogs.length > 0 && (
          <div className="hidden">
            <PatrolReportPDF
              key={pdfTrigger}
              logs={cleanLogs}
              campusCode={FIXED_CAMPUS}
              campusName={"KCET Main Campus"}
              campusAddress={"Virudhunagar"}
              reportDate={
                reportType === "single"
                  ? reportDate
                  : reportType === "range"
                  ? `${reportDate} to ${endDate}`
                  : `${new Date(selectedMonth + "-02").toLocaleDateString("en-IN", { month: "long", year: "numeric" })}`
              }
              generatedBy={adminName}
              shifts={shifts}
            />
          </div>
        )}
      </motion.div>
    </div>
  );
}
