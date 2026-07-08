import api from './axios'
import { unwrapApiData } from '../utils/apiResponse'

export async function getWaterUsageReport() {
  const response = await api.get('/reports/water-usage')
  return unwrapApiData(response)
}

export async function getEventsReport() {
  const response = await api.get('/reports/events')
  return unwrapApiData(response)
}

export async function getAlertsReport() {
  const response = await api.get('/reports/alerts')
  return unwrapApiData(response)
}

export async function createReport(payload) {
  const response = await api.post('/reports', payload)
  return unwrapApiData(response)
}
