import { type FormEvent, useMemo, useState } from 'react'
import { useAirport } from '../context/AirportContext'
import type { Passenger } from '../types'
import { newId } from '../utils/format'

const emptyForm = (): Omit<Passenger, 'id'> => ({
  fullName: '',
  passportNumber: '',
  flightId: '',
  seat: '',
  checkedIn: false,
})

export function PassengersPage() {
  const { data, upsertPassenger, deletePassenger } = useAirport()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm())
  const [filterFlight, setFilterFlight] = useState<string>('')

  const flightById = useMemo(
    () => new Map(data.flights.map((f) => [f.id, f])),
    [data.flights],
  )

  const filtered = useMemo(
    () =>
      filterFlight
        ? data.passengers.filter((p) => p.flightId === filterFlight)
        : data.passengers,
    [data.passengers, filterFlight],
  )

  function startEdit(p: Passenger) {
    setEditingId(p.id)
    setForm({
      fullName: p.fullName,
      passportNumber: p.passportNumber,
      flightId: p.flightId,
      seat: p.seat,
      checkedIn: p.checkedIn,
    })
  }

  function cancelEdit() {
    setEditingId(null)
    setForm(emptyForm())
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    const passenger: Passenger = {
      id: editingId ?? newId('p'),
      fullName: form.fullName.trim(),
      passportNumber: form.passportNumber.trim().toUpperCase(),
      flightId: form.flightId,
      seat: form.seat.trim().toUpperCase(),
      checkedIn: form.checkedIn,
    }
    if (!passenger.fullName || !passenger.flightId) return
    upsertPassenger(passenger)
    cancelEdit()
  }

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1>旅客管理</h1>
          <p className="muted">登記旅客、座位與報到狀態</p>
        </div>
        <label className="inline-filter">
          篩選航班
          <select
            value={filterFlight}
            onChange={(e) => setFilterFlight(e.target.value)}
          >
            <option value="">全部</option>
            {data.flights.map((f) => (
              <option key={f.id} value={f.id}>
                {f.flightNumber}
              </option>
            ))}
          </select>
        </label>
      </header>

      <div className="split">
        <form className="panel form-panel" onSubmit={onSubmit}>
          <h2>{editingId ? '編輯旅客' : '新增旅客'}</h2>
          <label>
            姓名
            <input
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              required
            />
          </label>
          <label>
            護照號碼
            <input
              value={form.passportNumber}
              onChange={(e) =>
                setForm({ ...form, passportNumber: e.target.value })
              }
            />
          </label>
          <label>
            航班
            <select
              value={form.flightId}
              onChange={(e) => setForm({ ...form, flightId: e.target.value })}
              required
            >
              <option value="">選擇航班</option>
              {data.flights.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.flightNumber} ({f.origin}→{f.destination})
                </option>
              ))}
            </select>
          </label>
          <label>
            座位
            <input
              value={form.seat}
              onChange={(e) => setForm({ ...form, seat: e.target.value })}
              placeholder="12A"
            />
          </label>
          <label className="checkbox">
            <input
              type="checkbox"
              checked={form.checkedIn}
              onChange={(e) =>
                setForm({ ...form, checkedIn: e.target.checked })
              }
            />
            已完成報到
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
          <h2>旅客列表</h2>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>姓名</th>
                  <th>護照</th>
                  <th>航班</th>
                  <th>座位</th>
                  <th>報到</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => {
                  const flight = flightById.get(p.flightId)
                  return (
                    <tr key={p.id}>
                      <td>
                        <strong>{p.fullName}</strong>
                      </td>
                      <td>{p.passportNumber || '—'}</td>
                      <td>{flight?.flightNumber ?? '—'}</td>
                      <td>{p.seat || '—'}</td>
                      <td>{p.checkedIn ? '✓' : '—'}</td>
                      <td className="actions">
                        <button
                          type="button"
                          className="btn tiny"
                          onClick={() => startEdit(p)}
                        >
                          編輯
                        </button>
                        <button
                          type="button"
                          className="btn tiny danger"
                          onClick={() => deletePassenger(p.id)}
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
