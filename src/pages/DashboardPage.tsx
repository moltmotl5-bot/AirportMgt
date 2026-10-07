import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { FlightStatusBadge } from '../components/StatusBadge'
import { useAirport } from '../context/AirportContext'
import { formatDateTime, gateLabel } from '../utils/format'

export function DashboardPage() {
  const { data } = useAirport()

  const stats = useMemo(() => {
    const boarding = data.flights.filter((f) => f.status === 'BOARDING').length
    const delayed = data.flights.filter((f) => f.status === 'DELAYED').length
    const checkedIn = data.passengers.filter((p) => p.checkedIn).length
    const gatesFree = data.gates.filter((g) => g.status === 'AVAILABLE').length
    return { boarding, delayed, checkedIn, gatesFree }
  }, [data])

  const upcoming = useMemo(
    () =>
      [...data.flights]
        .sort(
          (a, b) =>
            new Date(a.scheduledDeparture).getTime() -
            new Date(b.scheduledDeparture).getTime(),
        )
        .slice(0, 5),
    [data.flights],
  )

  const gateById = useMemo(
    () => new Map(data.gates.map((g) => [g.id, g])),
    [data.gates],
  )

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1>營運總覽</h1>
          <p className="muted">即時掌握航班、登機門與旅客報到狀態</p>
        </div>
      </header>

      <div className="stat-grid">
        <article className="stat-card">
          <span className="stat-label">登機中航班</span>
          <strong className="stat-value">{stats.boarding}</strong>
        </article>
        <article className="stat-card">
          <span className="stat-label">延誤航班</span>
          <strong className="stat-value warn">{stats.delayed}</strong>
        </article>
        <article className="stat-card">
          <span className="stat-label">已報到旅客</span>
          <strong className="stat-value">{stats.checkedIn}</strong>
        </article>
        <article className="stat-card">
          <span className="stat-label">可用登機門</span>
          <strong className="stat-value">{stats.gatesFree}</strong>
        </article>
      </div>

      <section className="panel">
        <div className="panel-head">
          <h2>近期航班</h2>
          <Link to="/flights" className="link">
            管理航班 →
          </Link>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>航班</th>
                <th>航線</th>
                <th>起飛</th>
                <th>登機門</th>
                <th>狀態</th>
              </tr>
            </thead>
            <tbody>
              {upcoming.map((f) => {
                const gate = f.gateId ? gateById.get(f.gateId) : null
                return (
                  <tr key={f.id}>
                    <td>
                      <strong>{f.flightNumber}</strong>
                    </td>
                    <td>
                      {f.origin} → {f.destination}
                    </td>
                    <td>{formatDateTime(f.scheduledDeparture)}</td>
                    <td>
                      {gate ? gateLabel(gate.terminal, gate.number) : '—'}
                    </td>
                    <td>
                      <FlightStatusBadge status={f.status} />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
