'use strict'

var imp = require('../_js/testImports')

describe('shelljs.exec', function() {

  it('success', function() {

    var shelljsExec = require('../../index')
    var cmd = 'echo hello'
    var cmdObj = shelljsExec(cmd, {silent: true})

    imp.expect(cmdObj).to.eql({
      error: null, // same as child_process.exec
      stdout: 'hello' + imp.EOL,
      stderr: '', // same as child_process.exec
      code: 0,
      ok: true
    })
  })

  it('failure', function() {

    var shelljsExec = require('../../index')
    var cmd = 'blip blop'
    var cmdObj = shelljsExec(cmd, {silent: true})

    imp.expect(cmdObj.error).to.be.an('error')
    imp.expect(cmdObj.error.message).to.match(/not found|not recognized/)

    imp.expect(cmdObj.stdout).to.equal('')
    imp.expect(cmdObj.stderr).to.match(/not found|not recognized/)
    imp.expect(cmdObj.code).to.be.above(0)
    imp.expect(cmdObj.ok).to.be.false
  })

  it('drop-in', function() {

    var shelljs = require('shelljs')
    var cmd = 'echo hello'
    var cmdObj1 = shelljs.exec(cmd, {silent: true})

    shelljs.exec = require('../../index')

    var cmdObj2 = shelljs.exec(cmd, {silent: true})

    imp.expect(cmdObj1.error).to.be.undefined
    imp.expect(cmdObj2.error).to.be.null

    imp.expect(cmdObj1.stdout).to.equal(cmdObj2.stdout)
    imp.expect(cmdObj1.stderr).to.equal(cmdObj2.stderr)
    imp.expect(cmdObj1.code).to.equal(cmdObj2.code)

    imp.expect(cmdObj1.ok).to.be.undefined
    imp.expect(cmdObj2.ok).to.be.true
  })

  it('makes noise', function() {

    var shelljsExec = require('../../index')
    var cmd = 'echo hello'
    var cmdObj = shelljsExec(cmd, {stdio: 'inherit'})

    imp.expect(cmdObj).to.eql({
      error: null,
      stdout: null,
      stderr: '',
      code: 0,
      ok: true
    })
  })

  describe('options', function() {

    var sandbox, spy
    var shelljsExec = require('../../index')
    var expected = {
      error: null,
      stdout: 'hello' + imp.EOL,
      stderr: '',
      code: 0,
      ok: true
    }

    beforeEach(function() {
      sandbox = imp.sinon.sandbox.create()
      spy = sandbox.spy(imp.cp, 'execSync')
    })

    afterEach(function() {
      sandbox.restore()
    })

    it('options is undefined', function() {
      var cmd = 'echo hello'
      var cmdObj = shelljsExec(cmd)
      imp.expect(spy).to.have.been.calledWith(cmd, imp.DEFAULTS)
      imp.expect(cmdObj).to.eql(expected)
    })

    it('options is not an object', function() {
      var cmd = 'echo hello'
      var cmdObj = shelljsExec(cmd, 9)
      imp.expect(spy).to.have.been.calledWith(cmd, imp.DEFAULTS)
      imp.expect(cmdObj).to.eql(expected)
    })

    it('options is an empty object', function() {
      var cmd = 'echo hello'
      var cmdObj = shelljsExec(cmd, {})
      imp.expect(spy).to.have.been.calledWith(cmd, imp.DEFAULTS)
      imp.expect(cmdObj).to.eql(expected)
    })

    it('silent is a boolean', function() {
      var cmd = 'echo hello'
      var cmdObj = shelljsExec(cmd, {silent: true})
      imp.expect(spy).to.have.been.calledWith(cmd, {encoding: 'utf8', silent: true, stdio: 'pipe'})
      imp.expect(cmdObj).to.eql(expected)
    })

    it('silent is not a boolean', function() {
      var cmd = 'echo hello'
      var cmdObj = shelljsExec(cmd, {silent: 'false'})
      imp.expect(spy).to.have.been.calledWith(cmd, imp.DEFAULTS)
      imp.expect(cmdObj).to.eql(expected)
    })

    it('stdio undefined when - silent off, stdio undefined', function() {
      var cmd = 'echo hello'
      var cmdObj = shelljsExec(cmd, {silent: false})
      imp.expect(spy).to.have.been.calledWith(cmd, imp.DEFAULTS)
      imp.expect(cmdObj).to.eql(expected)
    })

    it('stdio respected when - silent off, stdio defined', function() {
      var cmd = 'echo hello'
      var cmdObj = shelljsExec(cmd, {silent: false, stdio: 'woteva'})
      imp.expect(spy).to.have.been.calledWith(cmd, {encoding: 'utf8', silent: false, stdio: 'woteva'})

      imp.expect(cmdObj.error).to.be.an('error')
      imp.expect(cmdObj.error.message).to.match(/stdio/)

      imp.expect(cmdObj.stdout).to.be.undefined
      imp.expect(cmdObj.stderr).to.be.undefined
      imp.expect(cmdObj.code).to.be.above(0)
      imp.expect(cmdObj.ok).to.be.false
    })

    it('stdio piped when - silent on, stdio undefined', function() {
      var cmd = 'echo hello'
      var cmdObj = shelljsExec(cmd, {silent: true})
      imp.expect(spy).to.have.been.calledWith(cmd, {encoding: 'utf8', silent: true, stdio: 'pipe'})
      imp.expect(cmdObj).to.eql(expected)
    })

    it('stdio respected when - silent on, stdio defined', function() {
      var cmd = 'echo hello'
      var cmdObj = shelljsExec(cmd, {silent: true, stdio: 'woteva'})
      imp.expect(spy).to.have.been.calledWith(cmd, {encoding: 'utf8', silent: true, stdio: 'woteva'})

      imp.expect(cmdObj.error).to.be.an('error')
      imp.expect(cmdObj.error.message).to.match(/stdio/)

      imp.expect(cmdObj.stdout).to.be.undefined
      imp.expect(cmdObj.stderr).to.be.undefined
      imp.expect(cmdObj.code).to.be.above(0)
      imp.expect(cmdObj.ok).to.be.false
    })
  })
})