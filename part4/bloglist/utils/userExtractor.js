const jwt = require('jsonwebtoken')
const config = require('./config')

// Expects token extractor to have
// run before.
const userExtractor = (request, response, next) => {

  const decodedToken = jwt.verify(request.token, config.JWT_SECRET)

  request.user = decodedToken
  next()
}

module.exports = {
  userExtractor
}