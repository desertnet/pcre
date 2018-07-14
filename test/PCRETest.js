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

  describe(`constructor()`, function () {
    it(`should not throw`, function () {
      const re = new PCRE('aaa', 'i')
      re.destroy()
    })

    it(`should throw on malformed pattern`, function () {
      assert.throws(() => new PCRE('a(a'), /missing closing parenthesis/)
    })

    it(`should throw an error with correct offset property`, function () {
      let err
      try { new PCRE('a)aa') }
      catch (e) { err = e }
      assert.strictEqual(err.offset, 1)
    })
  })

  describe(`instance property`, function () {
    describe.skip(`exec()`, function () {
      let re

      beforeEach(function () {
        re = new PCRE('foo')
      })

      afterEach(function () {
        re.destroy()
      })

      it(`should return null on no match`, function () {
        assert.strictEqual(re.exec('bar'), null)
      })

      it(`should return array with matching string on match`, function () {
        assert.strictEqual(re.exec('fo')[0], 'fo')
      })
    })
  })
})
