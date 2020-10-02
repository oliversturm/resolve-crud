const extractFieldNames = (fields) =>
  fields.map((f) => (typeof f === 'string' ? f : f.name));

module.exports = { extractFieldNames };
