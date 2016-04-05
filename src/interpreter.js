const parser = require('./scheme.js');
const helper = require('./helper.js');

const exec = code => {
  try {
    return eval(helper.runtime + parser.parse(code));
  } catch (err) {
    console.log(err.message);
  }
}

module.exports = {
  exec
}

