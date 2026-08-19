'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { ShieldCheck, Eye, EyeOff, ArrowRight, Lock, User } from 'lucide-react'
import { sanitize, fullValidate } from '@/app/lib/sanitize'
import { getApiUrl } from '@/app/utils/apiUrl'
import { tokenService } from '@/app/services/token.service'
import { motion, AnimatePresence } from 'framer-motion'

/* ── Floating orbs background ──────────────────── */
function FloatingOrbs() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {[
        { w: 520, h: 520, top: '-10%', left: '-8%',  bg: 'rgba(109,40,217,.13)',  dur: 18 },
        { w: 400, h: 400, top: '60%',  left: '72%',  bg: 'rgba(217,119,6,.10)',   dur: 22 },
        { w: 300, h: 300, top: '35%',  left: '40%',  bg: 'rgba(139,92,246,.08)',  dur: 16 },
        { w: 260, h: 260, top: '80%',  left: '5%',   bg: 'rgba(245,158,11,.07)',  dur: 25 },
      ].map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-3xl"
          style={{ width: orb.w, height: orb.h, top: orb.top, left: orb.left, background: orb.bg }}
          animate={{ scale: [1, 1.12, 1], x: [0, 20, 0], y: [0, -15, 0] }}
          transition={{ duration: orb.dur, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  )
}

/* ── Animated grid overlay ──────────────────────── */
function GridOverlay() {
  return (
    <div
      className="fixed inset-0 pointer-events-none opacity-[0.025]"
      aria-hidden
      style={{
        backgroundImage: 'linear-gradient(#6d28d9 1px, transparent 1px), linear-gradient(to right, #6d28d9 1px, transparent 1px)',
        backgroundSize: '48px 48px',
      }}
    />
  )
}

export default function LoginPage() {
  const router = useRouter()

  const [userId, setUserId]     = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd]   = useState(false)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState<string | null>(null)
  const [success, setSuccess]   = useState(false)
  const [mounted, setMounted]   = useState(false)

  useEffect(() => { setMounted(true) }, [])

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
      setTimeout(() => router.push(destination), 1000)
    } catch (err: any) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      <FloatingOrbs />
      <GridOverlay />

      <AnimatePresence>
        {mounted && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0,  scale: 1    }}
            exit   ={{ opacity: 0, y: -12               }}
            transition={{ duration: 0.55, ease: [.22,1,.36,1] }}
            className="relative z-10 w-full max-w-[400px]"
          >
            {/* ── Logo & Title ─────────────────────── */}
            <div className="flex flex-col items-center mb-8 space-y-4">
              <motion.div
                whileHover={{ scale: 1.08, rotate: 6 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="relative w-16 h-16"
              >
                {/* Glow ring */}
                <div className="absolute inset-0 rounded-2xl bg-purple-500/30 blur-xl scale-125 animate-pulse" />
                <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-violet-700
                                text-white flex items-center justify-center shadow-2xl shadow-purple-500/40">
                  <ShieldCheck size={32} strokeWidth={2} />
                </div>
              </motion.div>

              <div className="text-center">
                <h1 className="text-3xl font-extrabold tracking-tight text-purple-950">
                  KCET <span className="text-gradient">SECURITY</span>
                </h1>
                <p className="text-purple-500/80 font-medium text-sm mt-1 tracking-wide uppercase text-xs">
                  Admin Control Panel
                </p>
              </div>
            </div>

            {/* ── Card ───────────────────────────────── */}
            <div className="glass-panel rounded-3xl p-8 shadow-2xl shadow-purple-900/10 border border-purple-100/60">
              <AnimatePresence mode="wait">
                {success ? (
                  <motion.div
                    key="success"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex flex-col items-center py-10 space-y-4"
                  >
                    <div className="relative w-20 h-20">
                      <div className="absolute inset-0 rounded-full bg-emerald-400/20 blur-xl scale-125 anim-pulse-ring" />
                      <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500
                                      text-white flex items-center justify-center shadow-xl shadow-emerald-400/30">
                        <ShieldCheck size={36} />
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-purple-900 font-bold text-lg">Authentication Successful</p>
                      <p className="text-purple-500 text-sm mt-1">Redirecting to your dashboard…</p>
                    </div>
                    <div className="flex gap-1 mt-2">
                      {[0,1,2].map(i => (
                        <motion.div
                          key={i}
                          className="w-2 h-2 rounded-full bg-purple-400"
                          animate={{ scale: [1, 1.6, 1], opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 1, delay: i * 0.2, repeat: Infinity }}
                        />
                      ))}
                    </div>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={handleLogin}
                    className="space-y-5"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {/* User ID */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-widest text-purple-500">
                        User ID
                      </label>
                      <div className="relative">
                        <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-300" />
                        <input
                          value={userId}
                          onChange={e => setUserId(e.target.value)}
                          className="input-field pl-10"
                          placeholder="Enter your user ID"
                          required
                          autoComplete="username"
                        />
                      </div>
                    </div>

                    {/* Password */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-widest text-purple-500">
                        Password
                      </label>
                      <div className="relative">
                        <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-300" />
                        <input
                          type={showPwd ? 'text' : 'password'}
                          value={password}
                          onChange={e => setPassword(e.target.value)}
                          className="input-field pl-10 pr-12"
                          placeholder="••••••••"
                          required
                          autoComplete="current-password"
                        />
                        <button
                          type="button"
                          tabIndex={-1}
                          onClick={() => setShowPwd(!showPwd)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-purple-300 hover:text-purple-600 transition-colors"
                        >
                          {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>

                    {/* Error */}
                    <AnimatePresence>
                      {error && (
                        <motion.div
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          className="flex items-center gap-2 rounded-xl px-4 py-3
                                     bg-rose-50 border border-rose-200 text-sm text-rose-600"
                        >
                          <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10A8 8 0 11 2 10a8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          {error}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Submit */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      type="submit"
                      disabled={loading}
                      className="btn-primary w-full flex justify-center items-center gap-2 py-3"
                    >
                      {loading ? (
                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          Sign In
                          <ArrowRight size={17} />
                        </>
                      )}
                    </motion.button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            <p className="text-center text-xs text-purple-400/60 mt-6 tracking-wide">
              © {new Date().getFullYear()} KCET Security Rounds Management
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
