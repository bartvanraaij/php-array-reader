
const mockFs = require('mock-fs');
const phpArrayReader = require('./index');

const indexStr = `[
    'foo', 'bar', 'baz'
]`;
const associativeStr = `[
  'foo' => 'bar',
  'hello' => 'world'
]`;
const valueTypesStr = `[
  'arrayvalue' => [
    'hello', 'world'
  ],
  'stringvalue' => 'foo',
  'numbervalue' => 42,
  'decimalvalue' => 4.2,
  'nullvalue' => null
]`;
const multidimensionalStr = `[
  'first' => [
    'second' => [
      'third' => 1
    ],
    'fourth' => 4
  ]
]`;

const multipleStr = `
  $first = ['foo', 'bar'];
  $second = ['hello', 'world'];
`;

mockFs({
  'indexed.php': `<?php \n return ${indexStr}`,
  'associative.php': `<?php \n return ${associativeStr}`,
  'value-types.php': `<?php \n return ${valueTypesStr}`,
  'multidimensional.php': `<?php \n return ${multidimensionalStr}`,
  'multiple.php': `<?php \n  ${multipleStr}`
});



afterAll(() => {
  mockFs.restore();

});

// jest.mock('fs');

test('indexed array from string', () => {

  const data = phpArrayReader.fromString(indexStr);
  expect(data).toEqual([
    'foo', 'bar', 'baz'
  ])

});

test('indexed array from file', () => {

  const data = phpArrayReader.fromFile('indexed.php');
  expect(data).toEqual([
    'foo', 'bar', 'baz'
  ])

});


test('associative array from string', () => {

  const data = phpArrayReader.fromString(associativeStr);

  expect(data).toEqual({
    foo: 'bar',
    hello: 'world'
  });

});


test('associative array from file', () => {

  const data = phpArrayReader.fromFile('associative.php');

  expect(data).toEqual({
    foo: 'bar',
    hello: 'world'
  });

});

test('all value types match (arrays strings numbers decimals nulls) from string', () => {

  const data = phpArrayReader.fromString(valueTypesStr);

  expect(data).toEqual({
    arrayvalue: ['hello','world'],
    stringvalue: 'foo',
    numbervalue: 42,
    decimalvalue: 4.2,
    nullvalue: null
  });

});

test('all value types match (arrays strings numbers decimals nulls) from file', () => {

  const data = phpArrayReader.fromFile('value-types.php');

  expect(data).toEqual({
    arrayvalue: ['hello','world'],
    stringvalue: 'foo',
    numbervalue: 42,
    decimalvalue: 4.2,
    nullvalue: null
  });

});

test('multidimensional array from string', () => {

  const data = phpArrayReader.fromString(multidimensionalStr);

  expect(data).toEqual({
    first: {
      second: {
        third: 1
      },
      fourth: 4
    }
  });

});

test('multidimensional array from file', () => {

  const data = phpArrayReader.fromFile('multidimensional.php');

  expect(data).toEqual({
    first: {
      second: {
        third: 1
      },
      fourth: 4
    }
  });

});


test('multiple arrays from file', () => {

  const data = phpArrayReader.fromFile('multiple.php');

  expect(data).toEqual({
    first: ['foo','bar'],
    second: ['hello' , 'world']
  });

});