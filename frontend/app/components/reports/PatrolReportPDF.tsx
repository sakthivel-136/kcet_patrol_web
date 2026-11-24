"use client";
import React, { useEffect, useRef } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { ScanLog } from "../../types/scanlog";
import { ROUND_TIMES } from "./roundtime";
import { LOGO_BASE64 } from "./logoBase64";

interface PatrolReportPDFProps {
  logs: ScanLog[];
  shifts: any[];
  campusCode: string;
  campusName: string;
  campusAddress: string;
  reportDate: string;
  endDate?: string;
  reportType?: string;
  generatedBy: string;
}

const PatrolReportPDF: React.FC<PatrolReportPDFProps> = ({
  logs,
  shifts,
  campusCode,
  campusName,
  campusAddress,
  reportDate,
  endDate,
  reportType = "single",
  generatedBy,
}) => {
  const generatedRef = useRef(false);

  useEffect(() => {
    if (generatedRef.current) return;
    if (!logs || logs.length === 0) return;
    if (!Object.keys(ROUND_TIMES).length) return;
    if (!generatedBy || generatedBy.trim() === "") return;
    generatedRef.current = true;
    try {
      generatePDF();
    } catch (error) {
      console.error("PDF Generation Error:", error);
      alert("Failed to generate PDF. Please check the console for details.");
    }
  }, [logs, campusCode, campusName, campusAddress, reportDate, endDate, generatedBy]);

  const normalizeStatus = (status?: string | null): string => {
    if (!status) return "No Data";
    const s = status.toLowerCase().trim();
    if (s === "success" || s === "completed" || s === "done") return "SUCCESS";
    if (s === "missed") return "MISSED";
    if (s === "pending") return "PENDING";
    return "No Data";
  };

  const generatePDF = () => {
    const doc = new jsPDF("landscape", "pt", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 30;

    // ── 1. HIERARCHICAL GROUPING BY DATE & ROUND ──
    type DayData = {
      date: string;
      rounds: Record<string, ScanLog[]>;
      totalScans: number;
      completedScans: number;
      missedScans: number;
    };

    const logsByDate: Record<string, DayData> = {};

    logs.forEach((log) => {
      let dateKey = log.date;
      if (!dateKey) {
        if (log.scan_time) {
          dateKey = log.scan_time.slice(0, 10);
        } else {
          dateKey = reportDate;
        }
      }

      if (!logsByDate[dateKey]) {
        logsByDate[dateKey] = {
          date: dateKey,
          rounds: {},
          totalScans: 0,
          completedScans: 0,
          missedScans: 0,
        };
      }

      const dayGroup = logsByDate[dateKey];
      dayGroup.totalScans++;

      const st = normalizeStatus(log.status);
      if (st === "SUCCESS") dayGroup.completedScans++;
      if (st === "MISSED") dayGroup.missedScans++;

      const r = log.round?.toString() || "Unknown";
      if (!dayGroup.rounds[r]) {
        dayGroup.rounds[r] = [];
      }
      dayGroup.rounds[r].push(log);
    });

    // Sort dates chronologically
    const sortedDates = Object.keys(logsByDate).sort();

    const pageCountRef = { current: 1 };
    const pageDateMap: Record<number, string> = {};

    // Helper: Decorate Page Border & Footer
    const decoratePage = (pageNum: number, activeDate: string) => {
      doc.setPage(pageNum);
      pageDateMap[pageNum] = activeDate;

      // Outer 2px border
      doc.setDrawColor(0);
      doc.setLineWidth(2);
      doc.rect(15, 15, pageWidth - 30, pageHeight - 30);

      // Footer
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(0);
      doc.text("Authorized By: ____________________", margin, pageHeight - margin - 10);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text(
        `Report Generated on: ${new Date().toLocaleString()}`,
        margin,
        pageHeight - margin + 2
      );
    };

    // Helper: Compute Top 3 Performers (Highest successful scans)
    const computeTopPerformers = (dayLogs: ScanLog[]) => {
      const counts: Record<string, number> = {};
      dayLogs.forEach((l) => {
        if (normalizeStatus(l.status) === "SUCCESS" && l.guard_name && l.guard_name !== "-") {
          const names = l.guard_name
            .split(",")
            .map((n) => n.trim())
            .filter((n) => n && n.toUpperCase() !== "SYSTEM_MISSED");
          names.forEach((name) => {
            counts[name] = (counts[name] || 0) + 1;
          });
        }
      });

      return Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([name, scanCount], idx) => ({
          rank: `${idx + 1}${idx === 0 ? "st" : idx === 1 ? "nd" : "rd"}`,
          name,
          scans: scanCount,
        }));
    };

    // Helper: Render Official Header, Daily Summary Box, & Top Performers Row (1 row x 3 columns)
    const drawDateHeader = (dayData: DayData, dayAllLogs: ScanLog[]) => {
      if (LOGO_BASE64) {
        try {
          doc.addImage(LOGO_BASE64, "PNG", pageWidth / 2 - 30, 22, 55, 55);
        } catch (e) {}
      }
      doc.setFont("helvetica", "bold");
      doc.setFontSize(17);
      doc.setTextColor(0);
      doc.text("OFFICIAL SECURITY AUDIT REPORT", pageWidth / 2, 95, { align: "center" });

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.5);
      doc.setTextColor(80);
      doc.text(
        `${campusName} | ${campusAddress} | Code: ${campusCode}`,
        pageWidth / 2,
        109,
        { align: "center" }
      );

      // Summary Box
      doc.setFillColor("#F8FAFC");
      doc.setDrawColor("#CBD5E1");
      doc.setLineWidth(1);
      doc.rect(margin, 118, pageWidth - margin * 2, 32, "FD");

      doc.setFontSize(8.5);
      doc.setTextColor(40);
      doc.setFont("helvetica", "bold");
      doc.text(`Audit Date: ${dayData.date}`, margin + 12, 132);
      doc.setFont("helvetica", "normal");
      doc.text(`Generated By: ${generatedBy}`, margin + 12, 143);

      // Stats on Right
      doc.setFont("helvetica", "bold");
      doc.text(`Total Checkpoints: ${dayData.totalScans}`, pageWidth - margin - 350, 138);
      doc.setTextColor("#16A34A");
      doc.text(`Completed: ${dayData.completedScans}`, pageWidth - margin - 220, 138);
      doc.setTextColor("#DC2626");
      doc.text(`Missed: ${dayData.missedScans}`, pageWidth - margin - 100, 138);

      // ── TOP PERFORMERS: 1 ROW x 3 COLUMNS ──
      const topPerformers = computeTopPerformers(dayAllLogs);
      const topBoxY = 156;
      const topBoxHeight = 44;
      const availableWidth = pageWidth - margin * 2;
      const colGap = 12;
      const colWidth = (availableWidth - colGap * 2) / 3;

      const rankColors = [
        { fill: "#FEF9C3", border: "#CA8A04", text: "#854D0E", badge: "#EAB308", label: "1st Place" },
        { fill: "#F1F5F9", border: "#94A3B8", text: "#334155", badge: "#64748B", label: "2nd Place" },
        { fill: "#FFEDD5", border: "#EA580C", text: "#9A3412", badge: "#F97316", label: "3rd Place" },
      ];

      for (let i = 0; i < 3; i++) {
        const p = topPerformers[i];
        const style = rankColors[i];
        const colX = margin + i * (colWidth + colGap);

        doc.setFillColor(style.fill);
        doc.setDrawColor(style.border);
        doc.setLineWidth(1);
        doc.roundedRect(colX, topBoxY, colWidth, topBoxHeight, 4, 4, "FD");

        // Rank Badge
        doc.setFillColor(style.badge);
        doc.roundedRect(colX + 8, topBoxY + 8, 28, 14, 2, 2, "F");
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.setTextColor("#FFFFFF");
        doc.text(p ? p.rank : `${i + 1}${i === 0 ? "st" : i === 1 ? "nd" : "rd"}`, colX + 22, topBoxY + 18, { align: "center" });

        // Guard Name (BOLD)
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(style.text);
        const displayName = p ? p.name : "No Data";
        // Truncate name if too long for column
        const maxNameLen = 22;
        const safeName = displayName.length > maxNameLen ? displayName.substring(0, maxNameLen) + "..." : displayName;
        doc.text(safeName, colX + 42, topBoxY + 19);

        // Scan count subtitle
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8.5);
        doc.setTextColor("#475569");
        const countText = p ? `${p.scans} Scans Completed` : "0 Scans";
        doc.text(countText, colX + 42, topBoxY + 34);
      }
    };

    // Helper: Minimal Header for Sub-pages of the same date
    const drawDateSubHeader = (dayData: DayData) => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(50);
      doc.text(`Official Security Audit Report — ${campusName} (${campusCode})`, margin, 38);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(100);
      doc.text(`Date: ${dayData.date} | Generated By: ${generatedBy}`, pageWidth - margin, 38, { align: "right" });

      doc.setDrawColor("#E2E8F0");
      doc.setLineWidth(1);
      doc.line(margin, 46, pageWidth - margin, 46);
    };

    // ── 2. PROCESS EACH DATE AND EACH ROUND ON ITS OWN PAGE ──
    let isFirstPage = true;

    sortedDates.forEach((dateKey) => {
      const dayData = logsByDate[dateKey];
      // Collect all logs for this day to compute top performers
      const dayAllLogs: ScanLog[] = [];
      Object.values(dayData.rounds).forEach((rLogs) => dayAllLogs.push(...rLogs));

      const sortedRoundKeys = Object.keys(dayData.rounds).sort(
        (a, b) => Number(a) - Number(b)
      );

      sortedRoundKeys.forEach((roundStr, rIdx) => {
        // EACH ROUND GETS ITS OWN CLEAN PAGE TO COMPLETELY AVOID OVERLAPPING!
        if (!isFirstPage) {
          doc.addPage();
          pageCountRef.current++;
        }
        isFirstPage = false;

        decoratePage(pageCountRef.current, dateKey);

        let currentY = 58;

        // If it's the very first round of this date, draw the full official header + Top Performers
        if (rIdx === 0) {
          drawDateHeader(dayData, dayAllLogs);
          currentY = 216; // Right below top performers box
        } else {
          // Subsequent rounds get the clean sub-header
          drawDateSubHeader(dayData);
          currentY = 62;
        }

        const roundTimeStr = ROUND_TIMES[Number(roundStr)]
          ? `${ROUND_TIMES[Number(roundStr)].start} - ${ROUND_TIMES[Number(roundStr)].end}`
          : "";

        // Round Sub-Header Banner
        doc.setFillColor("#EEF2FF");
        doc.setDrawColor("#C7D2FE");
        doc.setLineWidth(1);
        doc.roundedRect(margin, currentY, pageWidth - margin * 2, 22, 3, 3, "FD");

        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor("#3730A3");
        doc.text(
          `Round ${roundStr} Slot: ${roundTimeStr || "Custom Time"}`,
          margin + 10,
          currentY + 15
        );

        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor("#6366F1");
        doc.text(
          `${dayData.rounds[roundStr].length} Checkpoints`,
          pageWidth - margin - 12,
          currentY + 15,
          { align: "right" }
        );

        currentY += 28;

        // Table Rows
        const tableData = dayData.rounds[roundStr].map((log, index) => {
          const status = normalizeStatus(log.status);
          let displayTime = "-";
          if (log.scan_time) {
            const safeTime = log.scan_time.replace(" ", "T");
            const d = new Date(safeTime);
            if (!isNaN(d.getTime())) {
              displayTime = d.toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
                timeZone: "Asia/Kolkata",
              });
            }
          }

          return [
            (index + 1).toString(),
            log.qr_name || "-",
            log.guard_name || "-",
            displayTime,
            log.lat != null ? String(log.lat) : "-",
            log.lon != null ? String(log.lon) : "-",
            status,
          ];
        });

        autoTable(doc, {
          startY: currentY,
          margin: { right: margin, left: margin, bottom: 50 },
          head: [
            [
              "S.No",
              "QR Checkpoint",
              "Security Guard / Officer",
              "Time Scanned",
              "Latitude",
              "Longitude",
              "Status",
            ],
          ],
          body: tableData,
          theme: "grid",
          headStyles: {
            fillColor: "#4F46E5",
            textColor: "#FFFFFF",
            fontStyle: "bold",
            halign: "center",
            valign: "middle",
          },
          styles: {
            font: "helvetica",
            fontSize: 9,
            valign: "middle",
            cellPadding: 5,
            halign: "center",
          },
          columnStyles: {
            0: { cellWidth: 35 },
            1: { halign: "left", cellWidth: 160 }, // QR Checkpoint
            2: { halign: "left", cellWidth: 260 }, // Security Name
            3: { cellWidth: 90 },
            4: { cellWidth: 70 },
            5: { cellWidth: 70 },
            6: { fontStyle: "bold" },
          },
          didParseCell: (data) => {
            if (data.section === "body" && data.column.index === 6) {
              const status = data.cell.raw;
              if (status === "MISSED") {
                data.cell.styles.fillColor = "#FEE2E2";
                data.cell.styles.textColor = "#DC2626";
              } else if (status === "SUCCESS") {
                data.cell.styles.fillColor = "#DCFCE7";
                data.cell.styles.textColor = "#16A34A";
              } else if (status === "PENDING") {
                data.cell.styles.fillColor = "#FEF3C7";
                data.cell.styles.textColor = "#D97706";
              }
            }
          },
          willDrawCell: (data) => {
            if (data.section === "body") {
              const statusCell = data.row.cells[6];
              const status = statusCell ? statusCell.raw : "";
              if (status === "MISSED") {
                doc.setFillColor("#FEE2E2");
                doc.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height, "F");
              }
            }
          },
          didDrawPage: (data) => {
            if (data.pageNumber > pageCountRef.current) {
              pageCountRef.current = data.pageNumber;
              decoratePage(pageCountRef.current, dateKey);
              drawDateSubHeader(dayData);
            }
          },
        });
      });
    });

    // ── 3. FINAL PASS: PAGE NUMBERS WITH DATE CONTEXT ──
    const totalPages = pageCountRef.current;
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(150);
      const pageDate = pageDateMap[i];
      const pageLabel = sortedDates.length > 1 && pageDate 
        ? `Date: ${pageDate} | Page ${i} of ${totalPages}` 
        : `Page ${i} of ${totalPages}`;

      doc.text(pageLabel, pageWidth - margin - 150, pageHeight - margin + 2, { align: "right" });
    }

    // Dynamic filename
    let filename = `Security_Audit_Report_${reportDate}.pdf`;
    if (sortedDates.length > 1) {
      filename = `Security_Audit_Report_${sortedDates[0]}_to_${sortedDates[sortedDates.length - 1]}.pdf`;
    }

    doc.save(filename);
  };

  return null;
};

export default PatrolReportPDF;
