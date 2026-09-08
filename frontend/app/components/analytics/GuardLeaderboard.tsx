'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Award, ShieldCheck, AlertCircle, Search, UserCheck, CheckCircle2, XCircle } from 'lucide-react'

export type GuardStat = {
  name: string
  scanned: number
  missed: number
  total: number
}

interface GuardLeaderboardProps {
  guards: GuardStat[]
}

export default function GuardLeaderboard({ guards }: GuardLeaderboardProps) {
  const [search, setSearch] = useState('')

  const filteredGuards = guards.filter(g =>
    g.name.toUpperCase() !== 'SYSTEM_MISSED' &&
    g.name.toLowerCase() !== 'unknown' &&
    g.name.toLowerCase().includes(search.toLowerCase())
  )

  const getRankBadge = (index: number) => {
    if (index === 0) return <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-100 text-amber-600 font-extrabold text-xs border border-amber-300 shadow-sm">🥇 1</span>
    if (index === 1) return <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-200 text-slate-700 font-extrabold text-xs border border-slate-300 shadow-sm">🥈 2</span>
    if (index === 2) return <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-700/10 text-amber-800 font-extrabold text-xs border border-amber-800/30 shadow-sm">🥉 3</span>
    return <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-purple-50 text-purple-700 font-bold text-xs border border-purple-100">#{index + 1}</span>
  }

  return (
    <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-purple-100/60 pb-5">
        <div>
          <div className="flex items-center gap-2 text-purple-600 font-bold text-xs uppercase tracking-widest mb-1">
            <Award size={16} /> Guard Compliance & Performance
          </div>
          <h2 className="text-xl font-extrabold text-purple-950">Security Personnel Leaderboard</h2>
          <p className="text-xs text-slate-500 mt-0.5">Real-time scan completion rates & officer reliability statistics</p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search guard name…"
            className="input-field pl-9 py-2 text-xs"
          />
        </div>
      </div>

      {/* Leaderboard Table / Cards */}
      {filteredGuards.length === 0 ? (
        <div className="py-12 flex flex-col items-center justify-center text-slate-400 gap-2">
          <UserCheck size={36} className="text-purple-300" />
          <p className="font-semibold text-sm text-slate-600">No security officers found</p>
          <p className="text-xs text-slate-400">Select another date or check guard assignments</p>
        </div>
      ) : (
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-purple-100/60 text-[11px] font-bold uppercase tracking-widest text-purple-400">
                <th className="py-3 px-3 text-left">Rank</th>
                <th className="py-3 px-3 text-left">Security Officer</th>
                <th className="py-3 px-3 text-center">Completed Scans</th>
                <th className="py-3 px-3 text-center">Missed</th>
                <th className="py-3 px-3 text-center">Total Assigned</th>
                <th className="py-3 px-3 text-center">Compliance Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-50/60">
              {filteredGuards.map((guard, idx) => {
                const total = guard.total || (guard.scanned + guard.missed) || 1
                const pct = Math.round((guard.scanned / total) * 100)

                return (
                  <motion.tr
                    key={guard.name}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: idx * 0.04 }}
                    className="hover:bg-purple-50/40 transition-colors"
                  >
                    {/* Rank */}
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      {getRankBadge(idx)}
                    </td>

                    {/* Name */}
                    <td className="py-3.5 px-3 font-semibold text-purple-950 whitespace-nowrap">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs border border-purple-200">
                          {guard.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">{guard.name}</p>
                          <p className="text-[11px] text-slate-400 font-medium">Officer ID: {guard.name}</p>
                        </div>
                      </div>
                    </td>

                    {/* Scanned */}
                    <td className="py-3.5 px-3 text-center whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 size={13} /> {guard.scanned}
                      </span>
                    </td>

                    {/* Missed */}
                    <td className="py-3.5 px-3 text-center whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                        guard.missed > 0 ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-slate-50 text-slate-400 border border-slate-200'
                      }`}>
                        <XCircle size={13} /> {guard.missed}
                      </span>
                    </td>

                    {/* Total */}
                    <td className="py-3.5 px-3 text-center font-bold text-slate-600 whitespace-nowrap">
                      {total}
                    </td>

                    {/* Progress Bar + % */}
                    <td className="py-3.5 px-3 text-center whitespace-nowrap">
                      <div className="flex items-center gap-3 justify-center min-w-[140px]">
                        <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200/60">
                          <div
                            className={`h-full transition-all duration-500 rounded-full ${
                              pct >= 85 ? 'bg-gradient-to-r from-emerald-500 to-teal-400' :
                              pct >= 60 ? 'bg-gradient-to-r from-amber-500 to-yellow-400' :
                              'bg-gradient-to-r from-rose-500 to-red-400'
                            }`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className={`text-xs font-extrabold px-2 py-0.5 rounded-full ${
                          pct >= 85 ? 'bg-emerald-100 text-emerald-800' :
                          pct >= 60 ? 'bg-amber-100 text-amber-800' :
                          'bg-rose-100 text-rose-800'
                        }`}>
                          {pct}%
                        </span>
                      </div>
                    </td>
                  </motion.tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
