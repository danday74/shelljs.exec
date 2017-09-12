'use strict'

var imp = require('../_js/testImports')
var shello = require('../../index')
var shelljs = require('shelljs')
var now = require('performance-now')

describe('benchmarks: shell-o v shelljs', function() {

  var cmdObj, start, end
  var shelljsCmdTime, shelljsExecTime, shelloTime

  describe('shelljs supported commands', function() {

    describe('echo', function() {

      before(function() {
        var echo1 = shello('where echo', {stdio: 'pipe', encoding: 'utf-8'})
        var echo2 = shello('which echo', {stdio: 'pipe', encoding: 'utf-8'})
        if (!echo1.ok && !echo2.ok) {
          this.skip()
        }
      })

      it('echo', function() {

        start = now()
        cmdObj = shelljs.exec('echo hello', {silent: true})
        end = now()
        imp.expect(cmdObj.stdout).to.equal('hello' + imp.EOL)
        shelljsExecTime = end - start
        console.log('shelljs.exec time -----> ', shelljsExecTime.toFixed(2))

        start = now()
        cmdObj = shello('echo hello', {stdio: 'pipe', encoding: 'utf-8'})
        end = now()
        imp.expect(cmdObj.stdout).to.equal('hello' + imp.EOL)
        shelloTime = end - start
        console.log('shello time -----------> ', shelloTime.toFixed(2))

        start = now()
        cmdObj = shelljs.echo('hello')
        end = now()
        imp.expect(cmdObj.stdout).to.equal('hello')
        shelljsCmdTime = end - start
        console.log('shelljs.echo time -----> ', shelljsCmdTime.toFixed(2))

        imp.expect(shelljsExecTime).to.be.above(shelloTime * 9)
        imp.expect(shelloTime).to.be.above(shelljsCmdTime * 4)
      })
    })


    describe('which', function() {

      before(function() {
        var which1 = shello('where which', {stdio: 'pipe', encoding: 'utf-8'})
        var which2 = shello('which which', {stdio: 'pipe', encoding: 'utf-8'})
        if (!which1.ok && !which2.ok) {
          this.skip()
        }
      })

      it('which', function() {

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
        console.log('shelljs.which time ----> ', shelljsCmdTime.toFixed(2))

        imp.expect(shelljsExecTime).to.be.above(shelloTime * 1.8)
        imp.expect(shelloTime).to.be.above(shelljsCmdTime * 1.2)
      })
    })

    describe('cat', function() {

      before(function() {
        var cat1 = shello('where cat', {stdio: 'pipe', encoding: 'utf-8'})
        var cat2 = shello('which cat', {stdio: 'pipe', encoding: 'utf-8'})
        if (!cat1.ok && !cat2.ok) {
          this.skip()
        }
      })

      it('cat', function() {

        var file1 = __dirname + '/file1'
        var file2 = __dirname + '/file2'

        start = now()
        cmdObj = shelljs.exec('cat ' + file1 + ' ' + file2, {silent: true})
        end = now()
        imp.expect(cmdObj.stdout).to.equal('hello\nworld\n')
        shelljsExecTime = end - start
        console.log('shelljs.exec time -----> ', shelljsExecTime.toFixed(2))

        start = now()
        cmdObj = shello('cat ' + file1 + ' ' + file2, {stdio: 'pipe', encoding: 'utf-8'})
        end = now()
        imp.expect(cmdObj.stdout).to.equal('hello\nworld\n')
        shelloTime = end - start
        console.log('shello time -----------> ', shelloTime.toFixed(2))

        start = now()
        cmdObj = shelljs.cat(file1, file2)
        end = now()
        imp.expect(cmdObj.stdout).to.equal('hello\nworld\n')
        shelljsCmdTime = end - start
        console.log('shelljs.cat time ------> ', shelljsCmdTime.toFixed(2))

        imp.expect(shelljsExecTime).to.be.above(shelloTime * 3.5)
        // shello sometimes faster here
        // imp.expect(shelloTime).to.be.above(shelljsCmdTime * 1.0)
      })
    })
  })
})
