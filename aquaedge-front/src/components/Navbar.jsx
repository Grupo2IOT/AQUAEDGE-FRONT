import { CircleUserRound, LogOut } from 'lucide-react'
import { useAuth } from '../contexts/useAuth'

function Navbar() {
  const { logout, user } = useAuth()
  const label = user?.name || user?.email || 'Usuario'

  return (
    <header className="navbar">
      <div>
        <p className="navbar__eyebrow">Panel administrativo</p>
        <h1>Monitoreo general y supervision operativa</h1>
      </div>
      <div className="navbar__actions">
        <span className="navbar__device">
          <CircleUserRound size={16} />
          {label}
        </span>
        <button className="icon-button" type="button" aria-label="Cerrar sesion" onClick={logout}>
          <LogOut size={18} />
        </button>
      </div>
    </header>
  )
}

export default Navbar
