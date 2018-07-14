import libpcre2 from '../../dist/libpcre2'
import assert from 'assert'
import {TextDecoder} from 'util'

const utf16Decoder = new TextDecoder('utf-16')
let initialized = false
const cfunc = {}

const ptrSym = Symbol('ptr')

export default class PCRE {
  static async init () {
    await libpcre2.loaded

    Object.assign(cfunc, {
      malloc (bytes) { return libpcre2._malloc(bytes) },
      free (ptr) { return libpcre2._free(ptr) },
      version: libpcre2.cwrap('version', 'number', ['number']),
      compile: libpcre2.cwrap('compile', 'number', ['array', 'number', 'string']),
      destroyCode: libpcre2.cwrap('destroyCode', null, ['number']),
      lastErrorMessage: libpcre2.cwrap('lastErrorMessage', 'number', ['number', 'number']),
      lastErrorOffset: libpcre2.cwrap('lastErrorOffset', 'number'),
      match: libpcre2.cwrap('match', 'number', ['number', 'array', 'number', 'number']),
      destroyMatchData: libpcre2.cwrap('destroyMatchData', null, ['number']),
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

  constructor (pattern, flags = '') {
    assert(initialized)
    pattern = Buffer.from(pattern, 'utf16le')
    const ptr = cfunc.compile(pattern, pattern.length / 2, flags)

    if (ptr === 0) {
      const errMsgBufLen = 256
      const errMsgBuf = allocateStringBuffer(errMsgBufLen)
      const actualErrMsgLen = cfunc.lastErrorMessage(errMsgBuf, errMsgBufLen)
      const errorMessage = copyAndFreeStringBuffer(errMsgBuf, actualErrMsgLen)

      const err = new Error(errorMessage)
      err.offset = cfunc.lastErrorOffset()
      throw err
    }

    this[ptrSym] = ptr
  }

  destroy () {
    if (this[ptrSym] === 0) return
    cfunc.destroyCode(this[ptrSym])
    this[ptrSym] = 0
  }

  exec (subject, options) {
    assert(this[ptrSym])

    const {startOffset} = {
      startOffset: 0,
      ...options
    }

    subject = Buffer.from(subject, 'utf16le')
    const matchDataPtr = cfunc.match(
      this[ptrSym],
      subject, subject.length / 2,
      startOffset
    )

    cfunc.destroyMatchData(matchDataPtr)
    return null
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
