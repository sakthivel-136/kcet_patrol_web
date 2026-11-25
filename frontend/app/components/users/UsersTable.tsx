'use client'

import { useState } from 'react'
import { deleteSecurityUser } from '@/app/api/securityUsers.api'
import { SecurityUser } from '@/app/types/securityUser'

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
    setVisiblePasswords(prev => ({ ...prev, [user.security_id]: !prev[user.security_id] }))
  }

  const handleEditAttempt = (user: SecurityUser) => {
    onEditUser(user)
  }

  const filteredUsers = users.filter(u => u.security_id !== 'SUPREME_PASSCODE')

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
            {filteredUsers.length === 0 ? (
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
              filteredUsers.map((user) => (
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
    </>
  )
}
