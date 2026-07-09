const statusLabels = {
  ACTIVE: 'Activo',
  INACTIVE: 'Inactivo',
  ONLINE: 'Online',
  OFFLINE: 'Offline',
  ALERTA: 'Alerta',
  CRITICO: 'Critico',
  WARNING: 'Warning',
  RESOLVED: 'Resuelta',
  OPEN: 'Abierta',
  CRITICAL: 'Critico',
  ERROR: 'Error',
  MAINTENANCE: 'Mantenimiento',
  DELIVERED: 'Entregado',
  EXECUTED: 'Ejecutado',
  REJECTED: 'Rechazado',
  ON: 'Encendida',
  OFF: 'Detenida',
  PENDING: 'Pendiente',
  pending: 'Pendiente',
}

function normalizeStatus(status) {
  if (!status) return ''
  return String(status).toUpperCase()
}

function StatusBadge({ status }) {
  const normalized = normalizeStatus(status)
  if (!normalized) return null
  const label = statusLabels[status] || statusLabels[normalized] || normalized

  return <span className={`status-badge status-${normalized.toLowerCase()}`}>{label}</span>
}

export default StatusBadge
