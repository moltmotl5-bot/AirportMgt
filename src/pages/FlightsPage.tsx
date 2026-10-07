import { type FormEvent, useMemo, useState } from 'react'
import { FlightStatusBadge } from '../components/StatusBadge'
import { useAirport } from '../context/AirportContext'
import type { Flight, FlightStatus } from '../types'
import {
  formatDateTime,
  gateLabel,
  localInputToIso,
  newId,
  toLocalDateTimeInput,
} from '../utils/format'

const statuses: FlightStatus[] = [
  'SCHEDULED',
  'BOARDING',
  'DEPARTED',
  'DELAYED',
  'CANCELLED',
]

const emptyForm = (): Omit<Flight, 'id'> => ({
  flightNumber: '',
  origin: '',
  destination: '',
  scheduledDeparture: toLocalDateTimeInput(
    new Date(Date.now() + 3600000).toISOString(),
  ),
  gateId: null,
  status: 'SCHEDULED',
})

export function FlightsPage() {
  const { data, upsertFlight, deleteFlight } = useAirport()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm())

  const gateById = useMemo(
    () => new Map(data.gates.map((g) => [g.id, g])),
    [data.gates],
  )

  function startEdit(flight: Flight) {
    setEditingId(flight.id)
    setForm({
      flightNumber: flight.flightNumber,
      origin: flight.origin,
      destination: flight.destination,
      scheduledDeparture: toLocalDateTimeInput(flight.scheduledDeparture),
      gateId: flight.gateId,
      status: flight.status,
    })
  }

  function cancelEdit() {
    setEditingId(null)
    setForm(emptyForm())
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    const flight: Flight = {
      id: editingId ?? newId('f'),
      flightNumber: form.flightNumber.trim().toUpperCase(),
      origin: form.origin.trim().toUpperCase(),
      destination: form.destination.trim().toUpperCase(),
      scheduledDeparture: localInputToIso(form.scheduledDeparture),
      gateId: form.gateId || null,
      status: form.status,
    }
    if (!flight.flightNumber || !flight.origin || !flight.destination) return
    upsertFlight(flight)
    cancelEdit()
  }

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1>航班管理</h1>
          <p className="muted">新增、更新航班與指派登機門</p>
        </div>
      </header>

      <div className="split">
        <form className="panel form-panel" onSubmit={onSubmit}>
          <h2>{editingId ? '編輯航班' : '新增航班'}</h2>
          <label>
            航班編號
            <input
              value={form.flightNumber}
              onChange={(e) => setForm({ ...form, flightNumber: e.target.value })}
              placeholder="AM101"
              required
            />
          </label>
          <div className="row-2">
            <label>
              出發
              <input
                value={form.origin}
                onChange={(e) => setForm({ ...form, origin: e.target.value })}
                placeholder="HKG"
                maxLength={3}
                required
              />
            </label>
            <label>
              目的地
              <input
                value={form.destination}
                onChange={(e) =>
                  setForm({ ...form, destination: e.target.value })
                }
                placeholder="TPE"
                maxLength={3}
                required
              />
            </label>
          </div>
          <label>
            預定起飛
            <input
              type="datetime-local"
              value={form.scheduledDeparture}
              onChange={(e) =>
                setForm({ ...form, scheduledDeparture: e.target.value })
              }
              required
            />
          </label>
          <label>
            登機門
            <select
              value={form.gateId ?? ''}
              onChange={(e) =>
                setForm({
                  ...form,
                  gateId: e.target.value ? e.target.value : null,
                })
              }
            >
              <option value="">未指派</option>
              {data.gates.map((g) => (
                <option key={g.id} value={g.id}>
                  {gateLabel(g.terminal, g.number)} ({g.status})
                </option>
              ))}
            </select>
          </label>
          <label>
            狀態
            <select
              value={form.status}
              onChange={(e) =>
                setForm({ ...form, status: e.target.value as FlightStatus })
              }
            >
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
          <div className="form-actions">
            <button type="submit" className="btn primary">
              {editingId ? '儲存' : '新增'}
            </button>
            {editingId && (
              <button type="button" className="btn ghost" onClick={cancelEdit}>
                取消
              </button>
            )}
          </div>
        </form>

        <section className="panel flex-grow">
          <h2>航班列表</h2>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>航班</th>
                  <th>航線</th>
                  <th>起飛</th>
                  <th>登機門</th>
                  <th>狀態</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {data.flights.map((f) => {
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
                      <td className="actions">
                        <button
                          type="button"
                          className="btn tiny"
                          onClick={() => startEdit(f)}
                        >
                          編輯
                        </button>
                        <button
                          type="button"
                          className="btn tiny danger"
                          onClick={() => deleteFlight(f.id)}
                        >
                          刪除
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  )
}
