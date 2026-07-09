import { useEffect, useState } from 'react'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { getTelemetryHistory } from '../api/telemetryApi'
import DataTable from '../components/DataTable'
import SectionCard from '../components/SectionCard'
import { formatDate, toArray } from '../utils/collections'
import { getApiErrorMessage } from '../utils/apiResponse'

function formatTime(value) {
  return new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function History() {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true

    async function loadHistory() {
      try {
        const data = await getTelemetryHistory({ limit: 20 })
        if (!mounted) return
        setHistory(toArray(data))
        setError('')
      } catch (loadError) {
        if (!mounted) return
        setError(getApiErrorMessage(loadError))
        setHistory([])
      } finally {
        if (mounted) setLoading(false)
      }
    }

    loadHistory()
    return () => {
      mounted = false
    }
  }, [])

  const chartData = history
    .filter((item) => item.createdAt && item.soilMoisture != null)
    .map((item) => ({
      time: formatTime(item.createdAt),
      humedad: Number(item.soilMoisture),
    }))

  const columns = [
    {
      key: 'createdAt',
      label: 'Fecha',
      render: (row) => formatDate(row.createdAt),
    },
    {
      key: 'soilMoisture',
      label: 'Humedad suelo',
      render: (row) => row.soilMoisture != null ? `${row.soilMoisture}%` : '',
    },
    {
      key: 'airTemperature',
      label: 'Temp. aire',
      render: (row) => row.airTemperature != null ? `${row.airTemperature} C` : '',
    },
    {
      key: 'waterLevel',
      label: 'Nivel agua',
      render: (row) => row.waterLevel || '',
    },
  ]

  return (
    <div className="page-stack">
      <div className="page-title-row">
        <div>
          <p className="eyebrow">Historial de telemetria</p>
          <h2>Lecturas registradas</h2>
        </div>
      </div>

      {loading ? <div className="state-card">Cargando datos...</div> : null}
      {!loading && error ? <div className="state-card state-card--error">{error}</div> : null}
      {!loading && !error && history.length === 0 ? (
        <div className="state-card">No hay datos disponibles.</div>
      ) : null}

      {!loading && !error && history.length > 0 ? (
        <>
          {chartData.length > 0 ? (
            <SectionCard title="Humedad del suelo" description="Ultimas lecturas disponibles para el dispositivo.">
              <div className="chart-box">
                <ResponsiveContainer width="100%" height={320}>
                  <LineChart data={chartData} margin={{ top: 10, right: 16, left: -12, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#dfe6eb" />
                    <XAxis dataKey="time" stroke="#597487" tickLine={false} />
                    <YAxis stroke="#597487" tickLine={false} axisLine={false} />
                    <Tooltip />
                    <Line type="monotone" dataKey="humedad" stroke="#1E8449" strokeWidth={3} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </SectionCard>
          ) : null}

          <SectionCard title="Detalle de lecturas">
            <DataTable columns={columns} rows={history} />
          </SectionCard>
        </>
      ) : null}
    </div>
  )
}

export default History
