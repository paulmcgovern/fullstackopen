const app = require('./app')
const config = require('./utils/config')
const logger = require('./utils/logging')

app.listen(config.LISTEN_PORT, () => {
  logger.info(`Server running on port ${config.LISTEN_PORT}`)
})

