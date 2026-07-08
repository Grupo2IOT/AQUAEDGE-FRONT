import api from './axios'
import { unwrapApiData } from '../utils/apiResponse'

export async function getAlerts() {
  const response = await api.get('/alerts')
  return unwrapApiData(response)
}

export async function getAlert(id) {
  const response = await api.get(`/alerts/${id}`)
  return unwrapApiData(response)
}

export async function createAlert(payload) {
  const response = await api.post('/alerts', payload)
  return unwrapApiData(response)
}

export async function updateAlert(id, payload) {
  const response = await api.put(`/alerts/${id}`, payload)
  return unwrapApiData(response)
}

export async function resolveAlert(id) {
  const response = await api.put(`/alerts/${id}/resolve`)
  return unwrapApiData(response)
}

export async function deleteAlert(id) {
  const response = await api.delete(`/alerts/${id}`)
  return unwrapApiData(response)
}
