
const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const blogRouter = require('./controllers/blogController')
const middleware = require('./utils/middleware')
const logger = require('./utils/logging')
const config = require('./utils/config')
const mongoose = require('mongoose')

mongoose.connect(config.MONGO_URL).then(() => {
  logger.info('Connected to MongoDB')
}).catch((error) => {
  logger.error('Error connecting to MongoDB:', error.message)
})

mongoose.set('strictQuery',false)


// Parse JSON payloads
const bodyParser = require('body-parser')
app.use(middleware.reqLogger)
app.use(cors())
app.use(express.static('dist'))
app.use(express.json())

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/api/blogs', blogRouter)

app.use(middleware.errorHandler)

module.exports = app

