const {
  crudCommands,
  extractFieldNames,
  buildEventPayload,
} = require('./commands');

const simpleProductSpec = {
  name: 'Product',
  initial: {},
  fields: [{ name: 'name', required: true }, 'price'],
};

test('command handlers exist', () => {
  const cmds = crudCommands(simpleProductSpec);

  expect(cmds).toEqual({
    createProduct: expect.anything(),
    updateProduct: expect.anything(),
    deleteProduct: expect.anything(),
  });
});

test('create command', () => {
  const cmds = crudCommands(simpleProductSpec);

  const cmd = {
    aggregateName: 'Product',
    aggregateId: '1',
    payload: { name: 'Rubber Chicken', price: 7.99, extra: 'irrelevant' },
  };
  const ev = cmds.createProduct({}, cmd);

  expect(ev).toEqual({
    type: 'CRUD_PRODUCT_CREATED',
    payload: { name: 'Rubber Chicken', price: 7.99 },
  });
});

test('create command with callbacks', () => {
  const spec = {
    ...simpleProductSpec,
    validateCreateCommand: jest.fn(),
    finalizeCreateEvent: jest.fn((x) => x),
  };
  const cmds = crudCommands(spec);

  const cmd = {
    aggregateName: 'Product',
    aggregateId: '1',
    payload: { name: 'Rubber Chicken', price: 7.99, extra: 'irrelevant' },
  };
  const ev = cmds.createProduct({}, cmd);

  expect(ev).toEqual({
    type: 'CRUD_PRODUCT_CREATED',
    payload: { name: 'Rubber Chicken', price: 7.99 },
  });

  expect(spec.validateCreateCommand).toHaveBeenCalledWith(cmd);
  expect(spec.finalizeCreateEvent).toHaveBeenCalledWith(ev, cmd);
});

test('create command with missing name', () => {
  const cmds = crudCommands(simpleProductSpec);

  expect(() =>
    cmds.createProduct(
      {},
      {
        aggregateName: 'Product',
        aggregateId: '1',
        payload: { price: 7.99, extra: 'irrelevant' },
      }
    )
  ).toThrow();
});

test('update command', () => {
  const cmds = crudCommands(simpleProductSpec);

  const cmd = {
    aggregateName: 'Product',
    aggregateId: '1',
    payload: { name: 'Rubber Chicken', price: 7.99, extra: 'irrelevant' },
  };
  const ev = cmds.updateProduct({ exists: true }, cmd);

  expect(ev).toEqual({
    type: 'CRUD_PRODUCT_UPDATED',
    payload: { name: 'Rubber Chicken', price: 7.99 },
  });
});

test('update command with callbacks', () => {
  const spec = {
    ...simpleProductSpec,
    validateUpdateCommand: jest.fn(),
    finalizeUpdateEvent: jest.fn((x) => x),
  };
  const cmds = crudCommands(spec);

  const cmd = {
    aggregateName: 'Product',
    aggregateId: '1',
    payload: { name: 'Rubber Chicken', price: 7.99, extra: 'irrelevant' },
  };
  const ev = cmds.updateProduct({ exists: true }, cmd);

  expect(ev).toEqual({
    type: 'CRUD_PRODUCT_UPDATED',
    payload: { name: 'Rubber Chicken', price: 7.99 },
  });

  expect(spec.validateUpdateCommand).toHaveBeenCalledWith(cmd);
  expect(spec.finalizeUpdateEvent).toHaveBeenCalledWith(ev, cmd);
});

test('delete command', () => {
  const cmds = crudCommands(simpleProductSpec);

  const cmd = {
    aggregateName: 'Product',
    aggregateId: '1',
    payload: { extra: 'irrelevant' },
  };
  const ev = cmds.deleteProduct({ exists: true }, cmd);

  expect(ev).toEqual({
    type: 'CRUD_PRODUCT_DELETED',
    payload: {},
  });
});

test('delete command with callbacks', () => {
  const spec = {
    ...simpleProductSpec,
    validateDeleteCommand: jest.fn(),
    finalizeDeleteEvent: jest.fn((x) => x),
  };
  const cmds = crudCommands(spec);

  const cmd = {
    aggregateName: 'Product',
    aggregateId: '1',
    payload: { extra: 'irrelevant' },
  };
  const ev = cmds.deleteProduct({ exists: true }, cmd);

  expect(ev).toEqual({
    type: 'CRUD_PRODUCT_DELETED',
    payload: {},
  });

  expect(spec.validateDeleteCommand).toHaveBeenCalledWith(cmd);
  expect(spec.finalizeDeleteEvent).toHaveBeenCalledWith(ev, cmd);
});

test('extractFieldNames', () => {
  const fields = ['field1', { name: 'field2' }];
  expect(extractFieldNames(fields)).toEqual(['field1', 'field2']);
});

test('buildEventPayload', () => {
  const spec = { fields: ['name', { name: 'price' }] };
  const command = {
    payload: {
      name: 'name value',
      extraField: 'extra value',
      /* missing: price: 'price value',*/
    },
  };

  expect(buildEventPayload(spec, command)).toEqual({ name: 'name value' });
});
