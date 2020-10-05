const extractFieldNames = (fields) =>
  fields.map((f) => (typeof f === 'string' ? f : f.name));

const tableName = (spec) => spec.tableName || `CRUD_${spec.name}`;

const undefinedContinuation = () => undefined;

const identity = (x) => x;

module.exports = {
  extractFieldNames,
  tableName,
  undefinedContinuation,
  identity,
};
