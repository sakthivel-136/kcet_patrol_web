import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { LOGO_BASE64 } from './logoBase64';

export const generateTimetablePDF = (shifts: any[], guards: any[], allocations: any[], campusName: string = "KCET Campus") => {
  const doc = new jsPDF('portrait', 'pt', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 30;

  // Header configuration
  const drawHeader = (doc: jsPDF) => {
    // 2px Border
    doc.setDrawColor(0);
    doc.setLineWidth(2);
    doc.rect(15, 15, pageWidth - 30, pageHeight - 30);

    if (LOGO_BASE64) {
      try { doc.addImage(LOGO_BASE64, "PNG", margin, 25, 45, 45); } catch (e) {}
    }
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(0);
    doc.text("MASTER SHIFT ALLOCATION", pageWidth - margin, 45, { align: "right" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(new Date().toLocaleDateString(), pageWidth - margin, 60, { align: "right" });

    doc.setDrawColor(200);
    doc.setLineWidth(1);
    doc.line(margin, 80, pageWidth - margin, 80);
  };

  drawHeader(doc);

  let currentY = 100;

  shifts.forEach((shift, index) => {
    // Add page if needed
    if (currentY > pageHeight - 150) {
      doc.addPage();
      drawHeader(doc);
      currentY = 100;
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(40);
    const shiftTime = `${shift.start_time.substring(0,5)} to ${shift.end_time.substring(0,5)}`;
    doc.text(`${shift.shift_name.toUpperCase()} (${shiftTime})`, margin, currentY);
    currentY += 15;

    const shiftAllocations = allocations.filter(a => a.shift_id === shift.shift_id);
    const assignedGuardIds = shiftAllocations.map(a => a.guard_id);
    const assignedGuards = guards.filter(g => assignedGuardIds.includes(g.security_id));

    if (assignedGuards.length === 0) {
      doc.setFont("helvetica", "italic");
      doc.setFontSize(10);
      doc.setTextColor(150);
      doc.text("No guards assigned to this shift", margin, currentY);
      currentY += 30;
      return;
    }

    const tableData = assignedGuards.map(g => [g.security_id, g.username]);

    autoTable(doc, {
      startY: currentY,
      head: [["Guard ID", "Guard Name"]],
      body: tableData,
      theme: "grid",
      margin: { left: margin, right: margin, bottom: 50 },
      headStyles: { fillColor: "#F3F4F6", textColor: "#1F2937", fontStyle: "bold" },
      styles: { font: "helvetica", fontSize: 10, cellPadding: 6 },
      alternateRowStyles: { fillColor: "#F9FAFB" },
      pageBreak: "auto",
      didDrawPage: (data) => {
        // Redraw border on new pages created by autoTable
        if (data.pageNumber > 1) {
          doc.setDrawColor(0);
          doc.setLineWidth(2);
          doc.rect(15, 15, pageWidth - 30, pageHeight - 30);
        }
      }
    });

    currentY = (doc as any).lastAutoTable.finalY + 30;
  });

  // Footer on all pages
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, margin, pageHeight - 20);
    doc.text(`Page ${i} of ${pageCount}`, pageWidth - margin, pageHeight - 20, { align: "right" });
  }

  doc.save(`Shift_Roster_${new Date().toISOString().split('T')[0]}.pdf`);
};
