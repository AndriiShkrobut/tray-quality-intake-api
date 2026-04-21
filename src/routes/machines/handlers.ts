import { HttpStatusCodes } from '@/lib/http.js'
import * as machinesService from '@/services/machines.js'
import * as traysService from '@/services/trays.js'
import type { RouteConfig, RouteHandler } from '@hono/zod-openapi'
import type { CreateTrayDto } from '@/db/dto/trays.js'
import type { MachineAppEnv, AppRouteHandler } from '@/lib/types.js'
import type { MachinesRegister, MachinesTrayIntake } from '@/routes/machines/routes.js'


type MachineRouteHandler<R extends RouteConfig> = RouteHandler<R, MachineAppEnv>

export const machinesRegister: AppRouteHandler<MachinesRegister> = async (ctx) => {
  // NOTE: just for simplicity, in reality it should be some more advanced mechanism to authorize machine itself or admin
  const adminKey = ctx.req.header('x-admin-key')

  if (!adminKey || adminKey !== process.env.ADMIN_KEY) {
    return ctx.json({ message: 'Unauthorized' }, HttpStatusCodes.UNAUTHORIZED)
  }

  const machineKey = await machinesService.registerMachine()

  return ctx.json(machineKey, HttpStatusCodes.CREATED)
}

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
