import React, { use, useEffect, useState } from 'react'
import { CCard, CCardBody, CCardHeader, CCol, CRow, CSpinner, CFormInput } from '@coreui/react'
import APIcontroller from '../../API/APIcontroller'
import ReactPaginate from 'react-paginate'
import '../../scss/ComicsCard.scss'
import { useNavigate } from 'react-router-dom'
import RoketLoad from '../../layout/RocketLoad'

const ComicLists = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [comicLists, setComicLists] = useState([])
  const [filteredComics, setFilteredComics] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(0)
  const navigate = useNavigate()
  const itemsPerPage = 6

  useEffect(() => {
    fetchComicLists()
  }, [])

  const fetchComicLists = async () => {
    try {
      setIsLoading(true)
      const res = await APIcontroller.GetComics()
      if (res?.RC === 200) {
        setComicLists(res.RD)
        setFilteredComics(res.RD)
      }
    } catch (error) {
      console.error('Error fetching comic lists:', error)
    } finally {
      setTimeout(() => {
        setIsLoading(false)
      }, 1500)
    }
  }

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase()
    setSearchTerm(value)
    const filtered = comicLists.filter((comic) => comic.title.toLowerCase().includes(value))
    setFilteredComics(filtered)
    setCurrentPage(0)
  }

  const offset = currentPage * itemsPerPage
  const currentItems = filteredComics.slice(offset, offset + itemsPerPage)
  const pageCount = Math.ceil(filteredComics.length / itemsPerPage)

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected)
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4 shadow">
          <CCardHeader>
            <strong>Danh sách truyện tranh</strong>
          </CCardHeader>
          <CCardBody>
            <CFormInput
              className="mb-3"
              placeholder="Tìm kiếm theo tiêu đề..."
              value={searchTerm}
              onChange={handleSearch}
            />
            {isLoading ? (
              <div className="loadingPage text-center py-5">
                <RoketLoad width={200} height={200} />
              </div>
            ) : (
              <>
                <div data-aos="fade-left" className="comic-list">
                  {currentItems.map((comic) => (
                    <div
                      onClick={() => navigate(`/Comics/ComicDetail`, { state: comic })}
                      className="comic-card"
                      style={{ cursor: 'pointer' }}
                      key={comic.id}
                    >
                      <img
                        className="comic-img"
                        src={
                          comic.cover_url
                            ? `http://localhost:3001/ImgStorage/Comic/CoverImg/${comic.cover_url}`
                            : 'https://via.placeholder.com/120x80?text=No+Image'
                        }
                        alt={comic.title}
                      />
                      <div className="comic-info">
                        <h5 className="comic-title">{comic.title}</h5>
                        <p className="comic-desc">
                          {comic?.description?.length > 100 ? (
                            <>{(comic.description || 'Không có mô tả.').slice(0, 100)}...</>
                          ) : (
                            comic?.description
                          )}
                        </p>
                        <p className="comic-meta">
                          <strong>Tác giả:</strong> {comic.AuthorInfo.Author_name} &nbsp;|&nbsp;
                          <strong>Trạng thái:</strong> {comic.status || 'Không rõ'}
                        </p>
                        <p className="comic-date">
                          Ngày tạo: {new Date(comic.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
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

export default ComicLists
