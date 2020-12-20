import { get, set, each, reduce } from './util'

/**
 * Generates the "$validators" getters for each group
 *
 * @param {Object} context
 * @param {Object} groups
 * @returns {Object}
 */
function setValidatorsGetters(context, groups) {
  each(groups, (validators, name) => {
    if (!get(context.$validators, name)) {
      set(context.$validators, name, {})
    }

    each(validators, (validator, key) => {
      Object.defineProperty(get(context.$validators, name), key, {
        enumerable: true,
        get() {
          return validator(get(context, name))
        }
      })
    })
  })
}

/**
 * Generates the "$valid" getters for each group
 *
 * @param {Object} context
 * @param {Object} groups
 * @returns {Object}
 */
function setValidGetters(context, groups) {
  each(groups, (group, name) => {
    const names = name.split('.')
    const depth = names.length > 1
    const key = depth ? names.pop() : name

    let target = depth ? get(context.$valid, names.join('.')) : context.$valid

    if (depth && !target) {
      target = get(set(context.$valid, names.join('.'), {}), names.join('.'))
    }

    Object.defineProperty(target, key, {
      enumerable: true,
      get() {
        return reduce(group, (state, validator) => {
          return state ? validator(get(context, name)) : false
        }, true)
      }
    })
  })
}

export default {
  install(Vue) {
    Object.assign(Vue.prototype, {
      $dirty: {},
      $valid: {},
      $validators: {}
    })

    Vue.mixin({
      created() {
        const groups = this.$options.validators

        if (typeof groups !== 'object') {
          return
        }

        // Initialize the properties of "$dirty".
        Object.keys(groups).forEach(groups, (name) => set(this.$dirty, name, false))

        // Initialize the getters of "$validators".
        setValidatorsGetters(this, groups)

        // Initialize the getters of "$valid".
        setValidGetters(this, groups)

        // Observes and verifies whether the model property has been modified.
        Object.keys(groups).forEach(groups, (name) => {
          const unwatch = this.$watch(name, () => {
            set(this.$dirty, name, true)
            unwatch()
          })
        })
      }
    })
  }
}
