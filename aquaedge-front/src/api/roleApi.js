import api from './axios'
import { unwrapApiData } from '../utils/apiResponse'

export async function getRoles() {
  const response = await api.get('/roles')
  return unwrapApiData(response)
}

export async function assignRole(userId, roleId) {
  const response = await api.post(`/users/${userId}/roles`, { roleId })
  return unwrapApiData(response)
}

export async function removeRole(userId, roleId) {
  const response = await api.delete(`/users/${userId}/roles/${roleId}`)
  return unwrapApiData(response)
}
