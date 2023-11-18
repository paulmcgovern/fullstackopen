require('dotenv').config()

const JWT_SECRET = process.env.JWT_SECRET

const LISTEN_PORT = process.env.LISTEN_PORT

const MAX_ITEMS = 50

const MIN_PW_LENGTH = 3

const SALT_ROUNDS = 10

console.log(`NODE_ENV: ${process.env.NODE_ENV}`)

const MONGO_URL = process.env.NODE_ENV === 'production'
  ? process.env.MONGO_URL_PROD.replace('__PASSWORD__', process.env.MONGO_PW)
  : process.env.MONGO_URL_TEST.replace('__PASSWORD__', process.env.MONGO_PW)

module.exports = {
  LISTEN_PORT,
  MAX_ITEMS,
  MIN_PW_LENGTH,
  SALT_ROUNDS,
  MONGO_URL,
  JWT_SECRET
}
