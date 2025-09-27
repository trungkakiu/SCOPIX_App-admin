import React, { useRef, useState } from 'react'
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CCard,
  CImage,
  CFormInput,
  CSpinner,
} from '@coreui/react'
import APIcontroller from '../../API/APIcontroller'
import { toast } from 'react-toastify'

const NewframModal = ({ closefetch, show, close, title }) => {
  const [isLoading, setIsLoading] = useState(false)
  const avatarframeinput = useRef()
  const [Newframe, setNewframe] = useState({
    framename: '',
    url: '',
    file: null,
    price: '',
  })

  const handelfilechange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setNewframe((prev) => ({
        ...prev,
        url: URL.createObjectURL(file),
        file: file,
      }))
    }
  }

  const handleAdd = async () => {
    if (!Newframe.file || !Newframe.framename) {
      toast.warning('Vui lòng chọn ảnh và nhập tên khung!')
      return
    }

    try {
      setIsLoading(true)
      const formData = new FormData()
      formData.append('framename', Newframe.framename)
      formData.append('price', Newframe.price)
      formData.append('FrameUpload', Newframe.file)

      const res = await APIcontroller.Addnewframe(formData)
      if (res) {
        if (res.RC === 200) {
          toast.success('Thêm khung thành công!')
          closefetch()
        } else {
          toast.error(res.RM)
        }
      }
    } catch (error) {
      console.error(error)
      toast.error('Error while calling API!')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <CModal visible={show} backdrop="static" onClose={close}>
      <CModalHeader>
        <CModalTitle>{title}</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <div className="d-flex flex-column">
          <input
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            ref={avatarframeinput}
            onChange={handelfilechange}
          />
          <CCard
            className="holding-frame p-2 d-flex justify-content-center align-items-center"
            style={{ width: '100%', height: '200px', cursor: 'pointer' }}
            onClick={() => avatarframeinput.current && avatarframeinput.current.click()}
          >
            {Newframe.url ? (
              <CImage src={Newframe.url} fluid style={{ maxHeight: '140px' }} />
            ) : (
              <span>+ Chọn khung ảnh</span>
            )}
          </CCard>
          <div style={{ display: 'flex', flexDirection: 'row', gap: '10px' }}>
            <CFormInput
              style={{ marginTop: '10px', flex: '2' }}
              placeholder="Nhập tên khung"
              value={Newframe.framename}
              onChange={(e) => setNewframe((prev) => ({ ...prev, framename: e.target.value }))}
            />
            <CFormInput
              style={{ marginTop: '10px', flex: '1' }}
              placeholder="giá bán (Xu)"
              value={Newframe.price}
              type="number"
              onChange={(e) => setNewframe((prev) => ({ ...prev, price: e.target.value }))}
            />
          </div>
        </div>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={close}>
          Đóng
        </CButton>
        <CButton color="primary" onClick={handleAdd} disabled={isLoading}>
          {isLoading ? <CSpinner size="sm" /> : 'Xác nhận'}
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

export default NewframModal
