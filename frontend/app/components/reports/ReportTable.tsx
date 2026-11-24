"use client";

import React, { useMemo, useState } from "react";
import { ArrowUp, ArrowDown, ArrowUpDown, Users } from "lucide-react";
import { ROUND_TIMES, RoundTime } from "./roundtime";

// ===============================
// Interface
// ===============================
export interface ScanLog {
  id?: string | number;

  scan_time: string | null;
  campus_code?: string;
  guard_name?: string;
  qr_name: string;

  round: number;

  lat?: string;
  lon?: string;

  status?: string;

  [key: string]: any;
}

// ===============================
// Column
// ===============================
interface Column {
  key: keyof ScanLog;
  label: string;
  widthClass: string;
}

// ===============================
// Props
// ===============================
interface ReportTableProps {
  logs: ScanLog[];
  loading: boolean;
}

// ===============================
// Component
// ===============================
const ReportTable: React.FC<ReportTableProps> = ({ logs, loading }) => {
  // ===============================
  // Status Normalizer (SAME AS PDF)
  // ===============================
  const normalizeStatus = (
    status?: string | null,
    scanTime?: string | null
  ): "SUCCESS" | "MISSED" | "PENDING" | "No Data" => {
    if (!status) return "No Data";

    const s = status.toLowerCase().trim();

    if (
      s === "success" ||
      s === "completed" ||
      s === "done"
    ) {
      return "SUCCESS";
    }

    if (s === "missed") {
      return "MISSED";
    }

    if (s === "pending") {
      return "PENDING";
    }

    if (!scanTime) return "No Data";

    return "No Data";
  };

  // -------------------------------
  // Sorting
  // -------------------------------
  const [sortConfig, setSortConfig] = useState<{
    key: keyof ScanLog;
    direction: "asc" | "desc";
  }>({
    key: "scan_time",
    direction: "desc",
  });

  // -------------------------------
  // Pagination Per Round
  // -------------------------------
  const [pages, setPages] = useState<Record<number, number>>({});

  const rowsPerPage = 10;

  const getPage = (round: number) => pages[round] || 1;

  const setPage = (round: number, page: number) => {
    setPages((prev) => ({
      ...prev,
      [round]: page,
    }));
  };

  // -------------------------------
  // Columns with fixed proportion widths
  // -------------------------------
  const columns: Column[] = [
    { key: "scan_time", label: "Scan Time", widthClass: "w-[16%]" },
    { key: "guard_name", label: "Guard", widthClass: "w-[30%]" },
    { key: "qr_name", label: "Scan Point", widthClass: "w-[24%]" },
    { key: "lat", label: "Latitude", widthClass: "w-[10%]" },
    { key: "lon", label: "Longitude", widthClass: "w-[10%]" },
    { key: "status", label: "Status", widthClass: "w-[10%]" },
  ];

  // -------------------------------
  // Sorting Handler
  // -------------------------------
  const handleSort = (key: keyof ScanLog) => {
    let direction: "asc" | "desc" = "asc";

    if (sortConfig.key === key) {
      direction = sortConfig.direction === "asc" ? "desc" : "asc";
    } else {
      direction = "desc";
    }

    setSortConfig({ key, direction });
  };

  // -------------------------------
  // Filter Logs
  // -------------------------------
  const validLogs = useMemo(() => {
    return logs.filter(
      (log) => log.round >= 1 && log.round <= 12
    );
  }, [logs]);

  // -------------------------------
  // Sort Data
  // -------------------------------
  const sortedData = useMemo(() => {
    return [...validLogs].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (sortConfig.key === "scan_time") {
        const dateA = aValue ? new Date((aValue as string).replace(" ", "T")).getTime() : 0;
        const dateB = bValue ? new Date((bValue as string).replace(" ", "T")).getTime() : 0;

        return sortConfig.direction === "asc"
          ? dateA - dateB
          : dateB - dateA;
      }

      if (!aValue || !bValue) return 0;

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;

      return 0;
    });
  }, [validLogs, sortConfig]);

  // -------------------------------
  // Group By Round
  // -------------------------------
  const logsByRound = useMemo(() => {
    const grouped: Record<number, ScanLog[]> = {};

    sortedData.forEach((log) => {
      const r = log.round || 1;

      if (!grouped[r]) grouped[r] = [];

      grouped[r].push(log);
    });

    return grouped;
  }, [sortedData]);

  // -------------------------------
  // Render Cell
  // -------------------------------
  const renderCell = (row: ScanLog, key: keyof ScanLog) => {
    const value = row[key];

    // Guard Name — Compact display: up to 5 names cleanly formatted with "+N more" badge
    if (key === "guard_name") {
      if (!value || String(value).toUpperCase() === "SYSTEM_MISSED") {
        return <span className="text-slate-400 font-mono text-xs">—</span>;
      }

      const rawStr = String(value).trim();
      const names = rawStr
        .split(",")
        .map((n) => n.trim())
        .filter(Boolean);

      if (names.length <= 5) {
        return (
          <div className="text-xs text-slate-800 leading-snug break-words">
            {names.join(", ")}
          </div>
        );
      }

      const visibleNames = names.slice(0, 5);
      const remainingCount = names.length - 5;
      const allNamesText = names.join(", ");

      return (
        <div
          className="text-xs text-slate-800 leading-snug break-words group/guard relative inline-block cursor-help"
          title={allNamesText}
        >
          <span>{visibleNames.join(", ")}</span>
          <span className="ml-1.5 inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-semibold text-purple-700 bg-purple-100 rounded-md border border-purple-200">
            +{remainingCount} more
          </span>
        </div>
      );
    }

    // Scan Time — parse DB scan_time and show Date + Time
    if (key === "scan_time") {
      if (!value) return <span className="text-slate-400 font-mono text-xs">—</span>;
      const safeValue = (value as string).replace(" ", "T");
      const d = new Date(safeValue);
      if (isNaN(d.getTime())) return <span className="text-slate-400 font-mono text-xs">—</span>;

      const date = d.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        timeZone: "Asia/Kolkata",
      });
      const time = d.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
        timeZone: "Asia/Kolkata",
      });

      return (
        <div className="text-xs leading-tight">
          <div className="font-medium text-slate-800">{time}</div>
          <div className="text-[10px] text-slate-400">{date}</div>
        </div>
      );
    }

    // Scan Point
    if (key === "qr_name") {
      return (
        <div className="text-xs font-semibold text-slate-800 break-words leading-tight" title={value}>
          {value || "—"}
        </div>
      );
    }

    // Coordinates
    if (key === "lat" || key === "lon") {
      if (!value) return <span className="text-slate-400 font-mono text-xs">—</span>;
      const num = parseFloat(value);
      return (
        <span className="text-[11px] font-mono text-slate-600 truncate block">
          {isNaN(num) ? value : num.toFixed(5)}
        </span>
      );
    }

    // Status
    if (key === "status") {
      const finalStatus = normalizeStatus(
        row.status,
        row.scan_time
      );

      let color = "bg-slate-100 text-slate-700 border-slate-200";

      if (finalStatus === "SUCCESS") {
        color = "bg-emerald-50 text-emerald-700 border-emerald-200";
      } else if (finalStatus === "MISSED") {
        color = "bg-rose-50 text-rose-700 border-rose-200";
      } else if (finalStatus === "PENDING") {
        color = "bg-amber-50 text-amber-700 border-amber-200";
      }

      return (
        <span
          className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-bold border tracking-wide uppercase ${color}`}
        >
          {finalStatus}
        </span>
      );
    }

    return value ?? "—";
  };

  // -------------------------------
  // Loading / Empty
  // -------------------------------
  if (loading) {
    return (
      <div className="text-center py-6 text-slate-500 text-sm">
        Loading scan logs...
      </div>
    );
  }

  if (!validLogs.length) {
    return (
      <div className="text-center py-6 text-slate-500 text-sm">
        No scan records found
      </div>
    );
  }

  // ===============================
  // UI
  // ===============================
  return (
    <div className="space-y-8">
      {Object.keys(logsByRound)
        .sort((a, b) => Number(a) - Number(b))
        .map((roundKey) => {
          const roundNumber = Number(roundKey);

          if (!ROUND_TIMES[roundNumber]) return null;

          const roundLogs = logsByRound[roundNumber];

          // Pagination
          const page = getPage(roundNumber);
          const totalPages = Math.ceil(roundLogs.length / rowsPerPage);
          const indexOfLastRow = page * rowsPerPage;
          const indexOfFirstRow = indexOfLastRow - rowsPerPage;
          const currentRows = roundLogs.slice(
            indexOfFirstRow,
            indexOfLastRow
          );

          // Round time
          const roundTime: RoundTime | undefined = ROUND_TIMES[roundNumber];
          const startTime = roundTime?.start ?? "-";
          const endTime = roundTime?.end ?? "-";

          return (
            <div
              key={roundKey}
              className="glass-panel rounded-2xl p-5 border border-purple-100 shadow-sm"
            >
              {/* Header — Fixed, Clear Round Slot */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-2.5 border-b border-purple-100/60">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-600 animate-pulse" />
                  <h2 className="text-base font-bold text-slate-900 tracking-tight">
                    Round {roundNumber}
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200/60">
                    {startTime} – {endTime}
                  </span>
                </div>
                <div className="text-xs text-slate-500 font-medium">
                  {roundLogs.length} points
                </div>
              </div>

              {/* Table with fixed layout — no horizontal moving / scroll jumping */}
              <div className="w-full overflow-hidden rounded-xl border border-slate-200/60 bg-white/60 shadow-sm">
                <table className="w-full table-fixed divide-y divide-slate-200/60">
                  {/* Head */}
                  <thead className="bg-slate-50/80">
                    <tr>
                      {columns.map((col) => {
                        const isActive = sortConfig.key === col.key;

                        return (
                          <th
                            key={String(col.key)}
                            onClick={() => handleSort(col.key)}
                            className={`${col.widthClass} px-3.5 py-2.5 text-left text-[11px] font-bold uppercase tracking-wider cursor-pointer select-none transition-colors
                              ${
                                isActive
                                  ? "bg-purple-100/70 text-purple-800"
                                  : "text-slate-600 hover:bg-slate-100/80"
                              }`}
                          >
                            <div className="flex items-center gap-1">
                              <span className="truncate">{col.label}</span>
                              {isActive ? (
                                sortConfig.direction === "asc" ? (
                                  <ArrowUp className="w-3 h-3 text-purple-700 shrink-0" />
                                ) : (
                                  <ArrowDown className="w-3 h-3 text-purple-700 shrink-0" />
                                )
                              ) : (
                                <ArrowUpDown className="w-3 h-3 opacity-30 shrink-0" />
                              )}
                            </div>
                          </th>
                        );
                      })}
                    </tr>
                  </thead>

                  {/* Body */}
                  <tbody className="divide-y divide-slate-200/50 bg-white/40">
                    {currentRows.map((row, index) => (
                      <tr
                        key={`${row.qr_name}-${roundNumber}-${index}`}
                        className="hover:bg-purple-50/40 transition-colors"
                      >
                        {columns.map((col) => (
                          <td
                            key={String(col.key)}
                            className={`${col.widthClass} px-3.5 py-2.5 align-middle text-sm text-slate-700`}
                          >
                            {renderCell(row, col.key)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-3.5 flex justify-between items-center px-1">
                  <button
                    onClick={() =>
                      setPage(roundNumber, Math.max(1, page - 1))
                    }
                    disabled={page === 1}
                    className="px-3 py-1 border border-slate-200 rounded-lg shadow-sm text-xs font-semibold
                      disabled:opacity-40 disabled:cursor-not-allowed
                      hover:bg-slate-50 text-slate-700 bg-white transition-colors"
                  >
                    Previous
                  </button>

                  <span className="text-xs font-medium text-slate-600">
                    Page {page} of {totalPages}
                  </span>

                  <button
                    onClick={() =>
                      setPage(
                        roundNumber,
                        Math.min(totalPages, page + 1)
                      )
                    }
                    disabled={page === totalPages}
                    className="px-3 py-1 border border-slate-200 rounded-lg shadow-sm text-xs font-semibold
                      disabled:opacity-40 disabled:cursor-not-allowed
                      hover:bg-slate-50 text-slate-700 bg-white transition-colors"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          );
        })}
    </div>
  );
};

export default ReportTable;
