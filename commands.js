const { doesNotExist, exists, hasFields } = require('./validation');

const extractFieldNames = (fields) =>
  fields.map((f) => (typeof f === 'string' ? f : f.name));

const buildEventPayload = (spec, command) =>
  Object.assign(
    {},
    ...extractFieldNames(spec.fields).map((fn) => ({
      [fn]: command.payload[fn],
    }))
  );

const createHandler = (spec) => (aggregate, command) => {
  doesNotExist(command, aggregate);

  spec.validateCreateCommand && spec.validateCreateCommand(command);

  const requiredFields = spec.fields
    .filter((f) => f.required)
    .map((f) => f.name);
  hasFields(command.payload, requiredFields);

  const eventPayload = buildEventPayload(spec, command);

  const result = {
    type: `CRUD_${spec.name.toUpperCase()}_CREATED`,
    payload: eventPayload,
  };

  return spec.finalizeCreateEvent
    ? spec.finalizeCreateEvent(result, command)
    : result;
};

const updateHandler = (spec) => (aggregate, command) => {
  exists(command, aggregate);

  spec.validateUpdateCommand && spec.validateUpdateCommand(command);

  const eventPayload = buildEventPayload(spec, command);

  const result = {
    type: `CRUD_${spec.name.toUpperCase()}_UPDATED`,
    payload: eventPayload,
  };

  return spec.finalizeUpdateEvent
    ? spec.finalizeUpdateEvent(result, command)
    : result;
};

const deleteHandler = (spec) => (aggregate, command) => {
  exists(command, aggregate);

  spec.validateDeleteCommand && spec.validateDeleteCommand(command);

  const result = {
    type: `CRUD_${spec.name.toUpperCase()}_DELETED`,
    payload: {},
  };

  return spec.finalizeDeleteEvent
    ? spec.finalizeDeleteEvent(result, command)
    : result;
};

const crudCommands = (spec) => ({
  [`create${spec.name}`]: createHandler(spec),
  [`update${spec.name}`]: updateHandler(spec),
  [`delete${spec.name}`]: deleteHandler(spec),
});

module.exports = {
  crudCommands,
  createHandler,
  updateHandler,
  deleteHandler,
  buildEventPayload,
  extractFieldNames,
};
