'use strict';

const phpParser = require('php-parser');

/**
 * Parse a string containing a PHP array into a JS object
 * @param {string} phpString - String containing a PHP array
 * @return {Object} The parsed object.
 */
function fromString(phpString) {

  const parser = new phpParser({
    parser: {
      extractDoc: false,
      suppressErrors: true
    },
    ast: {withPositions: false},
  });

  phpString = phpString.trim();
  if (phpString.substr(0, 5) !== '<?php') {
    phpString = '<?php \n' + phpString;
  }

  const ast = parser.parseCode(phpString);

  let phpObject = {};
  if (ast.kind === 'program') {

    ast.children.forEach(child => {

      if (child.kind === 'expressionstatement' && child.expression.operator === '=' && child.expression.left.kind === 'variable' && child.expression.right.kind === 'array') {
        phpObject[child.expression.left.name] = parseValue(child.expression.right);
      } else if (child.kind === 'expressionstatement' && child.expression.kind === 'array') {
        phpObject = parseValue(child.expression);
      } else if (child.kind === 'return' && child.expr.kind === 'array') {
        phpObject = parseValue(child.expr);
      }

    });

  }
  return phpObject;
}

/**
 * Parse a PHP expression to JavaScript
 * @private
 * @param  {Object} expr The AST PHP expression.
 * @return {*}           A JavaScript object or value.
 */
function parseValue(expr) {
  if (expr === null) return;
  switch (expr.kind) {
    case 'array':
      if (expr.items.length === 0) {
        return [];
      }
      const isKeyed = expr.items.every(item =>
        item === null || item.value === undefined || (item.key !== undefined && item.key !== null)
      );
      let items = expr.items.map(parseValue).filter(itm => itm !== undefined);
      if (isKeyed) {
        items = items.reduce((acc, val) => Object.assign({}, acc, val), {})
      }
      return items;
    case 'entry':
      if (expr.key) {
        return {
          [parseKey(expr.key)]: parseValue(expr.value)
        }
      }
      return parseValue(expr.value);
    case 'string':
      return expr.value;
    case 'number':
      return parseFloat(expr.value);
    case 'boolean':
      return expr.value;
    case 'nullkeyword':
      return null;
    case 'identifier':
      if (expr.name.name === 'null') {
        return null;
      }
      break;
  }
}

/**
 * Parse a PHP expression to JavaScript
 * @private
 * @param  {Object} expr The AST PHP expression.
 * @return {*}           A JavaScript object or value.
 */
function parseKey(expr) {
  switch (expr.kind) {
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

module.exports = {fromString};
