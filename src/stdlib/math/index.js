const { loadModule } = require('../../util/modules');

module.exports = {
  add: loadModule('./lib/stdlib/math/add.js'),
  substract: loadModule('./lib/stdlib/math/substract.js'),
  multiply: loadModule('./lib/stdlib/math/multiply.js'),
  devide: loadModule('./lib/stdlib/math/devide.js'),
}
