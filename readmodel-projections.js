const { extractFieldNames } = require('./utils');

const tableName = (spec) => spec.tableName || `CRUD_${spec.name}`;

const defaultContinuation = () => undefined;

const initHandler = (spec) => (store) =>
  store
    .defineTable(tableName(spec), {
      indexes: { id: 'string' },
      fields: extractFieldNames(spec.fields),
    })
    .then(() => (spec.readModelInitContinuation || defaultContinuation)(store));

const createdHandler = (spec) => (store, event) =>
  store
    .insert(tableName(spec), {
      ...event.payload,
      id: event.aggregateId,
    })
    .then(spec.readModelCreatedContinuation || defaultContinuation);

const updatedHandler = (spec) => (store, event) =>
  store
    .update(tableName(spec), { id: event.aggregateId }, { $set: event.payload })
    .then(spec.readModelUpdatedContinuation || defaultContinuation);

const deletedHandler = (spec) => (store, event) =>
  store
    .delete(tableName(spec), { id: event.aggregateId })
    .then(spec.readModelDeletedContinuation || defaultContinuation);

const defaultEventName = (_, x) => x;

const crudProjections = (spec) => ({
  Init: initHandler(spec),
  [(spec.modifyEventName || defaultEventName)(
    'created',
    `CRUD_${spec.name.toUpperCase()}_CREATED`
  )]: createdHandler(spec),
  [(spec.modifyEventName || defaultEventName)(
    'updated',
    `CRUD_${spec.name.toUpperCase()}_UPDATED`
  )]: updatedHandler(spec),
  [(spec.modifyEventName || defaultEventName)(
    'deleted',
    `CRUD_${spec.name.toUpperCase()}_DELETED`
  )]: deletedHandler(spec),
});

module.exports = {
  crudProjections,
  defaultEventName,
  deletedHandler,
  updatedHandler,
  createdHandler,
  initHandler,
  tableName,
};
