import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from '../contexts/AuthContext'
import DashboardLayout from '../layouts/DashboardLayout'
import Alerts from '../pages/Alerts'
import Dashboard from '../pages/Dashboard'
import Devices from '../pages/Devices'
import History from '../pages/History'
import Irrigation from '../pages/Irrigation'
import Login from '../pages/Login'
import Parcels from '../pages/Parcels'
import Profile from '../pages/Profile'
import Reports from '../pages/Reports'
import Settings from '../pages/Settings'
import Users from '../pages/Users'
import ProtectedRoute from '../routes/ProtectedRoute'

function AppRouter() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/parcels" element={<Parcels />} />
              <Route path="/history" element={<History />} />
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/devices" element={<Devices />} />
              <Route path="/irrigation" element={<Irrigation />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/users" element={<Users />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default AppRouter
