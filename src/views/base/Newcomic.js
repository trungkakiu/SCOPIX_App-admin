import React, { useEffect, useState } from 'react'
import {
  CBreadcrumb,
  CBreadcrumbItem,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CLink,
  CForm,
  CFormInput,
  CFormLabel,
  CFormTextarea,
  CButton,
  CFormSelect,
} from '@coreui/react'
import APIcontroller from '../../API/APIcontroller'
import { toast } from 'react-toastify'

const Newcomic = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    author: '',
    status: 'draft',
    options: 'New',
  })

  const [isLoading, setIsLoading] = useState(false)
  const [file, setFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [Author, setAuthor] = useState()

  const fecthAuthor = async () => {
    try {
      const res = await APIcontroller.GetAuthor()
      if (res && res.RC.toString() === '200') {
        setAuthor(res.RD)
        if (res.RD.length > 0) {
          setFormData((prev) => ({
            ...prev,
            author: prev.author || res.RD[0].id.toString(),
          }))
        }
      } else {
        toast.error(res.RM || 'Lỗi khi tải thông tin tác giả.')
      }
    } catch (error) {
      console.error('Error fetching author:', error)
      toast.error('Lỗi khi tải thông tin tác giả.')
    }
  }

  useEffect(() => {
    fecthAuthor()
  }, [])

  const handleChange = (e) => {
    if (e.target.name === 'author') {
      setFormData({ ...formData, author: e.target.value })
      return
    }
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    setFile(selectedFile)
    if (selectedFile) {
      const objectUrl = URL.createObjectURL(selectedFile)
      setPreviewUrl(objectUrl)
    }
  }

  const handleSubmit = async (e) => {
    try {
      e.preventDefault()
      const data = new FormData()
      data.append('title', formData.title)
      data.append('description', formData.description)
      data.append('author', formData.author)
      data.append('status', formData.status)
      data.append('options', formData.options)
      if (file) data.append('CoverImg', file)
      setIsLoading(true)
      const res = await APIcontroller.AddNewComic(data)
      if (res) {
        if (res.RC.toString() === '200') {
          toast.success('Đã thêm truyện thành công')
        } else {
          toast.error(res.RM)
        }
      } else {
        console.error('Error while call API!')
      }
    } catch (error) {
      console.error('Error adding comic:', error)
      toast.error('Lỗi khi gửi truyện, thử lại sau.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Thêm truyện mới</strong>
          </CCardHeader>
          <CCardBody>
            <CBreadcrumb>
              <CBreadcrumbItem>
                <CLink href="#">Trang chủ</CLink>
              </CBreadcrumbItem>
              <CBreadcrumbItem active>Thêm truyện</CBreadcrumbItem>
            </CBreadcrumb>

            <CForm onSubmit={handleSubmit}>
              <div className="mb-3">
                <CFormLabel htmlFor="title">Tiêu đề</CFormLabel>
                <CFormInput
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <CFormLabel htmlFor="description">Mô tả</CFormLabel>
                <CFormTextarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </div>

              <CRow className="mb-3">
                <CCol md={4}>
                  <CFormLabel htmlFor="author">Tác giả</CFormLabel>
                  <CFormSelect
                    id="author"
                    name="author"
                    value={formData.author}
                    onChange={handleChange}
                    required
                  >
                    {Author &&
                      Author.map((author) => (
                        <option key={author.id} value={author.id}>
                          {author.Author_name}
                        </option>
                      ))}
                    {!Author && <option value="">Không có tác giả</option>}
                  </CFormSelect>
                </CCol>
                <CCol md={4}>
                  <CFormLabel htmlFor="status">Trạng thái</CFormLabel>
                  <CFormSelect
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    required
                  >
                    <option value="draft">Nháp</option>
                    <option value="published">Công khai</option>
                  </CFormSelect>
                </CCol>
                <CCol md={4}>
                  <CFormLabel htmlFor="options">Options</CFormLabel>
                  <CFormSelect
                    id="options"
                    name="options"
                    value={formData.options}
                    onChange={handleChange}
                    required
                  >
                    <option value="New">Mới</option>
                    <option value="Recoment">Nên đọc</option>
                    <option value="NewUpdate">Mới cập nhật</option>
                    <option value="Complate">Hoàn thành</option>
                  </CFormSelect>
                </CCol>
              </CRow>

              <div className="mb-3">
                <CFormLabel required htmlFor="cover">
                  Ảnh bìa
                </CFormLabel>
                <CFormInput type="file" id="cover" accept="image/*" onChange={handleFileChange} />
              </div>

              {previewUrl && (
                <div className="mb-4 text-center">
                  <strong>Xem trước ảnh bìa:</strong>
                  <div>
                    <img
                      src={previewUrl}
                      alt="Preview"
                      style={{
                        maxWidth: '300px',
                        maxHeight: '400px',
                        marginTop: '10px',
                        borderRadius: '8px',
                        border: '1px solid #ddd',
                      }}
                    />
                  </div>
                </div>
              )}

              <CButton color="primary" type="submit" disabled={isLoading}>
                {isLoading ? 'Đang gửi...' : 'Thêm truyện'}
              </CButton>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Newcomic
