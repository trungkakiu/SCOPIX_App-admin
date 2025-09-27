import React, { useState, useEffect } from 'react'
import {
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CButton,
  CFormInput,
  CListGroup,
  CListGroupItem,
  CSpinner,
} from '@coreui/react'
import APIcontroller from '../../API/APIcontroller'
import { toast } from 'react-toastify'

const AddCategoryModal = ({ visible, closeFetch, onClose, comicId }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)

  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  const fetchCategories = async (reset = false) => {
    if (loading) return
    setLoading(true)
    try {
      const res = await APIcontroller.GetCategories({
        search: searchTerm,
        page: reset ? 1 : page,
        limit: 10,
      })
      if (res?.RC === 200) {
        if (reset) {
          setCategories(res.RD)
        } else {
          setCategories((prev) => [...prev, ...res.RD])
        }
        setHasMore(res.RD.length >= 10)
        setPage((prev) => (reset ? 2 : prev + 1))
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCategories(true)
    }, 400)
    return () => clearTimeout(timer)
  }, [searchTerm])

  const handleScroll = (e) => {
    const { scrollTop, clientHeight, scrollHeight } = e.target
    if (scrollTop + clientHeight >= scrollHeight - 10 && hasMore && !loading) {
      fetchCategories()
    }
  }

  const handleAddCategory = async (category) => {
    try {
      setLoading(true)
      const res = await APIcontroller.AddComicCategory(category.id, comicId)
      if (res?.RC === 200) {
        toast.success('Thêm category thành công')
        closeFetch()
      } else {
        console.error(res?.RM || 'Failed to add category')
        toast.error(res?.RM || 'Thêm category thất bại')
      }
    } catch (error) {
      console.error('Error adding category:', error)
      toast.error('Lỗi khi thêm category')
    } finally {
      setLoading(false)
    }
  }
  return (
    <CModal visible={visible} onClose={onClose} size="lg">
      <CModalHeader>Thêm Category</CModalHeader>
      <CModalBody style={{ maxHeight: '400px', overflowY: 'auto' }} onScroll={handleScroll}>
        <CFormInput
          type="text"
          placeholder="Tìm category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-3"
        />
        <CListGroup>
          {categories.map((cat) => (
            <CListGroupItem
              style={{ cursor: 'pointer' }}
              key={cat.id}
              action
              onClick={() => handleAddCategory(cat)}
            >
              {cat.category_name}
            </CListGroupItem>
          ))}
          {loading && (
            <div className="text-center my-2">
              <CSpinner size="sm" />
            </div>
          )}
        </CListGroup>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={onClose}>
          Đóng
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

export default AddCategoryModal
