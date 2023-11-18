
const blogRouter = require('express').Router()

const userExtractor = require('../utils/userExtractor')

const Blog = require('../models/Blog')
const User = require('../models/User')

const userPopulateFields = {
  username: 1,
  name: 1,
  id: 1
}


blogRouter.get('/', async (request, response) => {

  const blogs = await Blog.find({}).populate('user', userPopulateFields)
  response.json(blogs)
})


blogRouter.post('/', userExtractor.userExtractor, async (request, response) => {

  const userToken = request.user

  if(!userToken) {
    return response.status(400).json({ error: 'Not authorized' })
  }

  const user = await User.findById(userToken.id)

  if(!user){
    return response.status(400).json({ error: 'Unknown user' })
  }

  const blog = new Blog({
    title: request.body.title,
    author: request.body.author,
    url: request.body.url,
    likes: request.body.likes,
    user: user.id
  })

  const result = await(await blog.save()).populate('user', userPopulateFields)

  response.status(201).json(result)
})


blogRouter.get('/:id', async (request, response) => {

  const targetId = request.params.id
  const blog = await Blog.findById(targetId).populate('user', userPopulateFields)

  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})


blogRouter.delete('/:id', userExtractor.userExtractor, async (request, response) => {

  const userToken = request.user

  if(!userToken) {
    return response.status(400).json({ error: 'Not authorized' })
  }

  const user = await User.findById(userToken.id)

  if(!user){
    return response.status(400).json({ error: 'Unknown user' })
  }

  const targetId = request.params.id

  const blog = await Blog.findById(targetId)

  if(!blog){
    return response.status(404)
  }

  if(!user._id.equals(blog.user)){
    return response.status(400).json({ error: 'Not authorized' })
  }

  await Blog.findByIdAndRemove(targetId)
  response.status(204).end()
})

module.exports = blogRouter

