
const userRouter = require('express').Router()
const bcrypt = require('bcrypt')
const config = require('../utils/config')

const User = require('../models/User')
const Blog = require('../models/Blog')

const blogPopulateFields = {
  url: 1,
  title: 1,
  author: 1,
  id: 1
}


userRouter.get('/', async (request, response) => {

  const users = await User.find({}).populate('blogs', blogPopulateFields)
  response.json(users)
})


userRouter.post('/', async (request, response) => {

  const username = request.body.username
  const name = request.body.name
  const password = request.body.password

  const blogIds = request.body.blogs

  if(blogIds){

    const count = await Blog.countDocuments({ _id: { $in: blogIds } })

    if(count !== blogIds.length){
      return response.status(400).json({
        type: 'validation',
        error: 'Unknown Blog ID'
      })
    }
  }

  if(!password) {
    return response.status(400).json({
      type: 'validation',
      error: 'Missing password'
    })
  }

  if(password.length < config.MIN_PW_LENGTH){
    return response.status(400).json({
      type: 'validation',
      error: 'Password too short'
    })
  }

  const passwordHash = await bcrypt.hash(password, config.SALT_ROUNDS)

  const newUser = new User({
    username: username,
    name: name,
    passwordHash: passwordHash,
    blogs: blogIds
  })

  const result = await (await newUser.save()).populate('blogs', blogPopulateFields)

  response.status(201).json(result)
})


userRouter.get('/', async (request, response) => {

  const result = await User.find({}).limit(config.MAX_ITEMS)

  response.json(result)
})


userRouter.get('/:id', async (request, response) => {

  const targetId = request.params.id
  const user = await User.findById(targetId)

  if (user) {
    response.json(user)
  } else {
    response.status(404).end()
  }
})


userRouter.delete('/:id', async (request, response) => {

  await User.findByIdAndRemove(request.params.id)
  response.status(204).end()
})
/***

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
**/

module.exports = userRouter

