'use client'

import { useState, useEffect } from 'react'
import { getShifts, createShift, updateShift, deleteShift, Shift } from '@/app/api/shifts.api'
import { getSecurityUsers } from '@/app/api/securityUsers.api'
import { getAllocations, allocateGuards, ShiftAllocation } from '@/app/api/allocations.api'
import { SecurityUser } from '@/app/types/securityUser'
import { useAuthGuard } from '@/app/services/auth.guard'

export default function ShiftsPage() {
  const { authorized } = useAuthGuard({ allowedRoles: ['ADMIN', 'SUPERVISOR'] })
  
  // Data State
  const [shifts, setShifts] = useState<Shift[]>([])
  const [guards, setGuards] = useState<SecurityUser[]>([])
  const [allocations, setAllocations] = useState<ShiftAllocation[]>([])
  const [loading, setLoading] = useState(true)
  
  // Form State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingShift, setEditingShift] = useState<Shift | null>(null)
  const [shiftForm, setShiftForm] = useState({ shift_name: '', start_time: '', end_time: '' })
  
  // Roster Checkboxes State (guard_id: boolean)
  const [rosterSelection, setRosterSelection] = useState<Record<string, boolean>>({})

  const loadData = async () => {
    if (!authorized) return
    setLoading(true)
    try {
      const [shiftsData, usersData, allocsData] = await Promise.all([
        getShifts(),
        getSecurityUsers(),
        getAllocations() // Get all permanent allocations
      ])
      
      setShifts(shiftsData || [])
      setAllocations(allocsData || [])
      
      const guardsList = (Array.isArray(usersData) ? usersData : []).filter(u => u.role === 'Guard' || !u.role)
      setGuards(guardsList)
      
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (authorized) loadData()
  }, [authorized])

  const openModal = (shift?: Shift) => {
    if (shift) {
      setEditingShift(shift)
      setShiftForm({ shift_name: shift.shift_name, start_time: shift.start_time, end_time: shift.end_time })
      
      // Populate selections
      const currentGuards = allocations.filter(a => a.shift_id === shift.shift_id).map(a => a.guard_id)
      const selections: Record<string, boolean> = {}
      guards.forEach(g => {
        selections[g.security_id] = currentGuards.includes(g.security_id)
      })
      setRosterSelection(selections)
    } else {
      setEditingShift(null)
      setShiftForm({ shift_name: '', start_time: '', end_time: '' })
      const selections: Record<string, boolean> = {}
      guards.forEach(g => { selections[g.security_id] = false })
      setRosterSelection(selections)
    }
    setIsModalOpen(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      let savedShiftId = ''
      if (editingShift) {
        await updateShift(editingShift.shift_id, shiftForm)
        savedShiftId = editingShift.shift_id
      } else {
        const newShift = await createShift(shiftForm)
        savedShiftId = newShift.shift_id
      }

      // Save Roster
      const selectedGuardIds = Object.keys(rosterSelection).filter(id => rosterSelection[id])
      const newAllocations = selectedGuardIds.map(guard_id => ({
        shift_id: savedShiftId,
        guard_id
      }))

      if (newAllocations.length > 0) {
        await allocateGuards(newAllocations)
      } else if (editingShift) {
         // To properly clear, send a dummy alloc
         await allocateGuards([{ shift_id: savedShiftId, guard_id: 'CLEAR' }])
      }

      setIsModalOpen(false)
      loadData()
    } catch (error) {
      console.error('Error saving:', error)
      alert('Failed to save shift and roster')
    }
  }

  const handleDeleteShift = async (id: string) => {
    if (!confirm('Delete this shift?')) return
    try {
      await deleteShift(id)
      loadData()
    } catch (error) {
      console.error('Error deleting shift:', error)
      alert('Failed to delete shift')
    }
  }

  const toggleGuard = (guardId: string) => {
    setRosterSelection(prev => ({
      ...prev,
      [guardId]: !prev[guardId]
    }))
  }

  if (!authorized) {
    return (
      <div className="p-6 text-slate-500 min-h-screen bg-slate-50 flex items-center justify-center">
        Checking access...
      </div>
    )
  }

  return (
    <div className="min-h-screen relative font-sans overflow-hidden">
      {/* Abstract Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] mix-blend-multiply opacity-70" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px] mix-blend-multiply opacity-70" />
      </div>

      <div className="relative z-10 p-8 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight drop-shadow-sm">Shift Management</h1>
            <p className="text-slate-500 mt-2 font-medium tracking-wide">Configure recurring shifts and assign guard rosters</p>
          </div>
          <button
            onClick={() => openModal()}
            className="group relative overflow-hidden bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-md hover:shadow-lg"
          >
            <span className="relative z-10 flex items-center gap-2">
              <span className="text-lg leading-none">+</span> Add Shift
            </span>
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
          </div>
        ) : shifts.length === 0 ? (
          <div className="text-center py-16 backdrop-blur-xl bg-white/60 border border-white/80 rounded-3xl shadow-sm">
            <p className="text-slate-600 font-medium text-lg">No shifts configured yet</p>
            <p className="text-slate-400 text-sm mt-2">Create your first shift to start allocating guards</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {shifts.map(shift => {
              const assignedGuards = allocations
                .filter(a => a.shift_id === shift.shift_id && a.guard_id !== 'CLEAR')
                .map(a => guards.find(g => g.security_id === a.guard_id))
                .filter(Boolean) as SecurityUser[]

              return (
                <div key={shift.shift_id} className="relative group backdrop-blur-xl bg-white/80 border border-white rounded-3xl p-6 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h3 className="font-bold text-slate-800 text-xl tracking-tight mb-1">{shift.shift_name}</h3>
                        <div className="inline-flex items-center gap-2 text-xs font-medium text-indigo-700 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-lg">
                          <span>{shift.start_time}</span>
                          <span className="text-indigo-300">to</span>
                          <span>{shift.end_time}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => openModal(shift)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-50 hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 border border-slate-100 transition-all shadow-sm">
                          ✎
                        </button>
                        <button onClick={() => handleDeleteShift(shift.shift_id)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-600 border border-slate-100 transition-all shadow-sm">
                          ×
                        </button>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Assigned Roster ({assignedGuards.length})</h4>
                      <div className="flex flex-wrap gap-2">
                        {assignedGuards.length === 0 ? (
                          <span className="text-sm text-slate-400 italic">No guards assigned</span>
                        ) : (
                          assignedGuards.map(g => (
                            <div key={g.security_id} className="flex items-center gap-2 bg-white border border-slate-200 shadow-sm rounded-full pl-1.5 pr-3 py-1">
                              <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-[10px] font-bold text-white">
                                {g.security_name.charAt(0).toUpperCase()}
                              </div>
                              <span className="text-xs font-medium text-slate-700">{g.security_name}</span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Glassmorphic Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative z-10 w-full max-w-2xl bg-white/95 backdrop-blur-2xl border border-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
                {editingShift ? 'Edit Shift & Roster' : 'Create New Shift'}
              </h2>
            </div>
            
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
              
              {/* Shift Configuration Section */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-indigo-600 uppercase tracking-widest">Shift Details</h3>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1.5">Shift Name</label>
                  <input
                    type="text" required value={shiftForm.shift_name}
                    onChange={e => setShiftForm({...shiftForm, shift_name: e.target.value})}
                    className="w-full bg-white border border-slate-200 text-slate-800 px-4 py-2.5 rounded-xl focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all shadow-sm"
                    placeholder="e.g., Morning Shift"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1.5">Start Time</label>
                    <input
                      type="time" required value={shiftForm.start_time}
                      onChange={e => setShiftForm({...shiftForm, start_time: e.target.value})}
                      className="w-full bg-white border border-slate-200 text-slate-800 px-4 py-2.5 rounded-xl focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1.5">End Time</label>
                    <input
                      type="time" required value={shiftForm.end_time}
                      onChange={e => setShiftForm({...shiftForm, end_time: e.target.value})}
                      className="w-full bg-white border border-slate-200 text-slate-800 px-4 py-2.5 rounded-xl focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all shadow-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Roster Configuration Section */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-indigo-600 uppercase tracking-widest flex justify-between items-center">
                  <span>Assign Guards</span>
                  <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-md font-bold">
                    {Object.values(rosterSelection).filter(Boolean).length} Selected
                  </span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {guards.map(guard => {
                    const isSelected = rosterSelection[guard.security_id] || false;
                    
                    const activeShiftId = editingShift ? editingShift.shift_id : null;
                    const otherAssignments = allocations.filter(a => a.guard_id === guard.security_id && a.shift_id !== activeShiftId && a.guard_id !== 'CLEAR');
                    const otherShiftCount = otherAssignments.length;

                    let highlightClass = 'bg-white border-slate-200 hover:border-indigo-200 hover:bg-slate-50';
                    let textClass = 'text-slate-700';
                    let badge = null;

                    if (isSelected) {
                      highlightClass = 'bg-indigo-50 border-indigo-300 shadow-indigo-100';
                      textClass = 'text-indigo-900';
                    } else if (otherShiftCount === 1) {
                      highlightClass = 'bg-orange-50 border-orange-200 hover:border-orange-300';
                      textClass = 'text-orange-900';
                      badge = <span className="text-[10px] ml-auto bg-orange-100 text-orange-800 px-1.5 py-0.5 rounded font-bold">1 Shift</span>;
                    } else if (otherShiftCount >= 2) {
                      highlightClass = 'bg-red-50 border-red-200 hover:border-red-300';
                      textClass = 'text-red-900';
                      badge = <span className="text-[10px] ml-auto bg-red-100 text-red-800 px-1.5 py-0.5 rounded font-bold">{otherShiftCount} Shifts</span>;
                    }

                    return (
                      <div 
                        key={guard.security_id} 
                        onClick={() => toggleGuard(guard.security_id)}
                        className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer border transition-all duration-200 shadow-sm ${highlightClass}`}
                      >
                        <div className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${
                          isSelected ? 'bg-indigo-600' : 'border-2 border-slate-300 bg-white'
                        }`}>
                          {isSelected && <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                        </div>
                        <div className="flex flex-col">
                          <span className={`text-sm font-semibold ${textClass}`}>{guard.security_name}</span>
                          <span className="text-[10px] text-slate-400 uppercase">{guard.security_id}</span>
                        </div>
                        {badge}
                      </div>
                    )
                  })}
                </div>
              </div>
              
            </form>

            <div className="p-5 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-800 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-all shadow-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-md transition-all"
              >
                Save Changes
              </button>
            </div>
            
          </div>
        </div>
      )}

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  )
}
