import { sql } from 'drizzle-orm'
import { check, ExtraConfigColumn, integer, pgTable, timestamp, uniqueIndex, varchar } from 'drizzle-orm/pg-core'
import { createSelectSchema, createInsertSchema } from 'drizzle-zod'


const nonNegativeConstraint = (columnName: string, columnReference: ExtraConfigColumn) => (
  check(`${columnName}_non_negative`, sql`${columnReference} >= 0`)
)

// DB Schemas
export const machinesTable = pgTable('machines', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  // NOTE: it's assumed that each machine has an associated unique identifier that it will be authenticated by
  machine_key: varchar().notNull().unique()
})

export const traysTable = pgTable('trays', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  tray_barcode: varchar().notNull(),
  total_eggs: integer().notNull(),
  fertile: integer().notNull(),
  infertile: integer().notNull(),
  early_death: integer().notNull(),
  blood_ring: integer().notNull(),
  machine_id: integer().notNull().references(() => machinesTable.id),
  created_at: timestamp({ withTimezone: true }).notNull().defaultNow()
}, (table) => [
  nonNegativeConstraint('total_eggs', table.total_eggs),
  nonNegativeConstraint('fertile', table.fertile),
  nonNegativeConstraint('infertile', table.infertile),
  nonNegativeConstraint('early_death', table.early_death),
  nonNegativeConstraint('blood_ring', table.blood_ring),
  uniqueIndex('tray_barcode_idx').on(table.tray_barcode)
])


// App Schemas
export const machineSelectSchema = createSelectSchema(machinesTable)


export const trayInsertSchema = createInsertSchema(traysTable, {
  tray_barcode: (schema) => schema.min(1),
  total_eggs: (schema) => schema.nonnegative(),
  fertile: (schema) => schema.nonnegative(),
  infertile: (schema) => schema.nonnegative(),
  early_death: (schema) => schema.nonnegative(),
  blood_ring: (schema) => schema.nonnegative()
})

export const selectTraySchema = createSelectSchema(traysTable)
