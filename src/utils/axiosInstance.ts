import axios from 'axios'
import { getAuth } from 'firebase/auth'

const api = axios.create({
  baseURL: import.meta.env.VITE_FIREBASE_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(async (config) => {
  const auth = getAuth()
  const user = auth.currentUser

  if (user) {
    const token = await user.getIdToken()
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})
export default api
