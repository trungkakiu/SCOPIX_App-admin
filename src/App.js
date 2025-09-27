import React, { Suspense, useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import { useSelector } from 'react-redux'
import AOS from 'aos'
import 'aos/dist/aos.css'
import { CSpinner, useColorModes } from '@coreui/react'
import './scss/style.scss'
import { toast, ToastContainer } from 'react-toastify'

const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))
const Login = React.lazy(() => import('./views/pages/login/Login'))
const Register = React.lazy(() => import('./views/pages/register/Register'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))

const App = () => {
  const { isColorModeSet, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')
  const storedTheme = useSelector((state) => state.theme)

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    })
  }, [])

  useEffect(() => {
    const socket = new WebSocket('ws://scopix-app-backend.onrender.com')

    socket.onopen = () => {
      console.log('🔌 WebSocket connected')
      socket.send(JSON.stringify({ type: 'client_ready', user: 'CHUNG' }))
    }

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data)

      if (data.type === 'new_transaction') {
        toast.info(`Đơn hàng mới từ user ${data.user}: +${data.amount} coin`)
      }
    }

    socket.onerror = (error) => {
      console.error('WebSocket error:', error)
    }

    socket.onclose = () => {
      console.log('WebSocket disconnected')
    }

    return () => {
      socket.close()
    }
  }, [])

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.href.split('?')[1])
    const theme = urlParams.get('theme')?.match(/^[A-Za-z0-9\s]+/)?.[0]
    if (theme) setColorMode(theme)
    if (!isColorModeSet()) setColorMode(storedTheme)
  }, [])

  return (
    <div>
      <ToastContainer />
      <Suspense
        fallback={
          <div className="pt-3 text-center">
            <CSpinner color="primary" variant="grow" />
          </div>
        }
      >
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/404" element={<Page404 />} />
          <Route path="/500" element={<Page500 />} />
          <Route path="*" element={<DefaultLayout />} />
        </Routes>
      </Suspense>
    </div>
  )
}

export default App
