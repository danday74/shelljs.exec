'use strict'

var chalk = require('chalk')
var now = require('performance-now')
var shelljs = require('shelljs')
var imp = require('../_js/testImports')
var shello = require('../../index')

var COUNT = 2
var RANGE = imp.range(COUNT)

function report(cmd, shelljsExecTimeSum, shelloTimeSum, shelljsCmdTimeSum, shelljsCmd) {

  function getWord(percent) {
    if (percent < 100)
      return chalk.green((100 / percent).toFixed(1) + ' times faster than shell-o')
    else
      return chalk.red((percent / 100).toFixed(1) + ' times slower than shell-o')
  }

  var shelljsExecTimeAvg, shelloTimeAvg, shelljsCmdTimeAvg
  var shelljsExecTimePct, shelljsCmdTimePct, shelljsExecTimeWord, shelljsCmdTimeWord

  shelloTimeAvg = shelloTimeSum / COUNT

  shelljsExecTimeAvg = shelljsExecTimeSum / COUNT
  shelljsExecTimePct = 100 / shelloTimeAvg * shelljsExecTimeAvg
  shelljsExecTimeWord = getWord(shelljsExecTimePct)

  if (shelljsCmdTimeSum) {
    shelljsCmdTimeAvg = shelljsCmdTimeSum / COUNT
    shelljsCmdTimePct = 100 / shelloTimeAvg * shelljsCmdTimeAvg
    shelljsCmdTimeWord = getWord(shelljsCmdTimePct)
  }

  console.log(chalk.blue('COMMAND =', cmd))
  console.log(chalk.grey('AVERAGE TIMES FOR ' + COUNT + ' RUNS'))
  console.log(chalk.grey('shelljs.exec --------------------> ', shelljsExecTimeAvg.toFixed(2) + 'ms', ' (' + shelljsExecTimePct.toFixed(2) + '%)', ' ' + shelljsExecTimeWord))
  console.log(chalk.grey('shello --------------------------> ', shelloTimeAvg.toFixed(2) + 'ms', ' (100%)'))
  if (shelljsCmdTimeSum && shelljsCmd) {
    console.log(chalk.grey('shelljs.' + shelljsCmd + '> ', shelljsCmdTimeAvg.toFixed(2) + 'ms', ' (' + shelljsCmdTimePct.toFixed(2) + '%)', ' ' + shelljsCmdTimeWord))
  }
}

describe('benchmarks: shell-o v shelljs', function() {

  var cmdObj, start, end
  var shelljsExecTime, shelloTime, shelljsCmdTime

  describe('shelljs supported commands', function() {

    describe('echo', function() {

      it('echo hello', function() {

        var shelljsExecTimeSum = 0, shelloTimeSum = 0, shelljsCmdTimeSum = 0

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

          shelljsExecTimeSum += shelljsExecTime
          shelloTimeSum += shelloTime
          shelljsCmdTimeSum += shelljsCmdTime
        })

        report('echo hello', shelljsExecTimeSum, shelloTimeSum, shelljsCmdTimeSum, 'echo --------------------')
      })
    })

    describe('which', function() {

      before(function() {
        var which = shello('which which', {silent: true})
        var git = shello('which git', {silent: true})
        if (!which.ok || !git.ok) {
          this.skip()
        }
      })

      it('which git', function() {

        var shelljsExecTimeSum = 0, shelloTimeSum = 0, shelljsCmdTimeSum = 0

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

          shelljsExecTimeSum += shelljsExecTime
          shelloTimeSum += shelloTime
          shelljsCmdTimeSum += shelljsCmdTime
        })

        report('which git', shelljsExecTimeSum, shelloTimeSum, shelljsCmdTimeSum, 'which -------------------')
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

        var shelljsExecTimeSum = 0, shelloTimeSum = 0, shelljsCmdTimeSum = 0

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

          shelljsExecTimeSum += shelljsExecTime
          shelloTimeSum += shelloTime
          shelljsCmdTimeSum += shelljsCmdTime
        })

        report('cat file1 file2', shelljsExecTimeSum, shelloTimeSum, shelljsCmdTimeSum, 'cat ---------------------')
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

        var shelljsExecTimeSum = 0, shelloTimeSum = 0

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

          shelljsExecTimeSum += shelljsExecTime
          shelloTimeSum += shelloTime
        })

        report('printf hello', shelljsExecTimeSum, shelloTimeSum)
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

        var shelljsExecTimeSum = 0, shelloTimeSum = 0

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

          shelljsExecTimeSum += shelljsExecTime
          shelloTimeSum += shelloTime
        })

        report('whoami', shelljsExecTimeSum, shelloTimeSum)
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

        var shelljsExecTimeSum = 0, shelloTimeSum = 0

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

          shelljsExecTimeSum += shelljsExecTime
          shelloTimeSum += shelloTime
        })

        report('git rev-parse --is-inside-work-tree', shelljsExecTimeSum, shelloTimeSum)
      })
    })
  })
})
