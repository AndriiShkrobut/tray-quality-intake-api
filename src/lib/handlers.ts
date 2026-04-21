import { HttpStatusCodes } from '@/lib/http.js'
import type { ErrorHandler, NotFoundHandler } from 'hono'
import type { ContentfulStatusCode } from 'hono/utils/http-status'


export const notFoundHandler: NotFoundHandler = (ctx) => {
  return ctx.json({
    message: `Not Found - ${ctx.req.path}`
  }, HttpStatusCodes.NOT_FOUND)
}

export const errorHandler: ErrorHandler = (error, ctx) => {
  const statusCode = 'status' in error ? error.status as ContentfulStatusCode : HttpStatusCodes.INTERNAL_SERVER_ERROR

  return ctx.json({ message: error.message }, statusCode)
}
