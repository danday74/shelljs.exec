'use strict'

var imp = require('../_js/testImports')
var EOL = require('os').EOL

describe('shell-o', function() {

  it('success', function() {
    var shello = require('../../index')
    var cmd = 'echo hello'
    var cmdObj = shello(cmd, {stdio: 'pipe', encoding:'utf-8'})

    imp.expect(cmdObj).to.eql({
      out: 'hello' + EOL,
      err: undefined,
      code: 0,
      ok: true
    })
  })

  it('failure', function() {
    var shello = require('../../index')
    var cmdObj = shello('gecho hello', {stdio: 'pipe', encoding:'utf-8'})

    imp.expect(cmdObj.err).to.be.an('error')
    imp.expect(cmdObj.err.message).to.match(/not found|not recognized/)

    imp.expect(cmdObj.out).to.be.undefined
    imp.expect(cmdObj.code).to.be.above(0)
    imp.expect(cmdObj.ok).to.be.false
  })
})
