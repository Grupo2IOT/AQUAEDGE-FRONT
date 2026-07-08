import api from './axios'
import { unwrapApiData } from '../utils/apiResponse'

export async function getAuditLogs() {
  const response = await api.get('/audit-logs')
  return unwrapApiData(response)
}
