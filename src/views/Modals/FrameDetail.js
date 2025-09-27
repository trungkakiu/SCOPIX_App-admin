import React, { useEffect, useRef, useState } from 'react'
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

const FrameDetail = ({ closefetch, show, close, title, data }) => {
  const [isLoading, setIsLoading] = useState(false)
  const avatarframeinput = useRef()
  const [Newframe, setNewframe] = useState({
    framename: data?.framename || '',
    id: data?.id || '',
    url: data?.url || '',
    price: data?.price || '',
    Newurl: '',
  })

  useEffect(() => {
    setNewframe({
      framename: data?.framename || '',
      url: data?.url || '',
      price: data?.price || '',
      file: null,
    })
  }, [data])
  const handelfilechange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setNewframe((prev) => ({
        ...prev,
        Newurl: URL.createObjectURL(file),
        file: file,
      }))
    }
  }

  const handleAdd = async () => {
    const hasChanged =
      Newframe.framename !== data?.framename || Newframe.price !== data?.price || Newframe.file
    if (!hasChanged) {
      toast.info('Không có thay đổi nào!')
      return
    }
    if (!Newframe.framename || !Newframe.price) {
      toast.warning('Vui lòng chọn ảnh và nhập tên khung!')
      return
    }

    try {
      setIsLoading(true)
      const formData = new FormData()
      formData.append('framename', Newframe.framename)
      formData.append('price', Newframe.price)
      formData.append('url', Newframe.url)
      if (Newframe.file) formData.append('NewFrameImg', Newframe.file)

      const res = await APIcontroller.EditFrame(data?.id, formData)
      if (res) {
        if (res.RC === 200) {
          toast.success('Sửa khung thành công!')
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
        <CFormInput
          style={{ marginTop: '10px', flex: '2' }}
          placeholder="Nhập tên khung"
          value={Newframe.framename}
          onChange={(e) => setNewframe((prev) => ({ ...prev, framename: e.target.value }))}
        />
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
              <CImage
                src={
                  Newframe.Newurl
                    ? Newframe.Newurl
                    : `http://localhost:3001/Frame_avatar/${Newframe.url}` ||
                      'https://via.placeholder.com/200x150?text=No+Image'
                }
                fluid
                style={{ maxHeight: '140px', userSelect: 'none' }}
              />
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

export default FrameDetail
