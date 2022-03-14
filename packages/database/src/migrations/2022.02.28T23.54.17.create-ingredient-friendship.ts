import type { Migration } from '../cmds/migrate-db'

export const up: Migration = async ({ context: arangoDatabase }) => {
  await arangoDatabase.createEdgeCollection('love')
}

export const down: Migration = async ({ context: arangoDatabase }) => {
  await arangoDatabase.collection('love').drop()
}