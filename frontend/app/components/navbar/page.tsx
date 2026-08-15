'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { Menu, X, User } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { clearAuth } from '@/app/services/token.service'
import InteractiveTutorial from '../tutorial/InteractiveTutorial'
import AppDownloadModal from './AppDownloadModal'

const Navbar = () => {
  const pathname = usePathname()
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isTutorialOpen, setIsTutorialOpen] = useState(false)
  const [isAppDownloadOpen, setIsAppDownloadOpen] = useState(false)
  const [userRole, setUserRole] = useState<string>('')
  const userMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setUserRole(localStorage.getItem('role')?.toUpperCase() || '')
  }, [])

  const handleLogout = () => {
    clearAuth()
    setIsUserMenuOpen(false)
    setIsMobileMenuOpen(false)
    router.replace('/login')
  }

  const allNavItems = [
    { name: 'Dashboard', href: '/dashboard', roles: ['ADMIN'] },
    { name: 'Reports', href: '/report-download', roles: ['ADMIN', 'SUPERVISOR'] },
    { name: 'Users Management', href: '/user-crud', roles: ['ADMIN'] },
    { name: 'QR', href: '/dashboard/qr-crud', roles: ['ADMIN'] },
    { name: 'Shifts', href: '/shifts', roles: ['ADMIN', 'SUPERVISOR'] },
  ]

  const navItems = allNavItems.filter(item => item.roles.includes(userRole))
  const isActive = (href: string) => pathname === href

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) setIsUserMenuOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <>
    <header className="sticky top-0 z-50 w-full glass-panel border-x-0 border-t-0 rounded-none bg-white/60">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
        
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2 text-slate-800 hover:opacity-80 transition-opacity">
          <div className="flex h-14 w-auto items-center overflow-hidden">
            <Image src="/logocomm.png" alt="KCET Logo" width={150} height={50} className="h-full w-auto object-contain opacity-90 hover:opacity-100 transition-opacity" priority />
          </div>
        </Link>

        {/* MOBILE TOGGLE */}
        <button className="max-[1050px]:flex hidden text-slate-600 bg-white/60 border border-slate-200 rounded-xl p-2 backdrop-blur-md" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {/* DESKTOP NAV */}
        <nav className="hidden min-[1051px]:flex items-center gap-1 rounded-full bg-white/60 border border-slate-200 px-2 py-1 shadow-sm relative backdrop-blur-xl">
          {navItems.map((item) => (
            <Link key={item.name} href={item.href} className="relative z-10">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex items-center">
                {isActive(item.href) && (
                  <motion.div layoutId="nav-pill" className="absolute inset-0 bg-purple-100 border border-purple-200 rounded-full shadow-sm" transition={{ type: "spring", stiffness: 380, damping: 30 }} />
                )}
                <span className={`px-4 py-2 text-sm font-semibold rounded-full z-10 transition-colors ${isActive(item.href) ? 'text-purple-700' : 'text-slate-600 hover:text-purple-600'}`}>
                  {item.name}
                </span>
              </motion.div>
            </Link>
          ))}

          {/* USER AVATAR */}
          <div className="relative ml-2 z-50" ref={userMenuRef}>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-50 border border-purple-100 hover:bg-purple-100 hover:shadow-sm transition-all">
              <User className="h-5 w-5 text-purple-600" />
            </motion.button>
            <AnimatePresence>
              {isUserMenuOpen && (
                <motion.div initial={{ opacity: 0, scale: 0.95, y: -5 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: -5 }} className="absolute right-0 mt-3 w-44 rounded-2xl glass-panel p-2 shadow-lg border-slate-200">
                  <button onClick={() => { setIsTutorialOpen(true); setIsUserMenuOpen(false); }} className="block w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors">App Guide</button>
                  <button onClick={() => router.push('/login')} className="block w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors">Switch User</button>
                  <button onClick={handleLogout} className="block w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors">Log out</button>
                  <button onClick={() => { setIsAppDownloadOpen(true); setIsUserMenuOpen(false); }} className="block w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium text-purple-600 hover:text-purple-700 hover:bg-purple-50 transition-colors mt-1 border-t border-slate-100">Download App</button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>
      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="max-[1050px]:block hidden border-t border-slate-100 bg-white/95 backdrop-blur-xl overflow-hidden">
            <div className="px-4 py-4 space-y-2">
              {navItems.map((item) => (
                <Link key={item.name} href={item.href} onClick={() => setIsMobileMenuOpen(false)} className={`block rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${isActive(item.href) ? 'bg-purple-50 border border-purple-100 text-purple-700 shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}>
                  {item.name}
                </Link>
              ))}
              <div className="border-t border-slate-100 mt-4 pt-4 space-y-2">
                <button onClick={() => { setIsTutorialOpen(true); setIsMobileMenuOpen(false); }} className="block w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50">App Guide</button>
                <button onClick={() => router.push('/login')} className="block w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50">Switch User</button>
                <button onClick={() => { setIsAppDownloadOpen(true); setIsMobileMenuOpen(false); }} className="block w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-purple-600 hover:text-purple-700 hover:bg-purple-50">Download App</button>
                <button onClick={handleLogout} className="block w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50">Log out</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
    <InteractiveTutorial isOpen={isTutorialOpen} onClose={() => setIsTutorialOpen(false)} />
    <AppDownloadModal isOpen={isAppDownloadOpen} onClose={() => setIsAppDownloadOpen(false)} />
    </>
  )
}

export default Navbar