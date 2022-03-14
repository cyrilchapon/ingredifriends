import { Axios } from 'axios'
import { getPageDataFromPageHtml } from './marmiton/marmiton-helper'
import { arangoDatabase, RecipeCollection, IngredientCollection } from '@ingredifriends/database'
import {
  getDbIngredient,
  getDbRecipe,
  upsertIngredient,
  upsertRecipe
} from './marmiton/marmiton-parser'

import {
  marmitonCost,
  marmitonDifficulty,
  marmitonTimeToPrepare,
  marmitonDishType
} from './marmiton/marmiton-query'

const marmitonAxios = new Axios({
  baseURL: 'https://www.marmiton.org'
})

const run = async () => {
  for (const dt of marmitonDishType) {
    for (const exp of marmitonCost) {
      for (const dif of marmitonDifficulty) {
        for (const ttlt of marmitonTimeToPrepare) {
          console.log(`Scrapping ${dt} / cost ${exp} / difficulty ${dif} / time ${ttlt}`)

          let nextPage = 1
          let maxPage = 1
        
          do {
            // Download page
            const { data: html } = await marmitonAxios.get(
              '/recettes/recherche.aspx',
              { params: {
                dt,
                exp,
                dif,
                ttlt,
                page: nextPage
              } }
            )
        
            // Parse json from page data
            const pageData = getPageDataFromPageHtml(html)
        
            for (const marmitonRecipe of pageData.hits) {
              const dbRecipe = getDbRecipe(IngredientCollection)(marmitonRecipe)
              // console.log(`recipe ${dbRecipe._key}`)
        
              await upsertRecipe(arangoDatabase, RecipeCollection)(dbRecipe)
        
              for (const marmitonIngredient of marmitonRecipe.ingredients) {
                if (marmitonIngredient == null || marmitonIngredient.trim() === '') {
                  continue
                }
        
                const dbIngredient = getDbIngredient(marmitonIngredient)
                // console.log(`ingredient ${dbIngredient._key}`)
        
                await upsertIngredient(
                  arangoDatabase,
                  IngredientCollection
                )(dbIngredient)
              }
            }
        
            maxPage = pageData.nbPages
            console.log(`scrapped page ${nextPage}/${maxPage}`)
        
            nextPage = pageData.page + 2
          } while (nextPage <= maxPage)
        }
      }
    }
  }
}

run()
  .then(() => console.log('done'))
  .catch(console.error)