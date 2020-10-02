const { extractFieldNames } = require('./utils');

test('extractFieldNames', () => {
  const fields = ['field1', { name: 'field2' }];
  expect(extractFieldNames(fields)).toEqual(['field1', 'field2']);
});
