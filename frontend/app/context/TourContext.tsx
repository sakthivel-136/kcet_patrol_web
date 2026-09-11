'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'

interface TourContextType {
  isTourActive: boolean
  currentStep: number
  totalSteps: number
  startTour: () => void
  stopTour: () => void
  nextStep: () => void
  prevStep: () => void
}

const TourContext = createContext<TourContextType>({
  isTourActive: false,
  currentStep: 0,
  totalSteps: 15,
  startTour: () => {},
  stopTour: () => {},
  nextStep: () => {},
  prevStep: () => {},
})

export const useTour = () => useContext(TourContext)

export function TourProvider({ children }: { children: React.ReactNode }) {
  const [isTourActive, setIsTourActive] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const totalSteps = 15

  const startTour = useCallback(() => {
    setCurrentStep(0)
    setIsTourActive(true)
  }, [])

  const stopTour = useCallback(() => {
    setIsTourActive(false)
    setCurrentStep(0)
  }, [])

  const nextStep = useCallback(() => {
    setCurrentStep(prev => {
      if (prev >= totalSteps - 1) {
        setIsTourActive(false)
        return 0
      }
      return prev + 1
    })
  }, [totalSteps])

  const prevStep = useCallback(() => {
    setCurrentStep(prev => Math.max(0, prev - 1))
  }, [])

  return (
    <TourContext.Provider value={{ isTourActive, currentStep, totalSteps, startTour, stopTour, nextStep, prevStep }}>
      {children}
    </TourContext.Provider>
  )
}
