import { Database } from 'arangojs'

const GRAPH_NAME = 'love'

const graph = (arangoDatabase: Database) => (
  arangoDatabase.graph(GRAPH_NAME)
)

export {
  GRAPH_NAME,
  graph
}
