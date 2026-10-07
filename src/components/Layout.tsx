import { NavLink, Outlet } from 'react-router-dom'
import { useAirport } from '../context/AirportContext'

const nav = [
  { to: '/', label: '總覽', end: true },
  { to: '/flights', label: '航班' },
  { to: '/gates', label: '登機門' },
  { to: '/passengers', label: '旅客' },
]

export function Layout() {
  const { resetToSeed } = useAirport()

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark" aria-hidden>
            ✈
          </span>
          <div>
            <strong>AirportMgt</strong>
            <p>機場營運控制台</p>
          </div>
        </div>
        <nav className="nav">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                isActive ? 'nav-link active' : 'nav-link'
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <button type="button" className="btn ghost reset-btn" onClick={resetToSeed}>
          還原示範資料
        </button>
      </aside>
      <main className="main">
        <Outlet />
      </main>
    </div>
  )
}
