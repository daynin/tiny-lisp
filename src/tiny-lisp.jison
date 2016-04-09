/* lexical grammar */
%{
  const translator = require('./translator.js');
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
'def'                           return 'def'
'list'                          return 'list'
'if'                            return 'if'
'let'                           return 'let'
'set!'                          return 'set!'
'do'                            return 'do'
'print'                         return 'print'
'fn'                            return 'fn'
'or'                            return 'or'
'and'                           return 'and'
'not'                           return 'not'
'while'                         return 'while'
'conj'                          return 'conj'
'nth'                           return 'nth'
'map'                           return 'map'
'filter'                        return 'filter'
'reduce'                        return 'reduce'
'each'                          return 'each'
'require'                       return 'require'
\s+                             return 'space'
\"[^\"\n]*\"                    return 'string'
\;[^\n]*&                       return 'comment'
[a-zA-Z][a-zA-Z0-9?]*           return 'name'

/lex

%start file

%% /* language grammar */

operators
  : '+'
    { $$ = translator.add }
  | '-'
    { $$ = translator.substract }
  | '/'
    { $$ = translator.devide }
  | '*'
    { $$ = translator.multiply }
  | '>' '='
    { $$ = translator.greaterOrEqual }
  | '<' '='
    { $$ = translator.lessOrEqual }
  | '>'
    { $$ = translator.greater }
  | '<'
    { $$ = translator.less }
  | '='
    { $$ = translator.equal }
  | 'or'
    { $$ = translator.or}
  | 'and'
    { $$ = translator.and}
  | 'not'
    { $$ = translator.not }
  ;

standard_functions
  : conj
    { $$ = translator.conj }
  | nth
    { $$ = translator.nth }
  | map
    { $$ = translator.map }
  | filter
    { $$ = translator.filter }
  | reduce
    { $$ = translator.reduce }
  | each
    { $$ = translator.each }
  ;

value
  : string
  | expr
  | statement
  | number
    { $$ = +$1 }
  | '-' number
    { $$ = -$2 }
  | name
  | value space
  ;

values
  : value
    { $$ = [$1] }
  | values value
    { $$ = translator.collectArgs($1, $2)}
  ;

while_statement
  : '(' while space value value')'
    {$$ = { type: 'while', pred: $4, body: $5 }}
  ;

if_statement
  : '(' if space value value value ')'
    { $$ = { type: 'if', cond: $4, true: $5, false: $6} }
  | '(' if space value value ')'
    { $$ = { type: 'if', cond: $4, true: $5 } }
  ;

let_statement
  :'(' let '(' values ')' values'')'
    { $$ = { expr: $4, type: 'let', values: $6 }}
  |'(' let '(' values ')' space values ')'
    { $$ = { expr: $4, type: 'let', values: $7 }}
  |'(' let space '(' values ')' values ')'
    { $$ = { expr: $5, type: 'let', values: $7 }}
  |'(' let space '(' values ')' space values ')'
    { $$ = { expr: $5, type: 'let', values: $8 }}
  | list_statement
  ;

set_statement
  : '(' 'set!' value value ')'
    { $$ = { expr: $3, type: 'set', values: [$4]  } }
  | '(' 'set!' space  value value ')'
    { $$ = { expr: $4, type: 'set', values: [$5]  } }
  ;

require_statement
  : '(' require name string ')'
    { $$ = { type: 'require', module: $3, path: $4  } }
  ;

define_statement
  :'(' def space name space value')'
    { $$ = { expr: $4, type: 'var', values: [$6] }}
  |'(' def space expr space values')'
    { $$ = { expr: $4, type: 'function', values: $6 }; }
  ;

statement
  : define_statement
  | let_statement
  | if_statement
  | set_statement
  | while_statement
  ;

id
  : name
  | operators
  | standard_functions
  | space name
  | id space
  ;

simple_expr
  : '(' id ')'
    { $$ =  { id: $2, values: [] }}
  | '(' ')'
    { $$ =  { values: [] }}
  | '(' id values ')'
    { $$ =  { id: $2, values: $3 }}
  ;

fn_expr
  :'(' fn space expr space values')'
    { $$ = { expr: $4, type: 'fn', values: $6 }}
  |'(' fn expr space values')'
    { $$ = { expr: $3, type: 'fn', values: $5 }}
  |'(' fn expr values')'
    { $$ = { expr: $3, type: 'fn', values: $4 }}
  ;

list_expr
  : '(' list values ')'
    { $$ = `Array(${$3.map(translator.parse)})` }
  | '(' list space values ')'
    { $$ = `Array(${$4.map(translator.parse)})` }
  |'`' '(' values ')'
    { $$ = `Array(${$3.map(translator.parse)})` }
  ;

do_expr
  : '(' do values')'
    { $$ = { type: 'do', values: $3 }}
  | '(' do space values')'
    { $$ = { type: 'do', values: $4 }}
  ;

print_expr
  : '(' print space value ')'
    { $$ = { type: 'print', value: $4 } }
  ;

expr
  : simple_expr
  | fn_expr
  | list_expr
  | do_expr
  | print_expr
  ;

code
  : expr
    { $$ = translator.parse($1)}
  | statement
    { $$ = translator.parse($1) }
  | space
  | comment
    { $$ = '' }
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

