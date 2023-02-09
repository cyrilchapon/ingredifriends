import { Controller } from '~controllers'
import {
  arangoDatabase,
  IngredientCollection,
  IngredientModel
} from '@ingredifriends/database'

const get: Controller<{
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
    const ingredient = await IngredientModel.findOne(arangoDatabase)(key)

    if (ingredient == null) {
      res.code(404).send(null)
      return
    }

    return ingredient
  }
}

export default get
