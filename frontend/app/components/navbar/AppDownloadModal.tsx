"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download, Smartphone } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

interface AppDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DOWNLOAD_LINK = "https://drive.google.com/uc?export=download&id=1rrWO82bIRMvD3H1euaC1e9wMptplt9JR";

export default function AppDownloadModal({ isOpen, onClose }: AppDownloadModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative z-[101] w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col items-center p-8 text-center"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 rounded-full transition-colors"
          >
            <X size={20} />
          </button>

          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 mb-6">
            <Smartphone size={32} />
          </div>

          <h2 className="text-2xl font-bold text-slate-800 tracking-tight mb-2">
            Get the Patrol App
          </h2>
          <p className="text-slate-500 mb-8 font-medium">
            This is the app you have to download for the scan and the security usage.
          </p>

          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-4 inline-block">
            <QRCodeSVG
              value={DOWNLOAD_LINK}
              size={200}
              bgColor="#FFFFFF"
              fgColor="#000000"
              level="H"
            />
          </div>
          
          <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-6">
            Scan this QR to download
          </p>

          <a
            href={DOWNLOAD_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="group w-full relative overflow-hidden bg-purple-600 hover:bg-purple-700 text-white px-6 py-3.5 rounded-xl text-base font-semibold transition-all shadow-lg hover:shadow-purple-500/30 flex items-center justify-center gap-2"
          >
            <Download size={20} className="group-hover:-translate-y-1 transition-transform" />
            Click this button to download that app
          </a>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
