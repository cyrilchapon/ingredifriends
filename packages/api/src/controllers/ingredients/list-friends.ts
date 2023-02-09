import { Controller } from '~controllers'
import {
  arangoDatabase,
  IngredientCollection,
  IngredientModel
} from '@ingredifriends/database'

const listFriends: Controller<{
  Params: {
    key: string
  }
}> = {
  opts: {
    schema: {
      params: {
        type: 'object',
        properties: {
          key: { type: 'string' }
        }
      }
    }
  },
  handler: async (req, res) => {
    const key = req.params.key
    const ingredients = await IngredientModel.listLovers(arangoDatabase)(key)

    return ingredients
  }
}

export default listFriends
