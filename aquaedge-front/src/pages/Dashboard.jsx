import { useEffect, useState } from 'react'
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Droplet,
  Gauge,
  Map,
  MonitorCog,
  Thermometer,
  Waves,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { getAlerts } from '../api/alertApi'
import { getDevices } from '../api/deviceApi'
import { getPlots } from '../api/plotApi'
import { getLatestTelemetry } from '../api/telemetryApi'
import MetricCard from '../components/MetricCard'
import SectionCard from '../components/SectionCard'
import StatusBadge from '../components/StatusBadge'
import { formatDate, toArray } from '../utils/collections'
import { getApiErrorMessage } from '../utils/apiResponse'

function isOpenAlert(alert) {
  return alert.status === 'open'
}

function Dashboard() {
  const [telemetry, setTelemetry] = useState(null)
  const [devices, setDevices] = useState([])
  const [alerts, setAlerts] = useState([])
  const [plots, setPlots] = useState([])

  const [telemetryLoading, setTelemetryLoading] = useState(true)
  const [devicesLoading, setDevicesLoading] = useState(true)
  const [alertsLoading, setAlertsLoading] = useState(true)
  const [plotsLoading, setPlotsLoading] = useState(true)

  const [telemetryError, setTelemetryError] = useState('')
  const [devicesError, setDevicesError] = useState('')
  const [alertsError, setAlertsError] = useState('')
  const [plotsError, setPlotsError] = useState('')

  useEffect(() => {
    let mounted = true

    async function loadDashboard() {
      const results = await Promise.allSettled([
        getLatestTelemetry(),
        getDevices(),
        getPlots(),
        getAlerts(),
      ])

      if (!mounted) return

      const [telemetryResult, devicesResult, plotsResult, alertsResult] = results

      if (telemetryResult.status === 'fulfilled') {
        setTelemetry(telemetryResult.value)
        setTelemetryError('')
      } else {
        setTelemetry(null)
        setTelemetryError(getApiErrorMessage(telemetryResult.reason))
      }
      setTelemetryLoading(false)

      if (devicesResult.status === 'fulfilled') {
        setDevices(toArray(devicesResult.value))
        setDevicesError('')
      } else {
        setDevices([])
        setDevicesError(getApiErrorMessage(devicesResult.reason))
      }
      setDevicesLoading(false)

      if (plotsResult.status === 'fulfilled') {
        setPlots(toArray(plotsResult.value))
        setPlotsError('')
      } else {
        setPlots([])
        setPlotsError(getApiErrorMessage(plotsResult.reason))
      }
      setPlotsLoading(false)

      if (alertsResult.status === 'fulfilled') {
        setAlerts(toArray(alertsResult.value))
        setAlertsError('')
      } else {
        setAlerts([])
        setAlertsError(getApiErrorMessage(alertsResult.reason))
      }
      setAlertsLoading(false)
    }

    loadDashboard()
    return () => {
      mounted = false
    }
  }, [])

  const onlineDevices = devices.filter((device) => String(device.status).toUpperCase() === 'ONLINE')
  const offlineDevices = devices.filter((device) => String(device.status).toUpperCase() === 'OFFLINE')
  const openAlerts = alerts.filter(isOpenAlert)
  const systemHealth = telemetry?.systemHealth

  return (
    <div className="page-stack">
      <div className="page-title-row">
        <div>
          <p className="eyebrow">Monitoreo general</p>
          <h2>Consola administrativa AquaEdge</h2>
        </div>
        {telemetry ? <StatusBadge status={systemHealth} /> : null}
      </div>

      <div className="metrics-grid">
        <MetricCard
          title="Parcelas"
          value={plotsLoading ? '...' : plots.length}
          icon={Map}
          helper={plotsError || 'Parcelas registradas'}
        />
        <MetricCard
          title="Dispositivos"
          value={devicesLoading ? '...' : devices.length}
          icon={MonitorCog}
          helper={devicesError || `${onlineDevices.length} online / ${offlineDevices.length} offline`}
        />
        <MetricCard
          title="Alertas abiertas"
          value={alertsLoading ? '...' : openAlerts.length}
          icon={AlertTriangle}
          helper={alertsError || `${alerts.length} alertas totales`}
        />
        <MetricCard
          title="Salud del sistema"
          value={telemetryLoading ? '...' : systemHealth}
          icon={Activity}
          status={!telemetryLoading && telemetry ? systemHealth : null}
          helper={telemetryError || 'Ultima telemetria disponible'}
        />
      </div>

      <SectionCard
        title="Ultima telemetria"
        description="Lectura mas reciente reportada por el backend para supervision operativa."
      >
        {telemetryLoading ? <div className="state-inline">Cargando telemetria...</div> : null}
        {!telemetryLoading && telemetryError ? (
          <div className="state-inline state-inline--error">{telemetryError}</div>
        ) : null}
        {!telemetryLoading && !telemetryError && !telemetry ? (
          <div className="state-inline">No hay telemetria disponible.</div>
        ) : null}
        {!telemetryLoading && !telemetryError && telemetry ? (
          <div className="metrics-grid metrics-grid--compact">
            {telemetry.soilMoisture != null ? (
              <MetricCard title="Humedad del suelo" value={telemetry.soilMoisture} unit="%" icon={Droplet} />
            ) : null}
            {telemetry.soilFertility != null ? (
              <MetricCard title="Fertilidad del suelo" value={telemetry.soilFertility} icon={Gauge} />
            ) : null}
            {telemetry.airTemperature != null ? (
              <MetricCard title="Temperatura del aire" value={telemetry.airTemperature} unit="C" icon={Thermometer} />
            ) : null}
            {telemetry.airHumidity != null ? (
              <MetricCard title="Humedad del aire" value={telemetry.airHumidity} unit="%" icon={Waves} />
            ) : null}
          </div>
        ) : null}
      </SectionCard>

      <SectionCard title="Acceso rapido" description="Acciones frecuentes para supervision institucional.">
        <div className="quick-actions">
          <Link className="button button-primary" to="/reports">
            <BarChart3 size={18} />
            Reportes institucionales
          </Link>
          <Link className="button button-secondary" to="/alerts">
            <AlertTriangle size={18} />
            Centro de alertas
          </Link>
          <Link className="button button-secondary" to="/devices">
            <MonitorCog size={18} />
            Gestion de dispositivos
          </Link>
        </div>
      </SectionCard>

      <SectionCard title="Ultima actualizacion" description="Referencia de la ultima lectura registrada.">
        {telemetry ? (
          <div className="info-strip">
            <span>Dispositivo</span>
            <strong>{telemetry.deviceId}</strong>
            <span>Fecha</span>
            <strong>{formatDate(telemetry.createdAt)}</strong>
          </div>
        ) : (
          <div className="state-inline">No hay datos disponibles.</div>
        )}
      </SectionCard>
    </div>
  )
}

export default Dashboard
