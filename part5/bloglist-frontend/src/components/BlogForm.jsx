import { useState } from 'react'

const BlogForm = ({ addBlog }) => {

  // Form elements
  const [blogTitle, setBlogTitle] = useState(null)
  const [blogAuthor, setBlogAuthor] = useState(null)
  const [blogUrl, setBlogUrl] = useState(null)

  const blogTitleChangeHandler = (event) => {
    setBlogTitle(event.target.value)
  }

  const blogAuthorChangeHandler = (event) => {
    setBlogAuthor(event.target.value)
  }

  const blogUrlChangeHandler = (event) => {
    setBlogUrl(event.target.value)
  }

  const handleBlogFormSubmit = async (event) => {

    event.preventDefault()

    const blogParams = {
      title: blogTitle,
      author: blogAuthor,
      url: blogUrl
    }

    // Clear form on success
    if(await addBlog(blogParams)) {
      setBlogTitle(null)
      setBlogAuthor(null)
      setBlogUrl(null)
    }
  }

  return (
    <div>
      <h2>Create New</h2>
      <form onSubmit={handleBlogFormSubmit}>
        <table>
          <tbody>
            <tr>
              <td>Title:</td>
              <td>
                <input id='blogTitle'
                  value={blogTitle || ''}
                  onChange={blogTitleChangeHandler} />
              </td>
            </tr>
            <tr>
              <td>Author:</td>
              <td>
                <input id='author'
                  value={blogAuthor || ''}
                  onChange={blogAuthorChangeHandler} />
              </td>
            </tr>
            <tr>
              <td>URL:</td>
              <td>
                <input id='blogUrl'
                  value={blogUrl || ''}
                  onChange={blogUrlChangeHandler} />
              </td>
            </tr>
          </tbody>
        </table>
        <button type='submit'>Create</button>
      </form>
    </div>
  )
}

export default BlogForm
