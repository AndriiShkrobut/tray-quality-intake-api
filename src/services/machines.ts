import db from '@/db/index.js'
import { machinesTable } from '@/db/schema.js'
import { hashSHA256, randomHexString } from '@/lib/crypto.js'


export const getMachineByKey = async (key: string) => {
  const hashedKey = hashSHA256(key)

  const machine = await db.query.machinesTable.findFirst({
    where: (fields, operators) => operators.eq(fields.machine_key, hashedKey)
  })

  return machine
}


export const registerMachine = async () => {
  const plainKey = randomHexString()
  const hashedKey = hashSHA256(plainKey)

  await db.insert(machinesTable).values({ machine_key: hashedKey })

  return plainKey
}
