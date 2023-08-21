# php-array-reader

[![Node.js CI](https://github.com/bartvanraaij/php-array-reader/actions/workflows/node.js.yml/badge.svg)](https://github.com/bartvanraaij/php-array-reader/actions/workflows/node.js.yml)

This small JS utility reads PHP strings containing arrays and returns a JavaScript object. 

It uses [glayzzle/php-parser](https://github.com/glayzzle/php-parser) to parse PHP into AST and uses that 
info to extract arrays.  
It supports both indexed and associative arrays (i.e. lists and dictionaries/maps) and array, string, numeric and null values.
Inline function calls are not evaluated but returned as raw strings. See the example below.

## Installation

This library is distributed with [npm](https://www.npmjs.com/package/php-array-reader) :

```sh
npm install php-array-reader --save
```

## Usage

```js
import { fromString } from 'php-array-reader';

const phpString = `[
  'key' => 'string',
  'list' => [
    'first',
    'second'
  ],
  'dictionary' => [
    'foo' => 'bar',
    'hello' => 'world'
  ],
  'also_supports' => null,
  'and_numeric' => 42,
  'what_about' => true,
  'or' => false,
  'func' => strtoupper('abc'),
]`;
const data = fromString(phpString); 
```
`data` will be this JS object:
```js
{
  key: 'string',
  list: ['first', 'second'],
  dictionary: {
    foo: 'bar',
    hello: 'world'
  },
  also_supports: null,
  and_numeric: 42,
  what_about: true,
  or: false,
  func: "strtoupper('abc')"
}
```

### With a PHP file

Use [`fs.readFileSync`](https://nodejs.org/api/fs.html#fsreadfilesyncpath-options) or another file reading library to read the file, and pass 
that string into `fromString`, e.g.:
```js
import { fromString } from 'php-array-reader';
import { readFileSync } from 'node:fs';

const phpFile = './file.php';
const phpString = readFileSync(phpFile);

const data = fromString(phpFile);
```

> [!NOTE]
> Version `1.x` of this library included a [`fromFile` method](https://github.com/bartvanraaij/php-array-reader/blob/a3f48acdef4eace2106ac40fa3c4593ab196dc1c/index.js#L6) 
> that allowed you to read a file directly. This has been removed in version `2.x` forward, because that method was a scope creep.

The PHP file can either return a single array, e.g.:
```php
<?php
return [
   'key' => 'string',
   'list' => [
     'first',
     'second'
   ],
   'dictionary' => [
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
    'dictionary' => [
        'foo' => 'bar',
        'hello' => 'world'
    ]
];
$second = [
    'list' => [
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
    dictionary: {
      foo: 'bar', 
      hello: 'world'
    }
  },
  second: {
    list: ['first', 'second'],
    also_supports: null,
    and_numeric: 42
  }
}
```
