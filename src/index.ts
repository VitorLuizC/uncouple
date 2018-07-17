import reconstruct, { PropertyName } from 'reconstruct-descriptors';

function isMethod (name: PropertyName, { value }: PropertyDescriptor): boolean {
  return typeof value === 'function' && typeof name !== 'symbol' && name !== 'constructor';
}

type Method = (...args: any[]) => any;

type Uncouple <T extends object, U extends Method> = (instance: T, ...args: any[]) => ReturnType<U>;

type Uncoupled <T extends object> = { [K in keyof T]: T[K] extends Method ? Uncouple<T, T[K]> : never };

function uncouple <T extends object> (object: T): Uncoupled<T> {
  return reconstruct(object, (descriptor, name) => isMethod(name, descriptor) && {
    [name]: {
      value: Function.call.bind(descriptor.value),
      writable: true,
      enumerable: true,
      configurable: true
    }
  }) as Uncoupled<T>;
}

export { uncouple, uncouple as default, Uncoupled };
