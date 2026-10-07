import { createContext, useContext, type ReactNode } from 'react'
import { useAirportData, type AirportDataActions } from '../hooks/useAirportData'

const AirportContext = createContext<AirportDataActions | null>(null)

export function AirportProvider({ children }: { children: ReactNode }) {
  const value = useAirportData()
  return (
    <AirportContext.Provider value={value}>{children}</AirportContext.Provider>
  )
}

export function useAirport() {
  const ctx = useContext(AirportContext)
  if (!ctx) {
    throw new Error('useAirport must be used within AirportProvider')
  }
  return ctx
}
