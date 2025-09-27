import { createContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export const AdminContext = createContext()

const defaultUserStatus = {
  Authen: false,
  token: '',
  data: [],
}

export const AdminProvider = ({ children }) => {
  const navigate = useNavigate()

  const getInitialUser = () => {
    try {
      const stored = localStorage.getItem('admin')
      return stored ? JSON.parse(stored) : defaultUserStatus
    } catch {
      return defaultUserStatus
    }
  }

  const [Admin, setAdmin] = useState(() => getInitialUser())

  useEffect(() => {
    if (Admin.Authen) {
      localStorage.setItem('admin', JSON.stringify(Admin))
    } else {
      localStorage.removeItem('admin')
    }
  }, [Admin])

  const login = (adminData, token) => {
    const newAdmin = {
      Authen: true,
      token,
      data: adminData,
    }
    setAdmin(newAdmin)
  }

  const logout = () => {
    setAdmin(defaultUserStatus)
    navigate('/FlareOnline/Login', { replace: true })
  }

  return <AdminContext.Provider value={{ Admin, login, logout }}>{children}</AdminContext.Provider>
}
