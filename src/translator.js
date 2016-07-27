'use strict';
const runtime = `
'use strict';
function compare(arr, pred){
  var res = true;
  for(var i = 0; i < arr.length; i++){
    if(arr[i + 1] != null && res){
      res = res && pred(arr[i], arr[i + 1]);
    } else {
      break;
    }
  }
  return res;
}
function isFun(obj) { return typeof obj === 'function'; }
function add(a, b){ return a + b };
function substract(a, b){ return a - b };
function multiply(a, b){ return a * b };
function devide(a, b){ return a / b };
function or(a, b){ return a || b };
function and(a, b){ return a && b };
function greater(arr){ return compare(arr, function(a, b){ return a > b})};
function less(arr){ return compare(arr, function(a, b){ return a < b})};
function greaterOrEqual(arr){ return compare(arr, function(a, b){ return a >= b})};
function lessOrEqual(arr){ return compare(arr, function(a, b){ return a <= b})};
function equal(arr){ return compare(arr, function(a, b){ return a == b})};
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
})`;
const substract = `(function(){
 return getArrayFromArgs(arguments).reduce(substract);
})`;
const multiply = `(function(){
 return getArrayFromArgs(arguments).reduce(multiply);
})`;
const devide = `(function(){
 return getArrayFromArgs(arguments).reduce(devide);
})`;
const or = `(function(){
 return getArrayFromArgs(arguments).reduce(or);
})`;
const and = `(function(){
 return getArrayFromArgs(arguments).reduce(and);
})`;
const not = `(function(){
 return !getArrayFromArgs(arguments)[0];
})`;
const greater = `(function(){
 return greater(getArrayFromArgs(arguments));
})`;
const less = `(function(){
 return less(getArrayFromArgs(arguments));
})`;
const greaterOrEqual = `(function(){
 return greaterOrEqual(getArrayFromArgs(arguments));
})`;
const lessOrEqual = `(function(){
 return lessOrEqual(getArrayFromArgs(arguments));
})`;
const equal = `(function(){
 return equal(getArrayFromArgs(arguments));
})`;
const conj = `
(function(array, elem){
  if(Array.isArray(array)){
    array.push(elem);
    return array;
  } else {
   throw new Error(array + ' is not an array');
  }
})`;

const nth = `
(function(array, index){
  if(Array.isArray(array)){
    return array[index];
  } else if(typeof array === "string"){
    return array.substring(index, index + 1);
  } else {
   throw new Error(array + ' is not an array or string');
  }
})`;

const map = `
(function(fn, array){
  if(Array.isArray(array)){
    return array.map(fn);
  } else {
   throw new Error(array + ' is not an array');
  }
})`;

const filter = `
(function(fn, array){
  if(Array.isArray(array)){
    return array.filter(fn);
  } else {
   throw new Error(array + ' is not an array');
  }
})`;

const reduce = `
(function(fn, array){
  if(Array.isArray(array)){
    return array.reduce(fn);
  } else {
   throw new Error(array + ' is not an array');
  }
})`;

const each = `
(function(fn, array){
  if(Array.isArray(array)){
    return array.forEach(fn);
  } else {
   throw new Error(array + ' is not an array');
  }
})`;

const _parseIf = def => {
  if (def.false) {
    return `(function(){
if (${parse(def.cond)}){
  return ${parse(def.true)}
}else {
  return ${parse(def.false)}
}
})()`
  } else {
    return `(function(){
if (${parse(def.cond)}){
  return ${parse(def.true)}
}})()`
  }
}

const _parseFnExpression = expr => {
  if (expr.type === 'fn') {
    if (expr.expr.values.length > 0) {
      return `function(${[expr.expr.id].concat(expr.expr.values)}){return ${expr.values.map(parse)}}`;
    } else {
      return `function(${expr.expr.id}){return ${expr.values.map(parse)}}`;
    }
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
    return def.values.map(_parseTypedExpression).join('');
  } else {
    return def.values.map(parse);
  }
}

const _parseLetDefinitions = def => {
  def.expr = _prepareLetVariables(def.expr);
  const vars = def.expr.map(_parseTypedExpression).join('');
  let expr = _prepareLetSubDefinitions(def);
  let lastExpr;
  if (Array.isArray(expr)) {
    lastExpr = expr.pop();
  }

  return `;${def.internal ? 'return' : ''}(function(){${vars}\n${expr};\n ${lastExpr ? 'return ' + lastExpr : ''}})()`
}

const _parseSetDefinition = def => {
  return `(function(){${def.expr} = ${def.values.map(parse)[0]};return ${def.expr}})()\n`;
}

const _parseDoState = state => {
  const lastExpr = state.values.pop();
  const calls = state.values.map(parse).join(';');
  const res = `(function(){${calls}; return ${parse(lastExpr)}})()`;
  return res;
}

const _parseWhileState = state => {
  return `while(${parse(state.pred)}){${parse(state.body)}}`
}

const _parseRequireState = state => {
  return `const ${state.module} = require(${state.path});`
}

const _parsePrintState = state => {
  return `console.log(${parse(state.value)})`;
}

const _parseTypedExpression = expr => {
  if (expr.type === 'var') {
    return `let ${expr.expr} = ${parse(expr.values[0])};`
  } else if (expr.type === 'function') {
    return `function ${expr.expr.id}(${expr.expr.values}){ return ${parse(expr.values[0])} };`;
  } else if (expr.type === 'let') {
    return _parseLetDefinitions(expr);
  } else if (expr.type === 'if') {
    return _parseIf(expr);
  } else if (expr.type === 'fn') {
    return _parseFnExpression(expr);
  } else if (expr.type === 'set') {
    return _parseSetDefinition(expr);
  } else if (expr.type === 'do') {
    return _parseDoState(expr);
  } else if (expr.type === 'while') {
    return _parseWhileState(expr);
  } else if (expr.type === 'require') {
    return _parseRequireState(expr);
  } else if (expr.type === 'print') {
    return _parsePrintState(expr);
  }
}

const _constructFunctionCall = expr => {
  if (expr.values.length > 1) {
    return `${expr.id}(${expr.values.map(parse)})`;
  } else if (expr.values.length === 1) {
    return `${expr.id}(${expr.values.map(parse)})`;
  } else {
    return `isFun(${expr.id}) ? ${expr.id}() : ${expr.id}`
  }
}

const collectArgs = (values, value) => {
  if (Array.isArray(value)) {
    values = values.concat(value);
  } else {
    values.push(value);
  }
  return values;
}

const prepareFunctionName = expr => {
  expr.values = expr.values ? expr.values : [];
  return expr;
}

const parse = expr => {
  if (expr.type) {
    return _parseTypedExpression(expr);
  } else if (expr.values) {
    return _constructFunctionCall(expr);
  } else {
    return expr;
  }
}

module.exports = {
  collectArgs,
  add,
  substract,
  multiply,
  devide,
  or,
  and,
  not,
  greater,
  less,
  greaterOrEqual,
  lessOrEqual,
  equal,
  parse,
  prepareFunctionName,
  runtime,
  conj,
  nth,
  map,
  filter,
  reduce,
  each
}

