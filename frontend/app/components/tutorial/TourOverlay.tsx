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

const PADDING = 10

export default function TourOverlay() {
  const { isTourActive, currentStep, totalSteps, stopTour, nextStep, prevStep } = useTour()
  const router = useRouter()
  const [targetRect, setTargetRect] = useState<Rect | null>(null)
  const [tooltipPos, setTooltipPos] = useState<{ top: number; left: number } | null>(null)
  const navigatedRef = useRef<string | null>(null)

  const step = TOUR_STEPS[currentStep]

  // Navigate to the correct page when step changes
  useEffect(() => {
    if (!isTourActive || !step) return
    if (navigatedRef.current !== step.page) {
      navigatedRef.current = step.page
      router.push(step.page)
    }
  }, [isTourActive, currentStep, step, router])

  // Find and highlight the target element
  const measureTarget = useCallback(() => {
    if (!step) return
    const el = document.querySelector(`[data-tour="${step.target}"]`) as HTMLElement | null
    if (!el) return

    el.scrollIntoView({ behavior: 'smooth', block: 'center' })

    setTimeout(() => {
      const rect = el.getBoundingClientRect()
      setTargetRect({
        top: rect.top + window.scrollY - PADDING,
        left: rect.left + window.scrollX - PADDING,
        width: rect.width + PADDING * 2,
        height: rect.height + PADDING * 2,
      })

      // Calculate tooltip position
      const win = { w: window.innerWidth, h: window.innerHeight }
      const pos = step.position || 'bottom'
      let tooltipTop = 0
      let tooltipLeft = 0
      const TW = 340 // tooltip width approx
      const TH = 180 // tooltip height approx

      const absTop = rect.top + window.scrollY
      const absLeft = rect.left + window.scrollX

      if (pos === 'bottom') {
        tooltipTop = absTop + rect.height + PADDING + 10
        tooltipLeft = Math.min(absLeft, window.scrollX + win.w - TW - 20)
      } else if (pos === 'top') {
        tooltipTop = absTop - TH - PADDING - 10
        tooltipLeft = Math.min(absLeft, window.scrollX + win.w - TW - 20)
      } else if (pos === 'left') {
        tooltipTop = absTop + rect.height / 2 - TH / 2
        tooltipLeft = absLeft - TW - PADDING - 10
      } else {
        tooltipTop = absTop + rect.height / 2 - TH / 2
        tooltipLeft = absLeft + rect.width + PADDING + 10
      }

      tooltipLeft = Math.max(10, tooltipLeft)
      tooltipTop = Math.max(70, tooltipTop)

      setTooltipPos({ top: tooltipTop, left: tooltipLeft })
    }, 700)
  }, [step])

  useEffect(() => {
    if (!isTourActive) {
      setTargetRect(null)
      setTooltipPos(null)
      return
    }
    // Retry finding the element for up to 2 seconds (page may still be rendering)
    let attempts = 0
    const interval = setInterval(() => {
      const el = document.querySelector(`[data-tour="${step?.target}"]`)
      if (el) {
        measureTarget()
        clearInterval(interval)
      } else if (++attempts > 10) {
        clearInterval(interval)
        // Element not found, just clear rect and show tooltip at center
        setTargetRect(null)
        setTooltipPos({ top: 200, left: window.innerWidth / 2 - 170 })
      }
    }, 200)
    return () => clearInterval(interval)
  }, [isTourActive, currentStep, step, measureTarget])

  if (!isTourActive || !step) return null

  return (
    <>
      {/* Dark backdrop overlay */}
      <div
        className="fixed inset-0 z-[200] pointer-events-none"
        style={{ background: 'rgba(0,0,0,0.55)' }}
      />

      {/* Spotlight — transparent cutout around the target element */}
      {targetRect && (
        <div
          className="fixed z-[201] pointer-events-none rounded-2xl"
          style={{
            top: targetRect.top,
            left: targetRect.left,
            width: targetRect.width,
            height: targetRect.height,
            boxShadow: '0 0 0 9999px rgba(0,0,0,0.55)',
            border: '3px solid #7c3aed',
            borderRadius: '14px',
            animation: 'tourPulse 1.5s ease-in-out infinite',
          }}
        />
      )}

      {/* Stop Tour button (top-left, always visible) */}
      <div className="fixed top-4 left-4 z-[210]">
        <button
          onClick={stopTour}
          className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold text-sm shadow-lg transition-all"
        >
          <X size={16} />
          Stop Tour
        </button>
      </div>

      {/* Tooltip card */}
      <AnimatePresence mode="wait">
        {tooltipPos && (
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.2 }}
            className="fixed z-[210] w-[340px]"
            style={{ top: tooltipPos.top, left: tooltipPos.left }}
          >
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-purple-100">
              {/* Header */}
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-3">
                <div className="flex items-center justify-between">
                  <span className="text-white font-bold text-base">{step.title}</span>
                  <span className="text-purple-200 text-xs font-medium">
                    {currentStep + 1} / {totalSteps}
                  </span>
                </div>
                {/* Progress bar */}
                <div className="mt-2 h-1 bg-purple-400/40 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white rounded-full transition-all duration-300"
                    style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
                  />
                </div>
              </div>

              {/* Body */}
              <div className="px-5 py-4">
                <p className="text-slate-600 text-sm leading-relaxed">{step.description}</p>
                <p className="mt-2 text-xs text-purple-400 font-medium">
                  📍 Page: {step.page}
                </p>
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
                  {currentStep === totalSteps - 1 ? 'Finish 🎉' : 'Next'} <ChevronRight size={15} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pulse animation style */}
      <style>{`
        @keyframes tourPulse {
          0%, 100% { box-shadow: 0 0 0 9999px rgba(0,0,0,0.55), 0 0 0 4px rgba(124,58,237,0.6); }
          50% { box-shadow: 0 0 0 9999px rgba(0,0,0,0.55), 0 0 0 8px rgba(124,58,237,0.3); }
        }
      `}</style>
    </>
  )
}
