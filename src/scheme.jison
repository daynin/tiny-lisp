/* lexical grammar */
%{
  const helper = require('./helper.js');
%}

%lex
%%
<<EOF>>                         return 'end_of_file'
'('                             return '('
')'                             return ')'
'+'                             return '+'
'-'                             return '-'
'*'                             return '*'
'/'                             return '/'
'define'                        return 'define'
'if'                            return 'if'
'display'                       return 'display'
'lambda'                        return 'lambda'
\s+                             return 'space'
\"[^\"\n]*\"                    return 'string'
[a-zA-Z][a-zA-Z0-9?]*           return 'name'
[0-9]+("."[0-9]+)?\b            return 'number'

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
  | number
    { $$ = +$1 }
  | expr
  | name
  ;

values
  : value
    { $$ = [$1] }
  | values space
  | values value
    { $$ = helper.collectArgs($1, $2)}
  ;

definition
  :'(' define space name space value')'
    { $$ = { name: $4, type: 'var', values: [$6] }}
  |'(' define space expr space values')'
    { $$ = { name: $4, type: 'function', values: $6 }}
  ;

id
  : name
  | operators
  | space name
  | id space
  ;

expr
  : '(' id ')'
    { $$ =  { id: $2 }}
  | '(' id values ')'
    { $$ =  { id: $2, values: $3 }}
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

