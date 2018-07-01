import {promisify} from 'util'
import fs from 'fs'
import {resolve} from 'path'

const readFile = promisify(fs.readFile)

let initialized = false
let pcre2Module = null

export default class PCRE2 {
  static async initialize () {
    if (initialized) return

    const wasmCodePath = resolve(__dirname, '../../wasm/pcre2.wasm')
    const code = new Uint8Array(await readFile(wasmCodePath))
    const module = await WebAssembly.compile(code)
    pcre2Module = new WebAssembly.Instance(module, {})

    initialized = true
  }

  static compile (pattern, flags) {

  }
}

/* global WebAssembly */
