import { defineHTTPRoutes, wireHTTPRoutes } from '#pikku'
import { helloWorld } from '../functions/hello-world.function.js'

const helloRoutes = defineHTTPRoutes({
  auth: false,
  routes: {
    hello: { method: 'post', route: '/hello', func: helloWorld },
  },
})

wireHTTPRoutes({ routes: { hello: helloRoutes } })
