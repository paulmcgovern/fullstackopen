import axios from 'axios'
const baseUrl = '/api/login'

axios.defaults.baseURL = import.meta.env.VITE_LOGIN_SERVICE

const login = async (username, password) => {

  const loginSpec = {
    username: username,
    password: password
  }

  const res = await axios.post(baseUrl, loginSpec)

  return res.data
}

export default { login }

