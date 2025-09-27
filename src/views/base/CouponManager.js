import React, { useEffect, useState } from 'react'
import {
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CRow,
} from '@coreui/react'
import ReactPaginate from 'react-paginate'
import RocketLoad from '../../layout/RocketLoad'
import APIcontroller from '../../API/APIcontroller'
import { toast } from 'react-toastify'
import dayjs from 'dayjs'
import '../../scss/Couponmanager.scss'

const GiftCodeManager = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [giftCodes, setGiftCodes] = useState([])
  const [filteredGiftCodes, setFilteredGiftCodes] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(0)

  const [newGift, setNewGift] = useState({
    name: '',
    code: '',
    date: '',
    coin: 0,
  })
  const [today, setToday] = useState(dayjs())

  useEffect(() => {
    const timer = setInterval(
      () => {
        setToday(dayjs())
      },
      60 * 60 * 1000,
    )

    return () => clearInterval(timer)
  }, [])
  const itemsPerPage = 10

  useEffect(() => {
    fetchGiftCodes()
  }, [])

  const fetchGiftCodes = async () => {
    try {
      setIsLoading(true)
      const res = await APIcontroller.fetchGiftCodes()
      if (res?.RC === 200) {
        setGiftCodes(res.RD)
        setFilteredGiftCodes(res.RD)
      }
    } catch (error) {
      console.error('Error fetching gift codes:', error)
    } finally {
      setTimeout(() => setIsLoading(false), 1000)
    }
  }

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase()
    setSearchTerm(value)
    const filtered = giftCodes.filter((g) => g.name.toLowerCase().includes(value))
    setFilteredGiftCodes(filtered)
    setCurrentPage(0)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewGift((prev) => ({ ...prev, [name]: value }))
  }

  const handleCreateGift = async (e) => {
    e.preventDefault()
    try {
      const res = await APIcontroller.createGiftCode(newGift)
      if (res?.RC === 200) {
        setNewGift({ name: '', code: '', date: '', coin: '' })
        fetchGiftCodes()
        toast.success('Tạo mã thành công!')
      } else {
        toast.error(res.RM)
      }
    } catch (error) {
      console.error('Error creating gift code:', error)
    }
  }

  const offset = currentPage * itemsPerPage
  const currentItems = filteredGiftCodes.slice(offset, offset + itemsPerPage)
  const pageCount = Math.ceil(filteredGiftCodes.length / itemsPerPage)

  const handlePageChange = ({ selected }) => setCurrentPage(selected)

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="shadow-lg rounded-4 overflow-hidden">
          <CCardHeader className="header">
            <h5 className="fw-bold mb-0">Quản lý mã tặng quà</h5>
          </CCardHeader>
          <CCardBody className="bg-dark text-white">
            <CForm className="mb-4" onSubmit={handleCreateGift}>
              <CRow className="g-3 align-items-end">
                <CCol md={3}>
                  <CFormLabel className="text-white">Tên mã</CFormLabel>
                  <CFormInput
                    name="name"
                    value={newGift.name}
                    onChange={handleInputChange}
                    placeholder="Tên mã quà"
                    required
                  />
                </CCol>
                <CCol md={3}>
                  <CFormLabel className="text-white">Code</CFormLabel>
                  <CFormInput
                    name="code"
                    value={newGift.code}
                    onChange={handleInputChange}
                    placeholder="Nhập code"
                    required
                  />
                </CCol>
                <CCol md={3}>
                  <CFormLabel className="text-white">Ngày hết hạn</CFormLabel>
                  <CFormInput
                    type="date"
                    name="date"
                    value={newGift.date}
                    onChange={handleInputChange}
                    required
                  />
                </CCol>
                <CCol md={2}>
                  <CFormLabel className="text-white">Coin</CFormLabel>
                  <CFormInput
                    type="number"
                    name="coin"
                    value={newGift.coin}
                    onChange={handleInputChange}
                    placeholder="Coin"
                    required
                  />
                </CCol>
                <CCol md={1}>
                  <CButton color="success" type="submit">
                    Tạo
                  </CButton>
                </CCol>
              </CRow>
            </CForm>

            <CFormInput
              className="mb-4"
              placeholder="🔎 Tìm kiếm theo tên mã..."
              value={searchTerm}
              onChange={handleSearch}
            />

            {isLoading ? (
              <div className="loadingPage text-center py-5">
                <RocketLoad width={200} height={200} />
              </div>
            ) : (
              <>
                <div className="giftcode-list-grid">
                  {currentItems.length > 0 ? (
                    currentItems.map((gift) => {
                      const expiredAt = gift.date ? dayjs(gift.date) : null
                      let expiredText = 'Không rõ'
                      let expiredClass = 'gift-expired'

                      if (expiredAt) {
                        expiredText = expiredAt.format('DD/MM/YYYY')
                        if (expiredAt.isBefore(today, 'day') || expiredAt.diff(today, 'day') <= 3) {
                          expiredClass = 'gift-expired danger'
                        }
                      }

                      return (
                        <div key={gift.id} className="giftcode-card">
                          <h6 className="gift-title">{gift.name}</h6>
                          <p className="gift-code">Code: {gift.code}</p>
                          <p className="gift-coin">🎁 {gift.coin} Xu</p>
                          <p className={expiredClass}>Hết hạn: {expiredText}</p>
                        </div>
                      )
                    })
                  ) : (
                    <div className="Nodata text-center">
                      <span>Chưa có mã tặng quà nào</span>
                    </div>
                  )}
                </div>

                <div className="d-flex justify-content-center mt-4">
                  <ReactPaginate
                    previousLabel={'←'}
                    nextLabel={'→'}
                    breakLabel={'...'}
                    pageCount={pageCount}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={3}
                    onPageChange={handlePageChange}
                    containerClassName={'pagination'}
                    pageClassName={'page-item'}
                    pageLinkClassName={'page-link'}
                    previousClassName={'page-item'}
                    previousLinkClassName={'page-link'}
                    nextClassName={'page-item'}
                    nextLinkClassName={'page-link'}
                    activeClassName={'active'}
                  />
                </div>
              </>
            )}
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default GiftCodeManager
