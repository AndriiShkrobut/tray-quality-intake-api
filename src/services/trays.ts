import db from '@/db/index.js'
import { traysTable } from '@/db/schema.js'
import type { CreateTrayDto } from '@/db/dto/trays.js'


export const addTray = async (tray: CreateTrayDto) => {
  const [insertedTray] = await db.insert(traysTable).values(tray).returning()
  return insertedTray
}

export const getTrayByBarcode = async (barcode: string) => {
  const tray = await db.query.traysTable.findFirst({
    where: (fields, operators) => operators.eq(fields.tray_barcode, barcode)
  })

  return tray
}

export const getTrays = async () => {
  const trays = await db.query.traysTable.findMany({
    orderBy: (fields, operators) => operators.desc(fields.created_at)
  })
  return trays
}
