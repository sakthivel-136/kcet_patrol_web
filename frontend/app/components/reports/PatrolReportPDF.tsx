"use client";
import React, { useEffect, useRef } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { ScanLog } from "../../types/scanlog";
import { ROUND_TIMES } from "./roundtime";
import { LOGO_BASE64 } from "./logoBase64";

interface PatrolReportPDFProps {
  logs: ScanLog[];
  rawReport?: any[];
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
  rawReport,
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
    // ── PORTRAIT A4 CONFIGURATION ──
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "a4",
      compress: true,
    });
    const pageWidth = doc.internal.pageSize.getWidth(); // ~595 pt
    const pageHeight = doc.internal.pageSize.getHeight(); // ~842 pt
    const margin = 24;
    const availableWidth = pageWidth - margin * 2; // ~547 pt

    // ── 1. GROUPING BY DATE & ROUND ──
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

    const sortedDates = Object.keys(logsByDate).sort();

    const pageCountRef = { current: 1 };
    const pageDateMap: Record<number, string> = {};

    // Helper: Decorate Page Border & Footer
    const decoratePage = (pageNum: number, activeDate: string) => {
      doc.setPage(pageNum);
      pageDateMap[pageNum] = activeDate;

      // Outer border
      doc.setDrawColor(0);
      doc.setLineWidth(1.5);
      doc.rect(12, 12, pageWidth - 24, pageHeight - 24);

      // Footer
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(0);
      doc.text("Authorized By: ____________________", margin, pageHeight - margin - 4);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(140);
      doc.text(
        `Generated: ${new Date().toLocaleString()}`,
        margin,
        pageHeight - margin + 8
      );
    };

    // Helper: Compute All Guard Scans from raw database records
    const computeGuardScanCounts = (dayLogs: ScanLog[]) => {
      const counts: Record<string, number> = {};
      const sourceList = rawReport && rawReport.length > 0 ? rawReport : dayLogs;

      sourceList.forEach((l: any) => {
        if (l.scan_time && l.guard_name) {
          const rawGuard = String(l.guard_name).trim();
          if (
            rawGuard &&
            rawGuard !== "-" &&
            rawGuard.toUpperCase() !== "SYSTEM_MISSED"
          ) {
            const names = rawGuard
              .split(",")
              .map((n: string) => n.trim())
              .filter((n: string) => n && n.toUpperCase() !== "SYSTEM_MISSED");
            names.forEach((name: string) => {
              counts[name] = (counts[name] || 0) + 1;
            });
          }
        }
      });

      return counts;
    };

    // Helper: Render Official Portrait Header, Daily Summary Box, Top Performers, & Needs Improvement
    const drawDateHeader = (dayData: DayData, dayAllLogs: ScanLog[]): number => {
      const startY = 20;
      const logoSize = 48;
      const logoX = margin + 4;
      const logoY = startY;

      // ── LEFT: COLLEGE LOGO ──
      if (LOGO_BASE64) {
        try {
          doc.addImage(LOGO_BASE64, "PNG", logoX, logoY, logoSize, logoSize, "college_logo", "FAST");
        } catch (e) {}
      }

      // ── RIGHT: TITLE & ADDRESS (PORTRAIT COMPACT) ──
      const textStartX = logoX + logoSize + 14;

      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(15, 23, 42);
      doc.text("SECURITY ROUNDS REPORT", textStartX, startY + 13);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(9.5);
      doc.setTextColor(30, 41, 59);
      doc.text("Kamaraj College of Engineering & Technology (Autonomous)", textStartX, startY + 26);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(71, 85, 105);
      doc.text(
        "S.P.G. Chidambara Nadar - C. Nagammal Campus, Vellakulam, Tamil Nadu 625701",
        textStartX,
        startY + 38
      );

      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      doc.setTextColor(99, 102, 241);
      doc.text(`Campus Code: ${campusCode}`, textStartX, startY + 48);

      // Separator Line
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(1);
      doc.line(margin, startY + 56, pageWidth - margin, startY + 56);

      // ── SUMMARY METRICS BOX ──
      const summaryY = startY + 62;
      doc.setFillColor("#F8FAFC");
      doc.setDrawColor("#CBD5E1");
      doc.setLineWidth(1);
      doc.rect(margin, summaryY, availableWidth, 24, "FD");

      doc.setFontSize(8);
      doc.setTextColor(40);
      doc.setFont("helvetica", "bold");
      doc.text(`Date: ${dayData.date}`, margin + 8, summaryY + 15);
      doc.setFont("helvetica", "normal");
      doc.text(`By: ${generatedBy}`, margin + 95, summaryY + 15);

      doc.setFont("helvetica", "bold");
      doc.text(`Total: ${dayData.totalScans}`, availableWidth - 170, summaryY + 15);
      doc.setTextColor("#16A34A");
      doc.text(`Completed: ${dayData.completedScans}`, availableWidth - 110, summaryY + 15);
      doc.setTextColor("#DC2626");
      doc.text(`Missed: ${dayData.missedScans}`, availableWidth - 30, summaryY + 15);

      // ── TOP PERFORMERS: 1 ROW x 3 COLUMNS (PORTRAIT SCALED) ──
      const guardCounts = computeGuardScanCounts(dayAllLogs);
      const sortedGuards = Object.entries(guardCounts).sort((a, b) => b[1] - a[1]);

      const topPerformers = sortedGuards.slice(0, 3).map(([name, scanCount], idx) => ({
        rank: `${idx + 1}${idx === 0 ? "st" : idx === 1 ? "nd" : "rd"}`,
        name,
        scans: scanCount,
      }));

      const topBoxY = summaryY + 30;
      const topBoxHeight = 34;
      const colGap = 8;
      const colWidth = (availableWidth - colGap * 2) / 3;

      const rankColors = [
        { fill: "#FEF9C3", border: "#CA8A04", text: "#854D0E", badge: "#EAB308" },
        { fill: "#F1F5F9", border: "#94A3B8", text: "#334155", badge: "#64748B" },
        { fill: "#FFEDD5", border: "#EA580C", text: "#9A3412", badge: "#F97316" },
      ];

      for (let i = 0; i < 3; i++) {
        const p = topPerformers[i];
        const style = rankColors[i];
        const colX = margin + i * (colWidth + colGap);

        doc.setFillColor(style.fill);
        doc.setDrawColor(style.border);
        doc.setLineWidth(0.8);
        doc.roundedRect(colX, topBoxY, colWidth, topBoxHeight, 3, 3, "FD");

        // Rank Badge
        doc.setFillColor(style.badge);
        doc.roundedRect(colX + 5, topBoxY + 6, 22, 11, 2, 2, "F");
        doc.setFont("helvetica", "bold");
        doc.setFontSize(7);
        doc.setTextColor("#FFFFFF");
        doc.text(p ? p.rank : `${i + 1}${i === 0 ? "st" : i === 1 ? "nd" : "rd"}`, colX + 16, topBoxY + 14, { align: "center" });

        // Guard Name
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.setTextColor(style.text);
        const displayName = p ? p.name : "No Data";
        const maxNameLen = 17;
        const safeName = displayName.length > maxNameLen ? displayName.substring(0, maxNameLen) + ".." : displayName;
        doc.text(safeName, colX + 32, topBoxY + 15);

        // Scans Completed
        doc.setFont("helvetica", "bold");
        doc.setFontSize(7);
        doc.setTextColor("#475569");
        const countText = p ? `${p.scans} Scans Completed` : "0 Scans";
        doc.text(countText, colX + 32, topBoxY + 26);
      }

      let currentEndY = topBoxY + topBoxHeight + 8;

      // ── NEEDS IMPROVEMENT SECTION (< 8 SCANS) ──
      const needsImprovementList = sortedGuards
        .filter(([_, count]) => count < 8)
        .map(([name, count]) => ({ name, count }));

      if (needsImprovementList.length > 0) {
        const alertY = currentEndY;
        const textX = margin + 118;
        const maxTextWidth = availableWidth - 128;

        const guardDetails = needsImprovementList
          .map((item) => `${item.name} (${item.count} scans)`)
          .join("   •   ");

        doc.setFont("helvetica", "bold");
        doc.setFontSize(7.5);
        doc.setTextColor("#991B1B");

        const lines: string[] = doc.splitTextToSize(guardDetails, maxTextWidth);
        const lineHeight = 9.5;
        const textBlockHeight = lines.length * lineHeight;
        const alertHeight = Math.max(22, textBlockHeight + 10);

        doc.setFillColor("#FEF2F2");
        doc.setDrawColor("#FCA5A5");
        doc.setLineWidth(0.8);
        doc.roundedRect(margin, alertY, availableWidth, alertHeight, 3, 3, "FD");

        // Badge: Needs Improvement (<8)
        doc.setFillColor("#DC2626");
        doc.roundedRect(margin + 6, alertY + 5, 104, 12, 2, 2, "F");
        doc.setFont("helvetica", "bold");
        doc.setFontSize(6.5);
        doc.setTextColor("#FFFFFF");
        doc.text("NEEDS IMPROVEMENT (<8)", margin + 58, alertY + 13.5, { align: "center" });

        // Draw Lines
        doc.setFont("helvetica", "bold");
        doc.setFontSize(7.5);
        doc.setTextColor("#991B1B");

        lines.forEach((line: string, lineIndex: number) => {
          doc.text(line, textX, alertY + 13 + lineIndex * lineHeight);
        });

        currentEndY = alertY + alertHeight + 8;
      }

      return currentEndY;
    };

    // Helper: Minimal Header for Subsequent Pages
    const drawDateSubHeader = (dayData: DayData) => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9.5);
      doc.setTextColor(30, 41, 59);
      doc.text("Kamaraj College of Engineering & Technology — Security Audit", margin, 28);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(100);
      doc.text(`Date: ${dayData.date} | Code: ${campusCode} | By: ${generatedBy}`, pageWidth - margin, 28, { align: "right" });

      doc.setDrawColor("#E2E8F0");
      doc.setLineWidth(0.8);
      doc.line(margin, 34, pageWidth - margin, 34);
    };

    // ── 2. DYNAMIC TABLE PACKING (PAGE 1: ~3 TABLES, SUBSEQUENT PAGES: ~4 TABLES) ──
    const BOTTOM_MARGIN_LIMIT = pageHeight - 38; // reserve space for footer

    sortedDates.forEach((dateKey, dateIdx) => {
      const dayData = logsByDate[dateKey];
      const dayAllLogs: ScanLog[] = [];
      Object.values(dayData.rounds).forEach((rLogs) => dayAllLogs.push(...rLogs));

      const sortedRoundKeys = Object.keys(dayData.rounds).sort(
        (a, b) => Number(a) - Number(b)
      );

      // Start page for this date
      if (dateIdx > 0) {
        doc.addPage();
        pageCountRef.current++;
      }

      decoratePage(pageCountRef.current, dateKey);
      let currentY = drawDateHeader(dayData, dayAllLogs);

      sortedRoundKeys.forEach((roundStr) => {
        const roundRows = dayData.rounds[roundStr];
        const roundTimeStr = ROUND_TIMES[Number(roundStr)]
          ? `${ROUND_TIMES[Number(roundStr)].start} - ${ROUND_TIMES[Number(roundStr)].end}`
          : "";

        // Estimate required height for this round banner + table
        // Banner: 18pt + Gap: 6pt + Table Head: 16pt + Rows: count * ~13.5pt + Padding: 12pt
        const estimatedTableHeight = 18 + 6 + 16 + (roundRows.length * 13.5) + 12;

        // If this table doesn't fit in the remaining space of current page, start a fresh page!
        if (currentY + estimatedTableHeight > BOTTOM_MARGIN_LIMIT) {
          doc.addPage();
          pageCountRef.current++;
          decoratePage(pageCountRef.current, dateKey);
          drawDateSubHeader(dayData);
          currentY = 44;
        }

        // Render Compact Round Banner
        doc.setFillColor("#EEF2FF");
        doc.setDrawColor("#C7D2FE");
        doc.setLineWidth(0.8);
        doc.roundedRect(margin, currentY, availableWidth, 17, 2.5, 2.5, "FD");

        doc.setFont("helvetica", "bold");
        doc.setFontSize(8.5);
        doc.setTextColor("#3730A3");
        doc.text(
          `Round ${roundStr} Slot: ${roundTimeStr || "Custom Time"}`,
          margin + 8,
          currentY + 11.5
        );

        doc.setFont("helvetica", "normal");
        doc.setFontSize(7.5);
        doc.setTextColor("#6366F1");
        doc.text(
          `${roundRows.length} Checkpoints`,
          pageWidth - margin - 8,
          currentY + 11.5,
          { align: "right" }
        );

        currentY += 21;

        // Prepare table data
        const tableData = roundRows.map((log, index) => {
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
            log.lat != null ? Number(log.lat).toFixed(4) : "-",
            log.lon != null ? Number(log.lon).toFixed(4) : "-",
            status,
          ];
        });

        // Portrait table: width fits ~547 pt cleanly without crowding
        autoTable(doc, {
          startY: currentY,
          margin: { right: margin, left: margin, bottom: 36 },
          head: [
            [
              "S.No",
              "QR Checkpoint Location",
              "Security Guard / Officer",
              "Time",
              "Lat",
              "Lon",
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
            fontSize: 7.5,
            cellPadding: 2.5,
          },
          styles: {
            font: "helvetica",
            fontSize: 7.5,
            valign: "middle",
            cellPadding: 2.5,
            halign: "center",
            lineColor: [226, 232, 240],
            lineWidth: 0.5,
          },
          columnStyles: {
            0: { cellWidth: 26, halign: "center" },
            1: { halign: "left", cellWidth: 155 },
            2: { halign: "left", cellWidth: 168 },
            3: { cellWidth: 54 },
            4: { cellWidth: 44, fontSize: 6.5 },
            5: { cellWidth: 44, fontSize: 6.5 },
            6: { cellWidth: 56, fontStyle: "bold" },
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
          didDrawPage: (data) => {
            if (data.pageNumber > pageCountRef.current) {
              pageCountRef.current = data.pageNumber;
              decoratePage(pageCountRef.current, dateKey);
              drawDateSubHeader(dayData);
            }
          },
        });

        // Update currentY to point directly after the table + comfortable spacing
        currentY = ((doc as any).lastAutoTable?.finalY ?? currentY) + 12;
      });
    });

    // ── 3. FINAL PASS: DYNAMIC PAGE NUMBERING ──
    const totalPages = pageCountRef.current;
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(140);
      const pageDate = pageDateMap[i];
      const pageLabel =
        sortedDates.length > 1 && pageDate
          ? `Date: ${pageDate} | Page ${i} of ${totalPages}`
          : `Page ${i} of ${totalPages}`;

      doc.text(pageLabel, pageWidth - margin - 8, pageHeight - margin + 8, { align: "right" });
    }

    let filename = `Security_Audit_Report_${reportDate}.pdf`;
    if (sortedDates.length > 1) {
      filename = `Security_Audit_Report_${sortedDates[0]}_to_${sortedDates[sortedDates.length - 1]}.pdf`;
    }

    doc.save(filename);
  };

  return null;
};

export default PatrolReportPDF;
