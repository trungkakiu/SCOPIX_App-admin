import React, { useEffect, useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CRow,
  CCol,
  CButton,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CFormInput,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CFormTextarea,
} from '@coreui/react'
import axios from 'axios'
import APIcontroller from '../../API/APIcontroller'
import { toast } from 'react-toastify'

const CategoryTable = () => {
  const [categories, setCategories] = useState([])
  const [modalVisible, setModalVisible] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [categoryName, setCategoryName] = useState('')
  const [description, setDescription] = useState('')

  const fetchCategories = async () => {
    try {
      const res = await APIcontroller.GetCategories()
      if (res && res.RC === 200) {
        setCategories(res.RD)
      } else {
        console.error(res?.RM || 'Không lấy được danh sách categories')
      }
    } catch (error) {
      console.error('Lỗi khi lấy danh sách categories:', error)
    }
  }

  const saveCategory = async () => {
    try {
      if (editingCategory) {
        const res = await APIcontroller.EditCategory(editingCategory.id, {
          category_name: categoryName,
          description: description,
        })
        console.log(res)
        if (res && res.RC === 200) {
          toast.success('Cập nhật thành công')
          setEditingCategory(null)
          setCategoryName('')
          setDescription('')
          fetchCategories()
        } else {
          toast.error(res?.RM || 'Cập nhật thất bại')
        }
      } else {
        const res = await APIcontroller.AddCategory({
          category_name: categoryName,
          description: description,
        })
        if (res && res.RC === 200) {
          toast.success('Thêm mới thành công')
          setCategoryName('')
          setDescription('')
          fetchCategories()
        } else {
          toast.error(res?.RM || 'Thêm mới thất bại')
        }
      }
      setModalVisible(false)
      setEditingCategory(null)
      setCategoryName('')
      fetchCategories()
    } catch (error) {
      console.error(error)
    }
  }

  const deleteCategory = async (id) => {
    if (!window.confirm('Xóa category này?')) return
    try {
      const res = await APIcontroller.DeleteCategory(id)
      if (res && res.RC === 200) {
        toast.success('Xóa thành công')
      } else {
        toast.error(res?.RM || 'Xóa thất bại')
      }
      setEditingCategory(null)
      setCategoryName('')
      setDescription('')
      setModalVisible(false)
      fetchCategories()
    } catch (error) {
      toast.error('Lỗi khi xóa category')
      setEditingCategory(null)
      setCategoryName('')
      setDescription('')
      setModalVisible(false)
      fetchCategories()
      console.error('Lỗi khi xóa category:', error)
    }
  }

  const openEditModal = (cat) => {
    setEditingCategory(cat)
    setDescription(cat.description || '')
    setCategoryName(cat.category_name)
    setModalVisible(true)
  }

  const openAddModal = () => {
    setEditingCategory(null)
    setCategoryName('')
    setModalVisible(true)
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  return (
    <CRow>
      <CCol xs={12}>
        <CCard>
          <CCardHeader className="d-flex justify-content-between align-items-center">
            <strong>Quản lý Categories</strong>
            <CButton color="primary" onClick={openAddModal}>
              + Thêm Category
            </CButton>
          </CCardHeader>
          <CCardBody>
            <CTable bordered hover>
              <CTableHead color="dark">
                <CTableRow>
                  <CTableHeaderCell>#</CTableHeaderCell>
                  <CTableHeaderCell>Tên Category</CTableHeaderCell>
                  <CTableHeaderCell>Hành động</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {categories.map((cat, index) => (
                  <CTableRow key={cat.id}>
                    <CTableDataCell>{index + 1}</CTableDataCell>
                    <CTableDataCell>{cat.category_name}</CTableDataCell>
                    <CTableDataCell>
                      <CButton
                        size="sm"
                        color="warning"
                        className="me-2"
                        onClick={() => openEditModal(cat)}
                      >
                        Sửa
                      </CButton>
                      <CButton size="sm" color="danger" onClick={() => deleteCategory(cat.id)}>
                        Xóa
                      </CButton>
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
      </CCol>

      {/* Modal thêm/sửa */}
      <CModal backdrop={'static'} visible={modalVisible} onClose={() => setModalVisible(false)}>
        <CModalHeader>{editingCategory ? 'Sửa Category' : 'Thêm Category'}</CModalHeader>
        <CModalBody>
          <CFormInput
            type="text"
            placeholder="Tên category..."
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
          />
          <CFormTextarea
            className="mt-2"
            type="text"
            placeholder="Mô tả..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setModalVisible(false)}>
            Hủy
          </CButton>
          <CButton color="primary" onClick={saveCategory}>
            Lưu
          </CButton>
        </CModalFooter>
      </CModal>
    </CRow>
  )
}

export default CategoryTable
