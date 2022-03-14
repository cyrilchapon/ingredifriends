import { Database } from 'arangojs'
import { DocumentCollection } from 'arangojs/collection'

interface DbMarmitonRecipe {
  contentType: string
  title: string
  url: string
  isOnline: boolean
  averageRating: number
  nbRating: number
  isSponsored: boolean
  isPartnered: boolean
  dishType: string
  difficulty: number
  cost: number
  duration: number
  cookingType: string
  isGlutenFree: boolean
  isLactoseFree: boolean
  isVegetarian: boolean
  isVegan: boolean
  isPorkFree: boolean
  isSweet: boolean
  isSalty: boolean
  hasVideo: boolean
  preparationTime: number
  cookingTime: number
  restTime: number
  isSeasonal: boolean
  nutriScore: string
  publicationDate: Date
  relevanceScore: number
  indexationDate: Date
  objectID: string
}

interface RecipeDocumentObject {
  name: string,
  ingredients: string[]

  marmiton: DbMarmitonRecipe
}

const COLLECTION_NAME = 'recipes'

const collection = (arangoDatabase: Database): DocumentCollection<RecipeDocumentObject> => (
  arangoDatabase.collection(COLLECTION_NAME)
)

export {
  RecipeDocumentObject,
  DbMarmitonRecipe,
  COLLECTION_NAME,
  collection
}
