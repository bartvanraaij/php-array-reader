# php-array-reader

[![Node.js CI](https://github.com/bartvanraaij/php-array-reader/actions/workflows/node.js.yml/badge.svg)](https://github.com/bartvanraaij/php-array-reader/actions/workflows/node.js.yml)

This small JS utility reads PHP files and strings containing arrays and returns a JavaScript object. 

It uses [glayzzle/php-parser](https://github.com/glayzzle/php-parser) to parse PHP into AST and uses that 
info to extract arrays.  
It supports both indexed and associative arrays and array, string, numeric and null values.

## Installation

This library is distributed with [npm](https://www.npmjs.com/package/php-array-reader) :

```sh
npm install php-array-reader --save
```

## Usage

### With a PHP string
```js
const phpArrayReader = require('php-array-reader');

const phpString = `[
  'key' => 'string',
  'indexed_array' => [
    'first',
    'second'
  ],
  'associative_array' => [
    'foo' => 'bar',
    'hello' => 'world'
  ],
  'also_supports' => null,
  'and_numeric' => 42
]`;
const data = phpArrayReader.fromString(phpString); 
```
`data` will be this JS object:
```js
{
  key: 'string',
  indexed_array: ['first', 'second'],
  associative_array: {
    foo: 'bar',
    hello: 'world'
  },
  also_supports: null,
  and_numeric: 42
}
```

### With a PHP file
```js
const phpArrayReader = require('php-array-reader');

const phpFile = './file.php';
const data = phpArrayReader.fromFile(phpFile);
```

The PHP file can either return a single array, e.g.:
```php
<?php
return [
   'key' => 'string',
   'indexed_array' => [
     'first',
     'second'
   ],
   'associative_array' => [
     'foo' => 'bar',
     'hello' => 'world'
   ],
   'also_supports' => null,
   'and_numeric' => 42
];
```

This will have the same result as the `fromString` example above.

Or the PHP file may consist of multiple assigned arrays, e.g.:
```php
<?php
$first = [
    'key' => 'string',
    'associative_array' => [
        'foo' => 'bar',
        'hello' => 'world'
    ]
];
$second = [
    'index_array' => [
        'first','second'
    ],
    'also_supports' => null,
    'and_numeric' => 42  
];
```

This will return a JS object with the variable names as the first level keys:
```js
{
  first: {
    key: 'string',
    associative_array: {
      foo: 'bar', 
      hello: 'world'
    }
  },
  second: {
    index_array: ['first', 'second'],
    also_supports: null,
    and_numeric: 42
  }
}
```
You can then of course also use destructuring to assign the results to two variables:
```js
const phpArrayReader = require('php-array-reader');

const phpFile = './file.php';
const { first, second } = phpArrayReader.fromFile(phpFile);
```

