// Requires MONGO_URL and MONGO_PW set in environment

require('dotenv').config()

const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    minLength: 3,
    maxLength: 255,
    required: true
  },
  author: {
    type: String,
    minLength: 3,
    maxLength: 50,
    required: true
  },
  url: {
    type: String,
    minLength: 11,
    maxLength: 50,
    required: true
  },
  likes: {
    type: Number,
    required: true,
    min: 0
  }
})

blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Blog', blogSchema)
