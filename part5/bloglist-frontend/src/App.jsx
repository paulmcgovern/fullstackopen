import { useState, useEffect } from 'react'

import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Login from './components/Login'
import Logout from './components/Logout'
import Message from './components/Message'

import blogService from './services/Blogs'
import loginService from './services/Login'

const App = () => {

  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('') 
  const [user, setUser] = useState(null)
  const [feedback, setFeedback] = useState({message: '', isError: false})

  // Form elements
  const [blogTitle, setBlogTitle] = useState(null)
  const [blogAuthor, setBlogAuthor] = useState(null)
  const [blogUrl, setBlogUrl] = useState(null)


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
      setTimedFeedback("Incorrect username or password.", true)
    }
  }

  const handleBlogFormSubmit = async (event) => {

    event.preventDefault()

    try {

      const blogParams = {
        title: blogTitle,
        author: blogAuthor,
        url: blogUrl
      }

      const newBlog = await blogService.create(blogParams)
      console.log("NEW", newBlog)

      setTimedFeedback(`New blog created: ${newBlog.title}`)

      setBlogTitle(null)
      setBlogAuthor(null)
      setBlogUrl(null)

      // Refresh blog list
      setBlogs(await blogService.getAll())


    } catch(error){
      console.error(error)
      if(error.response && error.response.data.error) {
        setTimedFeedback(error.response.data.error, true)
      } else {
        setTimedFeedback("Bad parameters", true)
      }
    }
  }

  const handleLogout = (event) => {

    event.preventDefault()
    setUser(null)    
    window.localStorage.removeItem('blogUser')

    setBlogTitle(null) 
    setBlogAuthor(null)
    setBlogUrl(null)
  }

  const usernameChangeHandler = (event) => {
    setUsername(event.target.value)
  }

  const passwordChangeHandler = (event) => {
    setPassword(event.target.value)
  }

  const blogTitleChangeHandler = (event) => {
    setBlogTitle(event.target.value)
  }

  const blogAuthorChangeHandler = (event) => {
    setBlogAuthor(event.target.value)
  }

  const blogUrlChangeHandler = (event) => {
    setBlogUrl(event.target.value)
  }

  const setTimedFeedback = (msg, isError=false) => {

    if(feedback && feedback.tid){
      clearTimeout(feedback.tid)
    }

    // Three second timout on message display.
    const tid = setTimeout(() => { setFeedback({message: '', isError: false})}, 3000)

    setFeedback({tid: tid, message: msg, isError: isError})
  }

  const blogList = () => {
    return (
      <div>
        <h2>blogs</h2>
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} />
        )}
      </div>
    )
  }

  const blogForm = () => {
    return (
      <BlogForm
        formHandler={handleBlogFormSubmit}
        blogTitle={blogTitle}
        blogAuthor={blogAuthor}
        blogUrl={blogUrl}
        blogTitleChangeHandler={blogTitleChangeHandler}
        blogAuthorChangeHandler={blogAuthorChangeHandler}
        blogUrlChangeHandler={blogUrlChangeHandler}
      />
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
      {user !== null && blogList()}
      {user !== null && blogForm()}

    </div>
  )
}

export default App
