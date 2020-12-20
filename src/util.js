/**
 * Gets the property value at path of object.
 *
 * @param {Object} object
 * @param {String} path
 * @returns {T}
 */
export function get(object, path) {
  return `${path}`.split('.').reduce((result, value) => {
    return typeof result === 'object' ? result[value] : undefined
  }, object)
}

/**
 * Sets the value at path of object.
 *
 * @param {Object} object
 * @param {String} path
 * @param {T} value
 * @returns {Object}
 */
export function set(object, path, value) {
  const keys = `${path}`.split('.')
  const last = keys.pop()
  const item = get(object, keys.join('.'))

  if (typeof item === 'object' && typeof item[last] === 'object') {
    item[last] = value
  }

  return object
}

/**
 * Iterates over elements of collection.
 *
 * @param {Object} collection
 * @param {Function} iteratee
 */
export function each(collection, iteratee) {
  Object.keys(collection).forEach((key) => iteratee(collection[key], key))
}

/**
 * Reduces a collection to a value.
 *
 * @param {Object} collection
 * @param {Function} callback
 * @param {T} accumulator
 * @returns {T}
 */
export function reduce(collection, callback, accumulator) {
  return Object.values(collection).reduce(callback, accumulator)
}

export default {
  get,
  set,
  each,
  reduce
}
