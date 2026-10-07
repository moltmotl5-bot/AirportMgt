export type FlightStatus =
  | 'SCHEDULED'
  | 'BOARDING'
  | 'DEPARTED'
  | 'DELAYED'
  | 'CANCELLED'

export type GateStatus = 'AVAILABLE' | 'OCCUPIED' | 'CLOSED'

export interface Gate {
  id: string
  terminal: string
  number: string
  status: GateStatus
}

export interface Flight {
  id: string
  flightNumber: string
  origin: string
  destination: string
  scheduledDeparture: string
  gateId: string | null
  status: FlightStatus
}

export interface Passenger {
  id: string
  fullName: string
  passportNumber: string
  flightId: string
  seat: string
  checkedIn: boolean
}

export interface AirportData {
  gates: Gate[]
  flights: Flight[]
  passengers: Passenger[]
}
