import { promptSecret } from "@std/cli/prompt-secret"
import {
  logError,
  maskString,
  checkRequiredFlags,
} from "../lib/utils.ts"
import { loadFileContents } from "../lib/loadFile.ts"

export type Options = {
  id?: string
  dataFile?: string
  data?: object
  apiKey?: string
  usePrompt?: boolean // Prompt for missing required input
  useLog?: boolean // Output console logs
  skipConfirm?: boolean // Skip confirmation prompt for destructive api calls
}

const ID_TPL_VAR = '{id}'

function requiresData(method: string) {
  return ["POST", "PATCH"].includes(method)
}

export async function fetchApi(
  method: "GET" | "POST" | "PATCH" | "DELETE",
  pathTpl: string,
  opts: Options
): Promise<object> {
  const { useLog = true } = opts
  let { id, usePrompt = Deno.stdout.isTerminal() } = opts

  const apiKey =
    opts.apiKey ||
    Deno.env.get("VAPI_PRIVATE_API_KEY") ||
    (usePrompt && promptSecret("Vapi API Key:")?.trim()) ||
    undefined

  if (pathTpl.includes(ID_TPL_VAR) && !id && usePrompt) {
    const apiType = pathTpl.replace(new RegExp(`\\/?${ID_TPL_VAR}`), "")
    id = prompt(`ID for ${apiType}:`)?.trim() || ""
  }
  const url = `https://api.vapi.ai/${pathTpl.replace(ID_TPL_VAR, id ?? "")}`

  if (useLog && Deno.stdout.isTerminal()) {
    console.log(`API Key:`, maskString(apiKey, -5))
    console.log(`API URL:`, url)
  }

  checkRequiredFlags({ apiKey, id })

  let response: Response
  if (requiresData(method)) {
    response = await fetchWithData(method, url, { ...opts, apiKey })
  } else {
    response = await fetch(url, {
      method: "GET",
      headers: { Authorization: `Bearer ${apiKey}` },
    })
  }

  if (!response.ok) {
    logError(`Vapi API Response [${response.status}]: ${response.statusText}`)
    throw new Error(await response.text())
  }
  const json = await response.json()
  return json
}

async function fetchWithData(
  method: string,
  url: string,
  opts: Options
): Promise<Response> {
  const { apiKey, dataFile, data, skipConfirm = false } = opts
  if (!data && !dataFile) {
    throw new Error("Invalid config file")
  }
  const body =
    typeof data === "object" || (await loadFileContents(dataFile || ""))

  // Confirm before continuing update
  if (!skipConfirm) {
    console.log(`${method} ${url}`)
    console.log(body)
    const input: string | null = prompt(`${method} with the above data? y/N`, "N")
    if (input?.toUpperCase() !== "Y") {
      console.warn("Update aborted")
      Deno.exit(0)
    }
  }

  return await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })
}
