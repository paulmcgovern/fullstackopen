
const blogRouter = require('express').Router()

// Mondgoose models of phonebook entries
const Blog = require('../models/Blog')

blogRouter.get('/', async (request, response) => {

  const blogs = await Blog.find({})
  response.json(blogs)
})


blogRouter.post('/', async (request, response) => {

  const blog = new Blog(request.body)
  const result = await blog.save()

  response.status(201).json(result)
})


blogRouter.get('/:id', async (request, response) => {
 
  const targetId = request.params.id
  const blog = await Blog.findById(targetId)

  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})


blogRouter.delete('/:id', async (request, response) => {

  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
})


blogRouter.put('/:id', async (request, response) => {
 
  // Fields to update
  const updateBlog= {
    title: request.body.title,
    author: request.body.author,
    url: request.body.url,
    likes: request.body.likes
  }

  // Force validation before update
  const queryOpts = { new: true, runValidators: true, context: 'query' }

  const blog = await Blog.findByIdAndUpdate(request.params.id, updateBlog, queryOpts)

  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }

})

module.exports = blogRouter

