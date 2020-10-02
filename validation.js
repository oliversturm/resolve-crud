const doesNotExist = ({ aggregateName, aggregateId }, agg) => {
  if (agg && agg.exists)
    throw new Error(`${aggregateName}(${aggregateId}) exists`);
};

const exists = ({ aggregateName, aggregateId }, agg) => {
  if (!agg || !agg.exists)
    throw new Error(`${aggregateName}(${aggregateId}) does not exist`);
};

const hasField = (o, name) => {
  if (!o[name]) throw new Error(`Field '${name}' missing`);
};

const hasFields = (o, names) => {
  for (const name of names) hasField(o, name);
};

module.exports = { doesNotExist, exists, hasField, hasFields };
