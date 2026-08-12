'use client'

import { useEffect, useState } from 'react'
import { CampusForm } from './CampusForm'

interface Campus {
  id: string
  name: string
  location?: string
  address?: string
}

/* ================= AUTH HEADER ================= */

const getAuthHeaders = () => {
  const token = localStorage.getItem('auth_token')

  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }
}

/* ============================================== */

export const CampusesTable = () => {

  /* ================= STATE ================= */

  const [campuses, setCampuses] = useState<Campus[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)

  const [editName, setEditName] = useState('')
  const [editLocation, setEditLocation] = useState('')
  const [editAddress, setEditAddress] = useState('')

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || '/api'

  /* ================= LOAD ================= */

  const loadCampuses = async () => {
    setLoading(true)
    setError('')

    try {
      const res = await fetch(`${API_BASE_URL}/campuses`, {
        headers: getAuthHeaders(),
      })

      if (!res.ok) {
        if (res.status === 401) {
          throw new Error('Unauthorized. Please login again.')
        }
        throw new Error('Failed to load campuses')
      }

      const data = await res.json()

      const normalized = data.map((f: any) => ({
        id: f.campus_code,
        name: f.campus_name,
        location: f.location || '',
        address: f.campus_address || '',
      }))

      setCampuses(normalized)

    } catch (err: any) {
      console.error(err)
      setError(err.message)

    } finally {
      setLoading(false)
    }
  }

  /* ================= CREATE ================= */

  const addCampus = async (payload: {
    name: string
    code: string
    location?: string
    address?: string
  }) => {

    try {
      const res = await fetch(`${API_BASE_URL}/campuses`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          campus_name: payload.name,
          campus_code: payload.code,
          location: payload.location || '',
          campus_address: payload.address || '',
        }),
      })

      if (!res.ok) throw new Error('Create failed')

      await loadCampuses()

    } catch (err: any) {
      alert(err.message)
    }
  }

  /* ================= UPDATE ================= */

  const saveEdit = async (id: string) => {

    try {
      const res = await fetch(`${API_BASE_URL}/campuses/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          campus_name: editName,
          campus_code: id,
          location: editLocation,
          campus_address: editAddress,
        }),
      })

      if (!res.ok) throw new Error('Update failed')

      setEditingId(null)
      await loadCampuses()

    } catch (err: any) {
      alert(err.message)
    }
  }

  /* ================= DELETE ================= */

  const deleteCampus = async (id: string) => {

    if (!confirm('Delete this campus?')) return

    try {
      const res = await fetch(`${API_BASE_URL}/campuses/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      })

      if (!res.ok && res.status !== 204) {
        throw new Error('Delete failed')
      }

      await loadCampuses()

    } catch (err: any) {
      alert(err.message)
    }
  }

  /* ================= EDIT ================= */

  const startEdit = (f: Campus) => {
    setEditingId(f.id)
    setEditName(f.name)
    setEditLocation(f.location || '')
    setEditAddress(f.address || '')
  }

  /* ================= INIT ================= */

  useEffect(() => {
    loadCampuses()
  }, [])


  /* ================= UI ================= */

  const InlineInput = ({
    value,
    onChange,
    placeholder
  }: {
    value: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    placeholder?: string
  }) => (
    <input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="block w-full rounded-md border px-3 py-1.5"
      autoFocus
    />
  )


  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">

      <h2 className="text-2xl font-bold mb-6">
        Campuses Management
      </h2>

      {/* Error */}
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Add */}
      <CampusForm onSubmit={addCampus} />


      {/* Loading */}
      {loading && (
        <p className="mt-6 text-gray-500">
          Loading...
        </p>
      )}


      {/* Table */}
      {!loading && (
        <div className="overflow-x-auto mt-6">

          <table className="min-w-full border">

            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Code</th>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Location</th>
                <th className="p-2 border">Address</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>

            <tbody>

              {campuses.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-4 text-center">
                    No campuses
                  </td>
                </tr>
              )}

              {campuses.map((f) => (

                <tr key={f.id}>

                  {/* Code */}
                  <td className="p-2 border">
                    {f.id}
                  </td>

                  {/* Name */}
                  <td className="p-2 border">

                    {editingId === f.id ? (
                      <InlineInput
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                      />
                    ) : (
                      f.name
                    )}

                  </td>

                  {/* Location */}
                  <td className="p-2 border">

                    {editingId === f.id ? (
                      <InlineInput
                        value={editLocation}
                        onChange={(e) => setEditLocation(e.target.value)}
                      />
                    ) : (
                      f.location || '—'
                    )}

                  </td>

                  {/* Address */}
                  <td className="p-2 border">

                    {editingId === f.id ? (
                      <InlineInput
                        value={editAddress}
                        onChange={(e) => setEditAddress(e.target.value)}
                      />
                    ) : (
                      f.address || '—'
                    )}

                  </td>


                  {/* Actions */}
                  <td className="p-2 border text-center">

                    {editingId === f.id ? (

                      <>
                        <button
                          onClick={() => saveEdit(f.id)}
                          className="text-green-600 mr-3"
                        >
                          Save
                        </button>

                        <button
                          onClick={() => setEditingId(null)}
                          className="text-gray-600"
                        >
                          Cancel
                        </button>
                      </>

                    ) : (

                      <>
                        <button
                          onClick={() => startEdit(f)}
                          className="text-blue-600 mr-3"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => deleteCampus(f.id)}
                          className="text-red-600"
                        >
                          Delete
                        </button>
                      </>

                    )}

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>
      )}

    </div>
  )
}
