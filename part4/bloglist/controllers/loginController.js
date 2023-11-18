const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const config = require('../utils/config')
const User = require('../models/User')

const loginRouter = require('express').Router()


loginRouter.post('/', async (request, response) => {

  const { username, password } = request.body

  const user = await User.findOne({ username })

  if(user === null || ! (await bcrypt.compare(password, user.passwordHash))){
    return response.status(401).json({
      error: 'invalid username or password'
    })
  }

  const userForToken = {
    username: user.username,
    id: user._id,
  }

  const token = jwt.sign(userForToken, config.JWT_SECRET)

  response.status(200).send({
    token,
    username: user.username,
    name: user.name
  })

})


module.exports = loginRouter
