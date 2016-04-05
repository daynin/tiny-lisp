'use strict';
const runtime = `
'use strict';
function add(a, b){ return a + b };
function substract(a, b){ return a - b };
function multiply(a, b){ return a * b };
function devide(a, b){ return a / b };
function getArrayFromArgs(args){
var result = [];
  for(var i = 0; i < args.length; i++){
    result.push(args[i]);
  }
  return result;
}
`;

const add = `(function(){
 return getArrayFromArgs(arguments).reduce(add);
})`
const substract = `(function(){
 return getArrayFromArgs(arguments).reduce(substract);
})`
const multiply = `(function(){
 return getArrayFromArgs(arguments).reduce(multiply);
})`
const devide = `(function(){
 return getArrayFromArgs(arguments).reduce(devide);
})`

const _call = expr => {}

const _parseTypedExpression = expr => {
  if (expr.type === 'lambda') {
    return `function(${expr.expr.id}){return ${parseExpr(expr.values[0])}}`;
  }
}

const _prepareLetVariables = expr => {
  return expr.map(v => {
    return {
      expr: v.id,
      values: v.values,
      type: 'var'
    }
  });
}

const _prepareLetSubDefinitions = def => {
  if (def.values.some(v => v.type != null)) {
    def.values.map(v => {
      v.internal = true;
    });
    return def.values.map(parseDefinition).join('');
  } else {
    return def.values.map(parseExpr);
  }
}

const _parseLetDefinitions = def => {
  def.expr = _prepareLetVariables(def.expr);
  const vars = def.expr.map(parseDefinition).join('');
  let expr = _prepareLetSubDefinitions(def);
  let lastExpr;
  if (Array.isArray(expr)) {
    lastExpr = expr.pop();
  }

  return `;${def.internal ? 'return' : ''}(function(){${vars}\n${expr};\n ${lastExpr ? 'return ' + lastExpr : ''}})()`
}

const collectArgs = (values, value) => {
  if (Array.isArray(value)) {
    values = values.concat(value);
  } else {
    values.push(value);
  }
  return values;
}

const parseExpr = expr => {
  if (expr.type === 'lambda') {
    return _parseTypedExpression(expr);
  } else if (expr.values) {
    if (expr.values.length > 1) {
      return `${expr.id}(${expr.values.map(parseExpr)})`;
    } else if (expr.values.length === 1) {
      return `${expr.id}(${expr.values.map(parseExpr)})`;
    } else {
      return `${expr.id}()`;
    }
  } else if (expr.id) {
    return `${expr.id}`;
  } else {
    return expr;
  }
}

const parseDefinition = def => {
  if (def.type === 'var') {
    return `let ${def.expr} = ${parseExpr(def.values[0])};`
  } else if (def.type === 'function') {
    return `let ${def.expr.id} = function(${def.expr.values}){ return ${parseExpr(def.values[0])} };`;
  } else if (def.type === 'let') {
    return _parseLetDefinitions(def);
  }
}

module.exports = {
  collectArgs,
  add,
  substract,
  multiply,
  devide,
  parseExpr,
  parseDefinition,
  runtime
}

