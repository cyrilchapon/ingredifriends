import * as arango from 'arangojs'
import { DocumentCollection } from 'arangojs/collection'
import { Document } from 'arangojs/documents'
import { UmzugStorage } from 'umzug'

interface ArangoStorageOptions {
  db: arango.Database
  collection: DocumentCollection
}

class ArangoStorage implements UmzugStorage {
  public readonly database: arango.Database
  public readonly collection: DocumentCollection

  constructor(options: ArangoStorageOptions) {
    this.database = options.db
    this.collection = options.collection
  }
	async logMigration({ name: migrationName }: { name: string }): Promise<void> {
		await this.collection.save({ _key: migrationName })
	}

	async unlogMigration({ name: migrationName }: { name: string }): Promise<void> {
		await this.collection.remove(migrationName)
	}

	async executed(): Promise<string[]> {
    const records = (await (await this.database.query(arango.aql`
      FOR doc IN ${this.collection}
        SORT doc._key ASC
        RETURN doc
    `)).all()) as Document<{}>[]

		return records.map(r => r._key);
	}
}

export default ArangoStorage
export {
  ArangoStorageOptions,
  ArangoStorage
}
