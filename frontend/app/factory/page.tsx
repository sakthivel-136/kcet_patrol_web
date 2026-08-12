'use client';
import { FactoriesTable } from '@/app/components/factory/FactoriesTable';
import { useAuthGuard } from '@/app/services/auth.guard';

export default function FactoryPage() {
  const { authorized } = useAuthGuard();

  if (!authorized) {
    return (
      <div className="p-6 text-white min-h-screen bg-[#07071f] flex items-center justify-center">
        Checking access...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* HEADER SECTION */}
      <div className="max-w-7xl mx-auto mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Factories</h1>
          <p className="text-slate-500 mt-1 font-medium">Create, edit, and manage campus locations</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        <FactoriesTable />
      </div>
    </div>
  );
}

