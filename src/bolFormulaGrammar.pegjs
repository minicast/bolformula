/* jshint ignore: start */
/* eslint-disable */
/*
 * Boolean Logic Formula Grammar
 * ============================
 *
 * Accepts BOL expressions and parses them in JSON format.
 *
 * (see an example at the end of the file)
 *
 */

{
  function combine(first, rest, combiners) {
    var result = first, i;

    for (i = 0; i < rest.length; i++) {
      result = combiners[rest[i][1]](result, rest[i][3]);
    }

    return result;
  }
}

formula 'forumula' = junction / negation / atom

junction 'junction'
  = '(' _ first:formula rest:(_ ( '|' / '&' / '>' / '^' ) _ formula)* _ ')' {
    return combine(first, rest, {
      '&': function(left, right) {
        return {
          junctor: "and",
          left: left,
          right: right,
        }
      },
      '|': function(left, right) {
        return {
          junctor: "or",
          left: left,
          right: right,
        }
      },
      '>': function(left, right) {
        return {
          junctor: "if-then",
          left: left,
          right: right,
        }
      },
      '^': function(left, right) {
        return {
          junctor: "if-and-only-if",
          left: left,
          right: right,
        }
      },
    });
  }

negation 'negation'
  = _ '~' _ form:formula _ {
    return {
      negation: "not",
      content: form
    }
  }

atom 'atom'
  = nularyAtom

nularyAtom 'nularyAtom'
  = rel:relation _ ( ( '(' _ ')' ) / _ ) _ {
    return {
      relation: rel,
      arity: 0,
    }
  }

term 'term' = variable

relation 'relation' // propositional symbols
  = relationString:[P-Sp-s]+ index:index {
    return relationString.join('') + index
  }

variable 'variable'
  = variableString:[ux-z]+ index:index {
    return variableString.join('') + index
  }

index 'index' = digits:[0-9]* {
  return digits.join('')
}

_ 'whitespace' = [ \t\n\r]*

/* EXAMPLE:

the BOL formula ... :



... which can be also written more explicitly as ... :



... gets parsed in the following JSON format:



*/
