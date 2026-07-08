import api from './axios'
import { unwrapApiData } from '../utils/apiResponse'

export async function register(payload) {
  const response = await api.post('/auth/register', payload)
  return unwrapApiData(response)
}

export async function login(payload) {
  const response = await api.post('/auth/login', payload)
  return unwrapApiData(response)
}

export async function logout() {
  const response = await api.post('/auth/logout')
  return unwrapApiData(response)
}

export async function getMe() {
  const response = await api.get('/auth/me')
  return unwrapApiData(response)
}
