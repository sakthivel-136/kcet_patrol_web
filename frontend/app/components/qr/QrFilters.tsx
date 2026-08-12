"use client";

import { Search } from "lucide-react"; // Professional icons

interface QrFiltersProps {
  value: string; 
  onChange: (searchQuery: string) => void;
}

export default function QrFilters({ value, onChange }: QrFiltersProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition-shadow duration-300 flex items-center gap-4">
      
      {/* Label with Icon */}
      <div className="flex items-center gap-2">
        <Search className="w-5 h-5 text-blue-600" />
        <label className="text-sm font-bold text-slate-700 uppercase tracking-wider whitespace-nowrap">
          Search QR
        </label>
      </div>

      {/* Custom Styled Input */}
      <div className="relative flex-1 group">
        <input
          type="text"
          placeholder="Search by QR code, location name, or ID..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-800 font-medium rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 hover:bg-white hover:border-blue-300 transition-all"
        />
      </div>

    </div>
  );
}