'use client'

import { useEffect, useState } from 'react'
import { getSecurityUsers } from '@/app/api/securityUsers.api'
import UsersTable from '@/app/components/users/UsersTable'
import UserForm from '@/app/components/users/UserForm'
import { motion } from 'framer-motion'
import { SecurityUser } from '@/app/types/securityUser'
import { useAuthGuard } from '@/app/services/auth.guard'

export default function UserCrudPage() {
  const { authorized } = useAuthGuard({ allowedRoles: ['ADMIN'] })
  const [users, setUsers] = useState<SecurityUser[]>([])
  const [loading, setLoading] = useState(true)
  
  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<SecurityUser | null>(null)

  const loadData = async () => {
    if (!authorized) return
    try {
      setLoading(true)
      const usersData = await getSecurityUsers()
      setUsers(Array.isArray(usersData) ? usersData : [])
    } catch (error) {
      console.error("Fetch failed:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (authorized) {
      loadData()
    }
  }, [authorized])

  const handleAddUser = () => {
    setEditingUser(null)
    setIsFormOpen(true)
  }

  const handleEditUser = (user: SecurityUser) => {
    setEditingUser(user)
    setIsFormOpen(true)
  }

  if (!authorized) {
    return (
      <div className="p-6 text-slate-500 min-h-screen flex items-center justify-center">
        Checking access...
      </div>
    )
  }

  return (
    <div className="min-h-screen relative font-sans text-slate-900 selection:bg-purple-100 selection:text-purple-900">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [.22,1,.36,1] }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10"
      >
        {/* ── Header ─────────────────────────────── */}
        <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <p className="section-heading">User Management</p>
            <h1 className="text-3xl font-extrabold tracking-tight text-purple-950">
              Security <span className="text-gradient">Personnel</span>
            </h1>
            <p className="mt-1 text-slate-500 text-sm">Manage and register security guards and portal admins</p>
          </div>

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={handleAddUser}
            className="btn-primary flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Add Security User
          </motion.button>
        </div>

        {/* ── Table Panel ─────────────────────────── */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8">
          {loading && users.length === 0 ? (
            <div className="flex flex-col gap-3 p-6">
              {[1,2,3,4].map(i => (
                <div key={i} className="skeleton h-12 w-full" style={{ animationDelay: `${i * 0.1}s` }} />
              ))}
            </div>
          ) : (
            <UsersTable
              users={users}
              onAddUser={handleAddUser}
              onEditUser={handleEditUser}
              onRefresh={loadData}
            />
          )}
        </div>
      </motion.div>

      {isFormOpen && (
        <UserForm
          user={editingUser}
          onClose={() => setIsFormOpen(false)}
          onSave={loadData}
        />
      )}
    </div>
  )
}


