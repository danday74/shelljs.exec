'use strict'

var imp = require('../_js/testImports')
var Buffer = 'Uint8Array'

describe('shell-o', function() {

  it('success', function() {
    var shello = require('../../index')
    var cmdObj = shello('echo hello', {stdio: 'pipe'})
    imp.expect(cmdObj.out).to.be.a(Buffer)
    imp.expect(cmdObj.out.toString()).to.match(/hello/)

    imp.expect(cmdObj.err).to.be.undefined
    imp.expect(cmdObj.code).to.equal(0)
    imp.expect(cmdObj.ok).to.be.true
  })

  it('failure', function() {
    var shello = require('../../index')
    var cmdObj = shello('gecho hello', {stdio: 'pipe'})
    imp.expect(cmdObj.err).to.be.an('error')
    imp.expect(cmdObj.err.message).to.match(/not found|not recognized/)

    imp.expect(cmdObj.out).to.be.undefined
    imp.expect(cmdObj.code).to.equal(1)
    imp.expect(cmdObj.ok).to.be.false
  })
})
