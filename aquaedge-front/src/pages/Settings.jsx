import { useEffect, useState } from 'react'
import { Edit3, Plus, Save, Trash2, X } from 'lucide-react'
import {
  createIrrigationRule,
  deleteIrrigationRule,
  getIrrigationRules,
  updateIrrigationRule,
} from '../api/irrigationApi'
import { getPlots } from '../api/plotApi'
import DataTable from '../components/DataTable'
import SectionCard from '../components/SectionCard'
import StatusBadge from '../components/StatusBadge'
import { formatDate, toArray } from '../utils/collections'
import { getApiErrorMessage } from '../utils/apiResponse'

const emptyForm = {
  plotId: '',
  minSoilMoisture: '',
  maxSoilMoisture: '',
  autoIrrigationEnabled: false,
  readingIntervalSec: '',
}

function getRuleId(rule) {
  return rule.id
}

function mapRuleToForm(rule) {
  return {
    plotId: rule.plotId,
    minSoilMoisture: rule.minSoilMoisture,
    maxSoilMoisture: rule.maxSoilMoisture,
    autoIrrigationEnabled: rule.autoIrrigationEnabled,
    readingIntervalSec: rule.readingIntervalSec,
  }
}

function buildPayload(form) {
  return {
    plotId: form.plotId,
    minSoilMoisture: Number(form.minSoilMoisture),
    maxSoilMoisture: Number(form.maxSoilMoisture),
    autoIrrigationEnabled: form.autoIrrigationEnabled,
    readingIntervalSec: Number(form.readingIntervalSec),
  }
}

function validateForm(form) {
  const min = Number(form.minSoilMoisture)
  const max = Number(form.maxSoilMoisture)
  const interval = Number(form.readingIntervalSec)

  if (!form.plotId) return 'Selecciona una parcela.'
  if (form.minSoilMoisture === '' || !Number.isFinite(min) || min < 0 || min > 100) {
    return 'La humedad minima debe ser un numero entre 0 y 100.'
  }
  if (form.maxSoilMoisture === '' || !Number.isFinite(max) || max < 0 || max > 100) {
    return 'La humedad maxima debe ser un numero entre 0 y 100.'
  }
  if (min > max) return 'La humedad minima no puede ser mayor que la humedad maxima.'
  if (form.readingIntervalSec === '' || !Number.isInteger(interval) || interval < 1) {
    return 'El intervalo de lectura debe ser un entero positivo.'
  }

  return ''
}

function getPlotId(plot) {
  return plot.id
}

function getPlotName(plot) {
  return plot.name
}

