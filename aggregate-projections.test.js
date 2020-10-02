const { crudProjections } = require('./aggregate-projections');

const simpleProductSpec = {
  name: 'Product',
  initial: {},
  fields: [{ name: 'name', required: true }, 'price'],
};

test('handlers exist', () => {
  expect(crudProjections(simpleProductSpec)).toEqual({
    Init: expect.anything(),
    CRUD_PRODUCT_CREATED: expect.anything(),
    CRUD_PRODUCT_UPDATED: expect.anything(),
    CRUD_PRODUCT_DELETED: expect.anything(),
  });
});

test('handlers with different names', () => {
  const spec = {
    ...simpleProductSpec,
    modifyEventName: (event) => `${event}_XXX`,
  };
  expect(crudProjections(spec)).toEqual({
    Init: expect.anything(),
    created_XXX: expect.anything(),
    updated_XXX: expect.anything(),
    deleted_XXX: expect.anything(),
  });
});

test('initial', () => {
  const res = crudProjections(simpleProductSpec);
  expect(res.Init()).toBe(simpleProductSpec.initial);
});

test('created handler', () => {
  const res = crudProjections(simpleProductSpec);
  const event = {
    type: 'CRUD_PRODUCT_CREATED',
    payload: { name: 'Rubber Chicken', price: 7.99 },
  };
  expect(res.CRUD_PRODUCT_CREATED({}, event)).toEqual({ exists: true });
});

test('created handler with callback', () => {
  const spec = {
    ...simpleProductSpec,
    finalizeCreatedAggregate: jest.fn((x) => x),
  };
  const res = crudProjections(spec);
  const event = {
    type: 'CRUD_PRODUCT_CREATED',
    payload: { name: 'Rubber Chicken', price: 7.99 },
  };
  expect(res.CRUD_PRODUCT_CREATED({}, event)).toEqual({ exists: true });
  expect(spec.finalizeCreatedAggregate).toHaveBeenCalledWith(
    { exists: true },
    event
  );
});

test('updated handler', () => {
  const res = crudProjections(simpleProductSpec);
  const event = {
    type: 'CRUD_PRODUCT_UPDATED',
    payload: { name: 'Rubber Chicken', price: 7.99 },
  };
  expect(res.CRUD_PRODUCT_UPDATED({ exists: true }, event)).toEqual({
    exists: true,
  });
});

test('updated handler with callback', () => {
  const spec = {
    ...simpleProductSpec,
    finalizeUpdatedAggregate: jest.fn((x) => x),
  };
  const res = crudProjections(spec);
  const event = {
    type: 'CRUD_PRODUCT_UPDATED',
    payload: { name: 'Rubber Chicken', price: 7.99 },
  };
  expect(res.CRUD_PRODUCT_UPDATED({ exists: true }, event)).toEqual({
    exists: true,
  });
  expect(spec.finalizeUpdatedAggregate).toHaveBeenCalledWith(
    { exists: true },
    event
  );
});

test('deleted handler', () => {
  const res = crudProjections(simpleProductSpec);
  const event = {
    type: 'CRUD_PRODUCT_DELETED',
    payload: {},
  };
  expect(res.CRUD_PRODUCT_DELETED({ exists: true }, event)).toEqual({
    exists: true,
  });
});

test('deleted handler with callback', () => {
  const spec = {
    ...simpleProductSpec,
    finalizeDeletedAggregate: jest.fn((x) => x),
  };
  const res = crudProjections(spec);
  const event = {
    type: 'CRUD_PRODUCT_DELETED',
    payload: {},
  };
  expect(res.CRUD_PRODUCT_DELETED({ exists: true }, event)).toEqual({
    exists: true,
  });
  expect(spec.finalizeDeletedAggregate).toHaveBeenCalledWith(
    { exists: true },
    event
  );
});
