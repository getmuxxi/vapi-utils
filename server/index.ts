import { Hono } from '@hono/hono'
// import { cors, prettyJSON } from 'https://deno.land/x/hono@v3.12.8/middleware.ts'
import { functionCallRoute } from './functions/index.ts'
import { Bindings } from './types/hono.types.ts'
import { VapiPayload } from './types/vapi.types.ts'

const app = new Hono<{ Bindings: Bindings }>()

// app.use('*', prettyJSON())
// app.use('*', cors())
app.notFound((c) => c.json({ message: 'Not Found', ok: false }, 404))

app.get('/', (c) => {
  console.log('GET / received')
  return c.text('Hello World!')
})

// Vapi sends messages to this endpoint
app.post('/', async (c) => {
  const reqBody = await c.req.json()
  const payload: VapiPayload = reqBody.message
  console.log('Vapi payload:', payload)
})

app.route('/api/functions', functionCallRoute)
Deno.serve(app.fetch)
