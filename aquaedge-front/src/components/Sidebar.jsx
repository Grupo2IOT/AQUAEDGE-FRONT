import { NavLink } from 'react-router-dom'
import {
  AlertTriangle,
  BarChart3,
  Droplets,
  Gauge,
  History,
  MonitorCog,
  Map,
  CircleUserRound,
  Settings,
  Sprout,
  Users,
} from 'lucide-react'
import { useAuth } from '../contexts/useAuth'
import { isFarmer } from '../utils/authRoles'

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: Gauge, farmer: true },
  { to: '/parcels', label: 'Parcelas', icon: Map },
  { to: '/devices', label: 'Dispositivos', icon: MonitorCog },
  { to: '/history', label: 'Historial', icon: History, farmer: true },
  { to: '/alerts', label: 'Alertas', icon: AlertTriangle, farmer: true },
  { to: '/irrigation', label: 'Supervision de Riego', icon: Droplets },
  { to: '/users', label: 'Usuarios', icon: Users },
  { to: '/reports', label: 'Reportes', icon: BarChart3 },
  { to: '/settings', label: 'Configuracion', icon: Settings },
  { to: '/profile', label: 'Perfil', icon: CircleUserRound, farmer: true, farmerOnly: true },
]

function Sidebar() {
  const { user } = useAuth()
  const visibleLinks = isFarmer(user)
    ? links.filter((link) => link.farmer)
    : links.filter((link) => !link.farmerOnly)

  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <span className="sidebar__logo">
          <Sprout size={24} />
        </span>
        <div>
          <strong>AquaEdge</strong>
          <small>Consola administrativa</small>
        </div>
      </div>

      <nav className="sidebar__nav" aria-label="Navegacion principal">
        {visibleLinks.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} className="sidebar__link">
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar
