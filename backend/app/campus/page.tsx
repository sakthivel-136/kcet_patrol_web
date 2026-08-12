'use client';
import { CampusesTable } from '@/app/components/campus/CampusesTable';

export default function CampusPage() {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Campuses</h1>
      <CampusesTable />
    </div>
  );
}
