// Copyright 2024 Muxxi. All rights reserved. MIT license.
// This code is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { parse } from '@std/jsonc'
import { catchError } from './utils.ts'

/**
 * Return contents of json file or default export of js or ts file
 * @param fileName
 * @returns
 */
export async function loadFileContents(fileName: string) {
  const ext = (fileName.split('.').pop() || '').toLocaleLowerCase()

  if (ext.startsWith('json')) {
    // Load json or jsonc file
    const fileContent = await Deno.readTextFile(fileName)
    return parse(fileContent)
  } else if (['js', 'ts'].includes(ext)) {
    // Load default export from javascript or typescript file
    const [error, data] = await catchError(import(`../${fileName}`))
    if (error) {
      throw new Error(`Unable to load file: ${fileName}`)
    }
    return data.default
  } else {
    throw new Error(`Unsupported file type [${ext}]: ${fileName}`)
  }
}
