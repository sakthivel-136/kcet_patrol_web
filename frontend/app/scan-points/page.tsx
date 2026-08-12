'use client'

import { useEffect, useState } from 'react'
import { ScanPointsTable, ScanPoint } from '../components/scan/ScanPointsTable'
import { ScanPointForm } from '../components/scan/ScanPointForm'

import {
  getScanPointsByFactory,
  createScanPoint,
  updateScanPoint,
} from '../api/scanPoints.api'
import { useAuthGuard } from '../services/auth.guard'
import { getApiUrl } from '../utils/apiUrl'

/* ================= TYPES ================= */

interface Factory {
  id: string
  name: string
}

type StatusFilter = 'All' | 'Active' | 'Inactive'
type PriorityFilter = 'All' | 'Low' | 'Medium' | 'High'

export default function ScanPointsPage() {
  const { authorized } = useAuthGuard()
  const [scanPoints, setScanPoints] = useState<ScanPoint[]>([])
  const [factories, setFactories] = useState<Factory[]>([])
  const [selectedFactory, setSelectedFactory] = useState<string>('')

  const [isFormOpen, setIsFormOpen] = useState<boolean>(false)
  const [editingScanPoint, setEditingScanPoint] = useState<ScanPoint | null>(null)

  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All')
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>('All')

   /* ================= LOAD FACTORIES ================= */
  useEffect(() => {
    if (!authorized) return
    const API_BASE_URL = getApiUrl();
    const FACTORY_ENDPOINT = `${API_BASE_URL}/factories/minimal`;

    console.log(`🔍 Fetching from: ${FACTORY_ENDPOINT}`); // Debug Log

    fetch(FACTORY_ENDPOINT)
      .then(res => {
        if (!res.ok) {
          // Log status and URL for easier debugging
          console.error(`❌ Backend Error: ${res.status} at ${FACTORY_ENDPOINT}`);
          throw new Error(`HTTP error! status: ${res.status}`)
        }
        return res.json()
      })
      .then((data) => {
        const factoryArray = Array.isArray(data) ? data : []
        console.log('✅ Factories loaded:', factoryArray)
        
        setFactories(factoryArray)
        if (factoryArray.length > 0) {
          setSelectedFactory(factoryArray[0].id)
        } else {
          setSelectedFactory('')
        }
      })
      .catch((err: unknown) => {
        console.error('⚠️ Network or Parsing Error:', err)
        setFactories([]) 
      })
  }, [authorized])

  /* ================= LOAD SCAN POINTS ================= */
  useEffect(() => {
    if (!authorized || !selectedFactory) return

    getScanPointsByFactory(selectedFactory)
      .then((data: ScanPoint[]) => {
        setScanPoints(Array.isArray(data) ? data : [])
      })
      .catch((err: unknown) => {
        console.error('Failed to load scan points:', err)
        setScanPoints([])
      })
  }, [selectedFactory, authorized])

  /* ================= FILTER ================= */
  const visibleScanPoints = scanPoints.filter(sp => {
    if (statusFilter === 'Active' && !sp.is_active) return false
    if (statusFilter === 'Inactive' && sp.is_active) return false
    if (priorityFilter !== 'All' && sp.risk_level !== priorityFilter)
      return false
    return true
  })

  if (!authorized) {
    return <div className="p-6 text-slate-500 min-h-screen flex items-center justify-center">Checking access...</div>
  }

  return (
    <div className="min-h-screen relative font-sans p-8">
      
      {/* HEADER SECTION */}
      <div className="max-w-7xl mx-auto mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Scan Points</h1>
          <p className="text-slate-500 mt-1 font-medium">Manage and monitor location checkpoints</p>
        </div>
        
        <button
          onClick={() => {
            setEditingScanPoint(null)
            setIsFormOpen(true)
          }}
          className="group relative overflow-hidden bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-md hover:shadow-lg flex items-center gap-2"
        >
          <span>Add Scan Point</span>
          <svg className="w-4 h-4 transition-transform group-hover:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      {/* FILTERS TOOLBAR */}
      <div className="max-w-7xl mx-auto mb-8 glass-panel rounded-3xl p-5">
        <div className="flex flex-wrap gap-6 items-center">
          
          {/* Factory Select */}
          <div className="flex flex-col gap-1.5 min-w-[200px]">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Campus Location</label>
            <div className="relative">
              <select
                value={selectedFactory}
                onChange={e => setSelectedFactory(e.target.value)}
                className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-700 py-2.5 pl-4 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:bg-white hover:border-blue-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={factories.length === 0}
              >
                {(factories || []).map(f => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
                {factories.length === 0 && (
                  <option value="" disabled>No factories available</option>
                )}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>

          {/* Status Select */}
          <div className="flex flex-col gap-1.5 min-w-[160px]">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Status</label>
            <div className="relative">
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value as StatusFilter)}
                className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-700 py-2.5 pl-4 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:bg-white hover:border-blue-300 cursor-pointer"
              >
                <option value="All">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>

          {/* Risk Select */}
          <div className="flex flex-col gap-1.5 min-w-[160px]">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Risk Level</label>
            <div className="relative">
              <select
                value={priorityFilter}
                onChange={e =>
                  setPriorityFilter(e.target.value as PriorityFilter)
                }
                className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-700 py-2.5 pl-4 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:bg-white hover:border-blue-300 cursor-pointer"
              >
                <option value="All">All Levels</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TABLE CONTAINER */}
      <div className="max-w-7xl mx-auto">
        <div className="glass-panel rounded-3xl overflow-hidden transition-shadow duration-300 hover:shadow-md">
          <ScanPointsTable
            scanPoints={visibleScanPoints}
            onEdit={(sp: ScanPoint) => {
              setEditingScanPoint(sp)
              setIsFormOpen(true)
            }}
            onDisable={async (id: string) => {
              try {
                const updated = await updateScanPoint(id, { is_active: false })
                setScanPoints(prev =>
                  prev.map(sp =>
                    sp.id === id ? { ...sp, ...updated } : sp
                  )
                )
              } catch (err: unknown) {
                console.error('Failed to disable scan point:', err)
              }
            }}
          />
        </div>
      </div>

      {/* FORM MODAL */}
      {isFormOpen && (
        <ScanPointForm
          scanPoint={editingScanPoint}
          onClose={() => setIsFormOpen(false)}
          onSubmit={async (data: Partial<ScanPoint>) => {
            try {
              if (editingScanPoint) {
                const updated = await updateScanPoint(
                  editingScanPoint.id,
                  data
                )
                setScanPoints(prev =>
                  prev.map(sp =>
                    sp.id === editingScanPoint.id
                      ? { ...sp, ...updated }
                      : sp
                  )
                )
              } else {
                const created = await createScanPoint({
                  ...data,
                  factory_id: selectedFactory,
                })
                setScanPoints(prev => [...prev, created])
              }
            } catch (err: unknown) {
              console.error('Failed to save scan point:', err)
            } finally {
              setIsFormOpen(false)
              setEditingScanPoint(null)
            }
          }}
        />
      )}
    </div>
  )
}