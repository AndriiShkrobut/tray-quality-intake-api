import { machinesTable } from '@/db/schema.js'
import type { RouteConfig, RouteHandler } from '@hono/zod-openapi'


export interface MachineAppEnv {
  Variables: {
    machine: typeof machinesTable.$inferSelect
  }
}

export type AppRouteHandler<R extends RouteConfig> = RouteHandler<R>
