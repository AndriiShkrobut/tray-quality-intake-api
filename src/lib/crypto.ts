import { createHash, randomBytes } from 'node:crypto'


export const hashSHA256 = (value: string) => createHash('sha256').update(value).digest('hex')

export const randomHexString = () => randomBytes(32).toString('hex')
