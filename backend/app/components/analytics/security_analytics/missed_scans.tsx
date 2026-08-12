"use client";

import { useEffect, useState } from "react";
import {
  getMissedScans,
  MissedScansResponse,
} from "@/app/api/analytics.api";

interface MissedScansProps {
  campusCode: string;
}

export default function MissedScans({ campusCode }: MissedScansProps) {
  const [data, setData] = useState<MissedScansResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    getMissedScans(campusCode)
      .then((res) => setData(res))
      .catch(() => setError("Failed to load missed scans"))
      .finally(() => setLoading(false));
  }, [campusCode]);

  if (loading) return <p>Loading missed scans...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!data) return null;

  return (
    <div className="rounded-xl bg-white p-4 shadow">
      <h2 className="mb-2 text-lg font-semibold">
        Missed Scan Points ({data.missed_scan_count})
      </h2>

      {data.missed_scan_points.length === 0 ? (
        <p className="text-green-600">No missed scans 🎉</p>
      ) : (
        <ul className="list-disc pl-5 text-sm">
          {data.missed_scan_points.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
