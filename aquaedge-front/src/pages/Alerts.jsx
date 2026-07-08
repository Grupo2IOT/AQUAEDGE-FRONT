import { useEffect, useState } from 'react'
import { AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react'
import { getAlerts, resolveAlert } from '../api/alertApi'
import SectionCard from '../components/SectionCard'
import StatusBadge from '../components/StatusBadge'
import { formatDate, readValue, toArray } from '../utils/collections'
import { getApiErrorMessage } from '../utils/apiResponse'

function Alerts() {
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [resolvingId, setResolvingId] = useState('')

  async function loadAlerts() {
    setLoading(true)
    setError('')

    try {
      const data = await getAlerts()
      setAlerts(toArray(data))
    } catch (loadError) {
      setError(getApiErrorMessage(loadError))
      setAlerts([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAlerts()
  }, [])

  async function handleResolve(alertId) {
    setResolvingId(alertId)
    setSuccess('')
    setError('')

    try {
      await resolveAlert(alertId)
      setSuccess('Alerta resuelta correctamente.')
      await loadAlerts()
    } catch (resolveError) {
      setError(getApiErrorMessage(resolveError))
    } finally {
      setResolvingId('')
    }
  }

  return (
    <div className="page-stack">
      <div className="page-title-row">
        <div>
          <p className="eyebrow">Centro de alertas</p>
          <h2>Alertas abiertas y resueltas</h2>
        </div>
      </div>

      <SectionCard title="Centro de alertas" description="Supervision de alertas operativas registradas por backend-api.">
        {loading ? <div className="state-inline">Cargando datos...</div> : null}
        {!loading && error ? <div className="state-inline state-inline--error">{error}</div> : null}
        {success ? <div className="feedback feedback--success">{success}</div> : null}
        {!loading && !error && alerts.length === 0 ? (
          <div className="state-inline">No hay datos disponibles.</div>
        ) : null}
        {!loading && !error && alerts.length > 0 ? (
          <div className="alert-list">
            {alerts.map((alert) => {
              const id = readValue(alert, ['id', 'alertId', 'alert_id'], '')
              const status = readValue(alert, ['status', 'severity', 'level'], 'ALERTA')
              const title = readValue(alert, ['title', 'type', 'name'], 'Alerta del sistema')
              const message = readValue(alert, ['message', 'description', 'detail'], 'Sin detalle')
              const createdAt = readValue(alert, ['createdAt', 'created_at', 'timestamp'], '')
              const resolved = Boolean(alert.resolvedAt || alert.resolved_at || alert.isResolved)

              return (
                <article className="alert-item" key={id || `${title}-${createdAt}`}>
                  <span className="alert-item__icon">
                    {String(status).toUpperCase() === 'CRITICO' ? (
                      <ShieldAlert size={20} />
                    ) : (
                      <AlertTriangle size={20} />
                    )}
                  </span>
                  <div>
                    <div className="alert-item__header">
                      <h3>{title}</h3>
                      <StatusBadge status={resolved ? 'RESOLVED' : status} />
                    </div>
                    <p>{message}</p>
                    <small>{formatDate(createdAt)}</small>
                    {!resolved && id ? (
                      <button
                        className="button button-secondary alert-item__button"
                        type="button"
                        disabled={resolvingId === id}
                        onClick={() => handleResolve(id)}
                      >
                        <CheckCircle2 size={16} />
                        Resolver
                      </button>
                    ) : null}
                  </div>
                </article>
              )
            })}
          </div>
        ) : null}
      </SectionCard>
    </div>
  )
}

export default Alerts
