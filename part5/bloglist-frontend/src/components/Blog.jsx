import { useState } from 'react'

// TODO: put likes into a state
const Blog = ({ blog, incrementLikes, deleteBlog, currentUsername }) => {

  const [isShowDetail, setIsShowDetail] = useState(false)
  const [likes, setLikes] = useState(blog.likes)

  const toggleDetails = () => {
    setIsShowDetail(!isShowDetail)
  }

  const handleLikes =  async (event) => {
    event.preventDefault()
    await incrementLikes(blog)
    setLikes(likes + 1)
  }

  const handleDelete = async () => {
    await deleteBlog(blog)
  }

  const allowDelete = currentUsername === blog.user.username

  if(isShowDetail){
    return (
      <div className='blogItem'>
        <ul>
          <li>{blog.title} <button onClick={toggleDetails}>Hide</button></li>
          <li><a href={blog.url}>{blog.url}</a></li>
          <li>{likes} <button onClick={handleLikes}>Like</button></li>
          <li>{blog.author}</li>
          {allowDelete && <li><button onClick={handleDelete}>Delete</button></li>}
        </ul>
      </div>
    )
  } else {
    return (
      <div className='blogItem'>
        <ul>
          <li>{blog.title} <button onClick={toggleDetails}>View</button></li>
        </ul>
      </div>
    )
  }
}

export default Blog