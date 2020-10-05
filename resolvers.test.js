const { crudResolvers } = require('./resolvers');

const simpleProductSpec = {
  name: 'Product',
  initial: {},
  fields: [{ name: 'name', required: true }, 'price'],
};

test('handlers exist', () => {
  expect(crudResolvers(simpleProductSpec)).toEqual({
    all: expect.anything(),
    byId: expect.anything(),
  });
});

test('allHandler', () => {
  const res = crudResolvers(simpleProductSpec);

  const store = {
    find: jest.fn(() => Promise.resolve('magic result')),
  };

  return res.all(store).then((pr) => {
    expect(pr).toEqual('magic result');
    expect(store.find).toHaveBeenCalledWith('CRUD_Product', {}, null, {});
  });
});

test('allHandler with allResolverSort', () => {
  const spec = { ...simpleProductSpec, allResolverSort: { specialSort: true } };
  const res = crudResolvers(spec);

  const store = {
    find: jest.fn(() => Promise.resolve('magic result')),
  };

  return res.all(store).then((pr) => {
    expect(pr).toEqual('magic result');
    expect(store.find).toHaveBeenCalledWith('CRUD_Product', {}, null, {
      specialSort: true,
    });
  });
});

test('allHandler with continuation', () => {
  const spec = {
    ...simpleProductSpec,
    allResolverContinuation: jest.fn((x) => x),
  };
  const res = crudResolvers(spec);

  const store = {
    find: jest.fn(() => Promise.resolve('magic result')),
  };

  return res.all(store).then((pr) => {
    expect(pr).toEqual('magic result');
    expect(spec.allResolverContinuation).toHaveBeenCalledWith('magic result');
  });
});

test('byIdHandler', () => {
  const res = crudResolvers(simpleProductSpec);

  const store = {
    findOne: jest.fn(() => Promise.resolve('magic result')),
  };

  return res.byId(store, { id: '99' }).then((pr) => {
    expect(pr).toEqual('magic result');
    expect(store.findOne).toHaveBeenCalledWith('CRUD_Product', { id: '99' });
  });
});

test('byIdHandler with continuation', () => {
  const spec = {
    ...simpleProductSpec,
    byIdResolverContinuation: jest.fn((x) => x),
  };
  const res = crudResolvers(spec);

  const store = {
    findOne: jest.fn(() => Promise.resolve('magic result')),
  };

  return res.byId(store, { id: '99' }).then((pr) => {
    expect(pr).toEqual('magic result');
    expect(spec.byIdResolverContinuation).toHaveBeenCalledWith('magic result');
  });
});
