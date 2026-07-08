import api from './axios'
import { unwrapApiData } from '../utils/apiResponse'

export async function getPlots() {
  const response = await api.get('/plots')
  return unwrapApiData(response)
}

export async function getPlot(id) {
  const response = await api.get(`/plots/${id}`)
  return unwrapApiData(response)
}

export async function createPlot(payload) {
  const response = await api.post('/plots', payload)
  return unwrapApiData(response)
}

export async function updatePlot(id, payload) {
  const response = await api.put(`/plots/${id}`, payload)
  return unwrapApiData(response)
}

export async function deletePlot(id) {
  const response = await api.delete(`/plots/${id}`)
  return unwrapApiData(response)
}

export async function assignPlotUser(id, userId) {
  const response = await api.post(`/plots/${id}/assign-user`, { userId })
  return unwrapApiData(response)
}
