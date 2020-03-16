import { KeyOf, getKeys } from './key';

/**
 * A generic function type.
 */
type Method = (...args: any[]) => any;

/**
 * Method name from `T`.
 */
type MethodNameOf<T> = keyof {
  [K in KeyOf<T>]: T[K] extends Method ? K : never;
};

/**
 * Curry to check if name is a method name from object, `T`.
 * @param object
 */
const isMethodOf = <T>(object: T) => (key: KeyOf<T>): key is MethodNameOf<T> =>
  key !== 'constructor' && typeof object[key] === 'function';

/**
 * Uncoupled methods from `T`.
 */
type UncoupledMethodsOf<T> = {
  [K in KeyOf<T>]: T[K] extends Method
    ? (instance: T, ...args: Parameters<T[K]>) => ReturnType<T[K]>
    : never;
};

/**
 * A function constructor (class) with prototype of `T` or an object of `T`.
 */
type Constructor<T> = { prototype: T } | (T & { prototype: undefined });

/**
 * Uncouple methods from function constructor, a class or an object into functions.
 * @example ```js
 * const { filter } = uncoupleMethods(Array);
 * filter([ 1, 2, 3, 4 ], (value) => value % 2 === 0);
 * //=> [ 2, 4 ]
 * ```
 * @param constructor - A function constructor, a class or an object to be uncoupled into functions.
 */
export const uncoupleMethods = <T>(
  constructor: Constructor<T>
): UncoupledMethodsOf<T> => {
  const prototype = (constructor.prototype || constructor) as T;
  const methods = Object.create(null) as UncoupledMethodsOf<T>;
  getKeys(prototype)
    .filter(isMethodOf(prototype))
    .forEach(name => {
      // @ts-ignore
      methods[name] = Function.call.bind(prototype[name]);
    });
  return methods;
};

/**
 * Uncoupled methods from `T`.
 */
type UncoupledMethodsAsCurriesOf<T> = {
  [K in KeyOf<T>]: T[K] extends Method
    ? (...args: Parameters<T[K]>) => (instance: T) => ReturnType<T[K]>
    : never;
};

/**
 * Uncouple methods from function constructor, a class or an object into functions.
 * @example ```js
 * const { filter: createFilter } = uncoupleMethodsAsCurries(Array);
 * const filter((value) => value % 2 === 0);
 * filter([ 1, 2, 3, 4 ]);
 * //=> [ 2, 4 ]
 * ```
 * @param constructor - A function constructor, a class or an object.
 */
export const uncoupleMethodsAsCurries = <T>(
  constructor: Constructor<T>
): UncoupledMethodsAsCurriesOf<T> => {
  const prototype = (constructor.prototype || constructor) as T;
  const methods = Object.create(null) as UncoupledMethodsAsCurriesOf<T>;
  getKeys(prototype)
    .filter(isMethodOf(prototype))
    .forEach(name => {
      // @ts-ignore
      methods[name] = function() {
        // @ts-ignore
        return instance => prototype[name].apply(instance, arguments);
      };
    });
  return methods;
};

/**
 * Append prefix to a word and capitalize it.
 * @param prefix
 * @param name
 */
const prefix = (prefix: string, name: string) =>
  prefix + (name ? name[0].toUpperCase() + name.substr(1) : '');

/**
 * Uncoupled getters from `T`.
 */
type UncoupledGettersOf<T> = {
  [name: string]: (instance: T) => any;
};

/**
 * Uncouple getters from function constructor, a class or an object into functions.
 * @example ```js
 * const { getName } = uncoupleGetters({
 *   _name: 'Vitor',
 *   get name () {
 *     return this._name;
 *   }
 * });
 * getName({ _name: 'Lucas' })
 * //=> 'Lucas'
 * ```
 * @param constructor - A function constructor, a class or an object
 */
export const uncoupleGetters = <T>(
  constructor: Constructor<T>
): UncoupledGettersOf<T> => {
  const prototype = (constructor.prototype || constructor) as T;
  const getters = Object.create(null) as UncoupledGettersOf<T>;
  getKeys(prototype).forEach(name => {
    const descriptor = Object.getOwnPropertyDescriptor(prototype, name) || {};

    if (typeof descriptor.get === 'function')
      getters[prefix('get', name)] = Function.call.bind(descriptor.get);
  });
  return getters;
};

/**
 * Uncoupled setters from `T`.
 */
type UncoupledSettersOf<T> = {
  [name: string]: (instance: T, value: any) => void;
};

/**
 * Uncouple setters from function constructor, a class or an object into functions.
 * @example ```js
 * const { setName } = uncoupleGetters({
 *   _name: 'Vitor',
 *   set name (name) {
 *     this._name = name;
 *   }
 * });
 *
 * const user = {
 *   _name: 'Vitor'
 * };
 *
 * setName(user, 'Lucas');
 *
 * user._name;
 * //=> 'Lucas'
 * ```
 * @param constructor - A function constructor, a class or an object
 */
export const uncoupleSetters = <T>(
  constructor: Constructor<T>
): UncoupledSettersOf<T> => {
  const prototype = (constructor.prototype || constructor) as T;
  const setters = Object.create(null) as UncoupledSettersOf<T>;
  getKeys(prototype).forEach(name => {
    const descriptor = Object.getOwnPropertyDescriptor(prototype, name) || {};

    if (typeof descriptor.set === 'function')
      // @ts-ignore
      setters[prefix('set', name)] = Function.call.bind(descriptor.set);
  });
  return setters;
};
