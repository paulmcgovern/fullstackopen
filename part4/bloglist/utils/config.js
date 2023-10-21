require('dotenv').config()

const LISTEN_PORT = process.env.LISTEN_PORT

const MONGO_URL = process.env.MONGO_URL.replace('__PASSWORD__', process.env.MONGO_PW)

module.exports = {
  LISTEN_PORT,
  MONGO_URL
}
