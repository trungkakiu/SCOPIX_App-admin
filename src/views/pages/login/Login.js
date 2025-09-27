import React, { useContext, useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import APIcontroller from '../../../API/APIcontroller'
import { AdminContext } from '../../../context/AdminContext'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const { Admin, login } = useContext(AdminContext)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const loginDefault = {
    username: '',
    password: '',
  }
  const [loginData, setLoginData] = useState(loginDefault)
  const handleLogin = async () => {
    try {
      setIsLoading(true)
      const res = await APIcontroller.handleLogin(loginData)
      if (res) {
        if (res.RC === 200) {
          login(res.RD.Admin, res.RD.Token)
          toast.success('Login successful', 'Welcome back!')
          setLoginData(loginDefault)
          navigate('/', { replace: true })
        } else {
          toast.error(res.RM, 'Error')
        }
      } else {
        toast.error('Login failed', 'Please check your credentials and try again.')
      }
    } catch (error) {
      console.error('Login error:', error)
      toast.error('An error occurred during login', 'Please try again later.')
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center"
      style={{
        background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
      }}
    >
      <CContainer>
        <CRow className="justify-content-center">
          <CCol xs={12} sm={10} md={8} lg={6}>
            <CCard className="shadow-lg border-0 rounded-4">
              <CCardBody className="p-5">
                <h2 className="text-center mb-4 text-dark fw-bold fs-2">Admin Login</h2>
                <p className="text-medium-emphasis text-center mb-4 fs-6">
                  Welcome back! Please enter your credentials.
                </p>
                <CForm>
                  <CInputGroup className="mb-4">
                    <CInputGroupText className="py-3 px-4">
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput
                      value={loginData.username}
                      onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                      type="text"
                      placeholder="Username"
                      autoComplete="username"
                      className="py-3 fs-5"
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-4">
                    <CInputGroupText className="py-3 px-4">
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      type="password"
                      placeholder="Password"
                      autoComplete="current-password"
                      className="py-3 fs-5"
                    />
                  </CInputGroup>
                  <div className="d-grid">
                    <CButton
                      onClick={isLoading ? null : handleLogin}
                      color="primary"
                      className="py-3 fs-5 fw-semibold text-white"
                      style={{ backgroundColor: '#6a11cb', borderColor: '#2575fc' }}
                    >
                      {isLoading ? 'Logging in...' : 'Login'}
                    </CButton>
                  </div>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
