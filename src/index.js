import { map, filter, reduce } from './collection';
import { assign, entries, getOwnPropertyDescriptors } from './object';

const toProperty = ([ name, descriptor ]) => {
  const property = assign({}, descriptor, { name });
  return property;
};

const getProperties = (object) => {
  const descriptors = getOwnPropertyDescriptors(object);
  const properties = map(entries(descriptors), toProperty);
  return properties;
};

const isMethod = (property) => (
  property.name !== 'constructor' &&
  typeof property.name === 'string' &&
  typeof property.value === 'function'
);

const withMethod = (object, { name, value }) => {
  const result = assign({}, object, { [name]: Function.call.bind(value) });
  return result;
};

const uncouple = (object) => {
  const properties = getProperties(object.prototype || object);
  const methods = filter(properties, isMethod);
  const uncoupled = reduce(methods, withMethod, {});
  return uncoupled;
};

export default uncouple;
