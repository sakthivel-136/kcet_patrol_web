"use client";

import { useState, useEffect } from "react";
import { QRCode, Campus } from "@/app/dashboard/qr-crud/page";
import { X, MapPin, Save, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface QrFormProps {
  qr: QRCode | null;
  isEditMode: boolean;
  onSave: (qrData: QRCode) => Promise<void>;
  onClose: () => void;
}

export default function QrForm({ qr, isEditMode, onSave, onClose }: QrFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [waitingTimeInput, setWaitingTimeInput] = useState<string>("15");
  const FIXED_CAMPUS = "KCET01";

  // Initialize form state
  const [formData, setFormData] = useState<QRCode>({
    qr_id: 0,
    qr_name: "",
    lat: 0,
    lon: 0,
    status: isEditMode ? "inactive" : "active",
    campus_code: FIXED_CAMPUS,
    waiting_time: 15,
  });

  // Populate form when editing or when campuses load
  useEffect(() => {
    if (qr) {
      const wt = qr.waiting_time ?? 15;
      setFormData({ ...qr, waiting_time: wt });
      setWaitingTimeInput(wt.toString());
    }
  }, [qr]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.qr_name) {
      alert("Please fill in Name.");
      return;
    }

    // Process waiting_time input
    const trimmedInput = waitingTimeInput.trim();
    let finalWaitingTime = 15; // default if empty

    if (trimmedInput !== "") {
      const parsed = parseInt(trimmedInput, 10);
      if (isNaN(parsed) || parsed < 0) {
        alert("Waiting time must be a non-negative number.");
        return;
      }
      if (parsed === 0) {
        alert("Waiting time cannot be 0.");
        return;
      }
      finalWaitingTime = parsed;
    }

    const updatedFormData = {
      ...formData,
      campus_code: FIXED_CAMPUS,
      waiting_time: finalWaitingTime,
    };

    setIsSubmitting(true);
    try {
      await onSave(updatedFormData);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-lg bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden flex flex-col z-[101]"
        >
          {/* Header */}
          <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-white/50">
            <div>
              <h3 className="text-xl font-bold text-slate-800 tracking-tight">
                {isEditMode ? "Edit QR Code" : "Add QR Code"}
              </h3>
              <p className="text-xs font-medium text-slate-500 mt-1">
                {isEditMode ? "Update checkpoint details." : "Register a new checkpoint."}
              </p>
            </div>
            <button
              onClick={onClose}
              className="h-9 w-9 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">

          {/* QR Name */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">QR Name / Code</label>
            <input
              type="text"
              value={formData.qr_name}
              onChange={(e) => setFormData({ ...formData, qr_name: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 font-medium rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 hover:bg-white hover:border-slate-300 transition-all"
              placeholder="e.g. Main Entrance A"
              required
            />
          </div>

          {/* Coordinates */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-blue-600" />
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">GPS Coordinates</label>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                step="any"
                value={formData.lat}
                onChange={(e) => setFormData({ ...formData, lat: parseFloat(e.target.value) || 0 })}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 font-medium rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 hover:bg-white hover:border-slate-300 transition-all"
                placeholder="Latitude"
                required
              />
              <input
                type="number"
                step="any"
                value={formData.lon}
                onChange={(e) => setFormData({ ...formData, lon: parseFloat(e.target.value) || 0 })}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 font-medium rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 hover:bg-white hover:border-slate-300 transition-all"
                placeholder="Longitude"
                required
              />
            </div>
          </div>

          {/* Waiting Time */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Waiting Time (seconds)</label>
            <input
              type="text"
              value={waitingTimeInput}
              onChange={(e) => setWaitingTimeInput(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 font-medium rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 hover:bg-white hover:border-slate-300 transition-all"
              required
            />
          </div>

          {/* Status - Only show on edit */}
          {isEditMode && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Status</label>
              <div className="relative group">
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-800 font-medium rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 hover:bg-white transition-all cursor-pointer shadow-sm"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400 group-hover:text-indigo-500 transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl text-slate-600 font-semibold text-sm hover:bg-slate-100 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-sm shadow-sm hover:bg-indigo-700 hover:shadow-md transition-all flex items-center gap-2 disabled:opacity-70"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {isSubmitting ? "Saving..." : "Save QR Code"}
            </button>
          </div>
        </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
