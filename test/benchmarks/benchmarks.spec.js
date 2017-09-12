'use strict'

var imp = require('../_js/testImports')
var shello = require('../../index')
var shelljs = require('shelljs')
var now = require('performance-now')

describe('benchmarks: shell-o v shelljs', function() {

  var cmdObj, start, end
  var shelljsCmdTime, shelljsExecTime, shelloTime

  // it('echo - a shelljs supported command', function() {
  //
  //   start = now()
  //   cmdObj = shelljs.exec('echo hello', {silent: true})
  //   end = now()
  //   imp.expect(cmdObj.stdout).to.equal('hello' + imp.EOL)
  //   shelljsExecTime = end - start
  //   console.log('shelljs.exec time -----> ', shelljsExecTime.toFixed(2))
  //
  //   start = now()
  //   cmdObj = shello('echo hello', {stdio: 'pipe', encoding: 'utf-8'})
  //   end = now()
  //   imp.expect(cmdObj.stdout).to.equal('hello' + imp.EOL)
  //   shelloTime = end - start
  //   console.log('shello time -----------> ', shelloTime.toFixed(2))
  //
  //   start = now()
  //   cmdObj = shelljs.echo('hello')
  //   end = now()
  //   imp.expect(cmdObj.stdout).to.equal('hello')
  //   shelljsCmdTime = end - start
  //   console.log('shelljs.echo time -----> ', shelljsCmdTime.toFixed(2))
  //
  //   imp.expect(shelljsExecTime).to.be.above(shelloTime * 10)
  //   imp.expect(shelloTime).to.be.above(shelljsCmdTime * 4)
  // })

  it('which - a shelljs supported command', function() {

    start = now()
    cmdObj = shelljs.exec('which echo', {silent: true})
    end = now()
    imp.expect(cmdObj.code).to.equal(0)
    shelljsExecTime = end - start
    console.log('shelljs.exec time -----> ', shelljsExecTime.toFixed(2))

    start = now()
    cmdObj = shello('which echo', {stdio: 'pipe', encoding: 'utf-8'})
    end = now()
    imp.expect(cmdObj.code).to.equal(0)
    shelloTime = end - start
    console.log('shello time -----------> ', shelloTime.toFixed(2))

    start = now()
    cmdObj = shelljs.which('echo')
    end = now()
    imp.expect(cmdObj).to.not.be.null
    imp.expect(cmdObj.code).to.equal(0)
    shelljsCmdTime = end - start
    console.log('shelljs.echo time -----> ', shelljsCmdTime.toFixed(2))

    imp.expect(shelljsExecTime).to.be.above(shelloTime * 1.9)
    imp.expect(shelloTime).to.be.above(shelljsCmdTime * 28)
  })
})
