
const listHelper = require('../utils/list_helper')

const Blog = require('../models/Blog')

const blogs = [1, 2, 3, 4, 5].map(i => Blog({
  title: `Title ${i}`,
  author: `Author ${i}`,
  url: `http://${i}.com`,
  likes: i
}))

blogs[4].author = 'Author 4'


describe('Total Likes', () => {

  test('Empty returns zero', () => {
    const result = listHelper.totalLikes([])
    expect(result).toBe(0)
  })

  test('Undef rreturns zero', () => {
    const result = listHelper.totalLikes(undefined)
    expect(result).toBe(0)
  })

  test('List returns 6 likes', () => {
    const total = listHelper.totalLikes(blogs)
    expect(total).toBe(15)
  })
})


describe('Favourite Blog', () => {

  test('Undef returns undef', () => {
    expect(listHelper.favoriteBlog(undefined)).toBe(undefined)
  })

  test('Empty returns undef', () => {
    expect(listHelper.favoriteBlog([])).toBe(undefined)
  })

  test('Favourite is last', () => {
    const favBlog = listHelper.favoriteBlog(blogs)
    expect(favBlog).toEqual(blogs[4])
  })
})

describe('Most Blogs', () => {

  test('Undef returns undef', () => {
    expect(listHelper.mostBlogs(undefined)).toBe(undefined)
  })

  test('Empty returns undef', () => {
    expect(listHelper.mostBlogs([])).toBe(undefined)
  })

  test('Author 4 has most blogs', () => {
    const countByAuthor = listHelper.mostBlogs(blogs)
    expect(countByAuthor.author).toBe('Author 4')
    expect(countByAuthor.blogs).toBe(2)
  })
})

describe('Most Likes', () => {

  test('Undef returns undef', () => {
    expect(listHelper.mostLikes(undefined)).toBe(undefined)
  })

  test('Empty returns undef', () => {
    expect(listHelper.mostLikes([])).toBe(undefined)
  })

  test('Author 4 has most likes', () => {
    const likesByAuthor = listHelper.mostLikes(blogs)
    expect(likesByAuthor.author).toBe('Author 4')
    expect(likesByAuthor.likes).toBe(9)
  })

})

