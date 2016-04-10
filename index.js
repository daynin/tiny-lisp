#! /usr/bin/env node

const fs = require('fs');
const rl = require("readline");
const prompts = rl.createInterface(process.stdin, process.stdout);
const fileName = process.argv[2];
const i = require('./lib/interpreter.js');

const repl = () => {
  prompts.question('> ', code => {
    try {
      const result = i.exec(code);
      console.log(result);
    } catch(err){
      console.error(err);
    }
    repl();
  });
}

const execFile = () => {
  fs.readFile(fileName, 'utf8', (err, data) => {
    if (!err) {
      console.log(i.exec(data));
    } else {
      console.error(err.message);
    }
  });
}

if (fileName) {
  execFile();
} else {
  repl();
}

