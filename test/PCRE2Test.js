import assert from 'assert'
import PCRE2 from '../src/lib/PCRE2.js'

describe(`PCRE2`, function () {
  describe(`initialize()`, function () {
    it(`should not throw`, async function () {
      await PCRE2.initialize()
    })
  })

  describe(`compile()`, function () {
    it(`should not throw`, function () {
      PCRE2.compile(`foo`, 'i')
    })
  })
})
