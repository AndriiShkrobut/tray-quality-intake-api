import * as traysService from '@/services/trays.js'
import { HttpStatusCodes } from '@/lib/http.js'
import type { AppRouteHandler } from '@/lib/types.js'
import type { GetList, GetOneByBarcode } from '@/routes/trays/routes.js'


export const getOneByBarcode: AppRouteHandler<GetOneByBarcode> = async (ctx) => {
  const { barcode } = ctx.req.valid('param')
  const tray = await traysService.getTrayByBarcode(barcode)

  if (!tray) {
    return ctx.json({ message: 'Tray result not found' }, HttpStatusCodes.NOT_FOUND)
  }

  return ctx.json(tray, HttpStatusCodes.OK)
}

export const getList: AppRouteHandler<GetList> = async (ctx) => {
  const trays = await traysService.getTrays()

  return ctx.json(trays, HttpStatusCodes.OK)
}
