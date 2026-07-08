export function unwrapApiData(response) {
  if (response?.data && Object.prototype.hasOwnProperty.call(response.data, 'data')) {
    return response.data.data
  }

  return response?.data
}

function formatValidationErrors(errors) {
  if (!Array.isArray(errors) || errors.length === 0) return ''

  return errors
    .map((item) => {
      if (typeof item === 'string') return item
      const field = item.field || item.path || item.param
      const message = item.message || item.msg || item.error
      return field && message ? `${field}: ${message}` : message || field
    })
    .filter(Boolean)
    .join(' ')
}

export function getApiErrorMessage(error) {
  if (error?.code === 'ECONNABORTED') {
    return 'La solicitud tardó demasiado. Revisa que el backend esté disponible.'
  }

  if (error?.code === 'ERR_NETWORK') {
    return 'No se pudo conectar con el backend.'
  }

  const validationMessage = formatValidationErrors(error?.response?.data?.errors)
  if (validationMessage) {
    return `${error?.response?.data?.message || 'Error de validación'}: ${validationMessage}`
  }

  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    'No se pudieron cargar los datos.'
  )
}
