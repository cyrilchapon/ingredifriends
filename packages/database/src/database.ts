import { appEnv } from './env'
import * as arango from 'arangojs'
import { getDatabaseConnectionDescriptor } from './tools/arango-url-helper'

import {
  Ingredient,
  Recipe,
  Love
} from './collections'

import {
  Love as _LoveGraph
} from './graphs'

const arangoDatabase = new arango.Database(getDatabaseConnectionDescriptor(appEnv.ARANGO_URL))

export const IngredientCollection = Ingredient.collection(arangoDatabase)
export const RecipeCollection = Recipe.collection(arangoDatabase)
export const LoveCollection = Love.collection(arangoDatabase)

export const LoveGraph = _LoveGraph.graph(arangoDatabase)

export {
  IngredientDocumentObject,
  RecipeDocumentObject,
  LoveDocumentObject
} from './collections'

export {
  arangoDatabase
}
