var cp = require('child_process')

function shello(command, options) {
  var out, err, code, ok
  try {
    out = cp.execSync(command, options)
    code = 0
    ok = true
  } catch (e) {
    err = e
    code = 1
    ok = false
  }
  return {
    out: out,
    err: err,
    code: code,
    ok: ok
  }
}

module.exports = shello
