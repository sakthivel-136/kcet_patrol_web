import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { LOGO_BASE64 } from './logoBase64';

export const generateTimetablePDF = (shifts: any[], guards: any[], allocations: any[], campusName: string = "KCET Campus") => {
  const doc = new jsPDF('p', 'mm', 'a4');
  const width = doc.internal.pageSize.getWidth();
  
  // Header
  if (LOGO_BASE64) {
    try {
      doc.addImage(LOGO_BASE64, 'PNG', 14, 15, 25, 25);
    } catch (e) {
      console.warn("Logo rendering failed", e);
    }
  }

  doc.setFont("times", "bold");
  doc.setFontSize(22);
  doc.setTextColor(40);
  doc.text("SECURITY SHIFT TIMETABLE", width / 2, 25, { align: "center" });

  doc.setFontSize(12);
  doc.setFont("times", "normal");
  doc.setTextColor(100);
  doc.text(campusName.toUpperCase(), width / 2, 32, { align: "center" });

  // Add line
  doc.setDrawColor(200);
  doc.setLineWidth(0.5);
  doc.line(14, 45, width - 14, 45);

  let startY = 55;

  // Process data for table
  const tableData: any[] = [];
  
  shifts.forEach(shift => {
    // Find allocations for this shift
    const shiftAllocations = allocations.filter(a => a.shift_id === shift.shift_id);
    const assignedGuardIds = shiftAllocations.map(a => a.guard_id);
    
    // Find the guard names
    const assignedGuards = guards
      .filter(g => assignedGuardIds.includes(g.security_id))
      .map(g => g.username)
      .join(", ");
      
    tableData.push([
      shift.shift_name.toUpperCase(),
      `${shift.start_time.substring(0,5)} - ${shift.end_time.substring(0,5)}`,
      assignedGuards || "UNASSIGNED"
    ]);
  });

  autoTable(doc, {
    startY,
    head: [['SHIFT NAME', 'TIMINGS', 'ASSIGNED SECURITY GUARDS']],
    body: tableData,
    theme: 'grid',
    styles: { font: 'times', fontSize: 11, cellPadding: 5 },
    headStyles: { fillColor: [80, 40, 150], textColor: 255, fontStyle: 'bold', halign: 'center' },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 50 },
      1: { cellWidth: 40, halign: 'center' },
      2: { cellWidth: 'auto' }
    },
    alternateRowStyles: { fillColor: [245, 245, 250] },
    margin: { left: 14, right: 14 }
  });

  // Footer
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(9);
    doc.setTextColor(150);
    doc.text(
      `Generated on ${new Date().toLocaleString()}  |  Page ${i} of ${pageCount}`,
      width / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }

  // Download
  doc.save(`Shift_Timetable_${new Date().toISOString().split('T')[0]}.pdf`);
};
