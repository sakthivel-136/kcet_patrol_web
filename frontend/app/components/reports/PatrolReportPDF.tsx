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
      // Determine date key
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

      // 2px Page Border
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

    // Helper: Render Official Header & Daily Summary Box
    const drawDateHeader = (dayData: DayData) => {
      if (LOGO_BASE64) {
        try {
          doc.addImage(LOGO_BASE64, "PNG", pageWidth / 2 - 30, 25, 60, 60);
        } catch (e) {}
      }
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.setTextColor(0);
      doc.text("OFFICIAL SECURITY AUDIT REPORT", pageWidth / 2, 105, { align: "center" });

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(80);
      doc.text(
        `${campusName} | ${campusAddress} | Code: ${campusCode}`,
        pageWidth / 2,
        120,
        { align: "center" }
      );

      // Summary Box
      doc.setFillColor("#F8FAFC");
      doc.setDrawColor("#E2E8F0");
      doc.setLineWidth(1);
      doc.rect(margin, 135, pageWidth - margin * 2, 38, "FD");

      doc.setFontSize(9);
      doc.setTextColor(40);
      doc.setFont("helvetica", "bold");
      doc.text(`Audit Date: ${dayData.date}`, margin + 12, 151);
      doc.setFont("helvetica", "normal");
      doc.text(`Generated By: ${generatedBy}`, margin + 12, 164);

      // Stats on Right
      doc.setFont("helvetica", "bold");
      doc.text(`Total Checkpoints: ${dayData.totalScans}`, pageWidth - margin - 350, 158);
      doc.setTextColor("#16A34A");
      doc.text(`Completed: ${dayData.completedScans}`, pageWidth - margin - 220, 158);
      doc.setTextColor("#DC2626");
      doc.text(`Missed: ${dayData.missedScans}`, pageWidth - margin - 100, 158);
    };

    // ── 2. PROCESS EACH DATE SEPARATELY ──
    sortedDates.forEach((dateKey, dateIndex) => {
      const dayData = logsByDate[dateKey];

      // If not the very first page of the document, add a brand new page for this new date!
      if (dateIndex > 0) {
        doc.addPage();
        pageCountRef.current++;
      }

      // Initialize the new day's first page
      decoratePage(pageCountRef.current, dateKey);
      drawDateHeader(dayData);

      let currentY = 205;

      // Draw all rounds belonging to THIS date
      const sortedRoundKeys = Object.keys(dayData.rounds).sort(
        (a, b) => Number(a) - Number(b)
      );

      sortedRoundKeys.forEach((roundStr) => {
        // If too close to the bottom for a new round table, push to next page
        if (currentY > pageHeight - 120) {
          doc.addPage();
          pageCountRef.current++;
          decoratePage(pageCountRef.current, dateKey);
          currentY = 60;
        }

        const roundTimeStr = ROUND_TIMES[Number(roundStr)]
          ? `${ROUND_TIMES[Number(roundStr)].start} - ${ROUND_TIMES[Number(roundStr)].end}`
          : "";

        // Round Sub-Header
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.setTextColor(40);
        doc.text(
          `Round ${roundStr} ${roundTimeStr ? `(${roundTimeStr})` : ""}`,
          margin,
          currentY
        );
        currentY += 15;

        const tableData = dayData.rounds[roundStr].map((log, index) => {
          const status = normalizeStatus(log.status);
          return [
            (index + 1).toString(),
            log.qr_name || "-",
            log.guard_name || "-",
            log.scan_time ? new Date(log.scan_time).toLocaleTimeString() : "-",
            log.lat != null ? String(log.lat) : "-",
            log.lon != null ? String(log.lon) : "-",
            status,
          ];
        });

        autoTable(doc, {
          startY: currentY,
          margin: { right: margin, left: margin, bottom: 60 },
          head: [
            [
              "S.No",
              "QR Checkpoint",
              "Security Name",
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
            fontSize: 10,
            valign: "middle",
            cellPadding: 6,
            halign: "center",
          },
          columnStyles: {
            1: { halign: "left" }, // QR Checkpoint
            2: { halign: "left" }, // Security Name
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
            // When autoTable automatically creates an additional page
            if (data.pageNumber > pageCountRef.current) {
              pageCountRef.current = data.pageNumber;
              decoratePage(pageCountRef.current, dateKey);
            }
          },
        });

        currentY = ((doc as any).lastAutoTable?.finalY ?? currentY) + 35;
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
