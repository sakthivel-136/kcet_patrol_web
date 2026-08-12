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
    <div className="min-h-screen relative font-sans p-8">
      {/* HEADER SECTION */}
      <div className="max-w-7xl mx-auto mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Security Users</h1>
          <p className="text-slate-500 mt-1 font-medium">Manage and register security guards and portal admins</p>
        </div>
        
        <button
          onClick={handleAddUser}
          className="group relative overflow-hidden bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-md hover:shadow-lg flex items-center gap-2"
        >
          <span>Add Security User</span>
          <svg className="w-4 h-4 transition-transform group-hover:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      <div className="max-w-7xl mx-auto">
        {loading && users.length === 0 ? (
          <div className="flex items-center justify-center p-12 glass-panel rounded-3xl">
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


