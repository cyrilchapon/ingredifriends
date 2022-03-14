import { IngredientDocumentObject, LoveDocumentObject, RecipeDocumentObject } from '@ingredifriends/database'
import slugify from 'slugify'
import { Document, DocumentData } from 'arangojs/documents'
import { aql, Database } from 'arangojs'
import { ArrayCursor } from 'arangojs/cursor'
import { ArangoCollection } from 'arangojs/collection'
import { MarmitonRecipe } from './marmiton-types'
import { DbMarmitonRecipe } from '@ingredifriends/database/src/collections/recipes'

const formatIngredient = (marmitonIngredient: string) => (
  slugify(marmitonIngredient, {
    lower: true,
    strict: true,
    locale: 'fr'
  })
)

const getDbIngredient = (marmitonIngredient: string): DocumentData<IngredientDocumentObject> => ({
  _key: formatIngredient(marmitonIngredient),
  name: marmitonIngredient
})

const pruneMarmitonRecipe = (marmitonRecipe: MarmitonRecipe): DbMarmitonRecipe => {
  const {
    tags,
    ingredients,
    image,
    imageScore,
    _highlightResult,
    ...dbMarmitionRecipe
  } = marmitonRecipe

  return dbMarmitionRecipe
}

const getDbRecipe = (ingredientsCollection: ArangoCollection) => (marmitonRecipe: MarmitonRecipe): DocumentData<RecipeDocumentObject> => ({
  _key: marmitonRecipe.objectID.replace('recipe#', ''),
  name: marmitonRecipe.title,
  ingredients: marmitonRecipe.ingredients.map(marmitonIngredient => (
    `${ingredientsCollection.name}/${formatIngredient(marmitonIngredient)}`
  )),
  marmiton: pruneMarmitonRecipe(marmitonRecipe)
})

const upsertRecipe = (
  arangoDatabase: Database,
  recipesCollection: ArangoCollection
) => async (
  recipe: DocumentData<RecipeDocumentObject>
) => {
  const savedRecipeCursor = await arangoDatabase.query(aql`
    UPSERT {
      _key: ${recipe._key}
    }
    INSERT ${recipe}
    UPDATE {
      ingredients: ${recipe.ingredients},
      marmiton: ${recipe.marmiton}
    }
    IN ${recipesCollection}
    OPTIONS { mergeObjects: false }

    RETURN NEW
  `) as ArrayCursor<Document<IngredientDocumentObject>>

  const savedRecipe = (await savedRecipeCursor.all())[0]
  return savedRecipe
}

const upsertIngredient = (
  arangoDatabase: Database,
  ingredientsCollection: ArangoCollection
) => async (
  ingredient: DocumentData<IngredientDocumentObject>
) => {
  const savedIngredientCursor = await arangoDatabase.query(aql`
    UPSERT {
      _key: ${ingredient._key}
    }
    INSERT ${ingredient}
    UPDATE {
      name: ${ingredient.name}
    }
    IN ${ingredientsCollection}
    OPTIONS { mergeObjects: false }

    RETURN NEW
  `) as ArrayCursor<Document<IngredientDocumentObject>>

  const savedIngredient = (await savedIngredientCursor.all())[0]
  return savedIngredient
}

const listRecipes = async (
  arangoDatabase: Database,
  recipesCollection: ArangoCollection,
) => {
  const recipeCursor = (await arangoDatabase.query(aql`
    FOR recipe IN ${recipesCollection}
    RETURN recipe
  `, { count: true, ttl: 3600 * 3 })) as ArrayCursor<Document<RecipeDocumentObject>>

  return recipeCursor
}

function sortForLove(
  ingredient1: DocumentData<IngredientDocumentObject>,
  ingredient2: DocumentData<IngredientDocumentObject>
): [DocumentData<IngredientDocumentObject>, DocumentData<IngredientDocumentObject>];
function sortForLove(
  ingredient1Id: string,
  ingredient2Id: string
): [string, string];

