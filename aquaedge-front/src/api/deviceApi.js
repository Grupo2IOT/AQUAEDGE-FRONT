import api from './axios'
import { unwrapApiData } from '../utils/apiResponse'

export async function getDevices() {
  const response = await api.get('/devices')
  return unwrapApiData(response)
}

export async function getDevice(id) {
  const response = await api.get(`/devices/${id}`)
  return unwrapApiData(response)
}

export async function createDevice(payload) {
  const response = await api.post('/devices', payload)
  return unwrapApiData(response)
}

export async function updateDevice(id, payload) {
  const response = await api.put(`/devices/${id}`, payload)
  return unwrapApiData(response)
}

export async function deleteDevice(id) {
  const response = await api.delete(`/devices/${id}`)
  return unwrapApiData(response)
}
