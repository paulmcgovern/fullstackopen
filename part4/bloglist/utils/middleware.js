
const morgan = require('morgan')



const errorHandler = (error, req, res, next) => {

  console.error(`${error.name}: ${error.message}`)

  if(error && error.name === 'ValidationError') {

    return res.status(400).json({
      type: 'validation',
      error: error.message
    })

  } else if(error) {

    const message = error.message ? error.message: error
    return res.status(400).send({ error: message })
  }

  next(error)
}

// Log request body on POST
morgan.token('post-body', function (req) {
  if(req.method === 'POST') {
    return JSON.stringify(req.body)
  }
})

const reqLogger = morgan(':method :url :status :res[content-length] - :response-time ms :post-body')

module.exports = {
  errorHandler,
  reqLogger
}
