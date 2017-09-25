'use strict'

function isObject(obj) {
  return obj !== null && typeof obj === 'object' && !Array.isArray(obj)
}

function toBoolean(bool) {
  if (bool === 'false') bool = false
  return !!bool
}

function normaliseOptions(options) {

  var DEFAULTS = require('./defaultOptions')

  if (!isObject(options)) {
    options = {}
  } else {

    if (typeof options.silent !== 'undefined') {
      options.silent = toBoolean(options.silent)
    }
  }

  options = Object.assign({}, DEFAULTS, options)

  if (options.silent && typeof options.stdio === 'undefined') {
    options.stdio = 'pipe'
  }

  return options
}

module.exports = normaliseOptions
