"use client";

import { useState, useEffect } from "react";
import QrTable from "@/app/components/qr/QrTable";
import QrForm from "@/app/components/qr/QrForm";
import QrPreview from "@/app/components/qr/QrPreview";
import QrFilters from "@/app/components/qr/QrFilters";
import {
  fetchQRByFactory,
  createQR,
  updateQR,
  deleteQR,
  fetchFactories,
  QRData,
} from "@/app/api/qr.api";
import { useAuthGuard } from "@/app/services/auth.guard";

// ----------------- TYPES -----------------

export type QRCode = QRData;

export interface Factory {
  factory_code: string;
  factory_name: string;
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
    factory_code: data.factory_code ?? FIXED_CAMPUS,
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
      const rawData = await fetchQRByFactory(FIXED_CAMPUS);
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
        factory_code: qrData.factory_code,
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
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-0">
            QR Codes
          </h1>
          <button
            onClick={handleAddQr}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Add QR
          </button>
        </div>

        <div className="mb-4">
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
    </div>
  );
}
