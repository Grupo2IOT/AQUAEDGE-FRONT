export function toArray(value) {
  if (Array.isArray(value)) return value
  if (Array.isArray(value?.items)) return value.items
  if (Array.isArray(value?.rows)) return value.rows
  if (Array.isArray(value?.data)) return value.data
  if (value) return [value]
  return []
}

export function readValue(data, keys, fallback = '--') {
  const key = keys.find((item) => data?.[item] !== undefined && data?.[item] !== null)
  return key ? data[key] : fallback
}

export function formatDate(value) {
  return value ? new Date(value).toLocaleString() : '--'
}
