const createdHandler = (spec) => (aggregate, event) => {
  const result = { ...aggregate, exists: true };

  return spec.finalizeCreatedAggregate
    ? spec.finalizeCreatedAggregate(result, event)
    : result;
};

const updatedHandler = (spec) => (aggregate, event) => {
  return spec.finalizeUpdatedAggregate
    ? spec.finalizeUpdatedAggregate(aggregate, event)
    : aggregate;
};

const deletedHandler = (spec) => (aggregate, event) => {
  // We do not set 'exists' to false here - the object may have
  // been deleted, but we don't want the aggregate id to become
  // available for creation again. This seems sensible, but
  // the callback is available to change the behavior if you
  // disagree.
  return spec.finalizeDeletedAggregate
    ? spec.finalizeDeletedAggregate(aggregate, event)
    : aggregate;
};

const defaultEventName = (_, x) => x;

const crudProjections = (spec) =>
  ((eventName) => ({
    Init: () => spec.initial,

    [eventName(
      'created',
      `CRUD_${spec.name.toUpperCase()}_CREATED`
    )]: createdHandler(spec),

    [eventName(
      'updated',
      `CRUD_${spec.name.toUpperCase()}_UPDATED`
    )]: updatedHandler(spec),

    [eventName(
      'deleted',
      `CRUD_${spec.name.toUpperCase()}_DELETED`
    )]: deletedHandler(spec),
  }))(spec.modifyEventName || defaultEventName);

module.exports = {
  crudProjections,
  defaultEventName,
  createdHandler,
  updatedHandler,
  deletedHandler,
};
