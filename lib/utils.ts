import { urlTplId } from './api.ts'

/**
 * Wrap function call and return [error, data]
 * See https://www.youtube.com/watch?v=AdmGHwvgaVs
 */
export function catchError<T>(
  promise: Promise<T>,
): Promise<[undefined, T] | [Error]> {
  return promise
    .then((data) => {
      return [undefined, data] as [undefined, T]
    })
    .catch((error) => {
      return [error]
    })
}

/**
 * Output error to console in red
 * @param args
 */
export function logError(...args: unknown[]) {
  const [error, ...rest] = args
  console.error(`%c${error}`, 'color: red', ...rest)
}

/**
 * Mask a string with '*' except the number of chars set in length
 * @param input String to mask
 * @param numShow If positive, show the start of string. If negative, show the end of string.
 * @returns
 */
export function maskString(
  input: string | undefined | null,
  numShow = 0,
): string {
  if (!input) {
    return '[undefined]'
  }
  if (input === null) {
    return '[null]'
  }
  if (Math.abs(numShow) > input.length) {
    numShow = 0
  }
  if (numShow > 0) {
    return `${input.slice(0, numShow)}${'*'.repeat(input.length - numShow)}`
  } else if (numShow < 0) {
    const absLength = Math.abs(numShow)
    return `${'*'.repeat(input.length - absLength)}${input.slice(-absLength)}`
  } else {
    return '*'.repeat(input.length)
  }
}

export function checkRequired(url: string, {
  apiKey,
  id,
}: {
  apiKey: string | undefined
  id: string | undefined
}): boolean {
  const errors = []
  if (!apiKey) {
    errors.push(
      'Invalid API key. Set VAPI_PRIVATE_API_KEY in .env or --key flag',
    )
  }
  if (url.includes(urlTplId) && !id) {
    errors.push('Invalid assistant ID. Set --id flag')
  }
  if (errors.length) {
    throw new Error(errors.join('\n'))
  }
  return true
}

export function requiresData(method: string) {
  return ['POST', 'PATCH'].includes(method)
}
