'use strict'

var chalk = require('chalk')
var now = require('performance-now')
var shelljs = require('shelljs')
var imp = require('../_js/testImports')
var shelljsExec = require('../../index')

var COUNT = 5
var RANGE = imp.range(COUNT)

function report(cmd, oldTimeSum, newTimeSum, cmdTimeSum, shelljsCmd) {

  function getWord(percent) {
    if (percent < 100)
      return chalk.green((100 / percent).toFixed(1) + ' times faster than shelljs.exec (this module)')
    else
      return chalk.red((percent / 100).toFixed(1) + ' times slower than shelljs.exec (this module)')
  }

  var oldTimeAvg, newTimeAvg, cmdTimeAvg
  var oldTimePct, cmdTimePct, oldTimeWord, cmdTimeWord

  newTimeAvg = newTimeSum / COUNT

  oldTimeAvg = oldTimeSum / COUNT
  oldTimePct = 100 / newTimeAvg * oldTimeAvg
  oldTimeWord = getWord(oldTimePct)

  if (cmdTimeSum) {
    cmdTimeAvg = cmdTimeSum / COUNT
    cmdTimePct = 100 / newTimeAvg * cmdTimeAvg
    cmdTimeWord = getWord(cmdTimePct)
  }

  console.log(chalk.blue('COMMAND =', cmd))
  console.log(chalk.grey('AVERAGE TIMES FOR ' + COUNT + ' RUNS'))
  console.log(chalk.grey('shelljs.exec (from shelljs) -----> ', oldTimeAvg.toFixed(2) + 'ms', ' (' + oldTimePct.toFixed(2) + '%)', ' ' + oldTimeWord))
  console.log(chalk.grey('shelljs.exec (this module) ------> ', newTimeAvg.toFixed(2) + 'ms', ' (100%)'))
  if (cmdTimeSum && shelljsCmd) {
    console.log(chalk.grey('shelljs.' + shelljsCmd + '> ', cmdTimeAvg.toFixed(2) + 'ms', ' (' + cmdTimePct.toFixed(2) + '%)', ' ' + cmdTimeWord))
  }
}

