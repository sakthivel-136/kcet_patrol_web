'use client';
import { CampusesTable } from '@/app/components/campus/CampusesTable';
import { useAuthGuard } from '@/app/services/auth.guard';

export default function CampusPage() {
  const { authorized } = useAuthGuard({ allowedRoles: ['ADMIN'] });

  if (!authorized) {
    return (
      <div className="p-6 text-white min-h-screen bg-[#07071f] flex items-center justify-center">
        Checking access...
      </div>
    );
  }

  return (
    <div className="min-h-screen relative font-sans text-slate-900 selection:bg-purple-100 selection:text-purple-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* HEADER SECTION */}
        <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Campuses</h1>
            <p className="mt-1 text-slate-500 text-sm font-medium">Create, edit, and manage campus locations</p>
          </div>
        </div>

        <div className="glass-panel rounded-3xl p-6 sm:p-8">
          <CampusesTable />
        </div>
      </div>
    </div>
  );
}

