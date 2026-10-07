import type { FlightStatus, GateStatus } from '../types'

const flightLabels: Record<FlightStatus, string> = {
  SCHEDULED: '排程中',
  BOARDING: '登機中',
  DEPARTED: '已離站',
  DELAYED: '延誤',
  CANCELLED: '取消',
}

const gateLabels: Record<GateStatus, string> = {
  AVAILABLE: '可用',
  OCCUPIED: '使用中',
  CLOSED: '關閉',
}

export function FlightStatusBadge({ status }: { status: FlightStatus }) {
  return <span className={`badge flight-${status.toLowerCase()}`}>{flightLabels[status]}</span>
}

export function GateStatusBadge({ status }: { status: GateStatus }) {
  return <span className={`badge gate-${status.toLowerCase()}`}>{gateLabels[status]}</span>
}
