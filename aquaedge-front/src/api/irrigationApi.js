import api from './axios'
import { unwrapApiData } from '../utils/apiResponse'

export async function getIrrigationRules() {
  const response = await api.get('/irrigation-rules')
  return unwrapApiData(response)
}

export async function getIrrigationRulesByPlot(plotId) {
  const response = await api.get(`/irrigation-rules/plot/${plotId}`)
  return unwrapApiData(response)
}

export async function createIrrigationRule(payload) {
  const response = await api.post('/irrigation-rules', payload)
  return unwrapApiData(response)
}

export async function updateIrrigationRule(id, payload) {
  const response = await api.put(`/irrigation-rules/${id}`, payload)
  return unwrapApiData(response)
}

export async function deleteIrrigationRule(id) {
  const response = await api.delete(`/irrigation-rules/${id}`)
  return unwrapApiData(response)
}

export async function getIrrigationEvents() {
  const response = await api.get('/irrigation-events')
  return unwrapApiData(response)
}

export async function getIrrigationEventsByPlot(plotId) {
  const response = await api.get(`/irrigation-events/plot/${plotId}`)
  return unwrapApiData(response)
}

export async function getIrrigationEventsByDevice(deviceId) {
  const response = await api.get(`/irrigation-events/device/${deviceId}`)
  return unwrapApiData(response)
}
