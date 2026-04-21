import { createMiddleware } from 'hono/factory'
import * as machinesService from '@/services/machines.js'
import { HttpStatusCodes } from '@/lib/http.js'


export const machineAuthentication = createMiddleware(async (ctx, next) => {
  const machineKey = ctx.req.header('x-machine-key')

  if (!machineKey) {
    return ctx.json({ message: 'Unauthorized' }, HttpStatusCodes.UNAUTHORIZED)
  }

  const machine = await machinesService.getMachineByKey(machineKey)

  if (!machine) {
    return ctx.json({ message: 'Unauthorized' }, HttpStatusCodes.UNAUTHORIZED)
  }

  ctx.set('machine', machine)

  await next()
})
