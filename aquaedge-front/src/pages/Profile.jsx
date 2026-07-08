import SectionCard from '../components/SectionCard'
import StatusBadge from '../components/StatusBadge'
import { useAuth } from '../contexts/useAuth'
import { getUserRoles } from '../utils/authRoles'
import { readValue } from '../utils/collections'

function Profile() {
  const { user } = useAuth()
  const roles = getUserRoles(user)

  return (
    <div className="page-stack">
      <div className="page-title-row">
        <div>
          <p className="eyebrow">Perfil</p>
          <h2>Sesion actual</h2>
        </div>
      </div>

      <SectionCard title="Informacion de usuario" description="Datos de sesion provistos por backend-api.">
        <div className="info-strip">
          <span>Nombre</span>
          <strong>{readValue(user, ['name', 'fullName', 'full_name'])}</strong>
          <span>Email</span>
          <strong>{readValue(user, ['email'])}</strong>
          <span>Roles</span>
          <strong>{roles.length > 0 ? roles.join(', ') : '--'}</strong>
          <span>Estado</span>
          <strong>
            <StatusBadge status={readValue(user, ['status'], 'ACTIVE')} />
          </strong>
        </div>
      </SectionCard>
    </div>
  )
}

export default Profile
