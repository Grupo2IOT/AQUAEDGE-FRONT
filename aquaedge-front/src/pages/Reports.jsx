import { useEffect, useState } from 'react'
import { Download, FileText, ShieldCheck, Waves } from 'lucide-react'
import {
  getAlertsReport,
  getEventsReport,
  getWaterUsageReport,
} from '../api/reportApi'
import SectionCard from '../components/SectionCard'
import { getApiErrorMessage } from '../utils/apiResponse'

function getReportItems(data, preferredKeys = []) {
  if (Array.isArray(data)) return data

  for (const key of preferredKeys) {
    if (Array.isArray(data?.[key])) return data[key]
  }

  if (Array.isArray(data?.data)) return data.data
  if (Array.isArray(data?.items)) return data.items
  if (Array.isArray(data?.rows)) return data.rows
  if (data && Object.keys(data).length > 0) return [data]
  return []
}

function ReportPreview({
  title,
  description,
  icon: Icon,
  data,
  loading,
  error,
  emptyMessage = 'No hay datos disponibles.',
  preferredKeys = [],
}) {
  const items = getReportItems(data, preferredKeys)

  return (
    <article className="report-card">
      <span className="report-card__icon">
        <Icon size={22} />
      </span>
      <h3>{title}</h3>
      <p>{description}</p>
      {loading ? <div className="state-inline">Cargando datos...</div> : null}
      {!loading && error ? <div className="state-inline state-inline--error">{error}</div> : null}
      {!loading && !error && items.length === 0 ? (
        <div className="state-inline">{emptyMessage}</div>
      ) : null}
      {!loading && !error && items.length > 0 ? (
        <pre className="json-preview">{JSON.stringify(data, null, 2)}</pre>
      ) : null}
      <button
        className="button button-secondary"
        type="button"
        disabled
        title="Funcionalidad disponible en una próxima versión."
      >
        <Download size={16} />
        Exportar
      </button>
    </article>
  )
}

function Reports() {
  const [reports, setReports] = useState({
    waterUsage: null,
    events: null,
    alerts: null,
  })
  const [loading, setLoading] = useState(true)
  const [errors, setErrors] = useState({
    waterUsage: '',
    events: '',
    alerts: '',
  })

  useEffect(() => {
    let mounted = true

    async function loadReports() {
      try {
        const results = await Promise.allSettled([
          getWaterUsageReport(),
          getEventsReport(),
          getAlertsReport(),
        ])

        if (!mounted) return

        const [waterUsage, events, alerts] = results
        setReports({
          waterUsage: waterUsage.status === 'fulfilled' ? waterUsage.value : null,
          events: events.status === 'fulfilled' ? events.value : null,
          alerts: alerts.status === 'fulfilled' ? alerts.value : null,
        })
        setErrors({
          waterUsage: waterUsage.status === 'rejected' ? getApiErrorMessage(waterUsage.reason) : '',
          events: events.status === 'rejected' ? getApiErrorMessage(events.reason) : '',
          alerts: alerts.status === 'rejected' ? getApiErrorMessage(alerts.reason) : '',
        })
      } finally {
        if (mounted) setLoading(false)
      }
    }

    loadReports()
    return () => {
      mounted = false
    }
  }, [])

  return (
    <div className="page-stack">
      <div className="page-title-row">
        <div>
          <p className="eyebrow">Reportes institucionales</p>
          <h2>Modulo supervisor</h2>
        </div>
      </div>

      <div className="reports-grid">
        <ReportPreview
          title="Reporte de uso de agua"
          description="Datos reales devueltos por /reports/water-usage."
          icon={Waves}
          data={reports.waterUsage}
          loading={loading}
          error={errors.waterUsage}
          preferredKeys={['waterUsage', 'telemetry']}
        />
        <ReportPreview
          title="Reporte de eventos"
          description="Datos reales devueltos por /reports/events."
          icon={FileText}
          data={reports.events}
          loading={loading}
          error={errors.events}
          emptyMessage="No existen eventos registrados."
          preferredKeys={['events', 'irrigationEvents']}
        />
        <ReportPreview
          title="Reporte de alertas"
          description="Datos reales devueltos por /reports/alerts."
          icon={ShieldCheck}
          data={reports.alerts}
          loading={loading}
          error={errors.alerts}
          preferredKeys={['alerts']}
        />
      </div>

      <SectionCard title="Exportaciones" description="Las descargas no se simulan en esta version." />
    </div>
  )
}

export default Reports
