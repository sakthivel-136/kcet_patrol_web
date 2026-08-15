'use client'

import {
  useState,
  ChangeEvent,
  FormEvent,
  useMemo,
  useEffect,
} from 'react'

import {
  createSecurityUser,
  updateSecurityUser,
} from '@/app/api/securityUsers.api'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Save, Loader2, UserPlus, UserCog } from 'lucide-react'

import { SecurityUser } from '@/app/types/securityUser'

interface UserFormProps {
  user: SecurityUser | null
  onClose: () => void
  onSave: () => void
}

export default function UserForm({
  user,
  onClose,
  onSave,
}: UserFormProps) {

  const FIXED_CAMPUS = "KCET01"

  /* ================= DERIVED INITIAL DATA ================= */

  const initialData = useMemo<SecurityUser>(() => ({
    security_id: user?.security_id ?? '',
    security_name: user?.security_name ?? '',
    security_password: '',
    campus: user?.campus ?? FIXED_CAMPUS,
    role: user?.role ?? 'Guard',
  }), [user])

  const [formData, setFormData] = useState<SecurityUser>(initialData)
  const [isSubmitting, setIsSubmitting] = useState(false)

  /* ================= SYNC WHEN USER CHANGES ================= */

  useEffect(() => {
    setFormData(initialData)
  }, [initialData])

  /* ================= HANDLE INPUT ================= */

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target

    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  /* ================= SUBMIT ================= */

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    const password = formData.security_password ?? ''

    if (!formData.security_id.trim()) {
      alert('Security ID required')
      return
    }

    if (!formData.security_name.trim()) {
      alert('Security name required')
      return
    }

    if (!user && !password.trim()) {
      alert('Password required')
      return
    }

    setIsSubmitting(true)

    try {
      if (user) {
        await updateSecurityUser(user.security_id, {
          security_name: formData.security_name,
          campus: FIXED_CAMPUS,
          role: formData.role,
          ...(password.trim() ? { security_password: password } : {}),
        })
      } else {
        await createSecurityUser({
          security_id: formData.security_id,
          security_name: formData.security_name,
          security_password: password,
          campus: FIXED_CAMPUS,
          role: formData.role,
        })
      }

      onSave()
      onClose()

    } catch (err: unknown) {
      console.error('Save error:', err)
      if (err instanceof Error) {
        alert(err.message)
      } else {
        alert('Error saving security user')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  /* ================= UI ================= */

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-lg bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden flex flex-col z-[101]"
        >
          {/* Header */}
          <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-white/50">
            <div>
              <h3 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
                {user ? <UserCog className="w-6 h-6 text-purple-500" /> : <UserPlus className="w-6 h-6 text-purple-500" />}
                {user ? 'Edit Security User' : 'Add Security User'}
              </h3>
              <p className="text-xs font-medium text-slate-500 mt-1">
                {user ? 'Update personnel records and roles.' : 'Register new security personnel.'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="h-9 w-9 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Security ID</label>
              <input
                name="security_id"
                value={formData.security_id}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 font-medium rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="e.g. 0001"
                required
                disabled={!!user}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Full Name</label>
              <input
                name="security_name"
                value={formData.security_name}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 font-medium rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 hover:bg-white transition-all"
                placeholder="e.g. John Doe"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Password</label>
              <input
                type="password"
                name="security_password"
                value={formData.security_password ?? ''}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 font-medium rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 hover:bg-white transition-all"
                placeholder={user ? 'Leave blank to keep current' : 'Enter strong password'}
                required={!user}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">System Role</label>
              <div className="relative group">
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-800 font-medium rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 hover:bg-white transition-all cursor-pointer shadow-sm"
                  required
                >
                  <option value="Guard">Guard</option>
                  <option value="Supervisor">Supervisor</option>
                  <option value="ADMIN">Administrator</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400 group-hover:text-purple-500 transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-xl text-slate-600 font-semibold text-sm hover:bg-slate-100 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-purple-600 text-white font-bold text-sm shadow-sm hover:bg-purple-700 hover:shadow-md transition-all flex items-center gap-2 disabled:opacity-70"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {isSubmitting ? "Saving..." : "Save Personnel"}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
