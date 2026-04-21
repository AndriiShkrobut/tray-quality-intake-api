import { setupApp, setupOpenApiDocs } from '@/lib/setup.js'
import machines from '@/routes/machines/index.js'
import trays from '@/routes/trays/index.js'


const app = setupApp()

const routes = [
  machines,
  trays
] as const

routes.forEach((route) => {
  app.route('/', route)
})


setupOpenApiDocs(app, '/docs')


export default app
