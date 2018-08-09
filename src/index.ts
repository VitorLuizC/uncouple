import reconstruct from 'reconstruct-descriptors';

/**
 * Check if property (key & descriptor) is a method.
 * @param name
 * @param descriptor
 */
const isMethod = (name: PropertyKey, { value }: PropertyDescriptor): boolean => (
  name !== 'constructor' &&
  typeof name !== 'symbol' &&
  typeof value === 'function'
);

/**
 * Type definition to match every method or function.
 */
type Method = (...args: any[]) => any;

/**
 * A hi-order type definition to type an uncoupled function.
 */
type Uncoupled <T, F> = F extends (...args: infer A) => infer R ? (instance: T, ...args: A) => R : never;

/**
 * Uncouple object methods into functions that receives instance and method arguments.
 */
export type Uncouple <T> = { [K in keyof T]: T[K] extends Method ? Uncoupled<T, T[K]> : never; };

/**
 * Uncouple object methods.
 * @example ```js
 * const { filter } = uncouple(Array.prototype);
 * filter([ 1, 2, 3, 4 ], (value) => value % 2 === 0);
 * //=> [ 2, 4 ]
 * ```
 * @param object - A prototype, namespace of object with methods.
 */
function uncouple <T extends object> (object: T): Uncouple<T> {
  return reconstruct(object, (descriptor, name) => isMethod(name, descriptor) && {
    [name]: {
      value: Function.call.bind(descriptor.value),
      writable: true,
      enumerable: true,
      configurable: true
    }
  }) as Uncouple<T>;
}

export default uncouple;
