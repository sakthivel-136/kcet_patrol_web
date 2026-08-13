'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ShieldCheck, Eye, EyeOff, ArrowRight } from 'lucide-react'
import { sanitize, fullValidate } from '@/app/lib/sanitize'
import { getApiUrl } from '@/app/utils/apiUrl'
import { tokenService } from '@/app/services/token.service'

export default function LoginPage() {
  const router = useRouter()

  const [userId, setUserId]      = useState('')
  const [password, setPassword]  = useState('')
  const [showPwd, setShowPwd]    = useState(false)
  const [loading, setLoading]    = useState(false)
  const [error, setError]        = useState<string | null>(null)
  const [success, setSuccess]    = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError(null)

    const idErr  = fullValidate(userId,   'User ID',  { min: 1, max: 50 })
    const pwdErr = fullValidate(password, 'Password', { min: 1, max: 100 })
    if (idErr || pwdErr) {
      setError(idErr || pwdErr || 'Invalid input')
      setLoading(false)
      return
    }

    try {
      const apiUrl = getApiUrl()
      const res = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', accept: 'application/json' },
        body: JSON.stringify({ user_id: userId, user_pin: password }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err?.detail || 'Invalid credentials')
      }
      const data = await res.json()
      const userRole = (data.role || '').toUpperCase()
      
      if (userRole === 'GUARD') {
        throw new Error('Access denied. Guards cannot login to the web portal.')
      }
      
      localStorage.clear()
      tokenService.set(data.access_token)
      localStorage.setItem('role', userRole)
      localStorage.setItem('name', sanitize(data.name || ''))
      localStorage.setItem('adminName', sanitize(data.name || ''))
      setSuccess(true)
      
      const destination = userRole === 'ADMIN' ? '/dashboard' : '/report-download'
      setTimeout(() => router.push(destination), 900)
    } catch (err: any) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950 text-white selection:bg-white/30 px-4">
      
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] z-0"></div>

      <div className="relative z-10 w-full max-w-[380px]">
        {/* Header */}
        <div className="flex flex-col items-center mb-8 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-white text-black flex items-center justify-center shadow-[0_0_40px_rgba(255,255,255,0.3)]">
            <ShieldCheck size={28} strokeWidth={2.5} />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight">Admin Portal</h1>
            <p className="text-neutral-400 text-sm mt-1">Sign in to manage security rounds</p>
          </div>
        </div>

        {/* Card */}
        <div className="bg-neutral-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
          {success ? (
            <div className="flex flex-col items-center py-12 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center animate-bounce">
                <ShieldCheck size={32} />
              </div>
              <div className="text-center">
                <p className="text-white font-medium text-lg">Authentication Successful</p>
                <p className="text-neutral-400 text-sm mt-1">Preparing your dashboard...</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-4">
                {/* User ID */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-neutral-300">User ID</label>
                  <input
                    value={userId}
                    onChange={e => setUserId(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 focus:border-white/30 focus:bg-black text-white placeholder-neutral-600 outline-none transition-all"
                    placeholder="Enter your user ID"
                    required 
                    autoComplete="username"
                  />
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-neutral-300">Password</label>
                  <div className="relative">
                    <input
                      type={showPwd ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="w-full px-4 pr-12 py-3 rounded-xl bg-black/50 border border-white/10 focus:border-white/30 focus:bg-black text-white placeholder-neutral-600 outline-none transition-all"
                      placeholder="••••••••"
                      required 
                      autoComplete="current-password"
                    />
                    <button 
                      type="button" 
                      tabIndex={-1}
                      onClick={() => setShowPwd(!showPwd)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white transition-colors"
                    >
                      {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Error Alert */}
              {error && (
                <div className="flex items-center gap-2 rounded-xl px-4 py-3 bg-red-500/10 border border-red-500/20 text-sm text-red-400">
                  <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10A8 8 0 11 2 10a8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <button 
                type="submit" 
                disabled={loading || !userId || !password}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-white text-black font-semibold hover:bg-neutral-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                ) : (
                  <>Sign In <ArrowRight size={18} /></>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-neutral-600 mt-8">
          © {new Date().getFullYear()} KCET Security Rounds Management
        </p>
      </div>
    </div>
  )
}
