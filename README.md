# ill-formed-opts

An options object schema validator for Node.js.

#### Installation
```shell
npm install dannynemer/ill-formed-opts
```

<!-- div class="doc-container" -->

<!-- div -->


<!-- div -->

### <a id="illFormedOpts"></a>`illFormedOpts(schema, [options], [ignoreUndefined])`
<a href="#illFormedOpts">#</a> [&#x24C8;](https://github.com/DannyNemer/ill-formed-opts/blob/master/illFormedOpts.js#L138 "View in source")

Checks if `options` adheres to `schema`, thereby simulating static function arguments (i.e., type checking and arity).
<br>
<br>
Prints descriptive, helpful errors messages when `options` is ill-formed, including the line number of the offending function call.

#### Arguments
1. `schema` *(Object)*: The definition of required and optional properties for `options`.
2. `[options]` *(Object)*: The options object to check for conformity to `schema`.
3. `[ignoreUndefined]` *(Object)*: Specify ignoring non-`required` `options` properties defined as `undefined`. Otherwise, reports them as errors, which is useful for catching broken references.

#### Returns
*(boolean)*:  Returns `true` if `options` is ill-formed, else `false`.

#### Example
```js
var illFormedOpts = require('ill-formed-opts')

var mySchema = {
  // Optionally accept an `boolean` for 'silent'.
  silent: Boolean,
  // Optionally accept an `Array` of `string`s for 'args'.
  args: { type: Array, arrayType: String },
  // Require `string` 'modulePath'.
  modulePath: { type: String, required: true },
  // Optionally accept one of predefined values for 'stdio'.
  stdio: { values: [ 'pipe', 'ignore', 0, 1, 2 ] },
  // Optionally accept an `Object` that adheres to the nested `schema` object.
  options: { type: Object, schema: {
    cwd: String,
    uid: Number,
  } },
}

function myFork(options) {
  if (illFormedOpts(mySchema, options)) {
    // => Prints descriptive, helpful error message

    throw new Error('Ill-formed options')
  }

  // ...stuff...
}
```
The contents of `foo.js`:
```js
myFork({ modulePath: './myModule.js', stdio: 'out' })
```
Output:
<br><img src="https://raw.githubusercontent.com/DannyNemer/ill-formed-opts/master/doc/illFormedOpts-example.jpg" alt="illFormedOpts() example output"/>

**Property names and types:** `mySchema` is an object where each property name defines an accepted `options` property. Each `mySchema` property value defines the accepted data type(s) for that property using function constructors (e.g., `Array`, `Object`, `Number`, `MyClassName`):

```js
var mySchema = {
  list: Array,
  // => Optionally accepts the `list` property in `options`, which must be an `Array`.
}
```

When specifying primitive data types (e.g., `string`, `number`, and `boolean`), use their corresponding function constructors even if the passed `options` value is instantiated using literals instead of the constructor (and consequently are complex data types):

```js
var mySchema = {
  name: String,
  // => Accepts primitive type values, `{ name: 'dantil' }`, as well as complex type
  //    references of the same type, `{ name: String('dantil') }`.
}
```

**Required properties:** To require an `options` property, set the `mySchema` property to an object defining `type` and `required`:

```js
var mySchema = {
  port: { type: Number, required: true },
  // => Requires `options` with the property `port`.
}
```

**Variadic types:** To accept varying types for an `options` property, set the `mySchema` property to an object defining `type` as an array of function constructors:

```js
var mySchema = {
   count: { type: [ Number, String ] },
   // => Accepts values for `count` of type `Number` or `String`.
   name: { type: [ String ] },
   // => Accepts values for `count` of only type `String`.
   alias: String,
   // => Accepts values for `count` of only type `String` (identical to `name`).
}
```

**Array element types:** To accept an `Array` containing values of specific type(s), set the `mySchema` property to an object defining `type` as `Array` and `arrayType` as the function constructor(s):

```js
var mySchema = {
  names: { type: Array, arrayType: String },
  // => Accepts an `Array` containing elements of type `String` for `names`; e.g.,
  //    `{ names: [ 'dantil' ] }`.
  paths: { type: Array, arrayType: [ String ] },
  // => Behavior identical to `names` property.
  values: { type: Array, arrayType: [ Number, String ] },
  // => Accepts an `Array` containing elements of type `String` or `Number` for
  //    `values`.
  elements: { type: Array, arrayType: Object, allowEmpty: true },
  // => Accepts an `Array` containing elements of type `Object`, and does not report
  //    an error if the array is empty.
}
```

**Predefined values:** To only accept values from a predefined set, set the `mySchema` property to an object defining `values` as an array of the values:

```js
var mySchema = {
  fruit: { values: [ 'apple', 'orange', 'pear' ] },
  // => Only accepts 'apple', 'orange', or 'pear' as a value for `fruit`; e.g.,
  //    `{ fruit: 'apple' }`.
}
```

**Nested object schemas:** To recursively check if a passed `Object` value adhere to a separate, nested schema, set the `mySchema` property to an object defining `type` as `Object` and `schema` as an object following the `options` parameterization:

```js
var mySchema = {
  childOptions: { type: Object, schema: {
    cwd: String,
    uid: Number,
  } },
  // => Recursively checks value for `childOptions` adheres to `schema`.
}
```
* * *

<!-- /div -->

<!-- /div -->

<!-- /div -->
