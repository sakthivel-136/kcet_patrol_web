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
    factory: user?.factory ?? FIXED_CAMPUS,
    role: user?.role ?? 'Guard',
  }), [user])

  const [formData, setFormData] =
    useState<SecurityUser>(initialData)

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

    try {

      if (user) {
        await updateSecurityUser(user.security_id, {
          security_name: formData.security_name,
          factory: FIXED_CAMPUS,
          role: formData.role,
          ...(password.trim()
            ? { security_password: password }
            : {}),
        })

      } else {
        await createSecurityUser({
          security_id: formData.security_id,
          security_name: formData.security_name,
          security_password: password,
          factory: FIXED_CAMPUS,
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
    }
  }

  /* ================= UI ================= */

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-start justify-center">
      <div className="bg-white p-6 rounded-lg max-w-md w-full mt-24">

        <h2 className="text-xl font-bold mb-4">
          {user ? 'Edit Security User' : 'Add Security User'}
        </h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          <input
            name="security_id"
            value={formData.security_id}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            placeholder="Security ID"
            required
            disabled={!!user}
          />

          <input
            name="security_name"
            value={formData.security_name}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            placeholder="Security Name"
            required
          />

          <input
            type="password"
            name="security_password"
            value={formData.security_password ?? ''}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            placeholder={
              user
                ? 'New Password (optional)'
                : 'Password'
            }
            required={!user}
          />

          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          >
            <option value="Guard">Guard</option>
            <option value="Supervisor">Supervisor</option>
            <option value="ADMIN">Administrator</option>
          </select>

          <div className="flex justify-end gap-3 pt-4">

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Save
            </button>

          </div>

        </form>
      </div>
    </div>
  )
}
