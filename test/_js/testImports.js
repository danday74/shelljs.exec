'use strict'

// expect sinon

var chai = require('chai')
var sinon = require('sinon')
var sinonChai = require('sinon-chai')
var expect = chai.expect
chai.use(sinonChai)

// others

var cp = require('child_process')
var EOL = require('os').EOL

// custom

var DEFAULTS = require('../../js/normaliseOptions/defaultOptions')

function range(num) {
  var range = []
  for (var i = 0; i < num; i++) {
    range.push(i)
  }
  return range
}

var testImports = {
  expect: expect,
  sinon: sinon,
  cp: cp,
  EOL: EOL,
  DEFAULTS: DEFAULTS,
  range: range
}

module.exports = testImports
