import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CBadge,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormInput,
  CRow,
  CSpinner,
} from '@coreui/react'
import ReactPaginate from 'react-paginate'
import { cilPlus } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import NewframModal from '../Modals/NewframModal'
import APIcontroller from '../../API/APIcontroller'
import RocketLoad from '../../layout/RocketLoad'
import '../../scss/framelist.scss'
import FrameDetail from '../Modals/FrameDetail'

const Avatarframe = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [frameLists, setFrameLists] = useState([])
  const [filteredFrame, setFilteredFrame] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(0)
  const [modalState, setModalState] = useState({ new: false, edit: false })
  const navigate = useNavigate()
  const [modalData, setmodalData] = useState()

  const itemsPerPage = 15

  useEffect(() => {
    fetchAvatarframe()
  }, [])

  const fetchAvatarframe = async () => {
    try {
      setIsLoading(true)
      const res = await APIcontroller.fetchAvatarframe()
      if (res?.RC === 200) {
        setFrameLists(res.RD)
        setFilteredFrame(res.RD)
      }
    } catch (error) {
      console.error('Error fetching frame lists:', error)
    } finally {
      setTimeout(() => setIsLoading(false), 1000)
    }
  }

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase()
    setSearchTerm(value)
    const filtered = frameLists.filter((frames) => frames.framename.toLowerCase().includes(value))
    setFilteredFrame(filtered)
    setCurrentPage(0)
  }

  const openModal = (code, data) => {
    setModalState({ [code]: true })
    if (data) {
      setmodalData(data)
    }
  }
  const closeModal = (code) => setModalState({ [code]: false })
  const closefectModal = (code) => {
    setModalState({ [code]: false })
    fetchAvatarframe()
  }
  const offset = currentPage * itemsPerPage
  const currentItems = filteredFrame.slice(offset, offset + itemsPerPage)
  const pageCount = Math.ceil(filteredFrame.length / itemsPerPage)

  const handlePageChange = ({ selected }) => setCurrentPage(selected)

  return (
    <CRow>
      <NewframModal
        closefetch={() => closefectModal('new')}
        show={modalState.new}
        close={() => closeModal('new')}
        title="Thêm khung mới"
      />
      <FrameDetail
        closefetch={() => closefectModal('edit')}
        show={modalState.edit}
        data={modalData}
        close={() => closeModal('edit')}
      />
      <CCol xs={12}>
        <CCard className="shadow-lg rounded-4 overflow-hidden">
          <CCardHeader className="header d-flex justify-content-between align-items-center">
            <h5 className="fw-bold mb-0">Danh sách khung ảnh đại diện</h5>
            <CBadge
              onClick={() => openModal('new')}
              color="info"
              className="px-3 py-2 text-uppercase new-frame-btn"
              style={{ cursor: 'pointer' }}
            >
              <div className="d-flex align-items-center">
                <CIcon icon={cilPlus} />
                <span className="ms-2">Thêm mới</span>
              </div>
            </CBadge>
          </CCardHeader>
          <CCardBody className="bg-dark text-white">
            <CFormInput
              className="mb-4"
              placeholder="🔎 Tìm kiếm theo tên khung..."
              value={searchTerm}
              onChange={handleSearch}
            />

            {isLoading ? (
              <div className="loadingPage text-center py-5">
                <RocketLoad width={200} height={200} />
              </div>
            ) : (
              <>
                <div className="frame-list-grid">
                  {currentItems.length > 0 ? (
                    currentItems.map((frames) => (
                      <div
                        key={frames.id}
                        onClick={() => openModal('edit', frames)}
                        className="frame-card"
                      >
                        <img
                          className="frame-img"
                          src={
                            frames.url
                              ? `http://localhost:3001/Frame_avatar/${frames.url}`
                              : 'https://via.placeholder.com/200x150?text=No+Image'
                          }
                          alt={frames.framename}
                        />
                        <div className="frame-info">
                          <h6 className="frame-title">{frames.framename}</h6>
                          <p className="frame-desc">{`${frames.price} Xu` || 'Không có mô tả.'}</p>
                          <p className="frame-date">
                            Ngày thêm:{' '}
                            {frames.createdAt
                              ? new Date(frames.createdAt).toLocaleDateString()
                              : 'Không rõ'}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="Noframe text-center">
                      <span>📭 Hệ thống chưa có khung ảnh đại diện nào</span>
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

export default Avatarframe
