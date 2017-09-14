'use strict'

var imp = require('../_js/testImports')
var shello = require('../../index')
var shelljs = require('shelljs')
var now = require('performance-now')

var COUNT = 2
var RANGE = imp.range(COUNT)

function report(cmd, shelljsExecTimeAvg, shelloTimeAvg, shelljsCmdTimeAvg, shelljsCmd) {

  var shelljsCmdTimePct, shelljsExecTimePct, shelljsCmdTimeWord, shelljsExecTimeWord

  shelloTimeAvg = shelloTimeAvg / COUNT

  shelljsExecTimeAvg = shelljsExecTimeAvg / COUNT
  shelljsExecTimePct = 100 / shelloTimeAvg * shelljsExecTimeAvg
  shelljsExecTimeWord = (shelljsExecTimePct < 100) ? (100 / shelljsExecTimePct).toFixed(1) + ' times faster than shello' : (shelljsExecTimePct / 100).toFixed(1) + ' times slower than shell-o'

  if (shelljsCmdTimeAvg) {
    shelljsCmdTimeAvg = shelljsCmdTimeAvg / COUNT
    shelljsCmdTimePct = 100 / shelloTimeAvg * shelljsCmdTimeAvg
    shelljsCmdTimeWord = (shelljsCmdTimePct < 100) ? (100 / shelljsCmdTimePct).toFixed(1) + ' times faster than shello' : (shelljsCmdTimePct / 100).toFixed(1) + ' times slower than shell-o'
  }

  console.log('COMMAND =', cmd)
  console.log('AVERAGE TIMES FOR ' + COUNT + ' RUNS')
  console.log('shelljs.exec time -----> ', shelljsExecTimeAvg.toFixed(2) + 'ms', ' (' + shelljsExecTimePct.toFixed(2) + '%)', ' ' + shelljsExecTimeWord)
  console.log('shello time -----------> ', shelloTimeAvg.toFixed(2) + 'ms', ' (100%)')
  if (shelljsCmdTimeAvg && shelljsCmd) {
    console.log('shelljs.' + shelljsCmd + '> ', shelljsCmdTimeAvg.toFixed(2) + 'ms', ' (' + shelljsCmdTimePct.toFixed(2) + '%)', ' ' + shelljsCmdTimeWord)
  }
}