describe('benchmarks: shelljs v shelljs.exec', function() {

  var cmdObj, start, end
  var oldTime, newTime, cmdTime

  describe('shelljs supported commands', function() {

    describe('echo', function() {

      it('echo hello', function() {

        var oldTimeSum = 0, newTimeSum = 0, cmdTimeSum = 0

        RANGE.forEach(function() {

          start = now()
          cmdObj = shelljs.exec('echo hello', {silent: true})
          end = now()
          imp.expect(cmdObj.stdout).to.equal('hello' + imp.EOL)
          oldTime = end - start

          start = now()
          cmdObj = shelljsExec('echo hello', {silent: true})
          end = now()
          imp.expect(cmdObj.stdout).to.equal('hello' + imp.EOL)
          newTime = end - start

          start = now()
          cmdObj = shelljs.echo('hello')
          end = now()
          imp.expect(cmdObj.stdout).to.equal('hello')
          cmdTime = end - start

          oldTimeSum += oldTime
          newTimeSum += newTime
          cmdTimeSum += cmdTime
        })

        report('echo hello', oldTimeSum, newTimeSum, cmdTimeSum, 'echo --------------------')
      })
    })

    describe('which', function() {

      before(function() {
        var which = shelljsExec('which which', {silent: true})
        var git = shelljsExec('which git', {silent: true})
        if (!which.ok || !git.ok) {
          this.skip()
        }
      })

      it('which git', function() {

        var oldTimeSum = 0, newTimeSum = 0, cmdTimeSum = 0

        RANGE.forEach(function() {

          start = now()
          cmdObj = shelljs.exec('which git', {silent: true})
          end = now()
          imp.expect(cmdObj.code).to.equal(0)
          oldTime = end - start

          start = now()
          cmdObj = shelljsExec('which git', {silent: true})
          end = now()
          imp.expect(cmdObj.code).to.equal(0)
          newTime = end - start

          start = now()
          cmdObj = shelljs.which('git')
          end = now()
          imp.expect(cmdObj).to.not.be.null
          imp.expect(cmdObj.code).to.equal(0)
          cmdTime = end - start

          oldTimeSum += oldTime
          newTimeSum += newTime
          cmdTimeSum += cmdTime
        })

        report('which git', oldTimeSum, newTimeSum, cmdTimeSum, 'which -------------------')
      })
    })

    describe('cat', function() {

      before(function() {
        var cat1 = shelljsExec('where cat', {silent: true})
        var cat2 = shelljsExec('which cat', {silent: true})
        if (!cat1.ok && !cat2.ok) {
          this.skip()
        }
      })

      it('cat file1 file2', function() {

        var oldTimeSum = 0, newTimeSum = 0, cmdTimeSum = 0

        var file1 = __dirname + '/file1'
        var file2 = __dirname + '/file2'

        RANGE.forEach(function() {

          start = now()
          cmdObj = shelljs.exec('cat ' + file1 + ' ' + file2, {silent: true})
          end = now()
          imp.expect(cmdObj.stdout).to.equal('hello\nworld\n')
          oldTime = end - start

          start = now()
          cmdObj = shelljsExec('cat ' + file1 + ' ' + file2, {silent: true})
          end = now()
          imp.expect(cmdObj.stdout).to.equal('hello\nworld\n')
          newTime = end - start

          start = now()
          cmdObj = shelljs.cat(file1, file2)
          end = now()
          imp.expect(cmdObj.stdout).to.equal('hello\nworld\n')
          cmdTime = end - start

          oldTimeSum += oldTime
          newTimeSum += newTime
          cmdTimeSum += cmdTime
        })

        report('cat file1 file2', oldTimeSum, newTimeSum, cmdTimeSum, 'cat ---------------------')
      })
    })
  })

  describe('shelljs unsupported commands', function() {

    describe('printf', function() {

      before(function() {
        var printf1 = shelljsExec('where printf', {silent: true})
        var printf2 = shelljsExec('which printf', {silent: true})
        if (!printf1.ok && !printf2.ok) {
          this.skip()
        }
      })

      it('printf hello', function() {

        var oldTimeSum = 0, newTimeSum = 0

        RANGE.forEach(function() {

          start = now()
          cmdObj = shelljs.exec('printf hello', {silent: true})
          end = now()
          imp.expect(cmdObj.stdout).to.equal('hello')
          oldTime = end - start

          start = now()
          cmdObj = shelljsExec('printf hello', {silent: true})
          end = now()
          imp.expect(cmdObj.stdout).to.equal('hello')
          newTime = end - start

          oldTimeSum += oldTime
          newTimeSum += newTime
        })

        report('printf hello', oldTimeSum, newTimeSum)
      })
    })

    describe('whoami', function() {

      before(function() {
        var whoami1 = shelljsExec('where whoami', {silent: true})
        var whoami2 = shelljsExec('which whoami', {silent: true})
        if (!whoami1.ok && !whoami2.ok) {
          this.skip()
        }
      })

      it('whoami', function() {

        var oldTimeSum = 0, newTimeSum = 0

        RANGE.forEach(function() {

          start = now()
          cmdObj = shelljs.exec('whoami', {silent: true})
          end = now()
          imp.expect(cmdObj.code).to.equal(0)
          oldTime = end - start

          start = now()
          cmdObj = shelljsExec('whoami', {silent: true})
          end = now()
          imp.expect(cmdObj.code).to.equal(0)
          newTime = end - start

          oldTimeSum += oldTime
          newTimeSum += newTime
        })

        report('whoami', oldTimeSum, newTimeSum)
      })
    })

    describe('git', function() {

      before(function() {
        var git1 = shelljsExec('where git', {silent: true})
        var git2 = shelljsExec('which git', {silent: true})
        if (!git1.ok && !git2.ok) {
          this.skip()
        }
      })

      it('git rev-parse --is-inside-work-tree', function() {

        var oldTimeSum = 0, newTimeSum = 0

        RANGE.forEach(function() {

          start = now()
          cmdObj = shelljs.exec('git rev-parse --is-inside-work-tree', {silent: true})
          end = now()
          imp.expect(cmdObj.stdout).to.equal('true\n')
          oldTime = end - start

          start = now()
          cmdObj = shelljsExec('git rev-parse --is-inside-work-tree', {silent: true})
          end = now()
          imp.expect(cmdObj.stdout).to.equal('true\n')
          newTime = end - start

          oldTimeSum += oldTime
          newTimeSum += newTime
        })

        report('git rev-parse --is-inside-work-tree', oldTimeSum, newTimeSum)
      })
    })
  })
})
