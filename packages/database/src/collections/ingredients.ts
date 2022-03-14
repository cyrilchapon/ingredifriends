import { Database } from 'arangojs'
import { DocumentCollection } from 'arangojs/collection'

interface IngredientDocumentObject {
  name: string
}

const COLLECTION_NAME = 'ingredients'

const collection = (arangoDatabase: Database): DocumentCollection<IngredientDocumentObject> => (
  arangoDatabase.collection<IngredientDocumentObject>(COLLECTION_NAME)
)

export {
  IngredientDocumentObject,
  COLLECTION_NAME,
  collection
}
