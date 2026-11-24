"use client";

import { useState, useEffect } from "react";
import QrTable from "@/app/components/qr/QrTable";
import QrForm from "@/app/components/qr/QrForm";
import QrPreview from "@/app/components/qr/QrPreview";
import QrFilters from "@/app/components/qr/QrFilters";
import {
  fetchQRByCampus,
  createQR,
  updateQR,
  deleteQR,
  fetchCampuses,
  QRData,
} from "@/app/api/qr.api";
import { useAuthGuard } from "@/app/services/auth.guard";
import { motion } from "framer-motion";
import { generateSingleQrPdf, generateBulkQrPdf } from "@/app/components/qr/QrPdfGenerator";
import { QRCodeSVG } from "qrcode.react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Map, X, Download, FileSpreadsheet, FileText } from "lucide-react";

// ----------------- TYPES -----------------

export type QRCode = QRData;

export interface Campus {
  campus_code: string;
  campus_name: string;
}

// ----------------- MAIN COMPONENT -----------------

export default function QrCrudPage() {
  const [qrCodes, setQrCodes] = useState<QRCode[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [currentQr, setCurrentQr] = useState<QRCode | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showQrOnly, setShowQrOnly] = useState(false);

  const [isPathwayModalOpen, setIsPathwayModalOpen] = useState(false);
  const [pathwaySelection, setPathwaySelection] = useState<QRCode[]>([]);

  const FIXED_CAMPUS = "KCET01";

  // ----------------- DATA MAPPING -----------------

  const normalizeQR = (data: Partial<QRCode>): QRCode => ({
    qr_id: Number(data.qr_id ?? 0),
    qr_name: data.qr_name ?? "Unnamed QR",
    lat: typeof data.lat === "number" ? data.lat : 0,
    lon: typeof data.lon === "number" ? data.lon : 0,
    status: data.status ?? "inactive",
    created_at: data.created_at,
    campus_code: data.campus_code ?? FIXED_CAMPUS,
    waiting_time:
      typeof data.waiting_time === "number"
        ? data.waiting_time
        : 15,
  });

  const { authorized } = useAuthGuard({ allowedRoles: ['ADMIN'] });

  // ----------------- LOAD DATA -----------------

  const loadQRCodes = async () => {
    if (!authorized) return;
    try {
      const rawData = await fetchQRByCampus(FIXED_CAMPUS);
      const mappedData = rawData.map(normalizeQR);
      setQrCodes(mappedData);
    } catch (err) {
      console.error("Failed to load QR codes:", err);
      setQrCodes([]);
    }
  };

  useEffect(() => {
    if (authorized) {
      loadQRCodes();
    }
  }, [authorized]);

  if (!authorized) {
    return <div className="p-6 text-white min-h-screen bg-[#07071f] flex items-center justify-center">Checking access...</div>;
  }

  // ----------------- HANDLERS -----------------

  const handleAddQr = () => {
    setCurrentQr(null);
    setIsEditMode(false);
    setIsFormOpen(true);
  };

  const handleEditQr = (qr: QRCode) => {
    setCurrentQr(qr);
    setIsEditMode(true);
    setIsFormOpen(true);
  };

  const handleViewQr = (qr: QRCode) => {
    setCurrentQr(qr);
    setIsPreviewOpen(true);
  };

  const handleSaveQr = async (qrData: QRCode) => {
    try {
      const apiData: Omit<QRCode, "qr_id" | "created_at"> = {
        qr_name: qrData.qr_name,
        lat: Number(qrData.lat),
        lon: Number(qrData.lon),
        campus_code: qrData.campus_code,
        status: qrData.status ?? "inactive",
        waiting_time: qrData.waiting_time ?? 15,
      };

      if (isEditMode && currentQr) {
        await updateQR(currentQr.qr_id, apiData);

        const updatedList = qrCodes.map((qr) =>
          qr.qr_id === currentQr.qr_id ? qrData : qr
        );

        setQrCodes(updatedList);
      } else {
        await createQR(apiData);
        await loadQRCodes();
      }

      setIsFormOpen(false);
    } catch (err: unknown) {
      console.error("Save QR failed:", err);
      alert("Failed to save QR");
    }
  };

  const handleToggleStatus = (id: number) => {
    const qr = qrCodes.find((q) => q.qr_id === id);
    if (!qr) return;

    const newStatus =
      qr.status === "active" ? "inactive" : "active";

    handleSaveQr({
      ...qr,
      status: newStatus,
    });
  };

  const handleDeleteQr = async (id: number) => {
    if (!confirm("Are you sure you want to delete this QR?")) return;

    try {
      await deleteQR(id);
      setQrCodes((prev) => prev.filter((q) => q.qr_id !== id));
    } catch (err) {
      console.error("Delete QR failed:", err);
      alert("Failed to delete QR");
    }
  };

  const filteredQrCodes = qrCodes.filter((qr) => {
    const q = searchQuery.toLowerCase();
    return (
      qr.qr_name.toLowerCase().includes(q) ||
      qr.qr_id.toString().includes(q) ||
      qr.status?.toLowerCase().includes(q)
    );
  });

  const generatePathwayPdf = () => {
    if (pathwaySelection.length === 0) {
      alert("Please select at least one QR code for the pathway.");
      return;
    }
    const doc = new jsPDF('landscape', 'pt', 'a4')
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    const margin = 30

    // Header
    doc.setDrawColor(0)
    doc.setLineWidth(2)
    doc.rect(15, 15, pageWidth - 30, pageHeight - 30)

    doc.setFont("helvetica", "bold")
    doc.setFontSize(16)
    doc.setTextColor(0)
    doc.text("KCET Security Systems", margin, 40)

    doc.setFontSize(12)
    doc.setTextColor(100)
    doc.text("Checkpoint Pathway Document", pageWidth - margin, 40, { align: "right" })

    doc.setFontSize(18)
    doc.setTextColor(0)
    doc.text("Campus QR Installation List", pageWidth / 2, 70, { align: "center" })

    doc.setDrawColor(200)
    doc.setLineWidth(1)
    doc.line(margin, 90, pageWidth - margin, 90)

    const tableData = pathwaySelection
      .sort((a, b) => a.qr_name.localeCompare(b.qr_name))
      .map((qr, index) => [
        `${index + 1}`,
        qr.qr_id.toString(),
        qr.qr_name,
        qr.lat?.toString() || '-',
        qr.lon?.toString() || '-',
        (qr as any).waiting_time || '-'
    ]);

    autoTable(doc, {
      startY: 110,
      head: [['S.No', 'QR ID', 'Checkpoint Location Name', 'Latitude', 'Longitude', 'Wait Time (sec)']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: "#4F46E5", textColor: "#FFFFFF", fontStyle: "bold", halign: 'center' },
      styles: { font: "helvetica", fontSize: 10, cellPadding: 6, valign: 'middle' },
      columnStyles: {
        0: { halign: 'center', cellWidth: 40 },
        1: { halign: 'center', fontStyle: 'bold', cellWidth: 60 },
        5: { halign: 'center', cellWidth: 80 }
      },
      didParseCell: (data) => {
        if (data.section === "body" && data.column.index === 5) {
          data.cell.styles.fillColor = "#F1F5F9"
        }
      },
      didDrawPage: (data) => {
        // Redraw outer border for multi-page
        if (data.pageNumber > 1) {
          doc.setDrawColor(0)
          doc.setLineWidth(2)
          doc.rect(15, 15, pageWidth - 30, pageHeight - 30)
        }
      }
    });

    const finalY = (doc as any).lastAutoTable.finalY + 50
    if (finalY < pageHeight - 100) {
      doc.setFont("helvetica", "bold")
      doc.setFontSize(10)
      doc.text("Security Officer Signature: _______________________", margin, finalY)
    }

    doc.save("KCET_Patrol_Pathway.pdf")
    setIsPathwayModalOpen(false)
  };

  // ----------------- DOWNLOAD QR LIST (PDF & CSV) -----------------

  const downloadQrListPdf = () => {
    if (qrCodes.length === 0) {
      alert("No QR codes available to download.");
      return;
    }

    const doc = new jsPDF("landscape", "pt", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 30;

    // Header border
    doc.setDrawColor(0);
    doc.setLineWidth(2);
    doc.rect(15, 15, pageWidth - 30, pageHeight - 30);

    // Title & Institution
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(15, 23, 42);
    doc.text("Kamaraj College of Engineering & Technology (Autonomous)", margin, 42);

    doc.setFontSize(10);
    doc.setTextColor(71, 85, 105);
    doc.setFont("helvetica", "normal");
    doc.text("S.P.G. Chidambara Nadar - C. Nagammal Campus, Vellakulam, Tamil Nadu 625701", margin, 56);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(79, 70, 229);
    doc.text("SECURITY CHECKPOINTS & QR LIST", pageWidth - margin, 42, { align: "right" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(100);
    doc.text(`Total Checkpoints: ${qrCodes.length} | Campus Code: ${FIXED_CAMPUS}`, pageWidth - margin, 56, { align: "right" });

    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(1);
    doc.line(margin, 68, pageWidth - margin, 68);

    const tableData = [...qrCodes]
      .sort((a, b) => a.qr_id - b.qr_id)
      .map((qr, index) => [
        `${index + 1}`,
        qr.qr_id.toString(),
        qr.qr_name,
        qr.lat != null ? Number(qr.lat).toFixed(6) : "-",
        qr.lon != null ? Number(qr.lon).toFixed(6) : "-",
        qr.status ? qr.status.toUpperCase() : "INACTIVE",
        qr.waiting_time ? `${qr.waiting_time}s` : "15s",
      ]);

    autoTable(doc, {
      startY: 80,
      margin: { right: margin, left: margin, bottom: 40 },
      head: [["S.No", "QR ID", "QR Name / Checkpoint Location", "Latitude", "Longitude", "Status", "Wait Time"]],
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
        fontSize: 9.5,
        cellPadding: 5.5,
        valign: "middle",
        halign: "center",
      },
      columnStyles: {
        0: { cellWidth: 40, halign: "center" },
        1: { cellWidth: 60, halign: "center", fontStyle: "bold" },
        2: { halign: "left", cellWidth: 280, fontStyle: "bold" },
        3: { cellWidth: 110, halign: "center" },
        4: { cellWidth: 110, halign: "center" },
        5: { cellWidth: 80, halign: "center", fontStyle: "bold" },
        6: { cellWidth: 70, halign: "center" },
      },
      didParseCell: (data) => {
        if (data.section === "body" && data.column.index === 5) {
          const status = data.cell.raw;
          if (status === "ACTIVE") {
            data.cell.styles.fillColor = "#DCFCE7";
            data.cell.styles.textColor = "#16A34A";
          } else {
            data.cell.styles.fillColor = "#FEE2E2";
            data.cell.styles.textColor = "#DC2626";
          }
        }
      },
      didDrawPage: (data) => {
        doc.setDrawColor(0);
        doc.setLineWidth(2);
        doc.rect(15, 15, pageWidth - 30, pageHeight - 30);

        // Footer
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(
          `Generated on: ${new Date().toLocaleString()} | Page ${data.pageNumber}`,
          margin,
          pageHeight - 20
        );
      },
    });

    doc.save(`KCET_QR_Checkpoints_List_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  const downloadQrListCsv = () => {
    if (qrCodes.length === 0) {
      alert("No QR codes available to download.");
      return;
    }

    const headers = ["S.No", "QR ID", "QR Name", "Latitude", "Longitude", "Status", "Waiting Time (s)", "Campus Code"];
    const rows = [...qrCodes]
      .sort((a, b) => a.qr_id - b.qr_id)
      .map((qr, index) => [
        index + 1,
        qr.qr_id,
        `"${qr.qr_name.replace(/"/g, '""')}"`,
        qr.lat ?? "",
        qr.lon ?? "",
        qr.status ?? "inactive",
        qr.waiting_time ?? 15,
        qr.campus_code ?? FIXED_CAMPUS,
      ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `KCET_QR_Checkpoints_List_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ----------------- RENDER -----------------

  return (
    <div className="min-h-screen relative font-sans text-slate-900 bg-slate-50">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10"
      >
        <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">QR Code Management</h1>
            <p className="mt-1 text-slate-500 text-sm font-medium">Create and manage patrol checkpoints</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowQrOnly(!showQrOnly)}
              className="px-4 py-2.5 bg-slate-100 text-slate-700 font-bold text-sm rounded-xl border border-slate-200 hover:bg-slate-200 transition-all flex items-center gap-2"
            >
              {showQrOnly ? "Show List View" : "Show QR Only"}
            </button>

            {showQrOnly && (
              <button
                onClick={() => generateBulkQrPdf(filteredQrCodes)}
                className="px-4 py-2.5 bg-amber-100 text-amber-700 font-bold text-sm rounded-xl border border-amber-200 hover:bg-amber-200 transition-all flex items-center gap-2"
              >
                📄 Download All QRs
              </button>
            )}

            {/* Download QR List Buttons (PDF & Excel/CSV) */}
            <button
              onClick={downloadQrListPdf}
              title="Download full QR checkpoints list with Name, Lat, Lon, Status"
              className="px-4 py-2.5 bg-indigo-50 text-indigo-700 font-bold text-sm rounded-xl border border-indigo-200 hover:bg-indigo-100 transition-all flex items-center gap-1.5 shadow-sm"
            >
              <FileText size={16} /> Download List (PDF)
            </button>

            <button
              onClick={downloadQrListCsv}
              title="Export QR checkpoints as CSV/Excel"
              className="px-4 py-2.5 bg-blue-50 text-blue-700 font-bold text-sm rounded-xl border border-blue-200 hover:bg-blue-100 transition-all flex items-center gap-1.5 shadow-sm"
            >
              <FileSpreadsheet size={16} /> Export (CSV)
            </button>

            <button
              onClick={() => { setPathwaySelection([]); setIsPathwayModalOpen(true); }}
              className="px-4 py-2.5 bg-emerald-100 text-emerald-700 font-bold text-sm rounded-xl border border-emerald-200 hover:bg-emerald-200 transition-all flex items-center gap-2"
            >
              <Map size={16} /> Pathway PDF
            </button>

            <motion.button
              data-tour="qr-add"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddQr}
              className="px-6 py-2.5 bg-purple-600 text-white font-bold text-sm rounded-xl shadow-lg shadow-purple-500/30 hover:bg-purple-700 hover:shadow-xl hover:shadow-purple-500/40 transition-all duration-200 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Add New Checkpoint
            </motion.button>
          </div>
        </div>

        <div data-tour="qr-list" className="glass-panel rounded-3xl p-6 sm:p-8 min-h-[500px]">
          <div className="mb-6">
            <QrFilters
              value={searchQuery}
              onChange={setSearchQuery}
            />
          </div>

          {showQrOnly ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
              {filteredQrCodes.map((qr) => (
                <div key={qr.qr_id} className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col items-center shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="text-lg font-bold text-slate-800 text-center mb-1">{qr.qr_name}</h3>
                  <p className="text-sm font-mono text-slate-400 mb-6">ID: {qr.qr_id}</p>
                  
                  <div className="bg-white p-2 rounded-xl shadow-sm border border-slate-100 mb-6">
                    <QRCodeSVG 
                      value={String(qr.qr_id)}
                      size={150}
                      level="H"
                    />
                  </div>

                  <button
                    onClick={() => generateSingleQrPdf(qr)}
                    className="w-full py-2 bg-purple-50 text-purple-700 font-bold text-sm rounded-lg hover:bg-purple-100 transition-colors border border-purple-100"
                  >
                    Download as PDF
                  </button>
                </div>
              ))}
              {filteredQrCodes.length === 0 && (
                <div className="col-span-full py-12 text-center text-slate-400">
                  No QRs match your search.
                </div>
              )}
            </div>
          ) : (
            <QrTable
              qrCodes={filteredQrCodes}
              onEdit={handleEditQr}
              onView={handleViewQr}
              onToggleStatus={handleToggleStatus}
              onDelete={handleDeleteQr}
            />
          )}
        </div>
      </motion.div>

      {isFormOpen && (
        <QrForm
          qr={currentQr}
          isEditMode={isEditMode}
          onSave={handleSaveQr}
          onClose={() => setIsFormOpen(false)}
        />
      )}

      {isPreviewOpen && currentQr && (
        <QrPreview
          qr={currentQr}
          onClose={() => setIsPreviewOpen(false)}
        />
      )}

      {isPathwayModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[80vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-lg flex items-center gap-2 text-emerald-800">
                <Map size={20} /> Create QR Pathway
              </h3>
              <button onClick={() => setIsPathwayModalOpen(false)} className="p-1 hover:bg-slate-100 rounded-full">
                <X size={18} className="text-slate-500" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 flex flex-col md:flex-row gap-6 bg-slate-50">
              <div className="flex-1 space-y-4">
                <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Available QRs</h4>
                <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-2">
                  {qrCodes.filter(q => !pathwaySelection.find(s => s.qr_id === q.qr_id)).map(qr => (
                    <button
                      key={qr.qr_id}
                      onClick={() => setPathwaySelection([...pathwaySelection, qr])}
                      className="text-left p-3 bg-white border border-slate-200 rounded-xl hover:border-emerald-400 hover:shadow-sm transition-all text-sm font-semibold text-slate-700"
                    >
                      {qr.qr_name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex-1 space-y-4 border-l border-slate-200 pl-0 md:pl-6">
                <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Selected Pathway Order</h4>
                <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                  {pathwaySelection.length === 0 ? (
                    <p className="text-sm text-slate-400 p-4 text-center border-2 border-dashed border-slate-200 rounded-xl">Click QRs on the left to build a pathway.</p>
                  ) : (
                    pathwaySelection.map((qr, idx) => (
                      <div key={qr.qr_id} className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-100 rounded-xl">
                        <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold">
                          {idx + 1}
                        </div>
                        <span className="flex-1 text-sm font-bold text-emerald-900">{qr.qr_name}</span>
                        <button
                          onClick={() => setPathwaySelection(pathwaySelection.filter(s => s.qr_id !== qr.qr_id))}
                          className="p-1 hover:bg-emerald-200 rounded-lg text-emerald-600"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 bg-white flex justify-end gap-3">
              <button onClick={() => setIsPathwayModalOpen(false)} className="px-5 py-2.5 rounded-xl font-bold text-slate-600 hover:bg-slate-100">Cancel</button>
              <button onClick={generatePathwayPdf} className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md">
                Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
