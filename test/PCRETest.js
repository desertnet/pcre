import assert from 'assert'

import PCRE from '../src/lib/PCRE'

describe(`PCRE`, function () {
  describe(`version()`, function () {
    it(`should return the version of the PCRE2 library`, async function () {
      const version = await PCRE.version()
      assert.strictEqual(version, `10.31 2018-02-12`)
    })
  })
})
