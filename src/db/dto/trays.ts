import { trayInsertSchema, traysTable } from '@/db/schema.js'


export const createTrayDtoSchema = trayInsertSchema
  .omit({ machine_id: true, created_at: true })
  .refine(
    (data) => data.fertile + data.infertile + data.early_death + data.blood_ring === data.total_eggs,
    { message: 'Sum of fertile, infertile, early_death, and blood_ring must equal total_eggs' }
  )

export type CreateTrayDto = typeof traysTable.$inferInsert
