import api from './axios'
import { unwrapApiData } from '../utils/apiResponse'

export async function getUsers() {
  const response = await api.get('/users')
  return unwrapApiData(response)
}

export async function getUser(id) {
  const response = await api.get(`/users/${id}`)
  return unwrapApiData(response)
}

export async function createUser(payload) {
  const response = await api.post('/users', payload)
  return unwrapApiData(response)
}

export async function updateUser(id, payload) {
  const response = await api.put(`/users/${id}`, payload)
  return unwrapApiData(response)
}

export async function deleteUser(id) {
  const response = await api.delete(`/users/${id}`)
  return unwrapApiData(response)
}
