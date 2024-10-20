// See https://docs.vapi.ai/api-reference/assistants/update-assistant

import '@std/dotenv/load'
import { parseArgs } from '@std/cli/parse-args'
import { promptSecret } from '@std/cli/prompt-secret'
import { catchError, checkRequiredFlags, logError, maskString } from '../lib/utils.ts'
import { loadFileContents } from '../lib/loadFile.ts'

const help = `
Usage: update-assistant [OPTIONS...] [DATA FILE]

Required flags:
  -i, --id               UUID of the Vapi assistant
  -k, --key              Vapi API key. Prompts for key if none provided in args or .env

  Optional flags:
  -h, --help             Display this help and exit
`

const args = parseArgs(Deno.args, {
  string: ['id', 'key'],
  boolean: ['help', 'json'],
  alias: { help: 'h', id: 'i', json: 'j', key: 'k' },
})

function printHelp(): void {
  console.warn(help)
}

async function main(): Promise<object> {
  if (args.help) {
    printHelp()
    Deno.exit(0)
  }

  const id = args.id
  const configFile = args._[0]?.toString()
  let apiKey = args.key || Deno.env.get('VAPI_PRIVATE_API_KEY') || undefined

  if (!apiKey) {
    apiKey = promptSecret('Vapi API Key:') || undefined
  }

  if (Deno.stdout.isTerminal()) {
    console.log(`API Key:`, maskString(apiKey, -5))
    console.log(`Assistant ID:`, id)
  }

  checkRequiredFlags({ apiKey, id })
  if (!configFile) {
    throw new Error('Invalid config file')
  }

  const config = await loadFileContents(configFile)
  console.log('Config:\n', config)

  // Confirm before continuing update
  const input: string | null = prompt(
    'Update the assistant with the above config? y/N',
  )
  if (input?.toUpperCase() !== 'Y') {
    console.warn('Update aborted')
    Deno.exit(0)
  }

  const options = {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(config),
  }
  const response = await fetch(`https://api.vapi.ai/assistant/${id}`, options)
  if (!response.ok) {
    logError(`Vapi API Response [${response.status}]: ${response.statusText}`)
    throw new Error(await response.text())
  }
  const json = await response.json()
  return json
}

// Run main and catch errors
const [error, result] = await catchError(main())
if (error) {
  logError(error)
  printHelp()
} else {
  console.log('Assistant:\n', result)
  console.error(`%cAssistant successfully updated!`, 'color: green')
}
