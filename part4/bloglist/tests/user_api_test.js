
const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')

const config = require('../utils/config')
const User = require('../models/User')
const Blog = require('../models/Blog')

const app = require('../app')

const api = supertest(app)


beforeEach(async () => {

  await User.deleteMany({})
  await Blog.deleteMany({})

  const passwordHash = await bcrypt.hash('password', config.SALT_ROUNDS)

  const newUser = new User({
    username: 'user',
    name: 'Start User',
    passwordHash: passwordHash
  })

  await newUser.save()

  const newBlog = new Blog({
    title: 'User Test Blog',
    author: 'Foo McBar',
    url: 'http://foo.com',
    likes: 3,
    user: newUser.id
  })

  await newBlog.save()

  // Update user with reference to blog record
  const filter = { _id: newUser.id }
  const update = { blogs: [newBlog.id] }
  await User.findOneAndUpdate(filter, update)

})


describe('Test GET', () => {

  test('Users are returned as json', async () => {

    await api.get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)

  }, 10000)


  test('Check number of returned users', async () => {

    const res = await api.get('/api/users')
    expect(res.body).toHaveLength(1)

  }, 10000)


  test('Check User ID is Mongo ID', async () => {

    const res = await api.get('/api/users')
    res.body.forEach(user => expect(user.id).toBeDefined())
  }, 10000)


  test('Get User by ID', async () => {

    const existingRes = await api.get('/api/users')
    const allUsers = existingRes.body.map(u => new User(u))
    const userId = allUsers[0].id

    const res = await api.get(`/api/users/${userId}`).expect(200)

    expect(res.body.id).toEqual(userId)

  }, 10000)


  test ('Get unknown User ID', async () => {
    await api.get('/api/users/999999999999999999999999').expect(404)
  }, 10000)
})


describe('Test POST', () => {

  test('Test Create', async () => {

    const blog = (await Blog.find({}).limit(1))[0]

    const userParams = {
      username: 'user2',
      name: 'Another User',
      password: 'password',
      blogs: [blog.id]
    }

    const result = await api.post('/api/users').send(userParams)

    expect(result.status).toBe(201)
    expect(result.body.username).toBe(userParams.username)
    expect(result.body.name).toBe(userParams.name)
    expect(result.body.id).toBeDefined()
    expect(result.body.blogs).toBeDefined()

    const res = await api.get(`/api/users/${result.body.id}`).expect(200)

    expect(res.body.id).toEqual(result.body.id)

  }, 10000)


  test('Test Create bad blog Id', async () => {

    const newUser = {
      username: 'user2',
      name: 'Another User',
      passwordHash: 'password',
      blogs: ['999999999999999999999999']
    }

    await api.post('/api/users').send(newUser).expect(400)
  })


  test('Test username alredy taken', async () => {

    const userParams = {
      username: 'user',
      name: 'Another User',
      password: 'password'
    }

    await api.post('/api/users').send(userParams).expect(400)

  }, 10000)

  test('Test username too short', async () => {

    const userParams = {
      username: 'aa',
      name: 'Another User',
      password: 'password'
    }

    const result = await api.post('/api/users').send(userParams).expect(400)

    expect(result.body.error).toBeDefined()

  }, 10000)


  test('Test password too short', async () => {

    const userParams = {
      username: 'User 3',
      name: 'Another User',
      password: 'xx'
    }

    const result = await api.post('/api/users').send(userParams).expect(400)

    expect(result.body.error).toBeDefined()

  }, 10000)

})


describe('Test DELETE', () => {

  test('Test Delete', async () => {

    const newUser = {
      username: 'Delete User',
      name: 'Another User',
      password: 'password'
    }

    const result = await api.post('/api/users').send(newUser).expect(201)

    await api.delete(`/api/users/${result.body.id}`).expect(204)

    await api.get(`/api/blogs/${result.body.id}`).expect(404)

  }, 10000)

})


/*
describe('Test PUT', () => {

  test('Update Blog likes', async () => {

    const newBlog = {...blogValues}

    let res = await api.post('/api/blogs').send(newBlog).expect(201)

    const blogId = res.body.id

    newBlog.likes = 99

    await api.put(`/api/blogs/${blogId}`).send(newBlog).expect(200)

    res = await api.get(`/api/blogs/${blogId}`).expect(200)

    expect(res.body.likes).toBe(newBlog.likes)
  })
})
*/

afterAll(async () => {
  await mongoose.connection.close()
})