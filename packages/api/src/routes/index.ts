import { FastifyPluginAsync } from 'fastify'
import { ingredientRoutes } from './ingredients'

const apiRoutes: FastifyPluginAsync = async (fastify, pluginOpts) => {
  fastify.register(ingredientRoutes, { prefix: '/ingredients' })
}

export {
  apiRoutes
}
