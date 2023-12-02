import { useState, useEffect } from 'react'

import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Login from './components/Login'
import Logout from './components/Logout'
import Message from './components/Message'
import Togglable from './components/Togglable'

import blogService from './services/Blogs'
import loginService from './services/Login'

const App = () => {

  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [feedback, setFeedback] = useState({ message: '', isError: false })


  const handleLoginSubmit = async (event) => {

    event.preventDefault()

    try {

      const user = await loginService.login(username, password)

      setUser(user)
      setUsername('')
      setPassword('')

      window.localStorage.setItem('blogUser', JSON.stringify(user))

      blogService.setToken(user.token)

    } catch(error){
      setTimedFeedback('Incorrect username or password.', true)
    }
  }


  const addBlog = async (blogParams) => {

    let isSuccess = false

    try {

      const newBlog = await blogService.create(blogParams)

      setTimedFeedback(`New blog created: ${newBlog.title}`)

      // Refresh blog list
      setBlogs(await blogService.getAll())

      isSuccess = true

    } catch(error) {

      if(error.response && error.response.data.error) {
        setTimedFeedback(error.response.data.error, true)
      } else {
        setTimedFeedback('Bad parameters', true)
      }
    }

    return isSuccess
  }


  const deleteBlog = async (blog) => {

    if(!window.confirm(`Delete ${blog.title}`)){
      return
    }

    try {

      await blogService.deleteBlog(blog)

      // Remove blog and force render
      setBlogs(blogs.filter(b => b.id !== blog.id))

      setTimedFeedback('Blog deleted', false)

    } catch(error) {

      if(error.response && error.response.data.error) {
        setTimedFeedback(error.response.data.error, true)
      } else {
        setTimedFeedback('Bad parameters', true)
      }
    }
  }


  const incrementLikes = async (blog) => {

    try {

      blog.likes += 1
      blogService.update(blog)

      // Force an update to the blog
      // list by refreshing state
      setBlogs([...blogs])

    } catch(error) {

      if(error.response && error.response.data.error) {
        setTimedFeedback(error.response.data.error, true)
      } else {
        setTimedFeedback('Bad parameters', true)
      }
    }
  }

  const handleLogout = (event) => {

    event.preventDefault()
    setUser(null)
    window.localStorage.removeItem('blogUser')
  }

  const usernameChangeHandler = (event) => {
    setUsername(event.target.value)
  }

  const passwordChangeHandler = (event) => {
    setPassword(event.target.value)
  }

  const setTimedFeedback = (msg, isError=false) => {

    if(feedback && feedback.tid){
      clearTimeout(feedback.tid)
    }

    // Three second timout on message display.
    const tid = setTimeout(() => { setFeedback({ message: '', isError: false }) }, 3000)

    setFeedback({ tid: tid, message: msg, isError: isError })
  }

  const blogList = () => {

    if(!blogs || blogs.length === 0){
      return
    }

    // Sort descending by likes
    blogs.sort((a, b) => { return b.likes - a.likes })

    const currentUsername = user ? user.username: null

    return (
      <div>
        <h2>Blogs</h2>
        {blogs.map(blog =>
          <Blog
            key={blog.id}
            blog={blog}
            incrementLikes={incrementLikes}
            deleteBlog={deleteBlog}
            currentUsername={currentUsername} />
        )}
      </div>
    )
  }

  const blogForm = () => {
    return (
      <Togglable buttonLabel="Create New Blog">
        <BlogForm addBlog={addBlog} />
      </Togglable>
    )
  }

  const loginForm = () => {
    return (
      <div>
        <Login
          formHandler={handleLoginSubmit}
          username={username}
          password={password}
          usernameChangeHandler={usernameChangeHandler}
          passwordChangeHandler={passwordChangeHandler}
        />
      </div>)
  }

  const logout = () => {
    return (<Logout user={user} logoutHandler={handleLogout} />)
  }


  useEffect(() => {

    const fetchBlogs = async () => {
      const blogs = await blogService.getAll()
      setBlogs(blogs)
    }

    fetchBlogs()
  }, [])



  // Reinitialize user tokens on page reload after login
  useEffect(() => {

    const loggedUserJSON = window.localStorage.getItem('blogUser')

    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])


  return (
    <div>

      <Message message={feedback.message} isError={feedback.isError} />

      {user === null && loginForm()}
      {user !== null && logout()}
      {blogList()}
      {user !== null && blogForm()}

    </div>
  )
}

export default App
