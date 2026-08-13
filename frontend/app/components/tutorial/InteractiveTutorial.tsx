'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronRight, ChevronLeft, Map, ShieldCheck, Mail, Phone, Code } from 'lucide-react'

interface InteractiveTutorialProps {
  isOpen: boolean
  onClose: () => void
}

export default function InteractiveTutorial({ isOpen, onClose }: InteractiveTutorialProps) {
  const [step, setStep] = useState(1)
  const totalSteps = 3

  const nextStep = () => {
    if (step < totalSteps) setStep(step + 1)
  }

  const prevStep = () => {
    if (step > 1) setStep(step - 1)
  }

  const resetAndClose = () => {
    onClose()
    setTimeout(() => setStep(1), 300)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={resetAndClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100]"
          />

        <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-full pointer-events-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 pb-4 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-800">App Guide</h2>
              <button
                onClick={resetAndClose}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-6 relative">
              <AnimatePresence mode="wait">
                
                {/* Step 1: Overview */}
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-4 mx-auto">
                      <Map size={32} />
                    </div>
                    <div className="text-center">
                      <h3 className="text-xl font-bold text-slate-800">System Overview</h3>
                      <p className="mt-2 text-slate-600 text-sm leading-relaxed">
                        Welcome to KCET Security Rounds Management. This platform is designed to provide real-time visibility into patrol operations, ensuring every location is verified and secured on schedule.
                      </p>
                    </div>
                    
                    <div className="space-y-3 mt-6">
                      <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100">
                        <div className="w-2 h-2 mt-2 rounded-full bg-indigo-500 shrink-0"></div>
                        <p className="text-sm text-slate-700"><strong>Live Tracking:</strong> Monitor scan logs as they happen directly on the Dashboard.</p>
                      </div>
                      <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100">
                        <div className="w-2 h-2 mt-2 rounded-full bg-emerald-500 shrink-0"></div>
                        <p className="text-sm text-slate-700"><strong>Automated Accountability:</strong> Missed rounds are automatically logged with the specific guards assigned to that shift.</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Instructions */}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 mb-4 mx-auto">
                      <ShieldCheck size={32} />
                    </div>
                    <div className="text-center">
                      <h3 className="text-xl font-bold text-slate-800">How to Perform Rounds</h3>
                      <p className="mt-2 text-slate-600 text-sm leading-relaxed">
                        Security personnel execute their duties using the mobile application.
                      </p>
                    </div>

                    <div className="space-y-4 mt-6">
                      <div className="flex gap-4">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-100 text-slate-600 font-bold flex items-center justify-center text-sm">1</div>
                        <div>
                          <h4 className="font-semibold text-slate-800 text-sm">Scan QR Codes</h4>
                          <p className="text-xs text-slate-500 mt-1">Guards navigate to designated checkpoints and scan the physical QR tags during their hourly window.</p>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-100 text-slate-600 font-bold flex items-center justify-center text-sm">2</div>
                        <div>
                          <h4 className="font-semibold text-slate-800 text-sm">Location Verification</h4>
                          <p className="text-xs text-slate-500 mt-1">The app automatically logs GPS coordinates (Latitude/Longitude) to verify the guard is actually on site.</p>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-100 text-slate-600 font-bold flex items-center justify-center text-sm">3</div>
                        <div>
                          <h4 className="font-semibold text-slate-800 text-sm">Admin Review</h4>
                          <p className="text-xs text-slate-500 mt-1">Use the Reports tab to download PDF analytics of daily performance.</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Developer Support */}
                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 mb-4 mx-auto">
                      <Code size={32} />
                    </div>
                    <div className="text-center">
                      <h3 className="text-xl font-bold text-slate-800">Developer Support</h3>
                      <p className="mt-2 text-slate-600 text-sm leading-relaxed">
                        Need technical assistance or system modifications? Contact the core development team below.
                      </p>
                    </div>

                    <div className="space-y-4 mt-6">
                      {/* Dev 1 */}
                      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="font-bold text-slate-800">C. Sakthivel</h4>
                        <p className="text-xs text-slate-500 font-medium mb-3">Lead Developer</p>
                        <div className="flex gap-2">
                          <a href="mailto:C.SAKTHIVEL1.3.2006@GMAIL.COM" className="flex-1 flex items-center justify-center gap-2 py-2 bg-slate-50 hover:bg-indigo-50 text-indigo-600 text-xs font-semibold rounded-lg border border-slate-100 transition-colors">
                            <Mail size={14} /> Email
                          </a>
                          <a href="tel:+916374052055" className="flex-1 flex items-center justify-center gap-2 py-2 bg-slate-50 hover:bg-emerald-50 text-emerald-600 text-xs font-semibold rounded-lg border border-slate-100 transition-colors">
                            <Phone size={14} /> Call
                          </a>
                        </div>
                      </div>

                      {/* Dev 2 */}
                      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="font-bold text-slate-800">Godwin Samraj</h4>
                        <p className="text-xs text-slate-500 font-medium mb-3">Lead Developer</p>
                        <div className="flex gap-2">
                          <a href="mailto:23UCS008@KAMARAJENGG.EDU.IN" className="flex-1 flex items-center justify-center gap-2 py-2 bg-slate-50 hover:bg-indigo-50 text-indigo-600 text-xs font-semibold rounded-lg border border-slate-100 transition-colors">
                            <Mail size={14} /> Email
                          </a>
                          <a href="tel:+916379244349" className="flex-1 flex items-center justify-center gap-2 py-2 bg-slate-50 hover:bg-emerald-50 text-emerald-600 text-xs font-semibold rounded-lg border border-slate-100 transition-colors">
                            <Phone size={14} /> Call
                          </a>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
                
              </AnimatePresence>
            </div>

            {/* Footer Navigation */}
            <div className="p-6 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
              
              {/* Progress Dots */}
              <div className="flex items-center gap-2">
                {[1, 2, 3].map((i) => (
                  <div 
                    key={i} 
                    className={`h-2 rounded-full transition-all duration-300 ${step === i ? 'w-6 bg-indigo-600' : 'w-2 bg-slate-200'}`}
                  />
                ))}
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                {step > 1 && (
                  <button 
                    onClick={prevStep}
                    className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1"
                  >
                    <ChevronLeft size={16} /> Back
                  </button>
                )}
                
                {step < totalSteps ? (
                  <button 
                    onClick={nextStep}
                    className="px-6 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition-colors flex items-center gap-1"
                  >
                    Next <ChevronRight size={16} />
                  </button>
                ) : (
                  <button 
                    onClick={resetAndClose}
                    className="px-6 py-2 text-sm font-bold text-white bg-slate-900 hover:bg-black rounded-xl shadow-sm transition-colors"
                  >
                    Get Started
                  </button>
                )}
              </div>
            </div>
            
          </motion.div>
        </div>
        </>
      )}
    </AnimatePresence>
  )
}
