import axios from 'axios'
const baseUrl = '/api/blogs'

axios.defaults.baseURL = import.meta.env.VITE_BLOG_SERVICE

let userToken = null

const setToken = (newToken) => {
  userToken = `Bearer ${newToken}`
}

const create = async (blogParams) => {

  const auth = {
    headers: { Authorization: userToken }
  }

  const res = await axios.post(baseUrl, blogParams, auth)
  return res.data
}

const getAll = async () => {

  const res = await axios.get(baseUrl)
  return res.data
}

const update = async (blog) => {

  const id = blog.id

  const auth = {
    headers: { Authorization: userToken }
  }

  const res = await axios.put(`${baseUrl}/${id}`, blog, auth)

  return res.data
}

const deleteBlog = async (blog) => {

  const id = blog.id

  const auth = {
    headers: { Authorization: userToken }
  }

  await axios.delete(`${baseUrl}/${id}`, auth)
}

export default { create, getAll, setToken, update, deleteBlog }
