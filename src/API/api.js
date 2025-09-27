// Src/Utils/APIClient.js
import axios from 'axios'
import { toast } from 'react-toastify'
import { AdminContext } from '../Context/AdminContext'

const baseURL = 'http://localhost:3001/api'

const api = axios.create({
  baseURL: baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(
  (config) => {
    const stored = localStorage.getItem('admin')
    const token = stored ? JSON.parse(stored)?.token : null
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log(error)
    console.error('🔥 API ERROR:', error?.response || error)
    toast.error(
      error?.response?.data?.RM || 'An unexpected error occurred. Please try again later.',
    )
    return Promise.reject(error)
  },
)

export default api
