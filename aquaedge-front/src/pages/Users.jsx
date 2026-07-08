import { useEffect, useState } from 'react'
import { getRoles } from '../api/roleApi'
import { getUsers } from '../api/userApi'
import DataTable from '../components/DataTable'
import SectionCard from '../components/SectionCard'
import StatusBadge from '../components/StatusBadge'
import { readValue, toArray } from '../utils/collections'
import { getApiErrorMessage } from '../utils/apiResponse'

function Users() {
  const [users, setUsers] = useState([])
  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true

    async function loadUsers() {
      try {
        const [usersData, rolesData] = await Promise.all([getUsers(), getRoles()])
        if (!mounted) return
        setUsers(toArray(usersData))
        setRoles(toArray(rolesData))
        setError('')
      } catch (loadError) {
        if (!mounted) return
        setUsers([])
        setRoles([])
        setError(getApiErrorMessage(loadError))
      } finally {
        if (mounted) setLoading(false)
      }
    }

    loadUsers()
    return () => {
      mounted = false
    }
  }, [])

  const columns = [
    { key: 'name', label: 'Nombre', render: (row) => readValue(row, ['name', 'fullName', 'full_name']) },
    { key: 'email', label: 'Email' },
    {
      key: 'roles',
      label: 'Roles',
      render: (row) => {
        const rowRoles = toArray(row.roles)
        return rowRoles.map((role) => role.name || role.roleName || role).join(', ') || '--'
      },
    },
    { key: 'status', label: 'Estado', render: (row) => <StatusBadge status={row.status || 'ACTIVE'} /> },
  ]

  return (
    <div className="page-stack">
      <div className="page-title-row">
        <div>
          <p className="eyebrow">Administracion de usuarios</p>
          <h2>Usuarios, roles y estado</h2>
        </div>
      </div>

      <SectionCard title="Usuarios registrados" description="Modulo administrativo de usuarios y permisos visuales.">
        {loading ? <div className="state-inline">Cargando datos...</div> : null}
        {!loading && error ? <div className="state-inline state-inline--error">{error}</div> : null}
        {!loading && !error && users.length === 0 ? (
          <div className="state-inline">No hay datos disponibles.</div>
        ) : null}
        {!loading && !error && users.length > 0 ? <DataTable columns={columns} rows={users} /> : null}
      </SectionCard>

      <SectionCard title="Roles disponibles" description="Roles reales devueltos por /roles.">
        {!loading && !error && roles.length === 0 ? (
          <div className="state-inline">No hay datos disponibles.</div>
        ) : null}
        {!loading && !error && roles.length > 0 ? (
          <div className="pill-list">
            {roles.map((role) => (
              <span className="status-badge status-pending" key={role.id || role.name}>
                {role.name || role.roleName}
              </span>
            ))}
          </div>
        ) : null}
      </SectionCard>
    </div>
  )
}

export default Users
