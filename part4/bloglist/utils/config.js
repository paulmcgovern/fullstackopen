require('dotenv').config()

const LISTEN_PORT = process.env.LISTEN_PORT

console.log(`NODE_ENV: ${process.env.NODE_ENV}`)

const MONGO_URL = process.env.NODE_ENV === 'production'   
  ? process.env.MONGO_URL_PROD.replace('__PASSWORD__', process.env.MONGO_PW)  
  : process.env.MONGO_URL_TEST.replace('__PASSWORD__', process.env.MONGO_PW)  

module.exports = {
  LISTEN_PORT,
  MONGO_URL
}
