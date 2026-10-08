'use client'

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, Edit3, X, Save, AlertTriangle, Plus, Trash2 } from 'lucide-react'
import { useAuthGuard } from '@/app/services/auth.guard'
import { getRounds, createRound, updateRound, deleteRound, PatrolRound } from '@/app/api/rounds.api'

export default function RoundsCrudPage() {
  const { authorized } = useAuthGuard({ allowedRoles: ['ADMIN'] })
  
  const [rounds, setRounds] = useState<PatrolRound[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingRound, setEditingRound] = useState<PatrolRound | null>(null)
  
  // form states
  const [roundNumber, setRoundNumber] = useState<number | ''>('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  const fetchAllRounds = async () => {
    setLoading(true)
    const data = await getRounds()
    setRounds(data.sort((a, b) => a.round_number - b.round_number))
    setLoading(false)
  }

  useEffect(() => {
    if (authorized) {
      fetchAllRounds()
    }
  }, [authorized])

  const openModal = (round?: PatrolRound) => {
    setErrorMsg('')
    if (round) {
      setEditingRound(round)
      setRoundNumber(round.round_number)
      setStartTime(round.start_time.substring(0, 5))
      setEndTime(round.end_time.substring(0, 5))
    } else {
      setEditingRound(null)
      // Auto increment round number for convenience
      const nextNum = rounds.length > 0 ? Math.max(...rounds.map(r => r.round_number)) + 1 : 1
      setRoundNumber(nextNum)
      setStartTime('00:00')
      setEndTime('01:00')
    }
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingRound(null)
  }

  const handleSave = async () => {
    if (!roundNumber || !startTime || !endTime) {
      setErrorMsg('Please fill all fields')
      return
    }
    setErrorMsg('')

    let success = false
    // Format times with seconds for the backend
    const st = `${startTime}:00`
    const et = `${endTime}:00`

    if (editingRound) {
      success = await updateRound(editingRound.id, Number(roundNumber), st, et)
    } else {
      success = await createRound(Number(roundNumber), st, et)
    }

    if (success) {
      closeModal()
      fetchAllRounds()
    } else {
      setErrorMsg('Failed to save round. Please check the values.')
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this round?")) return
    const success = await deleteRound(id)
    if (success) fetchAllRounds()
  }

  const handleDownloadPDF = async () => {
    const jsPDF = (await import('jspdf')).default
    const autoTable = (await import('jspdf-autotable')).default
    const doc = new jsPDF('portrait', 'pt', 'a4')
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    const margin = 30

    // Header
    doc.setDrawColor(0)
    doc.setLineWidth(2)
    doc.rect(15, 15, pageWidth - 30, pageHeight - 30)

    doc.setFont("helvetica", "bold")
    doc.setFontSize(18)
    doc.setTextColor(0)
    doc.text("STANDARD PATROL ROUNDS TIMETABLE", pageWidth / 2, 60, { align: "center" })
    
    doc.setDrawColor(200)
    doc.setLineWidth(1)
    doc.line(margin, 75, pageWidth - margin, 75)

    const calculateDuration = (start: string, end: string) => {
      try {
        const [sh, sm] = start.split(':').map(Number)
        const [eh, em] = end.split(':').map(Number)
        let diff = (eh * 60 + em) - (sh * 60 + sm)
        if (diff < 0) diff += 24 * 60
        const hrs = Math.floor(diff / 60)
        const mins = diff % 60
        return `${hrs} hr ${mins} mins`
      } catch (e) {
        return '-'
      }
    }

    const tableData = rounds.map(r => [
      `Round ${r.round_number}`,
      r.start_time.substring(0, 5),
      r.end_time.substring(0, 5),
      calculateDuration(r.start_time, r.end_time)
    ])

    autoTable(doc, {
      startY: 100,
      head: [['Round Number', 'Start Time', 'End Time', 'Duration']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: "#4F46E5", textColor: "#FFFFFF", fontStyle: "bold", halign: 'center' },
      styles: { font: "helvetica", fontSize: 11, cellPadding: 8, halign: 'center', valign: 'middle' },
      columnStyles: { 0: { fontStyle: 'bold' } },
      alternateRowStyles: { fillColor: "#F8FAFC" }
    })

    // Footer
    const finalY = (doc as any).lastAutoTable.finalY + 40
    doc.setFont("helvetica", "italic")
    doc.setFontSize(9)
    doc.setTextColor(100)
    doc.text("Note: All guards must complete their checkpoint scans within the allocated time windows.", pageWidth / 2, finalY, { align: "center" })
    doc.text("Late scans will be marked as MISSED.", pageWidth / 2, finalY + 12, { align: "center" })

    doc.setFont("helvetica", "normal")
    doc.setFontSize(8)
    doc.setTextColor(150)
    doc.text(`Generated on: ${new Date().toLocaleString()}`, pageWidth - margin - 120, pageHeight - margin)

    doc.save("Patrol_Rounds_Schedule.pdf")
  }

  if (!authorized) return null

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <Clock className="text-purple-600" size={26} />
            Patrol Rounds Management
          </h1>
          <p className="text-slate-500 text-sm mt-1 font-medium">
            Configure the daily schedule and timing for patrol rounds.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleDownloadPDF}
            className="bg-purple-100 hover:bg-purple-200 text-purple-700 py-2.5 px-5 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors"
          >
            📊 Download PDF
          </button>
          <button
            onClick={() => openModal()}
            className="btn-primary py-2.5 px-5 text-sm flex items-center gap-2"
          >
            <Plus size={16} /> Add Round
          </button>
        </div>
      </div>

      {/* List */}
      <div className="glass-panel p-6 rounded-3xl min-h-[400px]">
        {loading ? (
          <div className="flex items-center justify-center h-40 text-purple-600 font-bold">
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, ease: "linear", duration: 1 }}>
              <Clock size={24} />
            </motion.div>
            <span className="ml-3">Loading rounds...</span>
          </div>
        ) : rounds.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="text-purple-300" size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-700">No rounds configured</h3>
            <p className="text-slate-500 text-sm mt-1 mb-4">Add your first patrol round to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rounds.map((round) => (
              <motion.div
                key={round.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/60 border border-purple-100/50 p-4 rounded-2xl shadow-sm hover:shadow-md transition-shadow relative group"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-black text-sm">
                      {round.round_number}
                    </div>
                    <span className="font-bold text-slate-700">Round {round.round_number}</span>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => openModal(round)}
                      className="p-1.5 text-purple-400 hover:text-purple-700 hover:bg-purple-50 rounded-lg"
                      title="Edit"
                    >
                      <Edit3 size={15} />
                    </button>
                    <button
                      onClick={() => handleDelete(round.id)}
                      className="p-1.5 text-rose-400 hover:text-rose-700 hover:bg-rose-50 rounded-lg"
                      title="Delete"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                <div className="bg-slate-50/80 p-3 rounded-xl flex items-center justify-between">
                  <div className="text-center">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Start Time</p>
                    <p className="text-sm font-semibold text-slate-700">{round.start_time.substring(0, 5)}</p>
                  </div>
                  <div className="text-slate-300">→</div>
                  <div className="text-center">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">End Time</p>
                    <p className="text-sm font-semibold text-slate-700">{round.end_time.substring(0, 5)}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={closeModal}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <Clock className="text-purple-600" size={18} />
                  {editingRound ? 'Edit Round Timing' : 'Add New Round'}
                </h3>
                <button onClick={closeModal} className="text-slate-400 hover:text-slate-700 p-1 rounded-full hover:bg-slate-100">
                  <X size={18} />
                </button>
              </div>

              <div className="p-6 space-y-4">
                {errorMsg && (
                  <div className="bg-rose-50 text-rose-600 p-3 rounded-xl text-sm font-medium flex items-center gap-2">
                    <AlertTriangle size={16} /> {errorMsg}
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Round Number</label>
                  <input
                    type="number"
                    value={roundNumber}
                    onChange={(e) => setRoundNumber(e.target.value ? Number(e.target.value) : '')}
                    className="input-field py-2.5 font-semibold"
                    placeholder="e.g. 1"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase">Start Time</label>
                    <input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="input-field py-2.5 font-semibold"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase">End Time</label>
                    <input
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="input-field py-2.5 font-semibold"
                    />
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <button onClick={closeModal} className="flex-1 py-2.5 rounded-xl font-semibold text-slate-600 hover:bg-slate-100 transition-colors">
                    Cancel
                  </button>
                  <button onClick={handleSave} className="flex-1 btn-primary py-2.5 flex items-center justify-center gap-2">
                    <Save size={16} /> Save Round
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  )
}
