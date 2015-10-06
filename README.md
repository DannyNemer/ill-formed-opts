# ill-formed-opts

An options object schema validator for Node.js.

<!-- div class="doc-container" -->

<!-- div -->


<!-- div -->

### <a id="illFormedOpts"></a>`illFormedOpts(schema, options)`
<a href="#illFormedOpts">#</a> [&#x24C8;](https://github.com/DannyNemer/ill-formed-opts/blob/master/illFormedOpts.js#L106 "View in source")

Checks if options object `options` adheres to `schema`. Simulates static function arguments (i.e., type checking and parameter count). Prints descriptive, helpful errors messages when `options` is ill-formed.
<br>
<br>
**Property names and types:** `schema` is an object where each property name defines an accepted `options` property. Each `schema` property value defines the accepted data type(s) for that property using function constructors (e.g., `Array`, `Object`, `Number`, `MyClassName`):<br>
```js
var schema = { list: Array }
// => Requires the `list` property in `options`, and must be an `Array`.
```
When a primitive data type is required (e.g., `string`, `number`, and `boolean`), use their corresponding function constructors even if the passed `options` value is instantiated using literals instead of the constructor (and consequently are complex data types):<br>
```js
var schema = { name: String }
// => Accepts primitive type values, `{ name: 'dantil' }`, as well as complex type
//    references of the same type, `{ name: String('dantil') }`.
```
**Optional properties:** To optionalize an `options` property, set the `schema` property to an object defining `type` and `optional`:<br>
```js
var schema = {
  port: { type: Number, optional: true }
  // => Accepts `options` with or without the property `port`.
}
```
**Variadic types:** To accept varying types for an `options` property, set the `schema` property to an object defining `type` as an array of function constructors:<br>
```js
var schema = {
   count: { type: [ Number, String ] },
   // => Accepts values for `count` of type `Number` or `String`.
   name: { type: [ String ] }
   // => Accepts values for `count` of only type `String` (identical to
   //    `{ name: String }`).
}
```
**Array element types:** To accept an `Array` containing values of specific type(s), set the `schema` property to an object defining `type` as `Array` and `arrayType` to the function constructor(s):<br>
```js
var schema = {
  names: { type: Array, arrayType: String },
  // => Accepts an `Array` containing elements of type `String` for `names`; e.g.,
  //    `{ names: [ 'dantil' ] }`.
  paths: { type: Array, arrayType: [ String ] },
  // => Behavior identical to `names` property.
  values: { type: Array, arrayType: [ Number, String ] }
  // => Accepts an `Array` containing elements of type `String` or `Number` for
  //    `values`.
}
```
**Predifined values:** To only accept values from a predefined set, set the `schema` property to an object defining `values` as an array of the values:<br>
```js
var schema = {
  fruit: [ 'apple', 'orange', 'pear' ]
}
// => Only accepts 'apple', 'orange', or 'pear' as a value for `fruit`; e.g.,
//   `{ fruit: 'apple' }`.
```

#### Arguments
1. `schema` *(Object)*: The definition of required and optional properties for `options`.
2. `options` *(Object)*: The options object to check for conformity to `schema`.

#### Returns
*(boolean)*:  Returns `true` if `options` is ill-formed, else `false`.

#### Example
```js
var schema = {
  // Must be a `number`.
  num: Number,

  // Must be a `number` (identical to previous parameter).
  otherNum: { type: Number },

  // Must be of type `Array` or `Object`.
  args: [ Array, Object ],

  // Must be of type `Array` or `Object` (identical to previous parameter).
  otherArgs: { type: [ Array, Object ] },

  // Must be `Array` containing only `strings`.
  strings: { type: Array, arrayType: String },

  // Must be `Array` containing only `strings`, `numbers`, or `booleans`.
  primitives: { type: Array, arrayType: [ String, Number, Boolean ] },

  // Parameter can be omitted.
  str: { type: String, optional: true },

  // Must be one of predefined values.
  val: { values: [ 'red', 'yellow', 'blue' ] }
}

function myFunc(options) {
  if (illFormedOpts(schema, options)) {
    // => Prints descriptive, helpful error messages

    // Handle ill-formed `options` how you choose
    throw new Error('ill-formed options')
  }

  // ...stuff...
}
```
* * *

<!-- /div -->

<!-- /div -->

<!-- /div -->
