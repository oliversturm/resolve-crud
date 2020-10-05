const {
  extractFieldNames,
  tableName,
  undefinedContinuation,
} = require('./utils');

const initHandler = (spec) => (store) =>
  store
    .defineTable(tableName(spec), {
      indexes: { id: 'string' },
      fields: extractFieldNames(spec.fields),
    })
    .then(() =>
      (spec.readModelInitContinuation || undefinedContinuation)(store)
    );

const createdHandler = (spec) => (store, event) =>
  store
    .insert(tableName(spec), {
      ...event.payload,
      id: event.aggregateId,
    })
    .then(() =>
      (spec.readModelCreatedContinuation || undefinedContinuation)(store, event)
    );

const updatedHandler = (spec) => (store, event) =>
  store
    .update(tableName(spec), { id: event.aggregateId }, { $set: event.payload })
    .then(() =>
      (spec.readModelUpdatedContinuation || undefinedContinuation)(store, event)
    );

const deletedHandler = (spec) => (store, event) =>
  store
    .delete(tableName(spec), { id: event.aggregateId })
    .then(() =>
      (spec.readModelDeletedContinuation || undefinedContinuation)(store, event)
    );

const defaultEventName = (_, x) => x;

const crudProjections = (spec) =>
  ((eventName, baseName) => ({
    Init: initHandler(spec),

    [eventName('created', `${baseName}_CREATED`)]: createdHandler(spec),

    [eventName('updated', `${baseName}_UPDATED`)]: updatedHandler(spec),

    [eventName('deleted', `${baseName}_DELETED`)]: deletedHandler(spec),
  }))(
    spec.modifyEventName || defaultEventName,
    `CRUD_${spec.name.toUpperCase()}`
  );

module.exports = {
  crudProjections,
  defaultEventName,
  deletedHandler,
  updatedHandler,
  createdHandler,
  initHandler,
  tableName,
};
