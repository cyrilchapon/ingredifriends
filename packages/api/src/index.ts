import Fastify from 'fastify'
import { appEnv } from './env'
import { apiRoutes } from './routes'

const fastify = Fastify({
  logger: true
})

fastify.get('/', async (request, reply) => {
  return { hello: 'world' }
})

fastify.register(apiRoutes, { prefix: '/api' })

const start = async () => {
  try {
    await fastify.listen(appEnv.PORT)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()
