import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { AirportProvider } from './context/AirportContext'
import { DashboardPage } from './pages/DashboardPage'
import { FlightsPage } from './pages/FlightsPage'
import { GatesPage } from './pages/GatesPage'
import { PassengersPage } from './pages/PassengersPage'

function App() {
  return (
    <AirportProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<DashboardPage />} />
            <Route path="flights" element={<FlightsPage />} />
            <Route path="gates" element={<GatesPage />} />
            <Route path="passengers" element={<PassengersPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AirportProvider>
  )
}

export default App
