const { fromString } = require('./index');

test('list', () => {
  const data = fromString(`[
    'foo', 'bar', 'baz'
  ]`);
  expect(data).toEqual([
    'foo', 'bar', 'baz'
  ])
});

test('dictionary', () => {
  const data = fromString(`[
    'foo' => 'bar',
    'hello' => 'world'
  ]`);
  expect(data).toEqual({
    foo: 'bar',
    hello: 'world'
  });
});

test('multidimensional', () => {
  const data = fromString(`[
    'first' => [
      'second' => [
        'third' => 1
      ],
      'fourth' => 4
    ]
  ]`);
  expect(data).toEqual({
    first: {
      second: {
        third: 1
      },
      fourth: 4
    }
  });
});

test('multiple', () => {
  const data = fromString(`
    $first = ['foo', 'bar'];
    $second = ['hello', 'world'];
  `);
  expect(data).toEqual({
    first: ['foo','bar'],
    second: ['hello' , 'world']
  });
});

test('all value types match (arrays strings numbers decimals nulls booleans)', () => {
  const data = fromString(`[
    'arrayvalue' => [
      'hello', 'world'
    ],
    'stringvalue' => 'foo',
    'numbervalue' => 42,
    'decimalvalue' => 4.2,
    'nullvalue' => null,
    'truevalue' => true,
    'falsevalue' => false,
  ]`);
  expect(data).toEqual({
    arrayvalue: ['hello','world'],
    stringvalue: 'foo',
    numbervalue: 42,
    decimalvalue: 4.2,
    nullvalue: null,
    truevalue: true,
    falsevalue: false,
  });
});
