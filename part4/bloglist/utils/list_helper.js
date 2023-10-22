const _ = require('lodash')

const totalLikes = (blogsArr) => {

  if(!blogsArr){
    return 0
  }

  return blogsArr.reduce((acc, cur) => {
    return acc + cur.likes
  }, 0)
}

const favoriteBlog = (blogsArr) => {

  if(!blogsArr || blogsArr.length === 0){
    return
  }

  return blogsArr.reduce((maxBlog, blog) => {
    return (maxBlog = maxBlog.likes > blog.likes ? maxBlog : blog)
  })

}

const mostBlogs = (blogsArr) => {

  if(!blogsArr || blogsArr.length === 0){
    return
  }

  let countByAuthors = _.countBy(blogsArr, (blog) => {
    return blog.author
  })

  let maxBlogs = _.maxBy(Object.entries(countByAuthors), (kv) => kv[1])

  return {
    author: maxBlogs[0],
    blogs: maxBlogs[1]
  }
}

const mostLikes = (blogsArr) => {

  if(!blogsArr || blogsArr.length === 0){
    return
  }

  const likesByAuthor = _.map(_.groupBy(blogsArr, 'author'), (blogs, author) => {
    return {
      author: author,
      likes: _.sumBy(blogs, 'likes')
    }
  })

  return _.maxBy(likesByAuthor, 'likes')
}

module.exports = {
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}