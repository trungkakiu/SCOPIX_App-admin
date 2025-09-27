import React, { useEffect, useState } from 'react'
import { CCard, CCardBody, CCardHeader, CCol, CRow, CSpinner } from '@coreui/react'
import APIcontroller from '../../API/APIcontroller'
import RocketLoad from '../../layout/RocketLoad'
import { toast } from 'react-toastify'

const Topcomics = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [topComics, setTopComics] = useState([])
  const [modalVisible, setModalVisible] = useState(false)
  const fetchTopComics = async () => {
    try {
      setIsLoading(true)
      const res = await APIcontroller.GetTopComics()
      if (res && res.RC === 200) {
        setTopComics(res.RD || [])
      }
    } catch (error) {
      toast.error(error.message)
      console.error('Error fetching top comics:', error)
    } finally {
      setTimeout(() => {
        setIsLoading(false)
      }, 1500)
    }
  }

  useEffect(() => {
    fetchTopComics()
  }, [])

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Top 10 Truyện Nổi Bật</strong>
          </CCardHeader>
          <CCardBody>
            {isLoading ? (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '200px',
                }}
              >
                <RocketLoad w={200} h={200} />
              </div>
            ) : (
              <CRow className="g-4">
                {topComics?.map((comic, index) => (
                  <CCol key={comic.id} xs={12} sm={6} md={4} lg={3}>
                    <CCard className="h-100 shadow-sm">
                      <img
                        src={`http://localhost:3001/ImgStorage/Comic/CoverImg/${comic.cover_url}`}
                        alt={comic.title}
                        className="card-img-top"
                        style={{ height: '200px', objectFit: 'cover' }}
                      />
                      <CCardBody>
                        <h5 className="card-title text-truncate" title={comic.title}>
                          #{index + 1} - {comic.title}
                        </h5>
                        <p className="card-text text-truncate" title={comic.description}>
                          {comic.description}
                        </p>
                      </CCardBody>
                    </CCard>
                  </CCol>
                ))}
              </CRow>
            )}
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Topcomics
