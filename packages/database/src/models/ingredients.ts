import { aql, Database } from 'arangojs'
import { ArrayCursor } from 'arangojs/cursor'
import { Document } from 'arangojs/documents'
import { IngredientCollection, LoveCollection } from '../database'
import { IngredientDocumentObject, LoveDocumentObject } from '../collections'

type CrushDocument = Document<LoveDocumentObject & {
  friend: Document<IngredientDocumentObject>
}>

const findOne = (arangoDatabase: Database) => async (key: string) => {
  const result = (await arangoDatabase.query(aql`
    FOR i IN ${IngredientCollection}
      FILTER i._key == ${key}
      RETURN i
  `, { count: true })) as ArrayCursor<Document<IngredientDocumentObject>>

  if (result.count! === 0) {
    return null
  }

  return (await result.next())!
}

const listLovers = (arangoDatabase: Database) => async (key: string) => {
  const result = (await arangoDatabase.query(aql`
    LET ingredient = DOCUMENT(${IngredientCollection},${key})
    FOR lover, love
      IN 1..1
      ANY ingredient
      ${LoveCollection}
      SORT (love.crush) DESC
      LIMIT 10
      RETURN { lover: lover, crush: love.crush }
  `, { count: true })) as ArrayCursor<CrushDocument>

  const results = await result.all()
  return results
}

export {
  findOne,
  listLovers
}
