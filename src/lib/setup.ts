import { OpenAPIHono, type Hook } from '@hono/zod-openapi'
import { swaggerUI } from '@hono/swagger-ui'
import { logger } from 'hono/logger'

import { notFoundHandler, errorHandler } from '@/lib/handlers.js'
import { HttpStatusCodes } from '@/lib/http.js'
import packageJson from '../../package.json' with { type: 'json' }


export const createRouter = () => {
  return new OpenAPIHono({ defaultHook: processZodError })
}


export const setupApp = () => {
  const app = createRouter()

  app.use(logger())
  app.notFound(notFoundHandler)
  app.onError(errorHandler)

  return app
}


export const setupOpenApiDocs = (app: OpenAPIHono, path = '/docs') => {
  app.doc(path, {
    openapi: '3.0.0',
    info: {
      title: 'Tray Quality Intake API',
      version: packageJson.version
    }
  })

  app.get('/swagger', swaggerUI({
    url: path
  }))
}


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const processZodError: Hook<any, any, any, any> = (result, ctx) => {
  if (!result.success) {
    const [issue] = result.error.issues

    return ctx.json({
      message: issue?.message || 'Unknown error occured'
    }, HttpStatusCodes.BAD_REQUEST)
  }
}
