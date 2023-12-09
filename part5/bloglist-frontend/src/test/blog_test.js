import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import Blog from '../components/Blog'
import BlogForm from '../components/BlogForm'

const getBlog = () => {

  return {
    title: 'Blog Title',
    author: 'Blog Author',
    url: 'http://foo.com',
    likes: 3,
    user: {
      'username': 'username',
      'name': 'Some User',
      'id': '999999999999999999999999'
    }
  }
}


describe('Test Blog component', () => {

  let mockIncrementLikes
  let mockDeleteBlog
  let currentUsername
  let blog
  let rendered

  beforeEach(() => {

    blog = getBlog()
    mockIncrementLikes = jest.fn()
    mockDeleteBlog = jest.fn()
    currentUsername = 'username'

    rendered = render(<Blog blog={blog}
      incrementLikes={mockIncrementLikes}
      deleteBlog={mockDeleteBlog}
      currentUsername={currentUsername}/>)
  })


  test('Summary view', () => {

    let element = screen.queryByText(blog.title)
    expect(element).toBeDefined()

    element = screen.queryByText(blog.url)
    expect(element).toBeNull()

    element = screen.queryByText(blog.likes)
    expect(element).toBeNull()
  })


  test('Detail view', async () => {

    const simUser = userEvent.setup()

    const viewButton = screen.getByRole('button', { name: 'View' })
    await simUser.click(viewButton)

    let element = screen.queryByText(blog.url)
    expect(element).toBeDefined()

    element = screen.queryByText(blog.likes)
    expect(element).toBeDefined()
  })


  test('Press Likes button handler', async () => {

    const simUser = userEvent.setup()

    const viewButton = screen.getByRole('button', { name: 'View' })
    await simUser.click(viewButton)

    const likeButton = screen.getByRole('button', { name: 'Like' })

    await simUser.click(likeButton)
    expect(mockIncrementLikes.mock.calls).toHaveLength(1)

    await simUser.click(likeButton)
    expect(mockIncrementLikes.mock.calls).toHaveLength(2)
  })
})


describe('Test BlogForm component', () => {

  test('New Blog form handler', async () => {

    const blogValues = {
      title: 'Blog Title',
      author: 'Blog Author',
      url: 'http://blogurl.com'
    }

    const mockAddBlog = jest.fn()

    const result = render(<BlogForm addBlog={mockAddBlog} />)

    const simUser = userEvent.setup()

    // Populate form
    const titleInput  = result.container.querySelector('#blogTitle')
    await simUser.type(titleInput, blogValues.title)

    const authorInput  = result.container.querySelector('#author')
    await simUser.type(authorInput, blogValues.author)

    const urlInput  = result.container.querySelector('#blogUrl')
    await simUser.type(urlInput, blogValues.url)

    const submitButton = screen.getByRole('button', { name: 'Create' })

    await simUser.click(submitButton)
    expect(mockAddBlog.mock.calls).toHaveLength(1)

    const callValues = mockAddBlog.mock.calls[0][0]

    // Confirm handler called with correct values
    expect(callValues.title).toBe(blogValues.title)
    expect(callValues.author).toBe(blogValues.author)
    expect(callValues.url).toBe(blogValues.url)
  })

})
