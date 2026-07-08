import api from './axios'
import { unwrapApiData } from '../utils/apiResponse'

function normalizeCommandPayload(payload) {
  const nextPayload = { ...payload }

  if (nextPayload.state === 'OFF' || Number(nextPayload.durationSec) <= 0) {
    delete nextPayload.durationSec
  }

  return nextPayload
}

export async function createCommand(payload) {
  const response = await api.post('/commands', normalizeCommandPayload(payload))
  return unwrapApiData(response)
}

export async function getCommands() {
  const response = await api.get('/commands')
  return unwrapApiData(response)
}

export async function getPendingCommands() {
  const response = await api.get('/commands/pending')
  return unwrapApiData(response)
}

export async function getCommandsByDevice(deviceId) {
  const response = await api.get(`/commands/device/${deviceId}`)
  return unwrapApiData(response)
}

export async function updateCommandStatus(id, status) {
  const response = await api.put(`/commands/${id}/status`, { status })
  return unwrapApiData(response)
}
