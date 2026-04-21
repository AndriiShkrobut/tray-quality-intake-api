import { createRoute, z } from '@hono/zod-openapi'
import { selectTraySchema } from '@/db/schema.js'
import { createTrayDtoSchema } from '@/db/dto/trays.js'
import { HttpStatusCodes } from '@/lib/http.js'
import { machineAuthentication } from '@/middlewares/auth.js'


const tags = ['Machines']

export const machinesTrayIntake = createRoute({
  path: '/machines/trays',
  method: 'post',
  middleware: [machineAuthentication],
  tags,
  request: {
    headers: z.object({
      'x-machine-key': z.string().openapi({ description: 'Machine Authentication Key' })
    }),
    body: {
      content: {
        'application/json': { schema: createTrayDtoSchema }
      },
      description: 'Tray quality data'
    }
  },
  responses: {
    [HttpStatusCodes.CREATED]: {
      content: {
        'application/json': { schema: selectTraySchema }
      },
      description: 'Submitted tray result'
    },
    [HttpStatusCodes.UNAUTHORIZED]: {
      content: {
        'application/json': { schema: z.object({ message: z.string().default('Unauthorized') }) }
      },
      description: 'Unauthorized'
    },
    [HttpStatusCodes.CONFLICT]: {
      content: {
        'application/json': { schema: z.object({ message: z.string().default('Conflict') }) }
      },
      description: 'Conflict: tray result with this barcode already exists'
    }
  }
})
export type MachinesTrayIntake = typeof machinesTrayIntake
