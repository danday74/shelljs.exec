'use strict'

var imp = require('../_js/testImports')
var EOL = require('os').EOL

describe('shell-o', function() {

  it('success', function() {

    var shello = require('../../index')
    var cmd = 'echo hello'
    var cmdObj = shello(cmd, {stdio: 'pipe', encoding:'utf-8'})

    imp.expect(cmdObj).to.eql({
      error: null, // same as child_process.exec
      stdout: 'hello' + EOL,
      stderr: '', // same as child_process.exec
      code: 0,
      ok: true
    })
  })

  it('failure', function() {

    var shello = require('../../index')
    var cmd = 'blip blop'
    var cmdObj = shello(cmd, {stdio: 'pipe', encoding:'utf-8'})

    imp.expect(cmdObj.error).to.be.an('error')
    imp.expect(cmdObj.error.message).to.match(/not found|not recognized/)

    imp.expect(cmdObj.stdout).to.equal('')
    imp.expect(cmdObj.stderr).to.match(/not found|not recognized/)
    imp.expect(cmdObj.code).to.be.above(0)
    imp.expect(cmdObj.ok).to.be.false
  })
})
