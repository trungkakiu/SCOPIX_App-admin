import React, { use, useContext, useEffect } from 'react'
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index'
import { AdminContext } from '../context/AdminContext'
import { useNavigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'

const DefaultLayout = () => {
  const { Admin } = useContext(AdminContext)
  const Navigate = useNavigate()
  useEffect(() => {
    if (!Admin.Authen) {
      Navigate('/login', { replace: true })
    }
  }, [Admin.Authen])

  return (
    <div>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100">
        <AppHeader />
        <div className="body flex-grow-1">
          <AppContent />
        </div>
        <AppFooter />
      </div>
    </div>
  )
}

export default DefaultLayout
