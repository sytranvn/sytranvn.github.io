%{
#include <stdio.h>

%}

%token INTEGER
%left '+' '-'
%left '*' '/'

%%

program:
                program expression '\n'          { printf("%d\n", $2); }
|               /* NOTHING */
;

expression:
                INTEGER
|               expression '+' expression        { $$ = $1 + $3; }
|               expression '-' expression        { $$ = $1 - $3; }
|               expression '*' expression        { $$ = $1 * $3; }
|               expression '/' expression        { $$ = $1 / $3; }
;
