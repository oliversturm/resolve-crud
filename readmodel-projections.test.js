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

  return res.Init(store).then(() => {
    expect(spec.readModelInitContinuation).toHaveBeenCalledWith(store);
  });
});

test('created handler', () => {
  const res = crudProjections(simpleProductSpec);

  const store = {
    insert: jest.fn(() => Promise.resolve()),
  };

  const event = {
    type: 'CRUD_PRODUCT_CREATED',
    aggregateId: '99',
    payload: { val: 42 },
  };

  return res.CRUD_PRODUCT_CREATED(store, event).then((pr) => {
    expect(pr).toBeUndefined();
    expect(store.insert).toHaveBeenCalledWith('CRUD_Product', {
      id: '99',
      val: 42,
    });
  });
});

test('created handler with continuation', () => {
  const spec = {
    ...simpleProductSpec,
    readModelCreatedContinuation: jest.fn(),
  };
  const res = crudProjections(spec);

  const store = {
    insert: jest.fn(() => Promise.resolve()),
  };

  const event = {
    type: 'CRUD_PRODUCT_CREATED',
    aggregateId: '99',
    payload: { val: 42 },
  };

  return res.CRUD_PRODUCT_CREATED(store, event).then(() => {
    expect(spec.readModelCreatedContinuation).toHaveBeenCalledWith(
      store,
      event
    );
  });
});

test('updated handler', () => {
  const res = crudProjections(simpleProductSpec);

  const store = {
    update: jest.fn(() => Promise.resolve()),
  };

  const event = {
    type: 'CRUD_PRODUCT_UPDATED',
    aggregateId: '99',
    payload: { val: 42 },
  };

  return res.CRUD_PRODUCT_UPDATED(store, event).then((pr) => {
    expect(pr).toBeUndefined();
    expect(store.update).toHaveBeenCalledWith(
      'CRUD_Product',
      {
        id: '99',
      },
      {
        $set: { val: 42 },
      }
    );
  });
});

test('updated handler with continuation', () => {
  const spec = {
    ...simpleProductSpec,
    readModelUpdatedContinuation: jest.fn(),
  };
  const res = crudProjections(spec);

  const store = {
    update: jest.fn(() => Promise.resolve()),
  };

  const event = {
    type: 'CRUD_PRODUCT_UPDATED',
    aggregateId: '99',
    payload: { val: 42 },
  };

  return res.CRUD_PRODUCT_UPDATED(store, event).then(() => {
    expect(spec.readModelUpdatedContinuation).toHaveBeenCalledWith(
      store,
      event
    );
  });
});

test('deleted handler', () => {
  const res = crudProjections(simpleProductSpec);

  const store = {
    delete: jest.fn(() => Promise.resolve()),
  };

  const event = {
    type: 'CRUD_PRODUCT_DELETED',
    aggregateId: '99',
    payload: {},
  };

  return res.CRUD_PRODUCT_DELETED(store, event).then((pr) => {
    expect(pr).toBeUndefined();
    expect(store.delete).toHaveBeenCalledWith('CRUD_Product', {
      id: '99',
    });
  });
});

test('deleted handler with continuation', () => {
  const spec = {
    ...simpleProductSpec,
    readModelDeletedContinuation: jest.fn(),
  };
  const res = crudProjections(spec);

  const store = {
    delete: jest.fn(() => Promise.resolve()),
  };

  const event = {
    type: 'CRUD_PRODUCT_DELETED',
    aggregateId: '99',
    payload: {},
  };

  return res.CRUD_PRODUCT_DELETED(store, event).then(() => {
    expect(spec.readModelDeletedContinuation).toHaveBeenCalledWith(
      store,
      event
    );
  });
});
