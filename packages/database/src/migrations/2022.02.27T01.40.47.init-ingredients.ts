import type { Migration } from '../cmds/migrate-db'

export const up: Migration = async ({ context: arangoDatabase }) => {
  await arangoDatabase.createCollection('ingredients')
}

export const down: Migration = async ({ context: arangoDatabase }) => {
  await arangoDatabase.collection('ingredients').drop()
}