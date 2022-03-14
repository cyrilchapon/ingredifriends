import { Config } from 'arangojs/connection'
import Uri from 'urijs'

const getRootUri = (databaseUri: string): string => {
  const _databaseUri = new Uri(databaseUri)
  let serverUri = _databaseUri.clone()
  serverUri.path('')
  return serverUri.toString()
}

const getDatabaseName = (databaseUri: string): string => {
  const _databaseUri = new Uri(databaseUri)
  const databaseName = _databaseUri.path().replace(/^\/+|\/+$/g, '')
  return databaseName
}

const getDatabaseConnectionDescriptor = (databaseUri: string) => {
  return {
    url: getRootUri(databaseUri),
    databaseName: getDatabaseName(databaseUri)
  }
  // return {
  //   url: databaseUri,
  //   isAbsolute: true
  // }
}

export default getRootUri
export {
  getRootUri,
  getDatabaseName,
  getDatabaseConnectionDescriptor
}
