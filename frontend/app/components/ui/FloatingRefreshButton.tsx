"use client";

import React, { useState } from "react";
import { RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";

export default function FloatingRefreshButton() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const router = useRouter();

  const handleRefresh = () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    // Refresh Next.js server components and client state
    router.refresh();
    // Also trigger full browser reload to ensure freshest cached data
    window.location.reload();
  };

  return (
    <aside
      aria-label="Page controls"
      className="fixed bottom-6 right-6 z-50 flex items-center group pointer-events-auto"
    >
      {/* Tooltip label on hover */}
      <span className="hidden group-hover:inline-block mr-2 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900/90 backdrop-blur-md rounded-xl shadow-lg border border-white/10 transition-all duration-200 pointer-events-none whitespace-nowrap">
        Refresh Page
      </span>

      {/* Floating Refresh Action Button */}
      <button
        type="button"
        onClick={handleRefresh}
        disabled={isRefreshing}
        title="Refresh Page"
        className="relative flex items-center justify-center w-12 h-12 rounded-full text-white bg-gradient-to-tr from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 active:scale-95 shadow-xl hover:shadow-purple-500/30 transition-all duration-200 border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2"
        aria-label="Refresh current page"
      >
        <RefreshCw
          className={`w-5 h-5 text-white transition-transform duration-700 ${
            isRefreshing ? "animate-spin" : "group-hover:rotate-180"
          }`}
        />
      </button>
    </aside>
  );
}
