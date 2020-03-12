const fs = require('fs');
const { resolve } = require('path');

const resolvePath = path => resolve(__dirname, '../../', path);

const loadModules = (path, ignoreFiles) =>
  fs.readdirSync(resolvePath(path))
    .filter(path => ignoreFiles.every(ignoredPath => !path.includes(ignoredPath)))
    .map(fileName => fs.readFileSync(resolvePath(`${path}/${fileName}`)))
    .join(';');

const loadModule = path => {
  const content = fs.readFileSync(resolvePath(path)).toString().trim();

  return content.endsWith(';')
    ? content.slice(0, content.length - 1)
    : content;
};

module.exports = {
  loadModule,
  loadModules,
}
