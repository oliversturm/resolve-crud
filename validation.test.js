const { doesNotExist, exists, hasField, hasFields } = require('./validation');

const cmd = { aggregateName: 'TestThing', aggregateId: '99' };

test('doesNotExist throws', () => {
  expect(() => doesNotExist(cmd, { exists: true })).toThrow();
});

test('doesNotExist does not throw', () => {
  doesNotExist(cmd, { exists: false });
});

test('exists throws', () => {
  expect(() => exists(cmd, { exists: false })).toThrow();
});

test('exists does not throw', () => {
  exists(cmd, { exists: true });
});

test('hasField throws', () => {
  expect(() => hasField({}, 'test')).toThrow();
});

test('hasField does not throw', () => {
  hasField({ test: 33 }, 'test');
});

test('hasFields throws', () => {
  expect(() => hasFields({}, ['test', 'other'])).toThrow();
});

test('hasFields does not throw', () => {
  hasFields({ test: 33, other: 44 }, ['test', 'other']);
});
