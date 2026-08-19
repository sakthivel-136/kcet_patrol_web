'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { Menu, X, User, LayoutDashboard, FileText, Users, QrCode, Clock, LogOut, BookOpen, Smartphone, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { clearAuth } from '@/app/services/token.service'
import InteractiveTutorial from '../tutorial/InteractiveTutorial'
import AppDownloadModal from './AppDownloadModal'

const navIcons: Record<string, React.ReactNode> = {
  'Dashboard':        <LayoutDashboard size={15} />,
  'Reports':          <FileText size={15} />,
  'Users Management': <Users size={15} />,
  'QR':               <QrCode size={15} />,
  'Shifts':           <Clock size={15} />,
}

const Navbar = () => {
  const pathname     = usePathname()
  const router       = useRouter()
  const userMenuRef  = useRef<HTMLDivElement>(null)

  const [isMobileMenuOpen, setIsMobileMenuOpen]   = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen]         = useState(false)
  const [isTutorialOpen, setIsTutorialOpen]         = useState(false)
  const [isAppDownloadOpen, setIsAppDownloadOpen]   = useState(false)
  const [userRole, setUserRole]                     = useState<string>('')
  const [userName, setUserName]                     = useState<string>('')
  const [scrolled, setScrolled]                     = useState(false)

  useEffect(() => {
    setUserRole(localStorage.getItem('role')?.toUpperCase() || '')
    setUserName(localStorage.getItem('name') || '')
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node))
        setIsUserMenuOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    clearAuth()
    setIsUserMenuOpen(false)
    setIsMobileMenuOpen(false)
    router.replace('/login')
  }

  const allNavItems = [
    { name: 'Dashboard',        href: '/dashboard',       roles: ['ADMIN'] },
    { name: 'Reports',          href: '/report-download', roles: ['ADMIN', 'SUPERVISOR'] },
    { name: 'Users Management', href: '/user-crud',       roles: ['ADMIN'] },
    { name: 'QR',               href: '/dashboard/qr-crud', roles: ['ADMIN'] },
    { name: 'Shifts',           href: '/shifts',          roles: ['ADMIN', 'SUPERVISOR'] },
  ]

  const navItems = allNavItems.filter(item => item.roles.includes(userRole))
  const isActive = (href: string) => pathname === href

  const initials = userName ? userName.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase() : '?'

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? 'bg-white/80 backdrop-blur-2xl border-b border-purple-100/60 shadow-lg shadow-purple-900/5'
            : 'bg-white/60 backdrop-blur-xl border-b border-white/40'
        }`}
      >
        <div className="container mx-auto flex h-18 items-center justify-between px-4 md:px-6 py-3">

          {/* LOGO */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="flex h-12 w-auto items-center overflow-hidden">
              <Image
                src="/logocomm.png"
                alt="KCET Logo"
                width={140}
                height={46}
                className="h-full w-auto object-contain"
                priority
              />
            </div>
          </Link>

          {/* MOBILE TOGGLE */}
          <button
            className="min-[1051px]:hidden flex text-purple-700 bg-purple-50 border border-purple-100 rounded-xl p-2 hover:bg-purple-100 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          {/* DESKTOP NAV */}
          <nav className="hidden min-[1051px]:flex items-center gap-0.5 rounded-2xl bg-purple-50/60 border border-purple-100/80 px-2 py-1.5 shadow-inner backdrop-blur-xl">
            {navItems.map((item) => (
              <Link key={item.name} href={item.href} className="relative">
                <motion.div
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className="relative flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold"
                >
                  {isActive(item.href) && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 bg-white border border-purple-200 rounded-xl shadow-sm shadow-purple-200/50"
                      transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className={`relative z-10 transition-colors ${isActive(item.href) ? 'text-purple-700' : 'text-slate-500 hover:text-purple-600'}`}>
                    {navIcons[item.name]}
                  </span>
                  <span className={`relative z-10 transition-colors ${isActive(item.href) ? 'text-purple-700' : 'text-slate-600 hover:text-purple-600'}`}>
                    {item.name}
                  </span>
                </motion.div>
              </Link>
            ))}
          </nav>

          {/* USER AVATAR + DROPDOWN */}
          <div className="hidden min-[1051px]:flex items-center" ref={userMenuRef}>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-purple-100
                         hover:border-purple-300 hover:shadow-md hover:shadow-purple-100/50 transition-all"
            >
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-600 to-violet-500
                              text-white text-xs font-bold flex items-center justify-center shadow-sm">
                {initials}
              </div>
              <span className="text-sm font-semibold text-slate-700 max-w-[100px] truncate">
                {userName || userRole}
              </span>
              <ChevronDown
                size={14}
                className={`text-slate-400 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`}
              />
            </motion.button>

            <AnimatePresence>
              {isUserMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -6 }}
                  animate={{ opacity: 1, scale: 1,    y: 0  }}
                  exit   ={{ opacity: 0, scale: 0.95, y: -6 }}
                  transition={{ duration: 0.18 }}
                  className="absolute right-4 top-16 w-48 rounded-2xl glass-panel p-1.5 shadow-xl shadow-purple-900/10 border border-purple-100/60"
                >
                  {[
                    { label: 'App Guide',    icon: <BookOpen size={14}/>,    onClick: () => { setIsTutorialOpen(true); setIsUserMenuOpen(false) } },
                    { label: 'Switch User',  icon: <User size={14}/>,         onClick: () => router.push('/login') },
                    { label: 'Download App', icon: <Smartphone size={14}/>,   onClick: () => { setIsAppDownloadOpen(true); setIsUserMenuOpen(false) }, gold: true },
                    { label: 'Log out',      icon: <LogOut size={14}/>,       onClick: handleLogout, danger: true },
                  ].map(({ label, icon, onClick, gold, danger }) => (
                    <button
                      key={label}
                      onClick={onClick}
                      className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors
                        ${danger ? 'text-rose-600 hover:bg-rose-50'
                          : gold ? 'text-amber-700 hover:bg-amber-50'
                          : 'text-slate-600 hover:text-purple-700 hover:bg-purple-50/60'}`}
                    >
                      {icon} {label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* MOBILE MENU */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit   ={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22 }}
              className="min-[1051px]:hidden border-t border-purple-50 bg-white/95 backdrop-blur-2xl overflow-hidden"
            >
              <div className="px-4 py-4 space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-colors
                      ${isActive(item.href)
                        ? 'bg-purple-50 border border-purple-100 text-purple-700'
                        : 'text-slate-600 hover:text-purple-600 hover:bg-purple-50/50'}`}
                  >
                    {navIcons[item.name]} {item.name}
                  </Link>
                ))}
                <div className="border-t border-purple-50 mt-2 pt-2 space-y-1">
                  <button onClick={() => { setIsTutorialOpen(true); setIsMobileMenuOpen(false) }} className="w-full flex items-center gap-3 text-left px-4 py-3 rounded-xl text-sm font-medium text-slate-600 hover:text-purple-700 hover:bg-purple-50/50"><BookOpen size={14}/> App Guide</button>
                  <button onClick={() => router.push('/login')} className="w-full flex items-center gap-3 text-left px-4 py-3 rounded-xl text-sm font-medium text-slate-600 hover:text-purple-700 hover:bg-purple-50/50"><User size={14}/> Switch User</button>
                  <button onClick={() => { setIsAppDownloadOpen(true); setIsMobileMenuOpen(false) }} className="w-full flex items-center gap-3 text-left px-4 py-3 rounded-xl text-sm font-medium text-amber-700 hover:bg-amber-50"><Smartphone size={14}/> Download App</button>
                  <button onClick={handleLogout} className="w-full flex items-center gap-3 text-left px-4 py-3 rounded-xl text-sm font-medium text-rose-600 hover:bg-rose-50"><LogOut size={14}/> Log out</button>
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