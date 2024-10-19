// Copyright 2024 Muxxi. All rights reserved. MIT license.
// This code is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

// See https://docs.vapi.ai/api-reference/assistants/get-assistant

import "@std/dotenv/load"
import { parseArgs } from "@std/cli/parse-args"
import { promptSecret } from "@std/cli/prompt-secret"
import {
  catchError,
  logError,
  maskString,
  checkRequiredFlags,
} from "../lib/utils.ts"

const help = `
Usage: get-assistant [OPTIONS...]

Required flags:
  -i, --id               UUID of the Vapi assistant
  -k, --key              Vapi API key. Prompts for key if none provided in args or .env

  Optional flags:
  -h, --help             Display this help and exit
  -j, --json             Output json [default false for console, true for stdout pipe]
`

const args = parseArgs(Deno.args, {
  string: ["id", "key"],
  boolean: ["help", "json"],
  alias: { help: "h", id: "i", json: "j", key: "k" },
})

function printHelp(): void {
  console.log(help)
}

async function main(): Promise<object> {
  if (args.help) {
    printHelp()
    Deno.exit(0)
  }

  const id = args.id
  let apiKey = args.key || Deno.env.get("VAPI_PRIVATE_API_KEY") || undefined

  if (!apiKey) {
    apiKey = promptSecret("Vapi API Key:") || undefined
  }

  if (Deno.stdout.isTerminal()) {
    console.log(`API Key:`, maskString(apiKey, -5))
    console.log(`Assistant ID:`, id)
  }

  checkRequiredFlags({ apiKey, id })

  const options = {
    method: "GET",
    headers: { Authorization: `Bearer ${apiKey}` },
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
  if (Deno.stdout.isTerminal()) {
    const output = args.json === true ? JSON.stringify(result, null, 2) : result
    console.log("Assistant:\n", output)
  } else {
    // Output json to stdout if piping to a file
    const output =
      args.json === false ? result : JSON.stringify(result, null, 2)
    console.log(output)
  }
}
