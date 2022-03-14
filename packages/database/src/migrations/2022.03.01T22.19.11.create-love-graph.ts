import type { Migration } from '../cmds/migrate-db'

export const up: Migration = async ({ context: arangoDatabase }) => {
  await arangoDatabase.createGraph('love', [
    { collection: 'love', from: 'ingredients', to: 'ingredients' }
  ])
}

export const down: Migration = async ({ context: arangoDatabase }) => {
  await arangoDatabase.graph('love').drop(false)
}
