import { arangoDatabase, LoveCollection, LoveGraph, IngredientCollection, IngredientDocumentObject, LoveDocumentObject } from '@ingredifriends/database'
import { aql } from 'arangojs'
import { ArrayCursor } from 'arangojs/cursor'
import { Document } from 'arangojs/documents'

const run = async () => {
  const i1Name = 'carotte'
  const i2Name = 'poireau'

  const i1 = (await ((await arangoDatabase.query(aql`
    FOR i IN ${IngredientCollection}
      FILTER i._key == ${i1Name}
      RETURN i
  `)) as ArrayCursor<Document<IngredientDocumentObject>>).all())[0]

  const i2 = (await ((await arangoDatabase.query(aql`
    FOR i IN ${IngredientCollection}
      FILTER i._key == ${i2Name}
      RETURN i
  `)) as ArrayCursor<Document<IngredientDocumentObject>>).all())[0]

  const cursor = await arangoDatabase.query(aql`
    FOR lover IN INTERSECTION(
      (FOR lover, love
        IN 1..1
        ANY ${i1}
        ${LoveCollection}
        FILTER lover._key != ${i1._key} AND lover._key != ${i2._key}
        RETURN { _key: lover._key }),
      (FOR lover, love
        IN 1..1
        ANY ${i2}
        ${LoveCollection}
        FILTER lover._key != ${i1._key} AND lover._key != ${i2._key}
        RETURN { _key: lover._key })
    )
    LET love1 = FIRST(FOR love IN ${LoveCollection}
      FILTER love._from == CONCAT(${IngredientCollection.name},'/',MIN([${i1._key},lover._key])) AND love._to == CONCAT(${IngredientCollection.name},'/',MAX([${i1._key},lover._key]))
      RETURN love)
    LET love2 = FIRST(FOR love IN ${LoveCollection}
      FILTER love._from == CONCAT(${IngredientCollection.name},'/',MIN([${i2._key},lover._key])) AND love._to == CONCAT(${IngredientCollection.name},'/',MAX([${i2._key},lover._key]))
      RETURN love)
    SORT (love1.crush+love2.crush) DESC
    LIMIT 20
    RETURN { _key: lover._key, crushWith1: love1.crush, crushWith2: love2.crush }
  `)
  const loves = await cursor.all()
  console.log(loves)
}

run()
  .then(() => console.log('done'))
  .catch(console.error)