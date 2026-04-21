import { HttpStatusCodes } from '@/lib/http.js'
import * as traysService from '@/services/trays.js'
import type { RouteConfig, RouteHandler } from '@hono/zod-openapi'
import type { CreateTrayDto } from '@/db/dto/trays.js'
import type { MachineAppEnv } from '@/lib/types.js'
import type { MachinesTrayIntake } from '@/routes/machines/routes.js'


type MachineRouteHandler<R extends RouteConfig> = RouteHandler<R, MachineAppEnv>

export const machinesTrayIntake: MachineRouteHandler<MachinesTrayIntake> = async (ctx) => {
  const machine = ctx.var.machine

  if (!machine) {
    return ctx.json({ message: 'Unauthorized' }, HttpStatusCodes.UNAUTHORIZED)
  }

  const data = ctx.req.valid('json')

  const existingTray = await traysService.getTrayByBarcode(data.tray_barcode)

  if (existingTray) {
    return ctx.json({ message: 'Tray result with this barcode already exists' }, HttpStatusCodes.CONFLICT)
  }

  const newTray: CreateTrayDto = {
    ...data,
    machine_id: machine.id
  }

  const result = await traysService.addTray(newTray)

  return ctx.json(result, HttpStatusCodes.CREATED)
}
