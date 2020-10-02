const { crudProjections } = require('./readmodel-projections');

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

test('init handler', () => {
  const res = crudProjections(simpleProductSpec);

  const store = {
    defineTable: jest.fn(() => Promise.resolve()),
  };

  return res.Init(store).then((pr) => {
    expect(pr).toBeUndefined();
    expect(store.defineTable).toHaveBeenCalledWith('CRUD_Product', {
      indexes: { id: 'string' },
      fields: ['name', 'price'],
    });
  });
});

test('init handler with continuation', () => {
  const spec = {
    ...simpleProductSpec,
    readModelInitContinuation: jest.fn(),
  };
  const res = crudProjections(spec);

  const store = {
    defineTable: jest.fn(() => Promise.resolve()),
  };

  return res.Init(store).then((pr) => {
    expect(pr).toBeUndefined();

    expect(store.defineTable).toHaveBeenCalledWith('CRUD_Product', {
      indexes: { id: 'string' },
      fields: ['name', 'price'],
    });

    expect(spec.readModelInitContinuation).toHaveBeenCalledTimes(1);
  });
});
