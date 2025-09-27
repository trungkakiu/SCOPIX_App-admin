import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CSpinner,
  CButton,
  CRow,
  CCol,
  CBadge,
  CCardFooter,
  CFormInput,
  CFormTextarea,
} from '@coreui/react'
import '../../scss/ComicDetail.scss'
import { CIcon } from '@coreui/icons-react'
import { cilPen, cilPlus, cilSave, cilTrash } from '@coreui/icons'
import RocketLoad from '../../layout/RocketLoad'
import APIcontroller from '../../API/APIcontroller'
import { useRef } from 'react'
import { toast } from 'react-toastify'
import NewChapter from '../Modals/NewChapter'
import AddCategoryModal from '../Modals/AddCategoryModal'

const ComicDetail = () => {
  const location = useLocation()
  const [isEditing, setIsEditing] = useState('edit')
  const navigate = useNavigate()
  const [comic, setComic] = useState(location.state || '')
  const [isLoading, setIsLoading] = useState(false)
  const [Page, setPage] = useState([])
  const AvatarRef = useRef()
  const [modelState, setmodalState] = useState({
    newchapter: false,
    NewCategory: false,
  })
  const [fileAvatar, setfileAvatar] = useState()
  const [newCover, setNewcover] = useState()

  const handleChooseImage = () => {
    AvatarRef.current.click()
  }

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (file) {
      const objectUrl = URL.createObjectURL(file)
      setfileAvatar(objectUrl)
      setNewcover(file)
    }
  }

  useEffect(() => {
    if (comic?.title) {
      document.title = `${comic.title}`
    }
    return () => {
      document.title = 'SCOPIX Admin control'
    }
  }, [comic?.title])

  const deleteComic = async (comicId) => {
    try {
      setIsLoading(true)
      const res = await APIcontroller.DeleteComic(comicId)
      if (res && res.RC.toString() === '200') {
        toast.success('Xóa truyện thành công!')
        navigate('/Comics/Comiclists')
      } else {
        toast.error(res.RM || 'Lỗi khi xóa truyện.')
      }
    } catch (error) {
      console.error('Error deleting comic:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fectPage = async () => {
    try {
      setIsLoading(true)
      if (location.state) {
        setComic(location.state)
      } else {
        navigate('/')
      }
      const res = await APIcontroller.fetchPage(comic.id)
      if (res && res.RC === 200) {
        setPage(res.RD)
      }
      if (!res) {
        toast.error('error while call API! ')
      }
    } catch (error) {
      console.error(error)
      toast.error(error)
    } finally {
      setTimeout(() => {
        setIsLoading(false)
      }, 1500)
    }
  }

  const handleDeleteCategory = async (catId) => {
    if (!window.confirm('Bạn có chắc muốn xóa category này?')) return
    try {
      const res = await APIcontroller.DeleteComicCategory(catId, comic.id)
      if (res && res.RC === 200) {
        toast.success('Xóa category thành công')
        fectPage()
      } else {
        toast.error(res?.RM || 'Xóa category thất bại')
      }
    } catch (error) {
      console.error('Error deleting category:', error)
      toast.error('Lỗi khi xóa category')
    }
  }

  const toggleEdit = async () => {
    if (isEditing === 'save') {
      try {
        setIsEditing('saving')
        const data = new FormData()
        data.append('title', comic.title)
        data.append('description', comic.description)
        data.append('author', comic.author)
        data.append('status', comic.status)
        data.append('oldcover', comic.cover_url)
        data.append('options', comic.options)
        if (newCover) data.append('NewCoverImg', newCover)
        const res = await APIcontroller.EditComic(data, comic.id)
        if (res) {
          if (res.RC === 200) {
            toast.success('Thay đổi thông tin ảnh thành công!')
          } else {
            toast.error(res.RM)
          }
        } else {
          toast.error('error while call API!')
        }
      } catch (error) {
        console.error(error)
      } finally {
        setTimeout(() => {
          setIsEditing('edit')
        }, 500)
      }
    } else {
      setIsEditing('save')
    }
  }

  const openModal = (code) => {
    setmodalState((prev) => ({ ...prev, [code]: true }))
  }

  const closeModal = (code) => {
    setmodalState((prev) => ({ ...prev, [code]: false }))
  }

  const closeFetch = (code) => {
    setmodalState((prev) => ({ ...prev, [code]: false }))
    fectPage()
  }
  useEffect(() => {
    fectPage()
  }, [location.state, navigate])

  return (
    <div className="comic-detail-wrapper">
      {isLoading ? (
        <>
          <div className="loading_page">
            <RocketLoad w={200} h={200} />
          </div>
        </>
      ) : (
        <>
          <CCard className="shadow-lg rounded-4 overflow-hidden">
            <NewChapter
              title={comic.title}
              show={modelState.newchapter}
              comicId={comic.id}
              closeFetch={() => closeFetch('newchapter')}
              close={() => closeModal('newchapter')}
            />
            <AddCategoryModal
              visible={modelState.NewCategory}
              onClose={() => closeModal('NewCategory')}
              closeFetch={() => closeFetch('NewCategory')}
              comicId={comic.id}
              comicTitle={comic.title}
            />
            <CCardHeader className="bg-dark text-white d-flex justify-content-between align-items-center px-4 py-3">
              <CFormInput
                type="text"
                value={comic.title}
                onChange={(e) =>
                  setComic((prev) => ({
                    ...prev,
                    title: e.target.value,
                  }))
                }
                readOnly={isEditing !== 'save'}
                placeholder="Tên tác giả"
                className="mb-0 fw-bold"
                style={{ maxWidth: 550, textAlign: 'center', fontSize: '20px' }}
              />
              <CBadge
                className="delete-comic-btn px-3 py-2 text-uppercase"
                onClick={() => deleteComic(comic.id)}
              >
                <div className="d-flex align-items-center ">
                  <CIcon icon={cilTrash} />
                  <span className="ms-2">Xóa</span>
                </div>
              </CBadge>
              <CBadge
                style={{ userSelect: 'none', cursor: 'pointer' }}
                color={
                  isEditing === 'saving' ? 'secondary' : isEditing === 'edit' ? 'info' : 'success'
                }
                className="edit-comic-btn px-3 py-2 text-uppercase"
                onClick={() => toggleEdit()}
              >
                <div className="d-flex align-items-center">
                  <CIcon icon={isEditing ? cilSave : cilPen} />
                  <span className="ms-2">
                    {isEditing === 'saving' ? 'Lưu...' : isEditing === 'edit' ? 'Sửa' : 'Lưu'}
                  </span>
                </div>
              </CBadge>
              <CBadge
                color={comic.status === 'published' ? 'success' : 'secondary'}
                className="px-3 py-2 text-uppercase"
              >
                {comic.status === 'published' ? 'Công khai' : 'Nháp'}
              </CBadge>
            </CCardHeader>
            <CCardBody className=" px-4 py-5 bg-dark">
              <CRow>
                <CCol
                  onClick={isEditing === 'save' ? handleChooseImage : null}
                  md={4}
                  className="text-center mb-4 mb-md-0"
                  style={isEditing === 'save' ? { cursor: 'pointer' } : null}
                >
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                    readOnly={isEditing !== 'save'}
                    ref={AvatarRef}
                  />
                  <img
                    src={
                      fileAvatar
                        ? fileAvatar
                        : comic.cover_url
                          ? `http://localhost:3001/ImgStorage/Comic/CoverImg/${comic.cover_url}`
                          : 'https://via.placeholder.com/180x240?text=No+Image'
                    }
                    alt={comic.title}
                    className="rounded shadow comic-cover-img"
                  />
                  <CButton
                    color="warning"
                    style={{ color: 'white', fontWeight: '700' }}
                    className="mt-4 w-75"
                    onClick={() => navigate(-1)}
                  >
                    ← Quay lại
                  </CButton>
                </CCol>
                <CCol md={8}>
                  <div className="px-3">
                    <CRow className="d-flex">
                      <CCol md="6" className="mb-3">
                        <h6 className="text-white fw-semibold">Tác giả:</h6>
                        <CBadge color="info" className="fs-6 text-dark">
                          {comic.AuthorInfo?.Author_name || 'Không rõ'}
                        </CBadge>
                      </CCol>

                      <CCol md="6" className="mb-3">
                        <h6 className="text-white fw-semibold text-black">Ngày tạo:</h6>
                        <p>
                          <CBadge color="black">
                            {new Date(comic.createdAt).toLocaleString()}
                          </CBadge>
                        </p>
                      </CCol>
                    </CRow>
                    <div className="Cate-review">
                      <h6 className="text-white fw-semibold">Thể loại:</h6>
                      <div className="d-flex flex-wrap gap-2">
                        {comic?.categories?.map((cat) => (
                          <CBadge
                            key={cat.id}
                            className="add_cate"
                            style={{
                              backgroundColor: 'transparent',
                              color: 'white',
                              cursor: 'pointer',
                              border: '1px solid white',
                            }}
                            onClick={() => navigate(`/Categories/CategoryDetail/${cat.id}`)}
                          >
                            <div
                              className="d-flex align-items-center"
                              style={{ width: 'max-content' }}
                            >
                              <span style={{ flex: 5 }} className="me-2">
                                {cat.category_name}
                              </span>
                              <div
                                style={{
                                  cursor: 'pointer',
                                  flex: 2,
                                  width: '30px',
                                  height: '20px',
                                  borderRadius: '5px',
                                  backgroundColor: 'red',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                              >
                                <CIcon
                                  onClick={() => handleDeleteCategory(cat.id)}
                                  icon={cilTrash}
                                  className="text-white"
                                />
                              </div>
                            </div>
                          </CBadge>
                        ))}
                        <CBadge
                          color="dark"
                          className="add_cate"
                          onClick={() => openModal('NewCategory')}
                        >
                          <div
                            style={{ cursor: 'pointer', width: 'max-content' }}
                            className="d-flex align-items-center"
                          >
                            <CIcon icon={cilPlus} />
                            <span className="ms-2">Thêm thể loại</span>
                          </div>
                        </CBadge>
                      </div>
                    </div>

                    <hr />
                    <div className="mb-3 ">
                      <h6 className="text-black fw-semibold">Mô tả:</h6>
                      <CFormTextarea
                        type="text"
                        value={comic.description}
                        readOnly={isEditing !== 'save'}
                        onChange={(e) =>
                          setComic((prev) => ({
                            ...prev,
                            description: e.target.value,
                          }))
                        }
                        placeholder="Tên tác giả"
                        className="fst-italic"
                        style={{ color: 'white', minHeight: '250px' }}
                      />
                    </div>
                    <hr />
                  </div>
                </CCol>
              </CRow>
            </CCardBody>
            <CCardFooter>
              <CBadge
                style={{ marginLeft: '10px', cursor: 'pointer' }}
                color="warning"
                onClick={() => openModal('newchapter')}
                className=" newchap"
              >
                <span className=" d-flex align-items-center">
                  <CIcon icon={cilPlus} />
                  <span className="ms-2">Thêm chapter</span>
                </span>
              </CBadge>
              <CRow className="d-flex justify-content-between align-items-center">
                <div className="mt-4 px-3">
                  <h5 className="fw-bold mb-3">Danh sách chương</h5>
                  {Page?.length > 0 ? (
                    <div className="d-flex flex-wrap gap-3">
                      {Page.map((chapter, index) => (
                        <CButton
                          key={chapter.id}
                          color="secondary"
                          variant="outline"
                          className="chapter-button"
                          onClick={() => navigate(`/Comic/Chapter/${chapter.id}`)}
                        >
                          Chương {chapter.chapter_number || index + 1}
                        </CButton>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-muted py-4">
                      <span style={{ fontSize: '2rem' }}>📭</span>
                      <p className="mt-2 mb-0">Hiện chưa có chương truyện nào</p>
                    </div>
                  )}
                </div>
              </CRow>
            </CCardFooter>
          </CCard>
        </>
      )}
    </div>
  )
}

export default ComicDetail
