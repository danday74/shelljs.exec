# shelljs.exec

<br>[![Linux Build](https://img.shields.io/travis/danday74/shelljs.exec/master.svg?label=linux)](https://travis-ci.org/danday74/shelljs.exec)
[![Windows Build](https://img.shields.io/appveyor/ci/danday74/shelljs-exec/master.svg?label=windows)](https://ci.appveyor.com/project/danday74/shelljs-exec)
[![Coverage Status](https://coveralls.io/repos/github/danday74/shelljs.exec/badge.svg)](https://coveralls.io/github/danday74/shelljs.exec)
<br>[![npm](https://img.shields.io/npm/v/shelljs.exec.svg)](https://www.npmjs.com/package/shelljs.exec)
[![Dependencies Status](https://david-dm.org/danday74/shelljs.exec/status.svg)](https://david-dm.org/danday74/shelljs.exec)
[![npm](https://img.shields.io/npm/dm/shelljs.exec.svg)](https://www.npmjs.com/package/shelljs.exec)
[![node](https://img.shields.io/node/v/shelljs.exec.svg)](https://www.npmjs.com/package/shelljs.exec)

**Replacement for shelljs' slow exec method - benchmarked 20x faster**



<br>

## Introduction

[shelljs](https://www.npmjs.com/package/shelljs) is **FAST** &nbsp;![FAST](images/fast.png "FAST")&nbsp; but its exec method is **SLOW** &nbsp;![SLOW](images/slow.png "SLOW")

- [x] Use this module instead of shelljs' exec method for speeds [20x faster](#benchmarks)

- [x] Continue to use shelljs' other methods as they are lightning fast (e.g. shelljs.echo shelljs.which shelljs.cat etc)

This module offers a shelljs.exec like interface and is a zero-dependency module



<br>

## Usage

```npm install --save shelljs.exec```

This module takes 2 arguments, the command to execute and an [options object](#options-object)

```javascript 1.5
var exec = require('shelljs.exec')
var cmdObj = exec('echo hello', {silent: true})
```

Continuing from the code above, the resulting JSON looks like:

```javascript 1.5
var assert = require('assert')
assert.deepEqual(cmdObj, {
  error: null,
  stdout: 'hello\n',
  stderr: '',
  code: 0,
  ok: true
})
```



<br>

## Options object

Available options:

* `encoding`: Defaults to 'utf8'

* `silent`: Do not echo any output to console, defaults to false

* and any option available to Node.js' [child_process.execSync](https://nodejs.org/api/child_process.html#child_process_child_process_execsync_command_options)

When the `stdio` option of child_process.execSync is provided, it overrides `silent`



<br>

## Benchmarks

[Logs for benchmarks are here](https://travis-ci.org/danday74/shelljs.exec) and [specs are here](test/benchmarks/benchmarks.spec.js)

Generally speaking, on Linux shelljs.exec (this module) is 20x faster and on Windows 5x faster than shelljs' exec method.

However, shelljs supported commands, where available, are much faster than both. Use this module where no equivalent shelljs supported command is available.

These tables compare average command execution times based on 1000 test runs:

##### Linux (Travis CI) Node v6

![Linux benchmarks](images/linux.png "Linux (Travis CI) Node v6")

##### Windows (GIT bash) Node v6.10.0

![Windows benchmarks](images/windows.png "Windows (GIT bash) Node v6.10.0")



<br>

## Limitations

* No support for chaining (unlike shelljs)

* Synchronous execution only (but feel free to wrap with a callback or promise)



<br>

## Author says

But as the days of Noah were, so also will the coming of the Son of Man be. For as in the days before the flood, they were eating and drinking, marrying and giving in marriage, until the day that Noah entered the ark, and did not know until the flood came and took them all away, so also will the coming of the Son of Man be.

[Matthew 24:37-39](https://www.biblegateway.com/passage/?search=Matthew+24%3A37-39&version=NKJV)



<br><br><br><br><br>
