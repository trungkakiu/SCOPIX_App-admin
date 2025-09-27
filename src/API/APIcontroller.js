import api from './api'

const handleLogin = async (loginData) => {
  try {
    const response = await api.post('/auth/login-admin', {
      email: loginData.username,
      password: loginData.password,
    })
    return response.data
  } catch (error) {
    console.error('Login error:', error)
    return error
  }
}

const AddNewComic = async (data) => {
  try {
    const response = await api.post('/Comic/Add', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  } catch (error) {
    console.error('Add comic error:', error)
    return error
  }
}

const GetAuthor = async () => {
  try {
    const response = await api.get('/Comic/Author')
    return response.data
  } catch (error) {
    console.error('Login error:', error)
    return error
  }
}

const GetComics = async () => {
  try {
    const response = await api.get('/Comic/GetComics')
    return response.data
  } catch (error) {
    console.error('Get comic error:', error)
    return error
  }
}

const DeleteComic = async (comicId) => {
  try {
    const response = await api.delete(`/Comic/Delete/${comicId}`)
    return response.data
  } catch (error) {
    console.error('Error deleting comic:', error)
    return error
  }
}

const GetTopComics = async () => {
  try {
    const response = await api.get('/Comic/TopComicbyviews')
    return response.data
  } catch (error) {
    console.error('Error fetching top comics:', error)
    return error
  }
}

const fetchPage = async (comicid) => {
  try {
    const response = await api.get(`/Comic/fectpagebycomic/${comicid}`)
    console.log(response)
    return response.data
  } catch (error) {
    console.error('Error fetching top comics:', error)
    return error
  }
}

const EditComic = async (data, comicid) => {
  try {
    const response = await api.put(`/Comic/EditComic/${comicid}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  } catch (error) {
    console.error('Error fetching top comics:', error)
    return error
  }
}

const fetchAvatarframe = async () => {
  try {
    const response = await api.get(`/Avatar/getframe`)
    return response.data
  } catch (error) {
    console.error('Error fetching top comics:', error)
    return error
  }
}

const Addnewframe = async (data) => {
  try {
    const response = await api.post(`/Avatar/newframe`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  } catch (error) {
    console.error('Error while add new frame avatar:', error)
    return error
  }
}

const EditFrame = async (id, data) => {
  try {
    const response = await api.put(`/Avatar/editframe/${id}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  } catch (error) {
    console.error('Error while add new frame avatar:', error)
    return error
  }
}
const addChapter = async (data) => {
  try {
    const response = await api.post(`/Comic/newchapter`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  } catch (error) {
    console.error('Error while adding new chapter:', error)
    return error
  }
}

const GetChapterDetail = async (id) => {
  try {
    const response = await api.get(`/Comic/chapter/${id}`)
    return response.data
  } catch (error) {
    console.error('Error fetching top comics:', error)
    return error
  }
}

const DeleteChapter = async (id) => {
  try {
    const response = await api.delete(`/Comic/chapter/${id}`)
    return response.data
  } catch (error) {
    console.error('Error fetching top comics:', error)
    return error
  }
}

const UpdateChapter = async (id, data) => {
  try {
    const response = await api.put(`/Comic/chapter/${id}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  } catch (error) {
    console.error('Error fetching top comics:', error)
    return error
  }
}

const GetCategories = async () => {
  try {
    const response = await api.get(`/Comic/Category`)
    return response.data
  } catch (error) {
    console.error('Error fetching top comics:', error)
    return error
  }
}
const AddCategory = async (data) => {
  try {
    const response = await api.post(`/Comic/NewCategory`, data)
    return response.data
  } catch (error) {
    console.error('Error adding category:', error)
    return error
  }
}
const EditCategory = async (id, data) => {
  try {
    const response = await api.put(`/Comic/UpdateCategory/${id}`, data)
    return response.data
  } catch (error) {
    console.error('Error editing category:', error)
    return error
  }
}
const DeleteCategory = async (id) => {
  try {
    const response = await api.delete(`/Comic/RemoveCategory/${id}`)
    return response.data
  } catch (error) {
    console.error('Error deleting category:', error)
    return error
  }
}

const AddComicCategory = async (categoryId, comicId) => {
  try {
    const response = await api.post(`/Comic/AddComicCategory`, {
      CategoryID: categoryId,
      ComicID: comicId,
    })
    return response.data
  } catch (error) {
    console.error('Error adding comic category:', error)
    return error
  }
}
const DeleteComicCategory = async (categoryId, comicId) => {
  try {
    const response = await api.delete(`/Comic/DeleteComicCategory`, {
      data: {
        CategoryID: categoryId,
        ComicID: comicId,
      },
    })
    return response.data
  } catch (error) {
    console.error('Error deleting comic category:', error)
    return error
  }
}

const fetchGiftCodes = async () => {
  try {
    const response = await api.get(`/GiftCodes`)
    return response.data
  } catch (error) {
    console.error('Error fetching gift codes:', error)
    return error
  }
}

const createGiftCode = async (data) => {
  try {
    const response = await api.post(`/GiftCode/create`, data)
    return response.data
  } catch (error) {
    console.error('Error creating gift code:', error)
    return error
  }
}

export default {
  createGiftCode,
  fetchGiftCodes,
  AddComicCategory,
  DeleteComicCategory,
  GetCategories,
  AddCategory,
  EditCategory,
  DeleteCategory,
  handleLogin,
  DeleteChapter,
  UpdateChapter,
  DeleteComic,
  AddNewComic,
  GetAuthor,
  fetchPage,
  addChapter,
  EditFrame,
  GetChapterDetail,
  Addnewframe,
  EditComic,
  fetchAvatarframe,
  GetTopComics,
  GetComics,
}
