const { loadModule } = require('../../util/modules');

module.exports = {
  conj: loadModule('./lib/stdlib/collections/conj.js'),
  nth: loadModule('./lib/stdlib/collections/nth.js'),
  map: loadModule('./lib/stdlib/collections/map.js'),
  filter: loadModule('./lib/stdlib/collections/filter.js'),
  reduce: loadModule('./lib/stdlib/collections/reduce.js'),
  each: loadModule('./lib/stdlib/collections/each.js'),
}
