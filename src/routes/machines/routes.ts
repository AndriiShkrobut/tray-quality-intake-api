import { createRoute, z } from '@hono/zod-openapi'
import { selectTraySchema } from '@/db/schema.js'
import { createTrayDtoSchema } from '@/db/dto/trays.js'
import { HttpStatusCodes } from '@/lib/http.js'
import { machineAuthentication } from '@/middlewares/auth.js'


const tags = ['Machines']

export const machinesRegister = createRoute({
  path: '/register',
  method: 'post',
  tags,
  request: {
    headers: z.object({
      'x-admin-key': z.string().openapi({ description: 'Admin/Machine authorization key' })
    })
  },
  responses: {
    [HttpStatusCodes.CREATED]: {
      content: {
        'application/json': { schema: z.string() }
      },
      description: 'Machine authentication key (shown once, store it securely)'
    },
    [HttpStatusCodes.UNAUTHORIZED]: {
      content: {
        'application/json': { schema: z.object({ message: z.string().default('Unauthorized') }) }
      },
      description: 'Unauthorized'
    }
  }
})
export type MachinesRegister = typeof machinesRegister

export const machinesTrayIntake = createRoute({
  path: '/trays',
  method: 'post',
  middleware: [machineAuthentication],
  tags,
  request: {
    headers: z.object({
      'x-machine-key': z.string().openapi({ description: 'Machine authentication key' })
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
