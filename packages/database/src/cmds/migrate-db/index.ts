// index.ts

import { Umzug } from 'umzug'
import { ArangoStorage } from './umzug-arango-storage'
import { arangoDatabase } from '../../database'
import path from 'path'
import fs from 'fs'

const arangoStorage = new ArangoStorage({
  db: arangoDatabase,
  collection: arangoDatabase.collection('migrations')
})

const umzug = new Umzug({
  migrations: { glob: 'src/migrations/*.ts' },
  context: arangoDatabase,
  storage: arangoStorage,
  logger: console,
  create: {
    folder: 'src/migrations',
    template: (filepath) => ([[filepath,
      fs.readFileSync(path.resolve(
        __dirname,
        '..',
        '..',
        'migrations',
        '_migration.ts.template'
      )).toString()
    ]])
  }
});

// export the type helper exposed by umzug, which will have the `context` argument typed correctly
export type Migration = typeof umzug._types.migration

(async () => {
  const migrationsCollection = arangoDatabase.collection('migrations')
  if(!await migrationsCollection.exists()) {
    await arangoDatabase.createCollection('migrations')
  }

  await umzug.runAsCLI()
})()
