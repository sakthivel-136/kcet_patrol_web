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
          <motion.button
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

        <div className="glass-panel rounded-3xl p-6 sm:p-8 min-h-[500px]">
          <div className="mb-6">
            <QrFilters
              value={searchQuery}
              onChange={setSearchQuery}
            />
          </div>

          <QrTable
            qrCodes={filteredQrCodes}
            onEdit={handleEditQr}
            onView={handleViewQr}
            onToggleStatus={handleToggleStatus}
            onDelete={handleDeleteQr}
          />
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
    </div>
  );
}
