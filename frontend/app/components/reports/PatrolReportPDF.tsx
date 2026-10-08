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

    let totalScans = logs.length;
    let completedScans = 0;
    let missedScans = 0;

    const tableData = logs.map((log, index) => {
      const status = normalizeStatus(log.status);
      if (status === "SUCCESS") completedScans++;
      if (status === "MISSED") missedScans++;

      return [
        (index + 1).toString(),
        reportDate,
        log.round ? `Round ${log.round}` : "Unknown",
        "-",
        log.guard_name || "N/A",
        log.qr_name || "N/A",
        log.scan_time ? new Date(log.scan_time).toLocaleTimeString() : "-",
        status
      ];
    });

    autoTable(doc, {
      startY: 180, // Starts below the summary box
      margin: { top: 60, right: margin, bottom: 60, left: margin },
      head: [["S.No", "Date", "Round Slot", "Shift", "Guard Name", "Checkpoint (QR)", "Time Scanned", "Status"]],
      body: tableData,
      theme: "grid",
      headStyles: { fillColor: "#4F46E5", textColor: "#FFFFFF", fontStyle: "bold", halign: "center", valign: "middle" },
      styles: { font: "helvetica", fontSize: 10, valign: "middle", cellPadding: 6 },
      columnStyles: {
        0: { cellWidth: 40, halign: "center" },
        7: { cellWidth: 70, halign: "center", fontStyle: "bold" },
      },
      didParseCell: (data) => {
        if (data.section === "body" && data.column.index === 7) {
          const status = data.cell.raw;
          if (status === "MISSED") {
            data.cell.styles.fillColor = "#FEE2E2";
            data.cell.styles.textColor = "#DC2626";
          } else if (status === "SUCCESS") {
            data.cell.styles.textColor = "#16A34A";
          }
        }
      },
      willDrawCell: (data) => {
        // Highlight entire row if missed
        if (data.section === "body") {
          const status = tableData[data.row.index][7];
          if (status === "MISSED") {
            doc.setFillColor("#FEE2E2");
            doc.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height, "F");
          }
        }
      },
      didDrawCell: (data) => {
        // Custom thick border for round slot changes
        if (data.section === "body" && data.row.index > 0) {
          const currentRound = tableData[data.row.index][2];
          const prevRound = tableData[data.row.index - 1][2];
          if (currentRound !== prevRound) {
            doc.setDrawColor("#475569");
            doc.setLineWidth(1.5);
            doc.line(data.cell.x, data.cell.y, data.cell.x + data.cell.width, data.cell.y);
          }
        }
      },
      didDrawPage: (data) => {
        // PAGE BORDER
        doc.setDrawColor(0);
        doc.setLineWidth(2);
        doc.rect(15, 15, pageWidth - 30, pageHeight - 30);

        if (data.pageNumber === 1) {
          // HEADER - Only on Page 1
          if (LOGO_BASE64) {
            try { doc.addImage(LOGO_BASE64, "PNG", pageWidth / 2 - 30, 25, 60, 60); } catch (e) {}
          }
          doc.setFont("helvetica", "bold");
          doc.setFontSize(18);
          doc.setTextColor(0);
          doc.text("OFFICIAL SECURITY AUDIT REPORT", pageWidth / 2, 105, { align: "center" });

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
          doc.text(`Total Scans: ${totalScans}`, pageWidth - margin - 200, 156);
          doc.setTextColor("#16A34A");
          doc.text(`Completed: ${completedScans}`, pageWidth - margin - 130, 156);
          doc.setTextColor("#DC2626");
          doc.text(`Missed: ${missedScans}`, pageWidth - margin - 60, 156);
        }

        // FOOTER - On Every Page
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(0);
        doc.text("Authorized By: ____________________", margin, pageHeight - margin - 10);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(`Report Generated on: ${new Date().toLocaleString()}`, margin, pageHeight - margin + 2);

        // Page Number
        const str = "Page " + (doc as any).internal.getNumberOfPages();
        doc.text(str, pageWidth - margin - 40, pageHeight - margin);
      }
    });

    doc.save(`Security_Audit_Report_${reportDate}.pdf`);
  };

  return null;
};

export default PatrolReportPDF;
