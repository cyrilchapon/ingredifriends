import { arangoDatabase, IngredientCollection, RecipeCollection, LoveCollection } from '@ingredifriends/database'
import {
  findLove,
  incrementLove,
  insertLove,
  listRecipes,
  upsertLove
} from './marmiton/marmiton-parser'

const run = async () => {
  await LoveCollection.truncate()

  const recipesCursor = await listRecipes(arangoDatabase, RecipeCollection)

  const recipesCount = recipesCursor.count!

  let recipeCpt = 0
  process.stdout.write(`|`)
  for await (const recipe of recipesCursor) {
    recipeCpt++

    if (recipe.ingredients.length > 45) {
      console.log(`Long recipe skipped (${recipe.ingredients.length})`)
      console.log(`${recipe.name}`)
      continue
    }

    let ingredientCpt = 0
    for (let i = 0; i < recipe.ingredients.length; i++) {
      const ingredient1Id = recipe.ingredients[i]

      // Internal loop, to ignore already counted crushes
      for (let j = i + 1; j < recipe.ingredients.length; j++) {
        const ingredient2Id = recipe.ingredients[j]

        ingredientCpt++;

        await upsertLove(
          arangoDatabase,
          LoveCollection
        )(ingredient1Id, ingredient2Id)

        // const love = await findLove(
        //   arangoDatabase,
        //   LoveCollection
        // )(ingredient1Id, ingredient2Id)

        // if (love == null) {
        //   await insertLove(
        //     arangoDatabase,
        //     LoveCollection
        //   )(ingredient1Id, ingredient2Id)
        // } else {
        //   await incrementLove(
        //     arangoDatabase,
        //     LoveCollection
        //   )(love)
        // }
      }
    }
    process.stdout.write(`${ingredientCpt.toString().padStart(3, '0')}|`)

    if (recipeCpt % 10 === 0) {
      process.stdout.write(`\n`)
      console.log(`processed recipe ${recipeCpt}/${recipesCount}`)
      process.stdout.write(`|`)
    }
  }
}

run()
  .then(() => console.log('done'))
  .catch(console.error)