const statusLabels = {
  ACTIVE: 'Activo',
  ONLINE: 'Online',
  OFFLINE: 'Offline',
  ALERTA: 'Alerta',
  CRITICO: 'Critico',
  WARNING: 'Warning',
  RESOLVED: 'Resuelta',
  ON: 'Encendida',
  OFF: 'Detenida',
  PENDING: 'Pendiente',
  pending: 'Pendiente',
}

function normalizeStatus(status) {
  if (!status) return 'OFFLINE'
  return String(status).toUpperCase()
}

function StatusBadge({ status }) {
  const normalized = normalizeStatus(status)
  const label = statusLabels[status] || statusLabels[normalized] || normalized

  return <span className={`status-badge status-${normalized.toLowerCase()}`}>{label}</span>
}

export default StatusBadge
