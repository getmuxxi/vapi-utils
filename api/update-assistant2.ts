// See https://docs.vapi.ai/api-reference/assistants/get-assistant

import "@std/dotenv/load"
import { parseArgs } from "@std/cli/parse-args"
import { catchError, logError } from "../lib/utils.ts"
import { api } from "../lib/api.ts"

const help = `
Usage: update-assistant [OPTIONS...] [DATA FILE]

Required flags:
  -i, --id               UUID of the Vapi assistant
  -k, --key              Vapi API key. Prompts for key if none provided in args or .env

  Optional flags:
  -h, --help             Display this help and exit
`

const args = parseArgs(Deno.args, {
  string: ["id", "key"],
  boolean: ["help", "json"],
  alias: { help: "h", id: "i", json: "j", key: "k" },
})

function printHelp(): void {
  console.warn(help)
}

async function main(): Promise<object> {
  if (args.help) {
    printHelp()
    Deno.exit(0)
  }
  const dataFile = args._[0]?.toString()
  return await api("PATCH", "assistant/{id}", {
    id: args.id,
    apiKey: args.key,
    dataFile
  })
}

// Run main and catch errors
const [error, result] = await catchError(main())
if (error) {
  logError(error)
  printHelp()
} else {
  if (Deno.stdout.isTerminal()) {
    const output = args.json === true ? JSON.stringify(result, null, 2) : result
    console.log("Assistant:\n", output)
    console.error(`%cAssistant successfully updated!`, "color: green")
  } else {
    // Output json to stdout if piping to a file
    const output =
      args.json === false ? result : JSON.stringify(result, null, 2)
    console.log(output)
  }
}
