import { map, filter, reduce } from './collection';
import { entries, getOwnPropertyDescriptors } from './object';

const toProperty = ([ name, descriptor ]) => ({ name, ...descriptor });

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

const withMethod = (object, { name, value }) => ({
  ...object,
  [name]: Function.call.bind(value)
});

const uncouple = (object) => {
  const properties = getProperties(object.prototype || object);
  const methods = filter(properties, isMethod);
  const uncoupled = reduce(methods, withMethod, {});
  return uncoupled;
};

export default uncouple;
