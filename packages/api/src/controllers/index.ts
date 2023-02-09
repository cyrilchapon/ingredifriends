import { RawReplyDefaultExpression, RawRequestDefaultExpression, RawServerDefault, RouteHandlerMethod, RouteShorthandOptions } from 'fastify'
import { RouteGenericInterface } from 'fastify/types/route'

type Controller<
  RouteGeneric extends RouteGenericInterface = RouteGenericInterface
> = {
  opts: RouteShorthandOptions<
    RawServerDefault,
    RawRequestDefaultExpression,
    RawReplyDefaultExpression,
    RouteGeneric
  >
  handler: RouteHandlerMethod<
    RawServerDefault,
    RawRequestDefaultExpression,
    RawReplyDefaultExpression,
    RouteGeneric
  >
}

export type {
  Controller
}

export * as IngredientController from './ingredients'
