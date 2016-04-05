/* lexical grammar */
%{
  const helper = require('./helper.js');
%}

%lex
%%
<<EOF>>                         return 'end_of_file'
[0-9]+("."[0-9]+)?\b            return 'number'
'('                             return '('
')'                             return ')'
'+'                             return '+'
'-'                             return '-'
'*'                             return '*'
'/'                             return '/'
'<'                             return '<'
'>'                             return '>'
'>='                            return '>='
'<='                            return '<='
'='                             return '='
'`'                             return '`'
'define'                        return 'define'
'list'                          return 'list'
'if'                            return 'if'
'let'                           return 'let'
'display'                       return 'display'
'lambda'                        return 'lambda'
\s+                             return 'space'
\"[^\"\n]*\"                    return 'string'
[a-zA-Z][a-zA-Z0-9?]*           return 'name'

/lex

%start file

%% /* language grammar */

operators
  : '+'
    { $$ = helper.add }
  | '-'
    { $$ = helper.substract }
  | '/'
    { $$ = helper.devide }
  | '*'
    { $$ = helper.multiply }
  ;

value
  : string
  | expr
  | definition
  | number
    { $$ = +$1 }
  | name
  | value space
  ;

values
  : value
    { $$ = [$1] }
  | values value
    { $$ = helper.collectArgs($1, $2)}
  ;

if_state
  : '(' if space value value value ')'
    { $$ = { type: 'if', cond: $4, true: $5, false: $6} }
  ;

let_def
  :'(' let '(' values ')' values'')'
    { $$ = { expr: $4, type: 'let', values: $6 }}
  |'(' let '(' values ')' space values ')'
    { $$ = { expr: $4, type: 'let', values: $7 }}
  |'(' let space '(' values ')' values ')'
    { $$ = { expr: $5, type: 'let', values: $7 }}
  |'(' let space '(' values ')' space values ')'
    { $$ = { expr: $5, type: 'let', values: $8 }}
  | list_state
  ;

definition
  :'(' define space name space value')'
    { $$ = { expr: $4, type: 'var', values: [$6] }}
  |'(' define space expr space values')'
    { $$ = { expr: $4, type: 'function', values: $6 }; }
  | let_def
  | if_state
  ;

id
  : name
  | operators
  | space name
  | id space
  ;

expr
  : '(' id ')'
    { $$ =  { id: $2, values: [] }}
  | '(' id values ')'
    { $$ =  { id: $2, values: $3 }}
  |'(' lambda space expr space values')'
    { $$ = { expr: $4, type: 'lambda', values: $6 }}
  |'(' lambda expr space values')'
    { $$ = { expr: $3, type: 'lambda', values: $5 }}
  |'(' lambda expr values')'
    { $$ = { expr: $3, type: 'lambda', values: $4 }}
  | '(' list values ')'
    { $$ = `Array(${$3.map(helper.parseExpr)})` }
  | '(' list space values ')'
    { $$ = `Array(${$4.map(helper.parseExpr)})` }
  |'`' '(' values ')'
    { $$ = `Array(${$3.map(helper.parseExpr)})` }
  ;

code
  : expr
    { $$ = helper.parseExpr($1)}
  | definition
    { $$ = helper.parseDefinition($1) }
  | space
  ;

program
  : code
  | program code
    { $$ = $1 + $2 }
  ;

file
  : program end_of_file
    { return $1 }
  ;

