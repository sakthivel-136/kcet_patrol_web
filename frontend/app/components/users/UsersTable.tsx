'use client'

import { useState } from 'react'
import { deleteSecurityUser } from '@/app/api/securityUsers.api'
import { SecurityUser } from '@/app/types/securityUser'
import axiosClient from '@/app/api/axiosClient'

interface UsersTableProps {
  users: SecurityUser[]
  onAddUser: () => void
  onEditUser: (user: SecurityUser) => void
  onRefresh: () => Promise<void>
}

export default function UsersTable({
  users,
  onEditUser,
  onRefresh,
}: UsersTableProps) {

  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({})
  const [supremeModal, setSupremeModal] = useState<{ isOpen: boolean; action: 'VIEW' | 'EDIT'; targetUser: SecurityUser | null }>({
    isOpen: false,
    action: 'VIEW',
    targetUser: null
  })
  const [passcodeInput, setPasscodeInput] = useState('')
  const [verifying, setVerifying] = useState(false)

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this user?')) return

    try {
      await deleteSecurityUser(id)
      await onRefresh()
    } catch (err) {
      alert('Delete failed')
    }
  }

  const handleToggleAttempt = (user: SecurityUser) => {
    if (visiblePasswords[user.security_id]) {
      // Just hide it if it's already visible
      setVisiblePasswords(prev => ({ ...prev, [user.security_id]: false }))
      return
    }

    if ((user.role || '').toUpperCase() === 'ADMIN') {
      setSupremeModal({ isOpen: true, action: 'VIEW', targetUser: user })
      setPasscodeInput('')
    } else {
      setVisiblePasswords(prev => ({ ...prev, [user.security_id]: true }))
    }
  }

  const handleEditAttempt = (user: SecurityUser) => {
    if ((user.role || '').toUpperCase() === 'ADMIN') {
      setSupremeModal({ isOpen: true, action: 'EDIT', targetUser: user })
      setPasscodeInput('')
    } else {
      onEditUser(user)
    }
  }

  const verifySupreme = async () => {
    setVerifying(true)
    try {
      await axiosClient.post('/auth/verify-supreme', { passcode: passcodeInput })
      // Success!
      if (supremeModal.action === 'VIEW' && supremeModal.targetUser) {
        setVisiblePasswords(prev => ({ ...prev, [supremeModal.targetUser!.security_id]: true }))
      } else if (supremeModal.action === 'EDIT' && supremeModal.targetUser) {
        onEditUser(supremeModal.targetUser)
      }
      setSupremeModal({ isOpen: false, action: 'VIEW', targetUser: null })
    } catch (err: any) {
      alert(err.response?.data?.detail || "Invalid Supreme Passcode")
    } finally {
      setVerifying(false)
    }
  }

  return (
    <>
      <div className="glass-panel rounded-3xl overflow-hidden w-full transition-shadow duration-300 hover:shadow-md">
        <table className="min-w-full divide-y divide-slate-100">
          <thead className="bg-slate-50/50">
            <tr>
              <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider">ID</th>
              <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider">Name</th>
              <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider">Password</th>
              <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider">Role</th>
              <th className="px-6 py-4 text-right text-[11px] font-bold text-slate-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white/50 divide-y divide-slate-100/50 backdrop-blur-sm">
            {users.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <div className="bg-slate-50 p-3 rounded-full">
                      <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    <p className="text-sm font-medium text-slate-500">No security users found</p>
                  </div>
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.security_id} className="hover:bg-white/60 transition-colors duration-150 group">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono font-bold text-slate-800">{user.security_id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-700">{user.security_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <span className="font-mono bg-slate-50 px-2.5 py-1 rounded border border-slate-200">
                        {visiblePasswords[user.security_id] ? user.security_password : '••••••'}
                      </span>
                      <button
                        onClick={() => handleToggleAttempt(user)}
                        className="p-1 rounded text-slate-400 hover:text-blue-600 hover:bg-slate-100 transition-colors"
                        title={visiblePasswords[user.security_id] ? "Hide Password" : "Show Password"}
                      >
                        👁️
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                    <span className="bg-purple-50 text-purple-700 font-bold px-2.5 py-0.5 rounded text-xs">
                      {user.role || 'Guard'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-3">
                      <button onClick={() => handleEditAttempt(user)} className="text-slate-600 hover:text-blue-600 transition-colors duration-200 font-medium">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(user.security_id)} className="text-slate-600 hover:text-red-600 transition-colors duration-200 font-medium">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {supremeModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 shadow-xl w-full max-w-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-2">Admin Protection</h3>
            <p className="text-sm text-slate-500 mb-4">Please enter the Supreme Passcode to {supremeModal.action === 'EDIT' ? 'edit' : 'view'} this Admin account.</p>
            <input
              type="password"
              value={passcodeInput}
              onChange={e => setPasscodeInput(e.target.value)}
              placeholder="Supreme Passcode"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 outline-none transition-all mb-4"
              autoFocus
              onKeyDown={e => {
                if (e.key === 'Enter') verifySupreme()
                if (e.key === 'Escape') setSupremeModal({ isOpen: false, action: 'VIEW', targetUser: null })
              }}
            />
            <div className="flex gap-3 justify-end">
              <button 
                onClick={() => setSupremeModal({ isOpen: false, action: 'VIEW', targetUser: null })}
                className="px-4 py-2 rounded-xl text-slate-500 hover:bg-slate-100 font-medium transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={verifySupreme}
                disabled={verifying || !passcodeInput}
                className="px-4 py-2 rounded-xl bg-purple-600 text-white hover:bg-purple-700 font-medium disabled:opacity-50 transition-colors"
              >
                {verifying ? 'Checking...' : 'Verify'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
