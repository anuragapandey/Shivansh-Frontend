const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

export async function apiRequest(path, options = {}) {
  const token = localStorage.getItem('a1_chips_access_token')
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    const details = data.details
      ? Object.entries(data.details)
          .flatMap(([field, messages]) => messages.map((message) => `${field}: ${message}`))
          .join(' ')
      : ''

    throw new Error(details || data.message || 'API request failed')
  }

  return data
}
