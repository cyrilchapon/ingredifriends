import { appEnv } from '../env'
import * as arango from 'arangojs'
import { isArangoError } from 'arangojs/error'
import { getRootUri, getDatabaseName } from '../tools/arango-url-helper'
import chalk from 'chalk'

const run = async () => {
  const ARANGO_ROOT_URL = getRootUri(appEnv.ARANGO_URL)
  const ARANGO_DB_NAME = getDatabaseName(appEnv.ARANGO_URL)

  const arangoDatabase = new arango.Database({
    url: ARANGO_ROOT_URL
  })

  console.log(`Dropping ${ARANGO_DB_NAME}`)

  try {
    await arangoDatabase.dropDatabase(ARANGO_DB_NAME)
    console.log('Dropped')
  } catch (err: unknown) {
    if (isArangoError(err)) {
      console.error(chalk.red(`Error: ${err.message}`))
    } else {
      console.error(err)
    }
  }
}

run()
