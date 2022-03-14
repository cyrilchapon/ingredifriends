import type { Migration } from '../cmds/migrate-db'

export const up: Migration = async ({ context: arangoDatabase }) => {
  await arangoDatabase.createCollection('recipes')
}

export const down: Migration = async ({ context: arangoDatabase }) => {
  await arangoDatabase.collection('recipes').drop()
}