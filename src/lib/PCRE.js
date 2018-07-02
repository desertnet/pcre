import libpcre2 from '../../dist/libpcre2'
import assert from 'assert'
import {TextDecoder} from 'util'

const utf16Decoder = new TextDecoder('utf-16')

let initialized = false
const cfunc = {}

export default class PCRE {
  static async init () {
    await libpcre2.loaded

    Object.assign(cfunc, {
      malloc (bytes) { return libpcre2._malloc(bytes) },
      free (ptr) { return libpcre2._free(ptr) },
      version: libpcre2.cwrap('version', 'number', ['number']),
    })

    initialized = true
  }

  static version () {
    assert(initialized)
    const len = cfunc.version(0)
    const ptr = allocateStringBuffer(len)
    cfunc.version(ptr)
    return copyAndFreeStringBuffer(ptr, len)
  }
}

function allocateStringBuffer (len) {
  return cfunc.malloc(len * 2)
}

function copyStringBuffer (ptr, len) {
  len = libpcre2.HEAPU16[(ptr / 2) + (len - 1)] === 0 ? len - 1 : len
  const encodedString = libpcre2.HEAP8.subarray(ptr, ptr + (len * 2))
  return utf16Decoder.decode(encodedString)
}

function copyAndFreeStringBuffer (ptr, len) {
  const string = copyStringBuffer(ptr, len)
  cfunc.free(ptr)
  return string
}
