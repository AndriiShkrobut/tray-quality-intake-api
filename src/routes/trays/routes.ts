import { createRoute, z } from '@hono/zod-openapi'
import { selectTraySchema } from '@/db/schema.js'
import { HttpStatusCodes } from '@/lib/http.js'


const tags = ['Trays']


export const getOneByBarcode = createRoute({
  path: '/{barcode}',
  method: 'get',
  tags,
  request: {
    params: z.object({
      barcode: z.string().openapi({
        param: {
          name: 'barcode',
          in: 'path',
          required: true
        },
        required: ['barcode'],
        example: '2456580'
      })
    })
  },
  responses: {
    [HttpStatusCodes.OK]: {
      content: {
        'application/json': { schema: selectTraySchema }
      },
      description: 'Retrieves a tray result by barcode'
    },
    [HttpStatusCodes.NOT_FOUND]: {
      content: {
        'application/json': { schema: z.object({ message: z.string() }) }
      },
      description: 'Tray result not found'
    }
  }
})
export type GetOneByBarcode = typeof getOneByBarcode

export const getList = createRoute({
  path: '/',
  method: 'get',
  tags,
  responses: {
    [HttpStatusCodes.OK]: {
      content: {
        'application/json': { schema: z.array(selectTraySchema) }
      },
      description: 'The list of submitted tray results'
    }
  }
})
export type GetList = typeof getList
