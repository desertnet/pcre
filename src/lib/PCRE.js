import {TextDecoder} from 'util'

const libSym = Symbol('lib')

export default class PCRE {
  static async load () {
    if (this[libSym]) return this[libSym]
    this[libSym] = require('../../dist/libpcre2')
    await new Promise(resolve => {
      this[libSym].onRuntimeInitialized = () => resolve()
    })
    return this[libSym]
  }

  static async version () {
    const libpcre2 = await this.load()
    const stringSize = libpcre2.ccall('version', 'number', ['number'], [0])
    const ptr = libpcre2._malloc(stringSize * 2)
    libpcre2.ccall('version', 'number', ['number'], [ptr])
    const encodedString = libpcre2.HEAP8.subarray(ptr, ptr + (stringSize - 1) * 2)
    const decoder = new TextDecoder('utf-16')
    const result = decoder.decode(encodedString)
    libpcre2._free(ptr)
    return result
  }
}
