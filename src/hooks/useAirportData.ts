import { useCallback, useEffect, useState } from 'react'
import { createSeedData, STORAGE_KEY } from '../data/seed'
import type { AirportData, Flight, Gate, Passenger } from '../types'

function loadData(): AirportData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      return JSON.parse(raw) as AirportData
    }
  } catch {
    /* ignore corrupt storage */
  }
  const seed = createSeedData()
  localStorage.setItem(STORAGE_KEY, JSON.stringify(seed))
  return seed
}

function persist(data: AirportData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function useAirportData() {
  const [data, setData] = useState<AirportData>(() => loadData())

  useEffect(() => {
    persist(data)
  }, [data])

  const resetToSeed = useCallback(() => {
    const seed = createSeedData()
    setData(seed)
  }, [])

  const upsertGate = useCallback((gate: Gate) => {
    setData((prev) => {
      const exists = prev.gates.some((g) => g.id === gate.id)
      const gates = exists
        ? prev.gates.map((g) => (g.id === gate.id ? gate : g))
        : [...prev.gates, gate]
      return { ...prev, gates }
    })
  }, [])

  const deleteGate = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      gates: prev.gates.filter((g) => g.id !== id),
      flights: prev.flights.map((f) =>
        f.gateId === id ? { ...f, gateId: null } : f,
      ),
    }))
  }, [])

  const upsertFlight = useCallback((flight: Flight) => {
    setData((prev) => {
      const exists = prev.flights.some((f) => f.id === flight.id)
      const flights = exists
        ? prev.flights.map((f) => (f.id === flight.id ? flight : f))
        : [...prev.flights, flight]
      return { ...prev, flights }
    })
  }, [])

  const deleteFlight = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      flights: prev.flights.filter((f) => f.id !== id),
      passengers: prev.passengers.filter((p) => p.flightId !== id),
    }))
  }, [])

  const upsertPassenger = useCallback((passenger: Passenger) => {
    setData((prev) => {
      const exists = prev.passengers.some((p) => p.id === passenger.id)
      const passengers = exists
        ? prev.passengers.map((p) => (p.id === passenger.id ? passenger : p))
        : [...prev.passengers, passenger]
      return { ...prev, passengers }
    })
  }, [])

  const deletePassenger = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      passengers: prev.passengers.filter((p) => p.id !== id),
    }))
  }, [])

  return {
    data,
    resetToSeed,
    upsertGate,
    deleteGate,
    upsertFlight,
    deleteFlight,
    upsertPassenger,
    deletePassenger,
  }
}

export type AirportDataActions = ReturnType<typeof useAirportData>