function sortForLove (
  ingredient1Any: DocumentData<IngredientDocumentObject> | string,
  ingredient2Any: DocumentData<IngredientDocumentObject> | string
): [DocumentData<IngredientDocumentObject>, DocumentData<IngredientDocumentObject>] | [string, string] {
  // Cheap local implementation for this context 
  const isIngredient = (ingredientAny: unknown): ingredientAny is DocumentData<IngredientDocumentObject> => (
    typeof ingredientAny === 'object' &&
    ingredientAny != null &&
    '_id' in (ingredientAny as DocumentData<IngredientDocumentObject>)
  )

  const i1IsIngredient = isIngredient(ingredient1Any)
  const i2IsIngredient = isIngredient(ingredient2Any)

  if (i1IsIngredient && i2IsIngredient) {
    const sorted = [ingredient1Any, ingredient2Any].sort((a, b) => a._key!.localeCompare(b._key!))
    return sorted as [DocumentData<IngredientDocumentObject>, DocumentData<IngredientDocumentObject>]
  } else if (!i1IsIngredient && !i2IsIngredient) {
    const sorted = [ingredient1Any, ingredient2Any].sort((a, b) => a.localeCompare(b))
    return sorted as [string, string]
  } else {
    throw new Error('ingredients should be of same type, string or Document')
  }
}

const upsertLove = (
  arangoDatabase: Database,
  loveCollection: ArangoCollection
) => async (
  ingredient1Id: string,
  ingredient2Id: string
) => {
  const [
    sortedIngredient1Id,
    sortedIngredient2Id
  ] = sortForLove(ingredient1Id, ingredient2Id)

  const savedLoveCursor = await arangoDatabase.query(aql`
    UPSERT {
      _from: ${sortedIngredient1Id}, _to: ${sortedIngredient2Id}
    }
    INSERT {
      _from: ${sortedIngredient1Id}, _to: ${sortedIngredient2Id}, crush: 1
    }
    UPDATE {
      crush: OLD.crush + 1
    }
    IN ${loveCollection}
    OPTIONS { mergeObjects: false }

    RETURN NEW
  `) as ArrayCursor<Document<LoveDocumentObject>>

  const savedLove = (await savedLoveCursor.all())[0]
  return savedLove
}

const findLove = (
  arangoDatabase: Database,
  loveCollection: ArangoCollection
) => async (
  ingredient1Id: string,
  ingredient2Id: string
) => {
  const [
    sortedIngredient1Id,
    sortedIngredient2Id
  ] = sortForLove(ingredient1Id, ingredient2Id)

  const loveCursor = (await arangoDatabase.query(aql`
    FOR love IN ${loveCollection}
      FILTER love._from == ${sortedIngredient1Id} AND love._to == ${sortedIngredient2Id}
      RETURN love
  `, { count: true })) as ArrayCursor<Document<LoveDocumentObject>>

  const loves = (await loveCursor.all())
  const love = loves.length > 0 ? loves[0] : null

  return love
}

const incrementLove = (
  arangoDatabase: Database,
  loveCollection: ArangoCollection
) => async (
  love: Document<LoveDocumentObject>
) => {
  await arangoDatabase.query(aql`
    LET love = DOCUMENT(${love._id})
    UPDATE love
    WITH {
      crush: love.crush + 1
    }
    IN ${loveCollection}
    RETURN NEW
  `)
}

const insertLove = (
  arangoDatabase: Database,
  loveCollection: ArangoCollection
) => async (
  ingredient1Id: string,
  ingredient2Id: string
) => {
  const [
    sortedIngredient1Id,
    sortedIngredient2Id
  ] = sortForLove(ingredient1Id, ingredient2Id)

  await arangoDatabase.query(aql`
    INSERT {
      _from: ${sortedIngredient1Id},
      _to: ${sortedIngredient2Id},
      crush: 1
    }
    IN ${loveCollection}
    RETURN NEW
  `)
}

export {
  formatIngredient,
  getDbIngredient,
  getDbRecipe,
  upsertIngredient,
  upsertRecipe,
  upsertLove,
  findLove,
  incrementLove,
  insertLove,
  listRecipes
}
