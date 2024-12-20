import { Hono } from '@hono/hono'
import { Bindings } from '../types/hono.types.ts'
import { VapiPayload, VapiWebhookEnum } from '../types/vapi.types.ts'

const ragHandler = new Hono<{ Bindings: Bindings }>()

ragHandler.post('/', async (c) => {
  try {
    const reqBody = await c.req.json()
    const payload: VapiPayload = reqBody.message

    if (payload.type === VapiWebhookEnum.FUNCTION_CALL) {
      const { functionCall } = payload

      if (!functionCall) {
        return c.json({ error: 'Invalid Request.' }, 400)
      }

      const { name, parameters } = functionCall
      console.log('functionCall', functionCall)
      console.log('parameters:', parameters)

      if (name === 'getCharacterInspiration') {
        const result = {
          response:
            'This is a placeholder response for the getCharacterInspiration function. It should be replaced with the actual implementation.',
        }
        // const result = await getCharacterInspiration(parameters as any)
        return c.json(result, 201)
      } else {
        console.log(`Function ${name} not found`)
        return c.json({ error: `Function ${name} not found` }, 404)
      }
    }

    return c.json({}, 201)
  } catch (err) {
    console.error(err)
    return c.json({ error: 'Internal Server Error' }, 500)
  }
})

export { ragHandler }
