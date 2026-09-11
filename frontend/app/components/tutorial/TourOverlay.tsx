'use client'

import React, { useEffect, useState, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronRight, ChevronLeft } from 'lucide-react'
import { useTour } from '@/app/context/TourContext'
import { TOUR_STEPS } from './tourSteps'

interface Rect {
  top: number
  left: number
  width: number
  height: number
}

interface TooltipPos {
  top: number
  left: number
}

const PADDING = 10
const TOOLTIP_W = 340
const TOOLTIP_H = 200

export default function TourOverlay() {
  const { isTourActive, currentStep, totalSteps, stopTour, nextStep, prevStep } = useTour()
  const router = useRouter()

  // viewport-relative rects for fixed positioning
  const [targetRect, setTargetRect] = useState<Rect | null>(null)
  const [tooltipPos, setTooltipPos] = useState<TooltipPos | null>(null)

  const navigatedPageRef = useRef<string | null>(null)

  const step = TOUR_STEPS[currentStep]

  // ── Navigate to correct page ──────────────────────────────
  useEffect(() => {
    if (!isTourActive || !step) return
    if (navigatedPageRef.current !== step.page) {
      navigatedPageRef.current = step.page
      router.push(step.page)
    }
  }, [isTourActive, currentStep, step, router])

  // ── Reset page ref when tour stops ────────────────────────
  useEffect(() => {
    if (!isTourActive) {
      navigatedPageRef.current = null
      setTargetRect(null)
      setTooltipPos(null)
    }
  }, [isTourActive])

  // ── Compute spotlight + tooltip positions ─────────────────
  const measureTarget = useCallback(() => {
    if (!step) return false
    const el = document.querySelector(`[data-tour="${step.target}"]`) as HTMLElement | null
    if (!el) return false

    // Scroll element into view first, then measure after scroll settles
    el.scrollIntoView({ behavior: 'smooth', block: 'center' })

    setTimeout(() => {
      const rect = el.getBoundingClientRect()
      const vw = window.innerWidth
      const vh = window.innerHeight

      // ── Spotlight rect (viewport coords for fixed positioning) ──
      const spotTop  = rect.top  - PADDING
      const spotLeft = rect.left - PADDING
      const spotW    = rect.width  + PADDING * 2
      const spotH    = rect.height + PADDING * 2

      setTargetRect({ top: spotTop, left: spotLeft, width: spotW, height: spotH })

      // ── Tooltip position ──────────────────────────────────────
      const pos = step.position || 'bottom'
      let ttTop = 0
      let ttLeft = 0

      if (pos === 'bottom') {
        ttTop  = rect.bottom + 12
        ttLeft = rect.left
      } else if (pos === 'top') {
        ttTop  = rect.top - TOOLTIP_H - 12
        ttLeft = rect.left
      } else if (pos === 'left') {
        ttTop  = rect.top + rect.height / 2 - TOOLTIP_H / 2
        ttLeft = rect.left - TOOLTIP_W - 12
      } else { // right
        ttTop  = rect.top + rect.height / 2 - TOOLTIP_H / 2
        ttLeft = rect.right + 12
      }

      // Clamp to viewport
      ttLeft = Math.max(10, Math.min(ttLeft, vw - TOOLTIP_W - 10))
      ttTop  = Math.max(70, Math.min(ttTop, vh - TOOLTIP_H - 10))

      setTooltipPos({ top: ttTop, left: ttLeft })
    }, 600)

    return true
  }, [step])

  // ── Poll until element appears (handles page render delay) ─
  useEffect(() => {
    if (!isTourActive || !step) return

    setTargetRect(null)
    setTooltipPos(null)

    let attempts = 0
    const MAX_ATTEMPTS = 15  // 3 seconds total

    const interval = setInterval(() => {
      const found = measureTarget()
      if (found) {
        clearInterval(interval)
      } else if (++attempts >= MAX_ATTEMPTS) {
        clearInterval(interval)
        // Element not found — show centered tooltip so tour doesn't hang
        setTooltipPos({
          top: window.innerHeight / 2 - TOOLTIP_H / 2,
          left: window.innerWidth  / 2 - TOOLTIP_W / 2,
        })
      }
    }, 200)

    return () => clearInterval(interval)
  }, [isTourActive, currentStep, step, measureTarget])

  if (!isTourActive || !step) return null

  return (
    <>
      {/* ── Dark backdrop ────────────────────────────────────── */}
      <div
        className="fixed inset-0 z-[200] pointer-events-none"
        style={{ background: 'rgba(0,0,0,0.60)' }}
      />

      {/* ── Spotlight cutout around target element ───────────── */}
      {targetRect && (
        <div
          className="fixed z-[201] pointer-events-none"
          style={{
            top:    targetRect.top,
            left:   targetRect.left,
            width:  targetRect.width,
            height: targetRect.height,
            boxShadow: '0 0 0 9999px rgba(0,0,0,0.60)',
            border: '3px solid #7c3aed',
            borderRadius: '14px',
            animation: 'tourPulse 1.6s ease-in-out infinite',
          }}
        />
      )}

      {/* ── Stop Tour button (top-left) ───────────────────────── */}
      <div className="fixed top-4 left-4 z-[210]">
        <button
          onClick={stopTour}
          className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold text-sm shadow-lg transition-all"
        >
          <X size={16} />
          Stop Tour
        </button>
      </div>

      {/* ── Floating tooltip card ────────────────────────────── */}
      <AnimatePresence mode="wait">
        {tooltipPos && (
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, scale: 0.94, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 6 }}
            transition={{ duration: 0.18 }}
            className="fixed z-[210]"
            style={{
              top:   tooltipPos.top,
              left:  tooltipPos.left,
              width: TOOLTIP_W,
            }}
          >
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-purple-100">

              {/* Header */}
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-white font-bold text-sm leading-tight">{step.title}</span>
                  <span className="text-purple-200 text-xs font-semibold shrink-0 ml-2">
                    {currentStep + 1} / {totalSteps}
                  </span>
                </div>
                {/* Progress bar */}
                <div className="h-1 bg-purple-400/40 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white rounded-full transition-all duration-400"
                    style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
                  />
                </div>
              </div>

              {/* Body */}
              <div className="px-5 py-4">
                <p className="text-slate-600 text-sm leading-relaxed">{step.description}</p>
                <p className="mt-2 text-xs text-purple-400 font-medium">📍 {step.page}</p>
              </div>

              {/* Footer */}
              <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                {currentStep > 0 ? (
                  <button
                    onClick={prevStep}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded-lg transition-colors"
                  >
                    <ChevronLeft size={15} /> Back
                  </button>
                ) : (
                  <div />
                )}
                <button
                  onClick={nextStep}
                  className="flex items-center gap-1 px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold rounded-xl shadow transition-colors"
                >
                  {currentStep === totalSteps - 1 ? '🎉 Finish' : 'Next'}
                  {currentStep < totalSteps - 1 && <ChevronRight size={15} />}
                </button>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Pulse keyframe ───────────────────────────────────── */}
      <style>{`
        @keyframes tourPulse {
          0%, 100% {
            box-shadow: 0 0 0 9999px rgba(0,0,0,0.60), 0 0 0 4px rgba(124,58,237,0.7);
          }
          50% {
            box-shadow: 0 0 0 9999px rgba(0,0,0,0.60), 0 0 0 9px rgba(124,58,237,0.2);
          }
        }
      `}</style>
    </>
  )
}
