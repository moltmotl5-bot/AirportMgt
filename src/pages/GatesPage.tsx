import { type FormEvent, useState } from 'react'
import { GateStatusBadge } from '../components/StatusBadge'
import { useAirport } from '../context/AirportContext'
import type { Gate, GateStatus } from '../types'
import { gateLabel, newId } from '../utils/format'

const statuses: GateStatus[] = ['AVAILABLE', 'OCCUPIED', 'CLOSED']

const emptyForm = (): Omit<Gate, 'id'> => ({
  terminal: 'T1',
  number: '',
  status: 'AVAILABLE',
})

export function GatesPage() {
  const { data, upsertGate, deleteGate } = useAirport()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm())

  function startEdit(gate: Gate) {
    setEditingId(gate.id)
    setForm({
      terminal: gate.terminal,
      number: gate.number,
      status: gate.status,
    })
  }

  function cancelEdit() {
    setEditingId(null)
    setForm(emptyForm())
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    const gate: Gate = {
      id: editingId ?? newId('g'),
      terminal: form.terminal.trim().toUpperCase(),
      number: form.number.trim().toUpperCase(),
      status: form.status,
    }
    if (!gate.number) return
    upsertGate(gate)
    cancelEdit()
  }

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1>登機門管理</h1>
          <p className="muted">維護航廈登機門與可用狀態</p>
        </div>
      </header>

      <div className="split">
        <form className="panel form-panel" onSubmit={onSubmit}>
          <h2>{editingId ? '編輯登機門' : '新增登機門'}</h2>
          <label>
            航廈
            <input
              value={form.terminal}
              onChange={(e) => setForm({ ...form, terminal: e.target.value })}
              placeholder="T1"
              required
            />
          </label>
          <label>
            門號
            <input
              value={form.number}
              onChange={(e) => setForm({ ...form, number: e.target.value })}
              placeholder="A12"
              required
            />
          </label>
          <label>
            狀態
            <select
              value={form.status}
              onChange={(e) =>
                setForm({ ...form, status: e.target.value as GateStatus })
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
          <h2>登機門列表</h2>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>登機門</th>
                  <th>狀態</th>
                  <th>指派航班數</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {data.gates.map((g) => {
                  const assigned = data.flights.filter(
                    (f) => f.gateId === g.id,
                  ).length
                  return (
                    <tr key={g.id}>
                      <td>
                        <strong>{gateLabel(g.terminal, g.number)}</strong>
                      </td>
                      <td>
                        <GateStatusBadge status={g.status} />
                      </td>
                      <td>{assigned}</td>
                      <td className="actions">
                        <button
                          type="button"
                          className="btn tiny"
                          onClick={() => startEdit(g)}
                        >
                          編輯
                        </button>
                        <button
                          type="button"
                          className="btn tiny danger"
                          onClick={() => deleteGate(g.id)}
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
