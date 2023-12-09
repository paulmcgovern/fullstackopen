
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const supertest = require('supertest')


const User = require('../models/User')
const Blog = require('../models/Blog')

const app = require('../app')

const api = supertest(app)


// Generate some test Blog instances
// User ID to be set after initialization
const testBlogs = [1, 2, 3, 4, 5].map(i => Blog({
  title: `Title ${i}`,
  author: `Author ${i}`,
  url: `http://${i}.com`,
  likes: i
}))

testBlogs[4].author = 'Author 4'

const blogValues = {
  title: 'Foo Blog',
  author: 'Foo McBar',
  url: 'http://foo.com',
  likes: 3
}


beforeEach(async () => {

  // One test user record
  const blogUser = new User({
    username: 'user',
    name: 'Blog Test User',
    passwordHash: await bcrypt.hash('password', 10)
  })

  await User.deleteMany({})
  await blogUser.save()

  // Associate user with blogs
  testBlogs.forEach(blog => blog.user = blogUser.id)
  blogValues.user = blogUser.id

  await Blog.deleteMany({})
  await Blog.insertMany(testBlogs)
})

const getAuthHeader = async (api, username='user', password='password') => {

  const token = await api.post('/api/login').send({
    username: username,
    password: password
  })

  return { 'Authorization': `Bearer ${token.body.token}` }
}


describe('Test GET', () => {

  test('Blogs are returned as json', async () => {
    await api.get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

  }, 10000)


  test('Check number of returned blogs', async () => {

    const res = await api.get('/api/blogs')
    expect(res.body).toHaveLength(testBlogs.length)

  }, 10000)


  test('Check blog ID is Mongo ID', async () => {

    const res = await api.get('/api/blogs')
    res.body.forEach(blog => expect(blog.id).toBeDefined())
  }, 10000)


  test('Get Blog by ID', async () => {

    const blog = testBlogs[0]

    const res = await api.get(`/api/blogs/${blog.id}`).expect(200)

    expect(res.body.id).toEqual(blog.id)
    expect(res.body.title).toEqual(blog.title)
    expect(res.body.author).toEqual(blog.author)
    expect(res.body.likes).toEqual(blog.likes)
    expect(JSON.stringify(res.body.user.id)).toEqual(JSON.stringify(blog.user))

  }, 10000)


  test ('Get unknown ID', async () => {

    await api.get('/api/blogs/999999999999999999999999').expect(404)

  }, 10000)
})




describe('Test POST', () => {

  test('Test Create', async () => {

    const authHeader = await getAuthHeader(api)

    const res = await api.post('/api/blogs').set(authHeader).send(blogValues)

    expect(res.status).toBe(201)
    expect(res.body.title).toBe(blogValues.title)
    expect(res.body.author).toBe(blogValues.author)
    expect(res.body.url).toBe(blogValues.url)
    expect(res.body.likes).toBe(blogValues.likes)
    expect(res.body.id).toBeDefined()
    expect(JSON.stringify(res.body.user.id)).toEqual(JSON.stringify(blogValues.user))

    const allRes = await api.get('/api/blogs')
    expect(allRes.body).toHaveLength(testBlogs.length + 1)

  }, 10000)

  test('Test Create no token', async () => {

    await api.post('/api/blogs').send(blogValues).expect(401)
  })


  test('Create missing Likes', async () => {

    const authHeader = await getAuthHeader(api)

    const newBlog = { ...blogValues }

    delete newBlog.likes

    const res = await api.post('/api/blogs').set(authHeader).send(newBlog)

    expect(res.body.likes).toBe(0)
  })


  test('Create missing Title', async () => {

    const authHeader = await getAuthHeader(api)

    const newBlog = { ...blogValues }

    delete newBlog.title

    await api.post('/api/blogs').set(authHeader).send(newBlog).expect(400)
  })


  test('Create missing URL', async () => {

    const authHeader = await getAuthHeader(api)

    const newBlog = { ...blogValues }

    delete newBlog.url

    await api.post('/api/blogs').set(authHeader).send(newBlog).expect(400)
  })

})


describe('Test DELETE', () => {

  test('Test DELETE with token', async () => {

    const authHeader = await getAuthHeader(api)

    const res = await api.post('/api/blogs').set(authHeader).send(blogValues).expect(201)

    await api.delete(`/api/blogs/${res.body.id}`).set(authHeader).expect(204)

    await api.get(`/api/blogs/${res.body.id}`).expect(404)

  }, 10000)

  test('Test DELETE no token', async () => {

    const authHeader = await getAuthHeader(api)

    const res = await api.post('/api/blogs').set(authHeader).send(blogValues).expect(201)

    await api.delete(`/api/blogs/${res.body.id}`).expect(401)

    await api.get(`/api/blogs/${res.body.id}`).expect(200)

  }, 10000)

  test('Test DELETE different token', async () => {

    const authHeader = await getAuthHeader(api)

    const res = await api.post('/api/blogs').set(authHeader).send(blogValues).expect(201)

    const anotherUser = new User({
      username: 'user2',
      name: 'Blog Test User2',
      passwordHash: await bcrypt.hash('password', 10)
    })

    await anotherUser.save()

    const anotherAuthHeader = await getAuthHeader(api, 'user2', 'password')

    await api.delete(`/api/blogs/${res.body.id}`).set(anotherAuthHeader).expect(401)
    await api.get(`/api/blogs/${res.body.id}`).expect(200)
  })
})

/*
describe('Test PUT', () => {

  test('Update Blog likes', async () => {

    const newBlog = { ...blogValues }

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