describe('benchmarks: shell-o v shelljs', function() {

  var cmdObj, start, end
  var shelljsCmdTime, shelljsExecTime, shelloTime

  describe('shelljs supported commands', function() {

    describe('echo', function() {

      it('echo hello', function() {

        var shelljsCmdTimeAvg = 0, shelljsExecTimeAvg = 0, shelloTimeAvg = 0

        RANGE.forEach(function() {

          start = now()
          cmdObj = shelljs.exec('echo hello', {silent: true})
          end = now()
          imp.expect(cmdObj.stdout).to.equal('hello' + imp.EOL)
          shelljsExecTime = end - start

          start = now()
          cmdObj = shello('echo hello', {silent: true})
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

        report('echo hello', shelljsExecTimeAvg, shelloTimeAvg, shelljsCmdTimeAvg, 'echo time -----')
      })
    })

    describe('which', function() {

      before(function() {
        var which = shello('which which', {silent: true})
        var git = shello('which git', {silent: true})
        if (!which.ok && !git.ok) {
          this.skip()
        }
      })

      it('which git', function() {

        var shelljsCmdTimeAvg = 0, shelljsExecTimeAvg = 0, shelloTimeAvg = 0

        RANGE.forEach(function() {
          start = now()
          cmdObj = shelljs.exec('which git', {silent: true})
          end = now()
          imp.expect(cmdObj.code).to.equal(0)
          shelljsExecTime = end - start

          start = now()
          cmdObj = shello('which git', {silent: true})
          end = now()
          imp.expect(cmdObj.code).to.equal(0)
          shelloTime = end - start

          start = now()
          cmdObj = shelljs.which('git')
          end = now()
          imp.expect(cmdObj).to.not.be.null
          imp.expect(cmdObj.code).to.equal(0)
          shelljsCmdTime = end - start

          shelljsExecTimeAvg += shelljsExecTime
          shelloTimeAvg += shelloTime
          shelljsCmdTimeAvg += shelljsCmdTime
        })

        report('which git', shelljsExecTimeAvg, shelloTimeAvg, shelljsCmdTimeAvg, 'which time ----')
      })
    })

    describe('cat', function() {

      before(function() {
        var cat1 = shello('where cat', {silent: true})
        var cat2 = shello('which cat', {silent: true})
        if (!cat1.ok && !cat2.ok) {
          this.skip()
        }
      })

      it('cat file1 file2', function() {

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
          cmdObj = shello('cat ' + file1 + ' ' + file2, {silent: true})
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

        report('cat file1 file2', shelljsExecTimeAvg, shelloTimeAvg, shelljsCmdTimeAvg, 'cat time ------')
      })
    })
  })

  describe('shelljs unsupported commands', function() {

    describe('printf', function() {

      before(function() {
        var printf1 = shello('where printf', {silent: true})
        var printf2 = shello('which printf', {silent: true})
        if (!printf1.ok && !printf2.ok) {
          this.skip()
        }
      })

      it('printf hello', function() {

        var shelljsExecTimeAvg = 0, shelloTimeAvg = 0

        RANGE.forEach(function() {
          start = now()
          cmdObj = shelljs.exec('printf hello', {silent: true})
          end = now()
          imp.expect(cmdObj.stdout).to.equal('hello')
          shelljsExecTime = end - start

          start = now()
          cmdObj = shello('printf hello', {silent: true})
          end = now()
          imp.expect(cmdObj.stdout).to.equal('hello')
          shelloTime = end - start

          shelljsExecTimeAvg += shelljsExecTime
          shelloTimeAvg += shelloTime
        })

        report('printf hello', shelljsExecTimeAvg, shelloTimeAvg)
      })
    })

    describe('whoami', function() {

      before(function() {
        var whoami1 = shello('where whoami', {silent: true})
        var whoami2 = shello('which whoami', {silent: true})
        if (!whoami1.ok && !whoami2.ok) {
          this.skip()
        }
      })

      it('whoami', function() {

        var shelljsExecTimeAvg = 0, shelloTimeAvg = 0

        RANGE.forEach(function() {
          start = now()
          cmdObj = shelljs.exec('whoami', {silent: true})
          end = now()
          imp.expect(cmdObj.code).to.equal(0)
          shelljsExecTime = end - start

          start = now()
          cmdObj = shello('whoami', {silent: true})
          end = now()
          imp.expect(cmdObj.code).to.equal(0)
          shelloTime = end - start

          shelljsExecTimeAvg += shelljsExecTime
          shelloTimeAvg += shelloTime
        })

        report('whoami', shelljsExecTimeAvg, shelloTimeAvg)
      })
    })

    describe('git', function() {

      before(function() {
        var git1 = shello('where git', {silent: true})
        var git2 = shello('which git', {silent: true})
        if (!git1.ok && !git2.ok) {
          this.skip()
        }
      })

      it('git rev-parse --is-inside-work-tree', function() {

        var shelljsExecTimeAvg = 0, shelloTimeAvg = 0

        RANGE.forEach(function() {
          start = now()
          cmdObj = shelljs.exec('git rev-parse --is-inside-work-tree', {silent: true})
          end = now()
          imp.expect(cmdObj.stdout).to.equal('true\n')
          shelljsExecTime = end - start

          start = now()
          cmdObj = shello('git rev-parse --is-inside-work-tree', {silent: true})
          end = now()
          imp.expect(cmdObj.stdout).to.equal('true\n')
          shelloTime = end - start

          shelljsExecTimeAvg += shelljsExecTime
          shelloTimeAvg += shelloTime
        })

        report('git rev-parse --is-inside-work-tree', shelljsExecTimeAvg, shelloTimeAvg)
      })
    })
  })
})
