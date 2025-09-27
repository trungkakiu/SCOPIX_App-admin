import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import APIcontroller from '../../API/APIcontroller'
import { toast } from 'react-toastify'
import {
  CButton,
  CSpinner,
  CCard,
  CCardBody,
  CCardHeader,
  CFormInput,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
} from '@coreui/react'

const ChapterDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [chapter, setChapter] = useState(null)
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [editModal, setEditModal] = useState(false)
  const [formData, setFormData] = useState({ chapter_number: '', title: '' })

  const fetchChapter = async () => {
    try {
      setLoading(true)
      const res = await APIcontroller.GetChapterDetail(id)
      if (res && res.RC === 200) {
        setChapter(res.RD)
        setImages(res.RD.images || [])
        setFormData({
          chapter_number: res.RD.chapter_number,
          title: res.RD.title,
        })
      } else {
        toast.error(res?.RM || 'Không lấy được dữ liệu')
      }
    } catch (error) {
      toast.error('Lỗi server')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchChapter()
  }, [id])

  const handleDelete = async () => {
    if (!window.confirm('Bạn có chắc muốn xóa chapter này?')) return
    try {
      const res = await APIcontroller.DeleteChapter(id)
      if (res && res.RC === 200) {
        toast.success('Xóa thành công')
        navigate(-1)
      } else {
        toast.error(res?.RM || 'Xóa thất bại')
      }
    } catch (error) {
      toast.error('Lỗi server')
    }
  }

  const handleUpdate = async () => {
    try {
      const res = await APIcontroller.UpdateChapter(id, formData)
      if (res && res.RC === 200) {
        toast.success('Cập nhật thành công')
        setEditModal(false)
        fetchChapter()
      } else {
        toast.error(res?.RM || 'Cập nhật thất bại')
      }
    } catch (error) {
      toast.error('Lỗi server')
    }
  }

  if (loading) {
    return (
      <div className="text-center mt-5">
        <CSpinner color="primary" />
      </div>
    )
  }

  return (
    <div className="p-3">
      <CCard className="mb-3">
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <h5>
            Chapter {chapter.chapter_number}: {chapter.title}
          </h5>
          <div>
            <CButton color="warning" className="me-2" onClick={() => setEditModal(true)}>
              Sửa
            </CButton>
            <CButton color="danger" onClick={handleDelete}>
              Xóa
            </CButton>
          </div>
        </CCardHeader>
        <CCardBody>
          <p>
            <strong>ID:</strong> {chapter.id}
          </p>
          <p>
            <strong>Comic ID:</strong> {chapter.comic_id}
          </p>
        </CCardBody>
      </CCard>

      <CCard>
        <CCardHeader>Ảnh của Chapter</CCardHeader>
        <CCardBody>
          {images.length > 0 ? (
            <div
              style={{
                display: 'flex',
                width: '100%',
                justifyContent: 'center',
                alignContent: 'center',
                flexDirection: 'column',
              }}
            >
              {images.map((img) => (
                <img
                  key={img.id}
                  src={
                    img.image_url
                      ? `http://localhost:3001/ImgStorage/Comic/ComicChapter/${img.image_url}`
                      : 'https://via.placeholder.com/200x150?text=No+Image'
                  }
                  alt="chapter-page"
                  style={{
                    width: '50%',
                  }}
                />
              ))}
            </div>
          ) : (
            <p>Không có ảnh nào.</p>
          )}
        </CCardBody>
      </CCard>

      {/* ==== Modal chỉnh sửa ==== */}
      <CModal visible={editModal} onClose={() => setEditModal(false)}>
        <CModalHeader>Chỉnh sửa Chapter</CModalHeader>
        <CModalBody>
          <CFormInput
            label="Số Chapter"
            type="number"
            value={formData.chapter_number}
            onChange={(e) => setFormData({ ...formData, chapter_number: e.target.value })}
            className="mb-3"
          />
          <CFormInput
            label="Tiêu đề"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setEditModal(false)}>
            Hủy
          </CButton>
          <CButton color="primary" onClick={handleUpdate}>
            Lưu
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  )
}

export default ChapterDetail
