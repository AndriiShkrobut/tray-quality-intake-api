import { createRouter } from '@/lib/setup.js'
import * as routes from './routes.js'
import * as handlers from './handlers.js'


const machinesRouter = createRouter()
  .openapi(routes.machinesTrayIntake, handlers.machinesTrayIntake)

export default machinesRouter
