// See https://docs.vapi.ai/api-reference/assistants/get-assistant

import { parseArgs } from '@std/cli/parse-args'
import '@std/dotenv/load'
import { api } from '../lib/api.ts'
import { catchError, logError } from '../lib/utils.ts'

const args = parseArgs(Deno.args, {
  string: ['key'],
  boolean: ['help', 'json'],
  alias: { help: 'h', json: 'j', key: 'k' },
})
const resource = args._[0]?.toString()

const help = `
Usage: ${resource}-list [OPTIONS...]

Required flags:
  -k, --key              Vapi API key. Prompts for key if none provided in args or .env

  Optional flags:
  -h, --help             Display this help and exit
  -j, --json             Output json [default false for console, true for stdout pipe]
`

function printHelp(): void {
  console.warn(help)
}

async function main(): Promise<object[]> {
  if (args.help) {
    printHelp()
    Deno.exit(0)
  }
  return await api('GET', resource, {
    apiKey: args.key,
  }) as object[]
}

// Run main and catch errors
const [error, result] = await catchError(main())
if (error) {
  logError(error)
  printHelp()
} else {
  if (Deno.stdout.isTerminal()) {
    const output = args.json === true ? JSON.stringify(result, null, 2) : result
    console.log(`${resource}:\n`, output)
    console.log(`%cNum ${resource}: ${result.length}`, 'color: green')
  } else {
    // Output json to stdout if piping to a file
    const output = args.json === false ? result : JSON.stringify(result, null, 2)
    console.log(output)
  }
}
