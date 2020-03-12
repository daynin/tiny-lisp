const fs = require('fs');

const loadModules = (path, ignoreFiles) =>
  fs.readdirSync(path)
    .filter(path => ignoreFiles.every(ignoredPath => !path.includes(ignoredPath)))
    .map(fileName => fs.readFileSync(`${path}/${fileName}`))
    .join(';');

const loadModule = path => {
  const content = fs.readFileSync(path).toString().trim();

  return content.endsWith(';')
    ? content.slice(0, content.length - 1)
    : content;
};

module.exports = {
  loadModule,
  loadModules,
}
