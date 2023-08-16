# php-array-reader

[![Node.js CI](https://github.com/bartvanraaij/php-array-reader/actions/workflows/node.js.yml/badge.svg)](https://github.com/bartvanraaij/php-array-reader/actions/workflows/node.js.yml)

This small JS utility reads PHP strings containing arrays and returns a JavaScript object. 

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

Use `fs` or another file reading library to read the file, and pass that info into `fromString`, e.g.:
```js
const phpArrayReader = require('php-array-reader');

const phpFile = './file.php';
const phpString = fs.readFileSync(phpFile, 'utf8');

const data = phpArrayReader.fromFile(phpFile);
```

> [!NOTE]
> Version `1.x` of this library included a [`fromFile` method](https://github.com/bartvanraaij/php-array-reader/blob/a3f48acdef4eace2106ac40fa3c4593ab196dc1c/index.js#L6) 
> that allowed you to read a file directly. This has been removed in version `2.x` forward.


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
