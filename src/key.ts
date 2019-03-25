/**
 * Property key from `T`.
 */
export type KeyOf<T> = Extract<keyof T, string>;

/**
 * Get property keys from object, `T`.
 * @param object
 */
export const getKeys = Object.getOwnPropertyNames as <T>(
  object: T
) => KeyOf<T>[];
