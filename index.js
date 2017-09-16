'use strict'

var cp = require('child_process')
var normaliseOptions = require('./js/normaliseOptions')

function shelljsExec(command, options) {

  options = normaliseOptions(options)

  var error, stdout, stderr, code, ok

  try {
    error = null
    stdout = cp.execSync(command, options)
    stderr = ''
    code = 0
    ok = true
  } catch (e) {
    error = e
    stdout = e.stdout
    stderr = e.stderr
    code = e.status || /* istanbul ignore next */ 1
    ok = false
  }

  return {
    error: error,
    stdout: stdout,
    stderr: stderr,
    code: code,
    ok: ok
  }
}

module.exports = shelljsExec
