'use strict'

// expect
var chai = require('chai')
var expect = chai.expect

// others
var EOL = require('os').EOL

//custom
function range(num) {
  var range = []
  for (var i = 0; i < num; i++) {
    range.push(i)
  }
  return range
}

var testImports = {
  expect: expect,
  EOL: EOL,
  range: range
}

module.exports = testImports
