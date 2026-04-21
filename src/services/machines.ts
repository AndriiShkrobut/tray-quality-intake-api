import db from '@/db/index.js'


export const getMachineByKey = async (key: string) => {
  // TODO: move db interactions to a repository
  const machine = await db.query.machinesTable.findFirst({
    where: (fields, operators) => operators.eq(fields.machine_key, key)
  })

  return machine
}
