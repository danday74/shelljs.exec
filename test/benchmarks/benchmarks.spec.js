'use strict'

var imp = require('../_js/testImports')
var shello = require('../../index')
var shelljs = require('shelljs')
var now = require('performance-now')

describe('benchmarks: shell-o v shelljs', function() {

  var cmdObj, start, end
  var shelljsCmdTime, shelljsExecTime, shelloTime
  var shelljsCmdTimePct, shelljsExecTimePct, shelljsCmdTimeWord, shelljsExecTimeWord
  var COUNT = 1000
  var RANGE = imp.range(COUNT)

  function report(shelljsExecTimeAvg, shelloTimeAvg, shelljsCmdTimeAvg, cmd) {

    shelljsExecTimeAvg = shelljsExecTimeAvg / COUNT
    shelloTimeAvg = shelloTimeAvg / COUNT
    shelljsCmdTimeAvg = shelljsCmdTimeAvg / COUNT

    shelljsExecTimePct = 100 / shelloTimeAvg * shelljsExecTimeAvg
    shelljsCmdTimePct = 100 / shelloTimeAvg * shelljsCmdTimeAvg

    shelljsExecTimeWord = (shelljsExecTimePct < 100) ? 'faster than shello' : 'slower than shell-o'
    shelljsCmdTimeWord = (shelljsCmdTimePct < 100) ? 'faster than shello' : 'slower than shell-o'

    console.log('Average times (' + COUNT + ' runs)')
    console.log('shelljs.exec time -----> ', shelljsExecTimeAvg.toFixed(2) + 'ms', ' (' + shelljsExecTimePct.toFixed(2) + '%)', shelljsExecTimeWord)
    console.log('shello time -----------> ', shelloTimeAvg.toFixed(2) + 'ms', ' (100%)')
    if (cmd) {
      console.log('shelljs.' + cmd + '> ', shelljsCmdTimeAvg.toFixed(2) + 'ms', ' (' + shelljsCmdTimePct.toFixed(2) + '%)', shelljsCmdTimeWord)
    }
  }

  describe('shelljs supported commands', function() {

    describe('echo', function() {

      it('echo', function() {

        var shelljsCmdTimeAvg = 0, shelljsExecTimeAvg = 0, shelloTimeAvg = 0

        RANGE.forEach(function() {

          start = now()
          cmdObj = shelljs.exec('echo hello', {silent: true})
          end = now()
          imp.expect(cmdObj.stdout).to.equal('hello' + imp.EOL)
          shelljsExecTime = end - start

          start = now()
          cmdObj = shello('echo hello', {stdio: 'pipe', encoding: 'utf-8'})
          end = now()
          imp.expect(cmdObj.stdout).to.equal('hello' + imp.EOL)
          shelloTime = end - start

          start = now()
          cmdObj = shelljs.echo('hello')
          end = now()
          imp.expect(cmdObj.stdout).to.equal('hello')
          shelljsCmdTime = end - start

          shelljsExecTimeAvg += shelljsExecTime
          shelloTimeAvg += shelloTime
          shelljsCmdTimeAvg += shelljsCmdTime
        })

        report(shelljsExecTimeAvg, shelloTimeAvg, shelljsCmdTimeAvg, 'echo time -----')
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

        var shelljsCmdTimeAvg = 0, shelljsExecTimeAvg = 0, shelloTimeAvg = 0

        RANGE.forEach(function() {
          start = now()
          cmdObj = shelljs.exec('which echo', {silent: true})
          end = now()
          imp.expect(cmdObj.code).to.equal(0)
          shelljsExecTime = end - start

          start = now()
          cmdObj = shello('which echo', {stdio: 'pipe', encoding: 'utf-8'})
          end = now()
          imp.expect(cmdObj.code).to.equal(0)
          shelloTime = end - start

          start = now()
          cmdObj = shelljs.which('echo')
          end = now()
          imp.expect(cmdObj).to.not.be.null
          imp.expect(cmdObj.code).to.equal(0)
          shelljsCmdTime = end - start

          shelljsExecTimeAvg += shelljsExecTime
          shelloTimeAvg += shelloTime
          shelljsCmdTimeAvg += shelljsCmdTime
        })

        report(shelljsExecTimeAvg, shelloTimeAvg, shelljsCmdTimeAvg, 'which time ----')
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

        var shelljsCmdTimeAvg = 0, shelljsExecTimeAvg = 0, shelloTimeAvg = 0

        var file1 = __dirname + '/file1'
        var file2 = __dirname + '/file2'

        RANGE.forEach(function() {
          start = now()
          cmdObj = shelljs.exec('cat ' + file1 + ' ' + file2, {silent: true})
          end = now()
          imp.expect(cmdObj.stdout).to.equal('hello\nworld\n')
          shelljsExecTime = end - start

          start = now()
          cmdObj = shello('cat ' + file1 + ' ' + file2, {stdio: 'pipe', encoding: 'utf-8'})
          end = now()
          imp.expect(cmdObj.stdout).to.equal('hello\nworld\n')
          shelloTime = end - start

          start = now()
          cmdObj = shelljs.cat(file1, file2)
          end = now()
          imp.expect(cmdObj.stdout).to.equal('hello\nworld\n')
          shelljsCmdTime = end - start

          shelljsExecTimeAvg += shelljsExecTime
          shelloTimeAvg += shelloTime
          shelljsCmdTimeAvg += shelljsCmdTime
        })

        report(shelljsExecTimeAvg, shelloTimeAvg, shelljsCmdTimeAvg, 'cat time ------')
      })
    })
  })

  describe('shelljs unsupported commands', function() {

    describe('printf', function() {

      before(function() {
        var printf1 = shello('where printf', {stdio: 'pipe', encoding: 'utf-8'})
        var printf2 = shello('which printf', {stdio: 'pipe', encoding: 'utf-8'})
        if (!printf1.ok && !printf2.ok) {
          this.skip()
        }
      })

      it('printf', function() {

        var shelljsCmdTimeAvg = 0, shelljsExecTimeAvg = 0, shelloTimeAvg = 0

        RANGE.forEach(function() {
          start = now()
          cmdObj = shelljs.exec('printf hello', {silent: true})
          end = now()
          imp.expect(cmdObj.stdout).to.equal('hello')
          shelljsExecTime = end - start

          start = now()
          cmdObj = shello('printf hello', {stdio: 'pipe', encoding: 'utf-8'})
          end = now()
          imp.expect(cmdObj.stdout).to.equal('hello')
          shelloTime = end - start

          shelljsExecTimeAvg += shelljsExecTime
          shelloTimeAvg += shelloTime
          shelljsCmdTimeAvg += shelljsCmdTime
        })

        report(shelljsExecTimeAvg, shelloTimeAvg, shelljsCmdTimeAvg)
      })
    })

    describe('whoami', function() {

      before(function() {
        var whoami1 = shello('where whoami', {stdio: 'pipe', encoding: 'utf-8'})
        var whoami2 = shello('which whoami', {stdio: 'pipe', encoding: 'utf-8'})
        if (!whoami1.ok && !whoami2.ok) {
          this.skip()
        }
      })

      it('whoami', function() {

        var shelljsCmdTimeAvg = 0, shelljsExecTimeAvg = 0, shelloTimeAvg = 0

        RANGE.forEach(function() {
          start = now()
          cmdObj = shelljs.exec('whoami', {silent: true})
          end = now()
          imp.expect(cmdObj.code).to.equal(0)
          shelljsExecTime = end - start

          start = now()
          cmdObj = shello('whoami', {stdio: 'pipe', encoding: 'utf-8'})
          end = now()
          imp.expect(cmdObj.code).to.equal(0)
          shelloTime = end - start

          shelljsExecTimeAvg += shelljsExecTime
          shelloTimeAvg += shelloTime
          shelljsCmdTimeAvg += shelljsCmdTime
        })

        report(shelljsExecTimeAvg, shelloTimeAvg, shelljsCmdTimeAvg)
      })
    })

    describe('git rev-parse --is-inside-work-tree', function() {

      before(function() {
        var git1 = shello('where git', {stdio: 'pipe', encoding: 'utf-8'})
        var git2 = shello('which git', {stdio: 'pipe', encoding: 'utf-8'})
        if (!git1.ok && !git2.ok) {
          this.skip()
        }
      })

      it('git rev-parse --is-inside-work-tree', function() {

        var shelljsCmdTimeAvg = 0, shelljsExecTimeAvg = 0, shelloTimeAvg = 0

        RANGE.forEach(function() {
          start = now()
          cmdObj = shelljs.exec('git rev-parse --is-inside-work-tree', {silent: true})
          end = now()
          imp.expect(cmdObj.stdout).to.equal('true\n')
          shelljsExecTime = end - start

          start = now()
          cmdObj = shello('git rev-parse --is-inside-work-tree', {stdio: 'pipe', encoding: 'utf-8'})
          end = now()
          imp.expect(cmdObj.stdout).to.equal('true\n')
          shelloTime = end - start

          shelljsExecTimeAvg += shelljsExecTime
          shelloTimeAvg += shelloTime
          shelljsCmdTimeAvg += shelljsCmdTime
        })

        report(shelljsExecTimeAvg, shelloTimeAvg, shelljsCmdTimeAvg)
      })
    })
  })
})
