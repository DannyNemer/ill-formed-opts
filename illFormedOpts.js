/**
 * @license
 * ill-formed-opts 0.0.1 - An options object schema validator for Node.js.
 * Copyright 2015 Danny Nemer
 * Available under MIT license <http://opensource.org/licenses/MIT>
 */

var util = require('dantil')

/**
 * Checks if options object `options` adheres to `schema`. Simulates static function arguments (i.e., type checking and parameter count). Prints descriptive, helpful errors messages when `options` is ill-formed.
 *
 * **Property names and types:** `schema` is an object where each property name defines an accepted `options` property. Each `schema` property value defines the accepted data type(s) for that property using function constructors (e.g., `Array`, `Object`, `Number`, `MyClassName`):
 * ```js
 * var schema = { list: Array }
 * // => Requires the `list` property in `options`, and must be an `Array`.
 * ```
 * When a primitive data type is required (e.g., `string`, `number`, and `boolean`), use their corresponding function constructors even if the passed `options` value is instantiated using literals instead of the constructor (and consequently are complex data types):
 * ```js
 * var schema = { name: String }
 * // => Accepts primitive type values, `{ name: 'dantil' }`, as well as complex type
 * //    references of the same type, `{ name: String('dantil') }`.
 * ```
 * **Optional properties:** To optionalize an `options` property, set the `schema` property to an object defining `type` and `optional`:
 * ```js
 * var schema = {
 *   port: { type: Number, optional: true }
 *   // => Accepts `options` with or without the property `port`.
 * }
 * ```
 * **Variadic types:** To accept varying types for an `options` property, set the `schema` property to an object defining `type` as an array of function constructors:
 * ```js
 * var schema = {
 *    count: { type: [ Number, String ] },
 *    // => Accepts values for `count` of type `Number` or `String`.
 *    name: { type: [ String ] }
 *    // => Accepts values for `count` of only type `String` (identical to
 *    //    `{ name: String }`).
 * }
 * ```
 * **Array element types:** To accept an `Array` containing values of specific type(s), set the `schema` property to an object defining `type` as `Array` and `arrayType` to the function constructor(s):
 * ```js
 * var schema = {
 *   names: { type: Array, arrayType: String },
 *   // => Accepts an `Array` containing elements of type `String` for `names`; e.g.,
 *   //    `{ names: [ 'dantil' ] }`.
 *   paths: { type: Array, arrayType: [ String ] },
 *   // => Behavior identical to `names` property.
 *   values: { type: Array, arrayType: [ Number, String ] }
 *   // => Accepts an `Array` containing elements of type `String` or `Number` for
 *   //    `values`.
 * }
 * ```
 * **Predifined values:** To only accept values from a predefined set, set the `schema` property to an object defining `values` as an array of the values:
 * ```js
 * var schema = {
 *   fruit: [ 'apple', 'orange', 'pear' ]
 * }
 * // => Only accepts 'apple', 'orange', or 'pear' as a value for `fruit`; e.g.,
 * //   `{ fruit: 'apple' }`.
 * ```
 *
 * @static
 * @param {Object} schema The definition of required and optional properties for `options`.
 * @param {Object} options The options object to check for conformity to `schema`.
 * @returns {boolean} Returns `true` if `options` is ill-formed, else `false`.
 * @example
 *
 * var schema = {
 *   // Must be a `number`.
 *   num: Number,
 *
 *   // Must be a `number` (identical to previous parameter).
 *   otherNum: { type: Number },
 *
 *   // Must be of type `Array` or `Object`.
 *   args: [ Array, Object ],
 *
 *   // Must be of type `Array` or `Object` (identical to previous parameter).
 *   otherArgs: { type: [ Array, Object ] },
 *
 *   // Must be `Array` containing only `strings`.
 *   strings: { type: Array, arrayType: String },
 *
 *   // Must be `Array` containing only `strings`, `numbers`, or `booleans`.
 *   primitives: { type: Array, arrayType: [ String, Number, Boolean ] },
 *
 *   // Parameter can be omitted.
 *   str: { type: String, optional: true },
 *
 *   // Must be one of predefined values.
 *   val: { values: [ 'red', 'yellow', 'blue' ] }
 * }
 *
 * function myFunc(options) {
 *   if (illFormedOpts(schema, options)) {
 *     // => Prints descriptive, helpful error messages
 *
 *     // Handle ill-formed `options` how you choose
 *     throw new Error('ill-formed options')
 *   }
 *
 *   // ...stuff...
 * }
 */
