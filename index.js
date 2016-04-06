const fs = require('fs');
const fileName = process.argv[2];
const i = require('./lib/interpreter.js');

fs.readFile(fileName, 'utf8', (err, data) => {
  if (!err) {
    console.log(i.exec(data));
  } else {
    console.log(err.message);
  }
});

