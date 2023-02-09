import * as envalid from 'envalid'
import { ValidatorSpec } from 'envalid'

const nodeEnv = ['development', 'production', 'test'] as const
type NodeEnv = typeof nodeEnv[number]

interface AppEnv {
  ARANGO_URL: string
  NODE_ENV: NodeEnv
  PORT: number
}

const getAppEnv = (env: NodeJS.ProcessEnv = process.env) => (
  envalid.cleanEnv<AppEnv>(env, {
    ARANGO_URL: envalid.url(),
    NODE_ENV: envalid.str({ choices: nodeEnv }) as ValidatorSpec<NodeEnv>,
    PORT: envalid.port()
  })
)

const appEnv = getAppEnv()

export {
  NodeEnv,
  AppEnv,
  getAppEnv,
  appEnv
}

export default appEnv
