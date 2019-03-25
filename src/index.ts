/**
 * Property name from `T`.
 */
type PropertyNameOf<T> = Extract<keyof T, string>;

/**
 * A generic function type.
 */
type Method = (...args: any[]) => any;

/**
 * Method name from `T`.
 */
type MethodNameOf<T> = keyof {
  [K in PropertyNameOf<T>]: T[K] extends Method ? K : never
};

/**
 * Curry to check if name is a method name from object, `T`.
 * @param object
 */
const isMethodOf = <T>(object: T) => (
  name: PropertyNameOf<T>
): name is MethodNameOf<T> =>
  name !== "constructor" && typeof object[name] === "function";

/**
 * Uncoupled methods from `T`.
 */
type UncoupledMethodsOf<T> = {
  [K in PropertyNameOf<T>]: T[K] extends Method
    ? (instance: T, ...args: Parameters<T[K]>) => ReturnType<T[K]>
    : never
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
const uncoupleMethods = <T>(
  constructor: Constructor<T>
): UncoupledMethodsOf<T> => {
  const prototype = (constructor.prototype || constructor) as T;
  const names = Object.getOwnPropertyNames(prototype) as PropertyNameOf<T>[];
  const methods = Object.create(null) as UncoupledMethodsOf<T>;
  names.filter(isMethodOf(prototype)).forEach(name => {
    // @ts-ignore
    methods[name] = Function.call.bind(prototype[name]);
  });
  return methods;
};

/**
 * Uncoupled methods from `T`.
 */
type UncoupledMethodsAsCurriesOf<T> = {
  [K in PropertyNameOf<T>]: T[K] extends Method
    ? (...args: Parameters<T[K]>) => (instance: T) => ReturnType<T[K]>
    : never
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
const uncoupleMethodsAsCurries = <T>(
  constructor: Constructor<T>
): UncoupledMethodsAsCurriesOf<T> => {
  const prototype = (constructor.prototype || constructor) as T;
  const methods = Object.create(null) as UncoupledMethodsAsCurriesOf<T>;
  const names = Object.getOwnPropertyNames(prototype) as PropertyNameOf<T>[];
  names.filter(isMethodOf(prototype)).forEach(name => {
    // @ts-ignore
    methods[name] = (...args) => instance =>
      // @ts-ignore
      prototype[name].apply(instance, args);
  });
  return methods;
};
