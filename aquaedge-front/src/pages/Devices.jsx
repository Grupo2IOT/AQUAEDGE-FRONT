import { useEffect, useState } from 'react'
import { getDevices } from '../api/deviceApi'
import DataTable from '../components/DataTable'
import SectionCard from '../components/SectionCard'
import StatusBadge from '../components/StatusBadge'
import { formatDate, toArray } from '../utils/collections'
import { getApiErrorMessage } from '../utils/apiResponse'

function Devices() {
  const [devices, setDevices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true

    async function loadDevices() {
      try {
        const data = await getDevices()
        if (!mounted) return
        setDevices(toArray(data))
        setError('')
      } catch (loadError) {
        if (!mounted) return
        setDevices([])
        setError(getApiErrorMessage(loadError))
      } finally {
        if (mounted) setLoading(false)
      }
    }

    loadDevices()
    return () => {
      mounted = false
    }
  }, [])

  const columns = [
    { key: 'deviceCode', label: 'Codigo' },
    { key: 'deviceName', label: 'Nombre' },
    { key: 'status', label: 'Estado', render: (row) => <StatusBadge status={row.status} /> },
    {
      key: 'firmwareVersion',
      label: 'Firmware',
      render: (row) => row.firmwareVersion || '',
    },
    {
      key: 'lastSeen',
      label: 'Ultima conexion',
      render: (row) => row.lastSeenAt ? formatDate(row.lastSeenAt) : '',
    },
    {
      key: 'plotId',
      label: 'Parcela asociada',
      render: (row) => row.plotId,
    },
  ]

  return (
    <div className="page-stack">
      <div className="page-title-row">
        <div>
          <p className="eyebrow">Gestion de dispositivos</p>
          <h2>Inventario IoT</h2>
        </div>
      </div>
      <SectionCard title="Dispositivos IoT" description="Gestion administrativa de nodos, firmware, estado y parcela asociada.">
        {loading ? <div className="state-inline">Cargando datos...</div> : null}
        {!loading && error ? <div className="state-inline state-inline--error">{error}</div> : null}
        {!loading && !error && devices.length === 0 ? (
          <div className="state-inline">No hay datos disponibles.</div>
        ) : null}
        {!loading && !error && devices.length > 0 ? <DataTable columns={columns} rows={devices} /> : null}
      </SectionCard>
    </div>
  )
}

export default Devices
