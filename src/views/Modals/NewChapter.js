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
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'

const NewChapter = ({ closeFetch, show, close, title, comicId }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [chapters, setChapters] = useState([
    { chapter_number: '', title: '', files: [], previews: [], key: Date.now() },
  ])
  const imageInputs = useRef([])

  const handleAddChapterBlock = () => {
    setChapters((prev) => [
      ...prev,
      { chapter_number: '', title: '', files: [], previews: [], key: Date.now() },
    ])
  }

  const handleRemoveChapter = (index) => {
    setChapters((prev) => prev.filter((_, i) => i !== index))
  }

  const handleChapterChange = (index, field, value) => {
    setChapters((prev) => {
      const newChaps = [...prev]
      newChaps[index][field] = value
      return newChaps
    })
  }

  // Chọn file ảnh
  const handleFileChange = (index, e) => {
    const files = Array.from(e.target.files)
    if (!files.length) return
    setChapters((prev) => {
      const newChaps = [...prev]
      newChaps[index].files = [...newChaps[index].files, ...files]
      newChaps[index].previews = [
        ...newChaps[index].previews,
        ...files.map((f) => URL.createObjectURL(f)),
      ]
      return newChaps
    })
  }

  const handleRemoveImage = (chapterIdx, imgIdx) => {
    setChapters((prev) => {
      const newChaps = [...prev]
      newChaps[chapterIdx].files.splice(imgIdx, 1)
      newChaps[chapterIdx].previews.splice(imgIdx, 1)
      return newChaps
    })
  }

  const handleDragEnd = (chapterIdx, result) => {
    if (!result.destination) return
    const { source, destination } = result

    setChapters((prev) => {
      const newChaps = [...prev]
      const chapter = newChaps[chapterIdx]

      const reorderedFiles = Array.from(chapter.files)
      const [movedFile] = reorderedFiles.splice(source.index, 1)
      reorderedFiles.splice(destination.index, 0, movedFile)

      const reorderedPreviews = Array.from(chapter.previews)
      const [movedPreview] = reorderedPreviews.splice(source.index, 1)
      reorderedPreviews.splice(destination.index, 0, movedPreview)

      chapter.files = reorderedFiles
      chapter.previews = reorderedPreviews
      return newChaps
    })
  }

  const handleSubmitAll = async () => {
    for (const chap of chapters) {
      if (!chap.chapter_number || !chap.title || chap.files.length === 0) {
        toast.warning('Vui lòng điền đầy đủ thông tin và chọn ảnh cho tất cả chapter!')
        return
      }

      const formData = new FormData()
      formData.append('comic_id', comicId)
      formData.append('chapter_number', chap.chapter_number)
      formData.append('title', title)
      formData.append('chapter_name', chap.title)
      chap.files.forEach((file) => formData.append('listchapter', file))

      setIsLoading(true)
      try {
        const res = await APIcontroller.addChapter(formData)
        if (res?.RC === 200) {
          toast.success(`Chapter ${chap.chapter_number} đã thêm thành công!`)
        } else {
          toast.error(res?.RM || `Lỗi chapter ${chap.chapter_number}`)
        }
      } catch (error) {
        console.error(error)
        toast.error(`Có lỗi xảy ra với chapter ${chap.chapter_number}`)
      } finally {
        setIsLoading(false)
      }
    }
    closeFetch()
  }

  return (
    <CModal visible={show} backdrop="static" onClose={close} size="lg">
      <CModalHeader>
        <CModalTitle>{title}</CModalTitle>
      </CModalHeader>
      <CModalBody>
        {chapters.map((chap, idx) => (
          <div
            key={chap.key}
            style={{ border: '1px solid #ddd', padding: '10px', marginBottom: '10px' }}
          >
            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
              <CFormInput
                placeholder="Số chương"
                type="number"
                value={chap.chapter_number}
                onChange={(e) => handleChapterChange(idx, 'chapter_number', e.target.value)}
              />
              <CFormInput
                placeholder="Tên chương"
                value={chap.title}
                onChange={(e) => handleChapterChange(idx, 'title', e.target.value)}
              />
            </div>

            <div style={{ marginBottom: '10px' }}>
              <CButton color="info" onClick={() => imageInputs.current[idx]?.click()}>
                + Chọn ảnh
              </CButton>
              <input
                type="file"
                accept="image/*"
                multiple
                ref={(el) => (imageInputs.current[idx] = el)}
                style={{ display: 'none' }}
                onChange={(e) => handleFileChange(idx, e)}
              />
            </div>

            <DragDropContext onDragEnd={(res) => handleDragEnd(idx, res)}>
              <Droppable droppableId={`droppable-${idx}`} direction="horizontal">
                {(provided) => (
                  <div
                    className="d-flex flex-wrap gap-2"
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {chap.previews.map((src, i) => (
                      <Draggable key={i} draggableId={`img-${idx}-${i}`} index={i}>
                        {(provided) => (
                          <CCard
                            className="p-1 position-relative"
                            style={{
                              width: '120px',
                              height: '140px',
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <CImage
                              src={src}
                              fluid
                              style={{ maxHeight: '130px', maxWidth: '100%' }}
                            />
                            <span
                              className="badge bg-primary position-absolute top-0 start-0"
                              style={{ fontSize: '12px' }}
                            >
                              {i + 1}
                            </span>
                            <button
                              type="button"
                              className="btn btn-sm btn-danger position-absolute top-0 end-0"
                              onClick={() => handleRemoveImage(idx, i)}
                            >
                              ×
                            </button>
                          </CCard>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>

            <CButton
              color="danger"
              size="sm"
              onClick={() => handleRemoveChapter(idx)}
              style={{ marginTop: '5px' }}
            >
              Xóa chapter
            </CButton>
          </div>
        ))}

        <CButton color="success" onClick={handleAddChapterBlock}>
          + Thêm chapter
        </CButton>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={close}>
          Đóng
        </CButton>
        <CButton color="primary" onClick={handleSubmitAll} disabled={isLoading}>
          {isLoading ? <CSpinner size="sm" /> : 'Xác nhận'}
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

export default NewChapter
