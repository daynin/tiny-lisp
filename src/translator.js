const runtime = require('./runtime');
const stdlib = require('./stdlib');

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

module.exports = Object.assign({},
  stdlib, {
    collectArgs,
    parse,
    prepareFunctionName,
    runtime,
  });

