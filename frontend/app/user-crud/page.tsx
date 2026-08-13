'use client'

import { useEffect, useState } from 'react'
import { getSecurityUsers } from '@/app/api/securityUsers.api'
import UsersTable from '@/app/components/users/UsersTable'
import UserForm from '@/app/components/users/UserForm'
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
    <div className="min-h-screen relative font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Security Users</h1>
            <p className="mt-1 text-slate-500 text-sm font-medium">Manage and register security guards and portal admins</p>
          </div>
          
          <button
            onClick={handleAddUser}
            className="px-6 py-2.5 bg-indigo-600 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-500/40 transition-all duration-200 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Add Security User
          </button>
        </div>

        <div className="glass-panel rounded-3xl p-6 sm:p-8">
          {loading && users.length === 0 ? (
            <div className="flex items-center justify-center p-12">
              <p className="text-slate-500 font-medium">Loading user management...</p>
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
      </div>

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


