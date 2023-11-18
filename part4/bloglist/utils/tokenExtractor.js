

const tokenExtractor = (request, response, next) => {

  const tokenAuth = request.get('Authorization')

  if(tokenAuth && tokenAuth.startsWith('Bearer ')) {
    request.token = tokenAuth.replace('Bearer ', '')
  }

  next()
}

module.exports = {
  tokenExtractor
}
