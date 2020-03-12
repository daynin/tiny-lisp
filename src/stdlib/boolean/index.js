const { loadModule } = require('../../util/modules');

module.exports = {
  or: loadModule('./lib/stdlib/boolean/or.js'),
  and: loadModule('./lib/stdlib/boolean/and.js'),
  not: loadModule('./lib/stdlib/boolean/not.js'),
  greater: loadModule('./lib/stdlib/boolean/greater.js'),
  less: loadModule('./lib/stdlib/boolean/less.js'),
  greaterOrEqual: loadModule('./lib/stdlib/boolean/greater-or-equal.js'),
  lessOrEqual: loadModule('./lib/stdlib/boolean/less-or-equal.js'),
  equal: loadModule('./lib/stdlib/boolean/equal.js'),
}
