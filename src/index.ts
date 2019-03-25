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
 * Constructor (class) with generic prototype `T`.
 */
type Constructor<T> = { prototype: T };

/**
 * Uncouple methods from constructor (class) into functions.
 * @example ```js
 * const { filter } = uncouple(Array);
 * filter([ 1, 2, 3, 4 ], (value) => value % 2 === 0);
 * //=> [ 2, 4 ]
 * ```
 * @param constructor - A constructor (class) to be uncoupled into functions.
 */
const uncoupleMethods = <T>({
  prototype
}: Constructor<T>): UncoupledMethodsOf<T> => {
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
 * Uncouple methods from constructor (class) into functions.
 * @example ```js
 * const { filter } = uncouple(Array);
 * filter([ 1, 2, 3, 4 ], (value) => value % 2 === 0);
 * //=> [ 2, 4 ]
 * ```
 * @param constructor - A constructor (class) to be uncoupled into functions.
 */
const uncoupleMethodsAsCurries = <T>({
  prototype
}: Constructor<T>): UncoupledMethodsAsCurriesOf<T> => {
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
