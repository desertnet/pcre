import assert from 'assert'

import PCRE from '../src/lib/PCRE'

describe(`PCRE`, function () {
  describe(`init()`, function () {
    it(`should not throw`, async function () {
      this.timeout(5000)
      await PCRE.init()
    })
  })

  describe(`version()`, function () {
    it(`should return the version of the PCRE2 library`, function () {
      const version = PCRE.version()
      assert.strictEqual(version, `10.31 2018-02-12`)
    })
  })
})
