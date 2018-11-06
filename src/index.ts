/**
 * It infer property names from an object (T).
 */
type PropertyName <T> = Exclude<keyof T, symbol | number>;

/**
 * Uncouple methods from an instances.
 */
type Uncouple <T> = {
  [K in PropertyName<T>]: T[K] extends (...args: infer A) => infer R ? (instance: T, ...args: A) => R : never;
};

/**
 * Uncouple methods from constructor or a class into functions.
 * @example ```js
 * const { filter } = uncouple(Array);
 * filter([ 1, 2, 3, 4 ], (value) => value % 2 === 0);
 * //=> [ 2, 4 ]
 * ```
 * @param constructor - A constructor or a class to uncouple it's methods into functions.
 */
const uncouple = <T> (constructor: { prototype: T }): Uncouple<T> => {
  const names = Object.getOwnPropertyNames(constructor.prototype) as PropertyName<T>[];
  return names.reduce((methods, name) => {
    const value = constructor.prototype[name];
    if (typeof value === 'function' && typeof name === 'string' && name !== 'constructor')
      methods[name] = Function.call.bind(value);
    return methods;
  }, Object.create(null) as Uncouple<T>);
};

export default uncouple;
