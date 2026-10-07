import type { AirportData } from '../types'

export const STORAGE_KEY = 'airportmgt-data-v1'

export function createSeedData(): AirportData {
  const gates = [
    { id: 'g1', terminal: 'T1', number: 'A12', status: 'OCCUPIED' as const },
    { id: 'g2', terminal: 'T1', number: 'A14', status: 'AVAILABLE' as const },
    { id: 'g3', terminal: 'T2', number: 'B03', status: 'AVAILABLE' as const },
    { id: 'g4', terminal: 'T2', number: 'B07', status: 'CLOSED' as const },
  ]

  const flights = [
    {
      id: 'f1',
      flightNumber: 'AM101',
      origin: 'HKG',
      destination: 'TPE',
      scheduledDeparture: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
      gateId: 'g1',
      status: 'BOARDING' as const,
    },
    {
      id: 'f2',
      flightNumber: 'AM204',
      origin: 'TPE',
      destination: 'NRT',
      scheduledDeparture: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString(),
      gateId: 'g3',
      status: 'SCHEDULED' as const,
    },
    {
      id: 'f3',
      flightNumber: 'AM330',
      origin: 'HKG',
      destination: 'SIN',
      scheduledDeparture: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
      gateId: null,
      status: 'DELAYED' as const,
    },
  ]

  const passengers = [
    {
      id: 'p1',
      fullName: '陳美玲',
      passportNumber: 'K12345678',
      flightId: 'f1',
      seat: '12A',
      checkedIn: true,
    },
    {
      id: 'p2',
      fullName: 'John Smith',
      passportNumber: 'US99887766',
      flightId: 'f1',
      seat: '12B',
      checkedIn: false,
    },
    {
      id: 'p3',
      fullName: '王小明',
      passportNumber: 'E11223344',
      flightId: 'f2',
      seat: '8C',
      checkedIn: true,
    },
  ]

  return { gates, flights, passengers }
}
