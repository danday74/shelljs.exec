'use strict'

var imp = require('../../test/_js/testImports')
var normaliseOptions = require('./index')

describe('normaliseOptions', function() {

  var actual, expected

  beforeEach(function() {
    actual = undefined
    expected = Object.assign({}, imp.DEFAULTS)
  })

  it('options is undefined', function() {
    actual = normaliseOptions()
    imp.expect(actual).to.eql(expected)
  })

  it('options is not an object', function() {
    actual = normaliseOptions(9)
    imp.expect(actual).to.eql(expected)
  })

  it('options is an empty object', function() {
    actual = normaliseOptions({})
    imp.expect(actual).to.eql(expected)
  })

  it('silent is a boolean', function() {
    expected.silent = true
    expected.stdio = 'pipe'
    actual = normaliseOptions({silent: true})
    imp.expect(actual).to.eql(expected)
  })

  it('silent is not a boolean', function() {
    actual = normaliseOptions({silent: 'false'})
    imp.expect(actual).to.eql(expected)
  })

  it('stdio undefined when - silent off, stdio undefined', function() {
    expected.silent = false
    actual = normaliseOptions({silent: expected.silent})
    imp.expect(actual).to.eql(expected)
  })

  it('stdio respected when - silent off, stdio defined', function() {
    expected.silent = false
    expected.stdio = 'woteva'
    actual = normaliseOptions({silent: expected.silent, stdio: expected.stdio})
    imp.expect(actual).to.eql(expected)
  })

  it('stdio piped when - silent on, stdio undefined', function() {
    expected.silent = true
    expected.stdio = 'pipe'
    actual = normaliseOptions({silent: expected.silent})
    imp.expect(actual).to.eql(expected)
  })

  it('stdio respected when - silent on, stdio defined', function() {
    expected.silent = true
    expected.stdio = 'woteva'
    actual = normaliseOptions({silent: expected.silent, stdio: expected.stdio})
    imp.expect(actual).to.eql(expected)
  })
})
