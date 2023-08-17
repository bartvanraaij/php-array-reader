const { fromString } = require('./index');

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

test('indexed array', () => {
  const data = fromString(indexStr);
  expect(data).toEqual([
    'foo', 'bar', 'baz'
  ])
});

test('associative array', () => {
  const data = fromString(associativeStr);
  expect(data).toEqual({
    foo: 'bar',
    hello: 'world'
  });
});

test('multidimensional array', () => {
  const data = fromString(multidimensionalStr);
  expect(data).toEqual({
    first: {
      second: {
        third: 1
      },
      fourth: 4
    }
  });
});

test('multiple arrays', () => {
  const data = fromString(multipleStr);
  expect(data).toEqual({
    first: ['foo','bar'],
    second: ['hello' , 'world']
  });
});

test('all value types match (arrays strings numbers decimals nulls)', () => {
  const data = fromString(valueTypesStr);
  expect(data).toEqual({
    arrayvalue: ['hello','world'],
    stringvalue: 'foo',
    numbervalue: 42,
    decimalvalue: 4.2,
    nullvalue: null
  });
});
