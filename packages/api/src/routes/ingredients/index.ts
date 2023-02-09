import { FastifyPluginAsync } from 'fastify'
import { IngredientController } from '~controllers'

const ingredientRoutes: FastifyPluginAsync = async (fastify, pluginOpts) => {
  fastify.get(
    '/:key',
    IngredientController.get.opts,
    IngredientController.get.handler
  )

  fastify.get(
    '/:key/friends',
    IngredientController.listFriends.opts,
    IngredientController.listFriends.handler
  )
}

export {
  ingredientRoutes
}