function Settings() {
  const [rules, setRules] = useState([])
  const [plots, setPlots] = useState([])
  const [selectedRuleId, setSelectedRuleId] = useState('')
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function loadRules() {
    setLoading(true)
    setError('')

    try {
      const data = await getIrrigationRules()
      setRules(toArray(data))
    } catch (loadError) {
      setRules([])
      setError(getApiErrorMessage(loadError))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    async function loadInitialData() {
      setLoading(true)
      setError('')

      try {
        const [rulesResult, plotsResult] = await Promise.allSettled([getIrrigationRules(), getPlots()])

        if (rulesResult.status === 'fulfilled') {
          setRules(toArray(rulesResult.value))
        } else {
          setRules([])
          setError(getApiErrorMessage(rulesResult.reason))
        }

        if (plotsResult.status === 'fulfilled') {
          setPlots(toArray(plotsResult.value))
        } else {
          setPlots([])
          setError((current) => current || getApiErrorMessage(plotsResult.reason))
        }
      } finally {
        setLoading(false)
      }
    }

    loadInitialData()
  }, [])

  async function handleSubmit(event) {
    event.preventDefault()
    setSaving(true)
    setSuccess('')
    setError('')

    try {
      const validationMessage = validateForm(form)
      if (validationMessage) {
        setError(validationMessage)
        return
      }

      const payload = buildPayload(form)

      if (selectedRuleId) {
        await updateIrrigationRule(selectedRuleId, payload)
        setSuccess('✔ Configuración actualizada.')
      } else {
        await createIrrigationRule(payload)
        setSuccess('✔ Configuración creada correctamente.')
      }

      setForm(emptyForm)
      setSelectedRuleId('')
      await loadRules()
    } catch (saveError) {
      setError(getApiErrorMessage(saveError))
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(ruleId) {
    if (!ruleId) return

    setDeletingId(ruleId)
    setSuccess('')
    setError('')

    try {
      await deleteIrrigationRule(ruleId)
      setSuccess('Configuracion eliminada correctamente.')

      if (selectedRuleId === ruleId) {
        cancelEdit()
      }

      await loadRules()
    } catch (deleteError) {
      setError(getApiErrorMessage(deleteError))
    } finally {
      setDeletingId('')
    }
  }

  function handleEdit(rule) {
    setSelectedRuleId(getRuleId(rule))
    setForm(mapRuleToForm(rule))
    setSuccess('')
    setError('')
  }

  function cancelEdit() {
    setSelectedRuleId('')
    setForm(emptyForm)
  }

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  function getRulePlotLabel(rule) {
    if (rule.plot) return getPlotName(rule.plot)
    const plot = plots.find((item) => item.id === rule.plotId)
    return plot?.name || ''
  }

  const columns = [
    {
      key: 'plotId',
      label: 'Parcela',
      render: (row) => getRulePlotLabel(row),
    },
    {
      key: 'minMoisture',
      label: 'Humedad min.',
      render: (row) => row.minSoilMoisture,
    },
    {
      key: 'maxMoisture',
      label: 'Humedad max.',
      render: (row) => row.maxSoilMoisture,
    },
    {
      key: 'automaticIrrigationEnabled',
      label: 'Riego automatico',
      render: (row) => {
        return <StatusBadge status={row.autoIrrigationEnabled ? 'ACTIVE' : 'OFF'} />
      },
    },
    {
      key: 'readingInterval',
      label: 'Intervalo',
      render: (row) => row.readingIntervalSec,
    },
    {
      key: 'updatedAt',
      label: 'Actualizacion',
      render: (row) => formatDate(row.updatedAt),
    },
    {
      key: 'actions',
      label: 'Acciones',
      render: (row) => {
        const ruleId = getRuleId(row)
        return (
          <div className="table-actions">
            <button className="icon-button" type="button" aria-label="Editar" onClick={() => handleEdit(row)}>
              <Edit3 size={16} />
            </button>
            <button
              className="icon-button icon-button--danger"
              type="button"
              aria-label="Eliminar"
              disabled={deletingId === ruleId}
              onClick={() => handleDelete(ruleId)}
            >
              <Trash2 size={16} />
            </button>
          </div>
        )
      },
    },
  ]

  return (
    <div className="page-stack">
      <div className="page-title-row">
        <div>
          <p className="eyebrow">Configuracion</p>
          <h2>Parametros de operacion</h2>
        </div>
      </div>

      <SectionCard title="Configuraciones registradas" description="Reglas reales devueltas por /irrigation-rules.">
        {loading ? <div className="state-inline">Cargando datos...</div> : null}
        {!loading && error ? <div className="state-inline state-inline--error">{error}</div> : null}
        {success ? <div className="feedback feedback--success">{success}</div> : null}
        {!loading && !error && rules.length === 0 ? (
          <div className="state-inline">No hay configuraciones registradas.</div>
        ) : null}
        {!loading && !error && rules.length > 0 ? <DataTable columns={columns} rows={rules} /> : null}
      </SectionCard>

      <SectionCard
        title={selectedRuleId ? 'Editar configuracion' : 'Nueva configuracion'}
        description={
          selectedRuleId
            ? 'Actualiza una regla existente usando PUT /irrigation-rules/:id.'
            : 'Crea una regla nueva usando POST /irrigation-rules.'
        }
        action={
          selectedRuleId ? (
            <button className="button button-secondary" type="button" onClick={cancelEdit}>
              <X size={16} />
              Cancelar edicion
            </button>
          ) : null
        }
      >
        <form className="settings-form settings-form--wide" onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="plot-id">Parcela</label>
            <select
              id="plot-id"
              value={form.plotId}
              onChange={(event) => updateField('plotId', event.target.value)}
            >
              <option value="">Selecciona una parcela</option>
              {plots.map((plot) => {
                const plotId = getPlotId(plot)
                return (
                  <option key={plotId} value={plotId}>
                    {getPlotName(plot)}
                  </option>
                )
              })}
            </select>
          </div>
          <div className="form-field">
            <label htmlFor="min-moisture">Humedad minima</label>
            <input
              id="min-moisture"
              type="number"
              min="0"
              max="100"
              value={form.minSoilMoisture}
              onChange={(event) => updateField('minSoilMoisture', event.target.value)}
            />
          </div>
          <div className="form-field">
            <label htmlFor="max-moisture">Humedad maxima</label>
            <input
              id="max-moisture"
              type="number"
              min="0"
              max="100"
              value={form.maxSoilMoisture}
              onChange={(event) => updateField('maxSoilMoisture', event.target.value)}
            />
          </div>
          <div className="form-field">
            <label htmlFor="reading-interval">Intervalo de lectura</label>
            <input
              id="reading-interval"
              type="number"
              min="1"
              value={form.readingIntervalSec}
              onChange={(event) => updateField('readingIntervalSec', event.target.value)}
            />
          </div>
          <label className="checkbox-field" htmlFor="automatic-irrigation">
            <input
              id="automatic-irrigation"
              type="checkbox"
              checked={form.autoIrrigationEnabled}
              onChange={(event) => updateField('autoIrrigationEnabled', event.target.checked)}
            />
            Riego automatico activo
          </label>
          <button className="button button-primary" type="submit" disabled={saving}>
            {selectedRuleId ? <Save size={18} /> : <Plus size={18} />}
            {saving
              ? 'Guardando...'
              : selectedRuleId
                ? 'Guardar cambios'
                : 'Crear configuracion'}
          </button>
        </form>
      </SectionCard>
    </div>
  )
}

export default Settings
