import api from './axios'
import { unwrapApiData } from '../utils/apiResponse'

export async function getLatestTelemetry() {
  const response = await api.get('/telemetry/latest')
  return unwrapApiData(response)
}

export async function getTelemetryHistory(params = {}) {
  const response = await api.get('/telemetry/history', { params })
  return unwrapApiData(response)
}

export async function getTelemetryByDevice(deviceId) {
  const response = await api.get(`/telemetry/device/${deviceId}`)
  return unwrapApiData(response)
}

export async function getTelemetryByPlot(plotId) {
  const response = await api.get(`/telemetry/plot/${plotId}`)
  return unwrapApiData(response)
}
