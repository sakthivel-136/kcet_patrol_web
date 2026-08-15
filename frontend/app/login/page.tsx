'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ShieldCheck, Eye, EyeOff, ArrowRight } from 'lucide-react'
import { sanitize, fullValidate } from '@/app/lib/sanitize'
import { getApiUrl } from '@/app/utils/apiUrl'
import { tokenService } from '@/app/services/token.service'
import { motion } from 'framer-motion'

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
    <div className="min-h-screen flex items-center justify-center bg-transparent text-slate-900 px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-[380px]"
      >
        <div className="flex flex-col items-center mb-8 space-y-3">
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="w-14 h-14 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-lg shadow-purple-500/30"
          >
            <ShieldCheck size={32} strokeWidth={2.5} />
          </motion.div>
          <div className="text-center">
            <h1 className="text-3xl font-extrabold tracking-tight text-purple-900">Admin Portal</h1>
            <p className="text-purple-600/80 font-medium text-sm mt-1">Sign in to manage security rounds</p>
          </div>
        </div>

        {/* Card */}
        <div className="glass-panel border border-white/60 rounded-3xl p-8 shadow-2xl">
          {success ? (
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center py-12 space-y-4"
            >
              <div className="w-16 h-16 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center animate-bounce">
                <ShieldCheck size={32} />
              </div>
              <div className="text-center">
                <p className="text-purple-900 font-bold text-lg">Authentication Successful</p>
                <p className="text-purple-600 text-sm mt-1">Preparing your dashboard...</p>
              </div>
            </motion.div>
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
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center items-center py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_4px_14px_0_rgba(147,51,234,0.39)] hover:shadow-[0_6px_20px_rgba(147,51,234,0.23)]"
                >
                  {loading ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  ) : (
                    <>
                      Sign In
                      <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </motion.button>
              </form>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-neutral-600 mt-8">
          © {new Date().getFullYear()} KCET Security Rounds Management
        </p>
      </motion.div>
    </div>
  )
}
