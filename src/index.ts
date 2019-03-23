/**
 * Property name from `T`.
 */
type PropertyNameOf<T> = Extract<keyof T, string>;

/**
 * Uncoupled methods from `T`.
 */
type UncoupledMethodsOf<T> = {
  [K in PropertyNameOf<T>]: T[K] extends (...args: any[]) => any
    ? (instance: T, ...args: Parameters<T[K]>) => ReturnType<T[K]>
    : never
};

/**
 * Constructor (class) with generic prototype `T`.
 */
type Constructor<T> = (new (...args: any[]) => any) & { prototype: T };

/**
 * Uncouple methods from constructor (class) into functions.
 * @example ```js
 * const { filter } = uncouple(Array);
 * filter([ 1, 2, 3, 4 ], (value) => value % 2 === 0);
 * //=> [ 2, 4 ]
 * ```
 * @param constructor - A constructor (class) to be uncoupled into functions.
 */
const uncouple = <T>({ prototype }: Constructor<T>): UncoupledMethodsOf<T> => {
  const names = Object.getOwnPropertyNames(prototype) as PropertyNameOf<T>[];
  return names.reduce((methods, name) => {
    if (typeof prototype[name] === "function" && name !== "constructor")
      // @ts-ignore
      methods[name] = Function.call.bind(prototype[name]);
    return methods;
  }, Object.create(null) as UncoupledMethodsOf<T>);
};

export default uncouple;
