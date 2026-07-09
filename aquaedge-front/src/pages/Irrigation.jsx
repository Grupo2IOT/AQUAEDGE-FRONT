import { useEffect, useState } from 'react'
import { Power, PowerOff } from 'lucide-react'
import { createCommand, getCommands } from '../api/commandApi'
import { getDevices } from '../api/deviceApi'
import DataTable from '../components/DataTable'
import SectionCard from '../components/SectionCard'
import StatusBadge from '../components/StatusBadge'
import { formatDate, toArray } from '../utils/collections'
import { getApiErrorMessage } from '../utils/apiResponse'

function getDeviceId(device) {
  return device.id
}

function Irrigation() {
  const [devices, setDevices] = useState([])
  const [commands, setCommands] = useState([])
  const [selectedDeviceId, setSelectedDeviceId] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [feedback, setFeedback] = useState(null)
  const [loadingAction, setLoadingAction] = useState('')

  async function loadIrrigationData() {
    setLoading(true)
    setError('')

    try {
      const results = await Promise.allSettled([getDevices(), getCommands()])
      const [devicesResult, commandsResult] = results

      if (devicesResult.status === 'fulfilled') {
        const nextDevices = toArray(devicesResult.value)
        setDevices(nextDevices)
        setSelectedDeviceId((current) => current || getDeviceId(nextDevices[0]) || '')
      } else {
        setDevices([])
        setError(getApiErrorMessage(devicesResult.reason))
      }

      if (commandsResult.status === 'fulfilled') {
        setCommands(toArray(commandsResult.value))
      } else {
        setCommands([])
        setError(getApiErrorMessage(commandsResult.reason))
      }
    } catch (loadError) {
      setDevices([])
      setCommands([])
      setError(getApiErrorMessage(loadError))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadIrrigationData()
  }, [])

  async function handleCommand(target, state) {
    if (!selectedDeviceId) {
      setFeedback({ type: 'error', message: 'Selecciona un dispositivo antes de enviar comandos.' })
      return
    }

    const actionKey = `${target}-${state}`
    setLoadingAction(actionKey)
    setFeedback(null)

    try {
      const commandPayload = {
        deviceId: selectedDeviceId,
        target,
        state,
      }

      if (state === 'ON') {
        commandPayload.durationSec = 10
      }

      await createCommand(commandPayload)
      setFeedback({
        type: 'success',
        message: `✔ Comando enviado. Dispositivo: ${selectedDeviceId}.`,
      })
      await loadIrrigationData()
    } catch (commandError) {
      setFeedback({ type: 'error', message: getApiErrorMessage(commandError) })
    } finally {
      setLoadingAction('')
    }
  }

  const commandColumns = [
    { key: 'deviceId', label: 'Dispositivo' },
    { key: 'target', label: 'Target' },
    { key: 'state', label: 'Estado', render: (row) => <StatusBadge status={row.state} /> },
    { key: 'status', label: 'Proceso', render: (row) => <StatusBadge status={row.status} /> },
    {
      key: 'createdAt',
      label: 'Fecha',
      render: (row) => formatDate(row.createdAt),
    },
  ]

  return (
    <div className="page-stack">
      <div className="page-title-row">
        <div>
          <p className="eyebrow">Supervision operativa</p>
          <h2>Supervision de comandos de riego</h2>
        </div>
      </div>

      <SectionCard
        title="Rol del modulo"
        description="El control operativo principal corresponde a la aplicacion movil del agricultor."
      >
        <div className="state-inline">
          Esta pantalla permite supervisar comandos y enviar acciones manuales solo como operacion administrativa.
        </div>
      </SectionCard>

      <SectionCard title="Comandos registrados" description="Historial de comandos devueltos por /commands.">
        {loading ? <div className="state-inline">Cargando datos...</div> : null}
        {!loading && error ? <div className="state-inline state-inline--error">{error}</div> : null}
        {!loading && !error && commands.length === 0 ? (
          <div className="state-inline">No hay datos disponibles.</div>
        ) : null}
        {!loading && !error && commands.length > 0 ? <DataTable columns={commandColumns} rows={commands} /> : null}
      </SectionCard>

      <SectionCard title="Accion administrativa manual" description="Selecciona un dispositivo real registrado en backend-api.">
        {loading ? <div className="state-inline">Cargando datos...</div> : null}
        {!loading && error ? <div className="state-inline state-inline--error">{error}</div> : null}
        {!loading && !error && devices.length === 0 ? (
          <div className="state-inline">No hay datos disponibles.</div>
        ) : null}
        {!loading && !error && devices.length > 0 ? (
          <div className="form-field">
            <label htmlFor="device-select">Dispositivo</label>
            <select
              id="device-select"
              value={selectedDeviceId}
              onChange={(event) => setSelectedDeviceId(event.target.value)}
            >
              {devices.map((device) => {
                const deviceId = getDeviceId(device)
                return (
                  <option key={deviceId} value={deviceId}>
                    {device.deviceName} - {deviceId}
                  </option>
                )
              })}
            </select>
          </div>
        ) : null}
        {feedback ? <div className={`feedback feedback--${feedback.type}`}>{feedback.message}</div> : null}
        <div className="command-grid">
          <button
            className="button button-primary"
            type="button"
            disabled={loadingAction === 'water_pump-ON' || !selectedDeviceId}
            onClick={() => handleCommand('water_pump', 'ON')}
          >
            <Power size={18} />
            Activar bomba de agua
          </button>
          <button
            className="button button-secondary"
            type="button"
            disabled={loadingAction === 'water_pump-OFF' || !selectedDeviceId}
            onClick={() => handleCommand('water_pump', 'OFF')}
          >
            <PowerOff size={18} />
            Detener bomba de agua
          </button>
          <button
            className="button button-success"
            type="button"
            disabled={loadingAction === 'fertilizer_pump-ON' || !selectedDeviceId}
            onClick={() => handleCommand('fertilizer_pump', 'ON')}
          >
            <Power size={18} />
            Activar fertilizante
          </button>
          <button
            className="button button-secondary"
            type="button"
            disabled={loadingAction === 'fertilizer_pump-OFF' || !selectedDeviceId}
            onClick={() => handleCommand('fertilizer_pump', 'OFF')}
          >
            <PowerOff size={18} />
            Detener fertilizante
          </button>
        </div>
      </SectionCard>
    </div>
  )
}

export default Irrigation
