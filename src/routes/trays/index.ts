import { createRouter } from '@/lib/setup.js'
import * as routes from './routes.js'
import * as handlers from './handlers.js'


const traysRouter = createRouter().basePath('/trays')
  .openapi(routes.getOneByBarcode, handlers.getOneByBarcode)
  .openapi(routes.getList, handlers.getList)

export default traysRouter
