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
  generatedBy: string;
}

const PatrolReportPDF: React.FC<PatrolReportPDFProps> = ({
  logs,
  shifts,
  campusCode,
  campusName,
  campusAddress,
  reportDate,
  generatedBy,
}) => {
  const generatedRef = useRef(false);

  useEffect(() => {
    if (generatedRef.current) return;
    if (!logs || logs.length === 0) return;
    if (!Object.keys(ROUND_TIMES).length) return;
    if (!generatedBy || generatedBy.trim() === "") return;
    generatedRef.current = true;
    generatePDF();
  }, [logs, campusCode, campusName, campusAddress, reportDate, generatedBy]);

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

    let totalRounds = 0;
    let completedRounds = 0;
    let missedRounds = 0;
    let partialRounds = 0;

    // Group logs by round
    const logsByRound: Record<string, ScanLog[]> = {};
    logs.forEach(log => {
      const r = log.round?.toString() || "Unknown";
      if (!logsByRound[r]) logsByRound[r] = [];
      logsByRound[r].push(log);
    });

    const tableData = Object.keys(logsByRound)
      .sort((a, b) => Number(a) - Number(b))
      .map((roundStr, index) => {
        totalRounds++;
        const roundLogs = logsByRound[roundStr];
        
        let successCount = 0;
        let guards = new Set<string>();
        
        roundLogs.forEach(log => {
          if (normalizeStatus(log.status) === "SUCCESS") successCount++;
          if (log.guard_name) guards.add(log.guard_name);
        });

        const totalQRs = roundLogs.length;
        const completionRate = totalQRs > 0 ? (successCount / totalQRs) * 100 : 0;
        
        let roundStatus = "MISSED";
        if (completionRate === 100) {
            roundStatus = "SUCCESS";
            completedRounds++;
        } else if (completionRate >= 50) {
            roundStatus = "PARTIAL";
            partialRounds++;
        } else {
            missedRounds++;
        }

        const roundTimeStr = ROUND_TIMES[Number(roundStr)] 
          ? `${ROUND_TIMES[Number(roundStr)].start} - ${ROUND_TIMES[Number(roundStr)].end}`
          : "N/A";

        return [
          (index + 1).toString(),
          `Round ${roundStr}`,
          roundTimeStr,
          Array.from(guards).join(", ") || "N/A",
          `${successCount} / ${totalQRs}`,
          `${completionRate.toFixed(0)}%`,
          roundStatus
        ];
      });

    autoTable(doc, {
      startY: 180,
      margin: { top: 60, right: margin, bottom: 60, left: margin },
      head: [["S.No", "Round", "Window", "Guards Present", "Checkpoints Scanned", "Completion %", "Overall Status"]],
      body: tableData,
      theme: "grid",
      headStyles: { fillColor: "#4F46E5", textColor: "#FFFFFF", fontStyle: "bold", halign: "center", valign: "middle" },
      styles: { font: "helvetica", fontSize: 11, valign: "middle", cellPadding: 8, halign: 'center' },
      columnStyles: {
        3: { halign: "left" },
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
          } else if (status === "PARTIAL") {
            data.cell.styles.fillColor = "#FEF3C7";
            data.cell.styles.textColor = "#D97706";
          }
        }
      },
      didDrawPage: (data) => {
        // PAGE BORDER
        doc.setDrawColor(0);
        doc.setLineWidth(2);
        doc.rect(15, 15, pageWidth - 30, pageHeight - 30);

        if (data.pageNumber === 1) {
          // HEADER
          if (LOGO_BASE64) {
            try { doc.addImage(LOGO_BASE64, "PNG", pageWidth / 2 - 30, 25, 60, 60); } catch (e) {}
          }
          doc.setFont("helvetica", "bold");
          doc.setFontSize(18);
          doc.setTextColor(0);
          doc.text("OFFICIAL ROUND-WISE SECURITY REPORT", pageWidth / 2, 105, { align: "center" });

          doc.setFont("helvetica", "normal");
          doc.setFontSize(10);
          doc.setTextColor(80);
          doc.text(`${campusName} | ${campusAddress} | Code: ${campusCode}`, pageWidth / 2, 120, { align: "center" });

          // Summary Box
          doc.setFillColor("#F8FAFC");
          doc.setDrawColor("#E2E8F0");
          doc.setLineWidth(1);
          doc.rect(margin, 135, pageWidth - (margin * 2), 35, "FD");

          doc.setFontSize(9);
          doc.setTextColor(40);
          doc.text(`Report Date: ${reportDate}`, margin + 10, 150);
          doc.text(`Generated By: ${generatedBy}`, margin + 10, 162);

          doc.setFont("helvetica", "bold");
          doc.text(`Total Rounds: ${totalRounds}`, pageWidth - margin - 350, 156);
          doc.setTextColor("#16A34A");
          doc.text(`Completed: ${completedRounds}`, pageWidth - margin - 250, 156);
          doc.setTextColor("#D97706");
          doc.text(`Partial: ${partialRounds}`, pageWidth - margin - 150, 156);
          doc.setTextColor("#DC2626");
          doc.text(`Missed: ${missedRounds}`, pageWidth - margin - 60, 156);
        }

        // FOOTER
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(0);
        doc.text("Authorized By: ____________________", margin, pageHeight - margin - 10);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(`Report Generated on: ${new Date().toLocaleString()}`, margin, pageHeight - margin + 2);

        const str = "Page " + (doc as any).internal.getNumberOfPages();
        doc.text(str, pageWidth - margin - 40, pageHeight - margin);
      }
    });

    doc.save(`Roundwise_Security_Report_${reportDate}.pdf`);
  };

  return null;
};

export default PatrolReportPDF;
