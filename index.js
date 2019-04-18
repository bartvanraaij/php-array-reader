const phpParser = require('php-parser'),
      fs = require('fs');

const readPhpArray = {

  fromFile: function(file) {
    const phpString = fs.readFileSync(file, 'utf8');
    return readPhpArray.fromString(phpString);
  },

  fromString: function(phpString){

    const parser = new phpParser({
      parser: {
        extractDoc: false,
        suppressErrors: true
      },
      ast: { withPositions: false },
    });

    phpString = phpString.trim();
    if(phpString.substr(0,5)!=='<?php') {
      phpString = '<?php \n'+phpString;
    }

    const ast = parser.parseCode(phpString);

    let phpObject = {};
    if (ast.kind === 'program') {

      ast.children.forEach(child => {

        if(child.kind==='expressionstatement' && child.expression.operator === '=' && child.expression.left.kind === 'variable' && child.expression.right.kind === 'array') {
          phpObject[child.expression.left.name] = readPhpArray.parseValue(child.expression.right);
        }
        else if(child.kind==='expressionstatement' && child.expression.kind === 'array'){
          phpObject = readPhpArray.parseValue(child.expression);
        }
        else if(child.kind === 'return' && child.expr.kind === 'array') {
          phpObject = readPhpArray.parseValue(child.expr);
        }

      });

    }
    return phpObject;
  },

  /**
   * Parse a PHP expression to JavaScript
   * @param  {Object} expr The AST PHP expression.
   * @return {*}           A JavaScript object or value.
   */
  parseValue: function(expr) {
    if(expr===null) return;
    switch(expr.kind) {
      case 'array':
        if (expr.items.length === 0) {
          return [];
        }
        const isKeyed = expr.items.every(item =>
          item === null || item.value === undefined || (item.key!==undefined && item.key !== null)
        );
        let items = expr.items.map(readPhpArray.parseValue).filter(itm => itm !== undefined);
        if (isKeyed) {
          items = items.reduce((acc, val) => Object.assign({}, acc, val), {})
        }
        return items;
      case 'entry':
        if (expr.key) {
          return {
            [readPhpArray.parseKey(expr.key)]: readPhpArray.parseValue(expr.value)
          }
        }
        return readPhpArray.parseValue(expr.value);
      case 'string':
        return expr.value;
      case 'number':
        return parseFloat(expr.value);
      case 'boolean':
        return expr.value;
      case 'identifier':
        if(expr.name.name==='null') {
          return null;
        }
        break;
    }
  },

  /**
   * Parse a PHP expression to JavaScript
   * @param  {Object} expr The AST PHP expression.
   * @return {*}           A JavaScript object or value.
   */
  parseKey: function(expr) {
    switch(expr.kind) {
      case 'string':
        return expr.value;
      case 'number':
        return parseFloat(expr.value);
      case 'boolean':
        return expr.value ? 1 : 0;
      default:
        return null;
    }
  }

};

module.exports = readPhpArray;