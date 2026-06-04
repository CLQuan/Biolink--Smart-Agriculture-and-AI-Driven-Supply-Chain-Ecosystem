import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import SupplyChain from './pages/SupplyChain'
import Inventory from './pages/Inventory'
import Drivers from './pages/Drivers'
import Alerts from './pages/Alerts'
import Reports from './pages/Reports'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Layout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="supply-chain" element={<SupplyChain />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="drivers" element={<Drivers />} />
          <Route path="alerts" element={<Alerts />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

function Settings() {
  return (
    <div className="p-8">
      <div className="card p-8 text-center">
        <h2 className="text-2xl font-bold text-[#2D5A1B] mb-2">Settings</h2>
        <p className="text-gray-500">System configuration options coming soon.</p>
      </div>
    </div>
  )
}

export default App
