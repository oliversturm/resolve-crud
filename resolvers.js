const { tableName, identity } = require('./utils');

const allHandler = (spec) => (store) =>
  store
    .find(tableName(spec), {}, null, spec.allResolverSort || {})
    .then(spec.allResolverContinuation || identity);

const byIdHandler = (spec) => (store, { id }) =>
  store
    .findOne(tableName(spec), { id })
    .then(spec.byIdResolverContinuation || identity);

const crudResolvers = (spec) => ({
  all: allHandler(spec),
  byId: byIdHandler(spec),
});

module.exports = { crudResolvers, allHandler, byIdHandler };
