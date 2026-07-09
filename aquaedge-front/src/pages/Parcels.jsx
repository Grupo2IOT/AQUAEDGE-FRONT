import { useEffect, useState } from 'react'
import { Edit3, Plus, Save, Trash2, X } from 'lucide-react'
import {
  createPlot,
  deletePlot,
  getPlots,
  updatePlot,
} from '../api/plotApi'
import DataTable from '../components/DataTable'
import SectionCard from '../components/SectionCard'
import { formatDate, toArray } from '../utils/collections'
import { getApiErrorMessage } from '../utils/apiResponse'

const emptyForm = {
  name: '',
  location: '',
  cropType: '',
  area: '',
}

function getPlotId(plot) {
  return plot.id
}

function mapPlotToForm(plot) {
  return {
    name: plot.name,
    location: plot.location || '',
    cropType: plot.cropType || '',
    area: plot.area ?? '',
  }
}

function buildPayload(form) {
  const payload = {
    name: form.name.trim(),
  }

  if (form.location.trim()) payload.location = form.location.trim()
  if (form.cropType.trim()) payload.cropType = form.cropType.trim()
  if (form.area !== '') payload.area = Number(form.area)

  return payload
}

function validateForm(form) {
  if (!form.name.trim()) return 'El nombre de la parcela es obligatorio.'
  if (form.area !== '' && (!Number.isFinite(Number(form.area)) || Number(form.area) < 0)) {
    return 'El area debe ser un numero mayor o igual a 0.'
  }
  return ''
}

function Parcels() {
  const [plots, setPlots] = useState([])
  const [selectedPlotId, setSelectedPlotId] = useState('')
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function loadPlots() {
    setLoading(true)
    setError('')

    try {
      const data = await getPlots()
      setPlots(toArray(data))
    } catch (loadError) {
      setPlots([])
      setError(getApiErrorMessage(loadError))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPlots()
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

      if (selectedPlotId) {
        await updatePlot(selectedPlotId, payload)
        setSuccess('✔ Parcela actualizada correctamente.')
      } else {
        await createPlot(payload)
        setSuccess('✔ Parcela creada correctamente.')
      }

      setSelectedPlotId('')
      setForm(emptyForm)
      await loadPlots()
    } catch (saveError) {
      setError(getApiErrorMessage(saveError))
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(plotId) {
    if (!plotId) return

    setDeletingId(plotId)
    setSuccess('')
    setError('')

    try {
      await deletePlot(plotId)
      setSuccess('Parcela eliminada correctamente.')

      if (selectedPlotId === plotId) cancelEdit()

      await loadPlots()
    } catch (deleteError) {
      setError(getApiErrorMessage(deleteError))
    } finally {
      setDeletingId('')
    }
  }

  function handleEdit(plot) {
    setSelectedPlotId(getPlotId(plot))
    setForm(mapPlotToForm(plot))
    setSuccess('')
    setError('')
  }

  function cancelEdit() {
    setSelectedPlotId('')
    setForm(emptyForm)
  }

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const columns = [
    { key: 'id', label: 'Codigo', render: (row) => getPlotId(row) },
    { key: 'name', label: 'Nombre' },
    { key: 'location', label: 'Ubicacion', render: (row) => row.location || '' },
    { key: 'cropType', label: 'Cultivo', render: (row) => row.cropType || '' },
    { key: 'area', label: 'Area', render: (row) => row.area ?? '' },
    {
      key: 'updatedAt',
      label: 'Actualizacion',
      render: (row) => formatDate(row.updatedAt),
    },
    {
      key: 'actions',
      label: 'Acciones',
      render: (row) => {
        const plotId = getPlotId(row)
        return (
          <div className="table-actions">
            <button className="icon-button" type="button" aria-label="Editar" onClick={() => handleEdit(row)}>
              <Edit3 size={16} />
            </button>
            <button
              className="icon-button icon-button--danger"
              type="button"
              aria-label="Eliminar"
              disabled={deletingId === plotId}
              onClick={() => handleDelete(plotId)}
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
          <p className="eyebrow">Administracion de parcelas</p>
          <h2>Parcelas registradas</h2>
        </div>
      </div>

      <SectionCard title="Inventario de parcelas" description="Gestion administrativa de parcelas conectadas al sistema.">
        {loading ? <div className="state-inline">Cargando datos...</div> : null}
        {!loading && error ? <div className="state-inline state-inline--error">{error}</div> : null}
        {success ? <div className="feedback feedback--success">{success}</div> : null}
        {!loading && !error && plots.length === 0 ? (
          <div className="state-inline">No hay datos disponibles.</div>
        ) : null}
        {!loading && !error && plots.length > 0 ? <DataTable columns={columns} rows={plots} /> : null}
      </SectionCard>

      <SectionCard
        title={selectedPlotId ? 'Editar parcela' : 'Nueva parcela'}
        description={
          selectedPlotId ? 'Actualiza una parcela existente.' : 'Registra una nueva parcela para monitoreo general.'
        }
        action={
          selectedPlotId ? (
            <button className="button button-secondary" type="button" onClick={cancelEdit}>
              <X size={16} />
              Cancelar edicion
            </button>
          ) : null
        }
      >
        <form className="settings-form settings-form--wide" onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="plot-name">Nombre</label>
            <input id="plot-name" value={form.name} onChange={(event) => updateField('name', event.target.value)} />
          </div>
          <div className="form-field">
            <label htmlFor="plot-location">Ubicacion</label>
            <input
              id="plot-location"
              value={form.location}
              onChange={(event) => updateField('location', event.target.value)}
            />
          </div>
          <div className="form-field">
            <label htmlFor="plot-crop">Tipo de cultivo</label>
            <input
              id="plot-crop"
              value={form.cropType}
              onChange={(event) => updateField('cropType', event.target.value)}
            />
          </div>
          <div className="form-field">
            <label htmlFor="plot-area">Area</label>
            <input
              id="plot-area"
              type="number"
              min="0"
              value={form.area}
              onChange={(event) => updateField('area', event.target.value)}
            />
          </div>
          <button className="button button-primary" type="submit" disabled={saving}>
            {selectedPlotId ? <Save size={18} /> : <Plus size={18} />}
            {saving ? 'Guardando...' : selectedPlotId ? 'Guardar cambios' : 'Crear parcela'}
          </button>
        </form>
      </SectionCard>
    </div>
  )
}

export default Parcels