function illFormedOpts(schema, options) {
  // Check if missing an options parameter required by schema.
  for (var paramName in schema) {
    var paramSchema = schema[paramName]

    if (!paramSchema.optional && (!options || !options.hasOwnProperty(paramName))) {
      util.logError('Missing \'' + paramName + '\' property:')
      util.logPathAndObject(options, true)
      return true
    }
  }

  // Check if passed parameters conform to schema.
  for (var paramName in options) {
    // Check for unrecognized properties.
    if (!schema.hasOwnProperty(paramName)) {
      util.logError('Unrecognized property:', util.stylize(paramName))
      util.log('       Acceptable properties:', Object.keys(schema).map(function (prop) {
        return util.stylize(prop)
      }).join(', '))
      util.logPathAndObject(options, true)
      return true
    }

    var optsVal = options[paramName]
    var paramSchema = schema[paramName]
    var paramSchemaType = paramSchema.type || paramSchema
    var paramSchemaVals = paramSchema.values

    // Check for an accidentally passed `undefined` object; e.g., `undefined`, `[]`, `[ 1, undefined ]`.
    if (optsVal === undefined || (Array.isArray(optsVal) && (optsVal.length === 0 || optsVal.indexOf(undefined) !== -1))) {
      util.logError('undefined found in \'' + paramName + '\':')
      util.logPathAndObject(options, true)
      return true
    }

    if (paramSchemaVals) {
      // Check if passed value is not an acceptable value.
      if (paramSchemaVals.indexOf(optsVal) === -1) {
        util.logError('Unrecognized value for \'' + paramName + '\':', util.stylize(optsVal))
        util.log('       Acceptable values for \'' + paramName + '\':', paramSchemaVals)
        util.logPathAndObject(options, true)
        return true
      }
    } else if (Array.isArray(paramSchemaType)) {
      // Check if passed value is not of an acceptable type.
      if (paramSchemaType.indexOf(optsVal.constructor) === -1) {
        util.logError('Incorrect type for \'' + paramName + '\':', util.stylize(optsVal))
        util.log('       Acceptable types for \'' + paramName + '\':', concatConstructorNames(paramSchemaType))
        util.logPathAndObject(options, true)
        return true
      }
    } else {
      // Check if passed value is not of correct type.
      if (optsVal.constructor !== paramSchemaType) {
        util.logError('\'' + paramName + '\' not of type ' + util.colors.cyan(paramSchemaType.name) + ':', util.stylize(optsVal))
        util.logPathAndObject(options, true)
        return true
      }

      // Check if passed Array contains elements not of `arrayType` (if `arrayType` is defined).
      if (Array.isArray(optsVal) && paramSchema.arrayType) {
        var arrayType = paramSchema.arrayType

        if (Array.isArray(arrayType)) {
          for (var i = 0, optsValLen = optsVal.length; i < optsValLen; ++i) {
            var el = optsVal[i]

            if (arrayType.indexOf(el.constructor) === -1) {
              util.logError('\'' + paramName + '\' array contains element of incorrect type:', util.stylize(el))
              util.log('       Acceptable types for elements of \'' + paramName + '\':', concatConstructorNames(arrayType))
              util.logPathAndObject(options, true)
              return true
            }
          }
        } else {
          for (var i = 0, optsValLen = optsVal.length; i < optsValLen; ++i) {
            var el = optsVal[i]

            if (el.constructor !== arrayType) {
              util.logError('\'' + paramName + '\' array contains element not of type ' + util.colors.cyan(arrayType.name) + ':', util.stylize(el))
              util.logPathAndObject(options, true)
              return true
            }
          }
        }
      }
    }
  }

  // No errors.
  return false
}

// Export `illFormedOpts`.
module.exports = illFormedOpts