import { Database } from 'arangojs'

interface LoveDocumentObject {
  crush: number
}

const COLLECTION_NAME = 'love'

const collection = (arangoDatabase: Database) => (
  arangoDatabase.collection<LoveDocumentObject>(COLLECTION_NAME)
)

export {
  LoveDocumentObject,
  COLLECTION_NAME,
  collection
}
