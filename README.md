# graphql-requester &middot; [![Travis CI Status](https://travis-ci.org/s3rious/graphql-requester.svg?branch=master)](https://travis-ci.org/s3rious/graphql-requester) [![codecov coverage](https://codecov.io/gh/s3rious/graphql-requester/branch/master/graph/badge.svg)](https://codecov.io/gh/s3rious/graphql-requester) [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/s3rious/graphql-requester/blob/master/LICENSE) 

Axios-based library used to request data from graphql (now with middlewares!).

```js
const request = Requester({
  url: "https://countries.trevorblades.com/",
  middlewares: [dedupe]
})

await countries = request("countries", `{
  name
}`)

<...>
```

Example: [/example/src/components/CountryList/index.js](https://github.com/s3rious/graphql-requester/blob/master/example/src/components/CountryList/index.js).

## Usage

### Create `Requester` instance

Firstly you have to create `Requester` instance, it receives object with three fields:
##### `url` 
Basically, your graphql endpoint, e.g. `https://countries.trevorblades.com/`
##### `options` 
Object of [axios options](https://github.com/axios/axios#request-config) for an axios instance, used, for example, if you need to pass specific header or something: `{ headers: { "X-Requested-With": "XMLHttpRequest"} }` .
##### `middlewares` 
Array of middlewares, built-in or your own, more on them later.

#### Example:
```js
import { Requester, dedupe } from "graphql-requester"

const request = Requester({
  url: "https://countries.trevorblades.com/",
  middlewares: [dedupe]
})

export default request
```

### Call instance

After that you're ready to call `Requester` instance you've configured.

Instance with three parameters:
##### Name of the query.
String. Used to name the query in requests tab of inspector. Also used in dedupe middleware in cacheKey, e.g. `products`
##### Graphql query.
String. e.g:
```
products {
  name
}
```
##### Options, used by middlewares.
Object. For example `dedupe` middleware uses `muliple` one: `{ multiple: true }`

### Middlewares

`graphql-requester` bundled with several middleware out of the box:

##### `dataExtract` 
Extracts data from response object to work with it in the next promise chain.

##### `errorExtract`
Does the same with error.

##### `dedupe` 
Deduplicates same requests for you, for example if you called same request several time and first call isn't finished, second call will be just the link to the first one and will not be called. But if you really need to place several calls in the same time you can pass `multiple: true` to the options.

##### `loader` 
Is a function which accepts object with two callbacks, `onBefore` and `onAfter` and returns middleware. Used to wrap all requests with some kind of global loader. For example:

```js
const loaderMiddleware = loader({
  onBefore: startLoader,
  onAfter: endLoader
});

const request = Requester({
  middlewares: [loaderMiddleware]
})
```

And after that your `Requester` instance will always invoke that callback on before and after the call, but if you don't need to invoke it, you can pass `{ withLoader: false }` top options.

#### Writing your own middleware

Each middleware receives `ctx` as an first and only argument, it cointains such fields like:
##### `call`
Promise. An promise of the call which will be fired.
##### `name`
String. Name of the query, first argument of call of an instance.
##### `query`
String. Graphql query itself, second argument.
##### `opts`
Object. Call options, third argument.
##### `cancelled`
Boolean. If it will be mutated to false, chain of middlwares will be broken an call will fire right after.
##### `preprocessors`
Array of functions. Will be called in a sequence on a successful request, each of function receives resolved data modified by previous middleware and should return modified version of it.
##### `errorHandlers`
Array of functions. Basically the same as `preprocessors`, but for errors. Will be called in a sequence on a failed request.


## TypeScript 

Definitions included.

```ts
import {
  dataExtract,
  loader, LoaderOpts,
  dedupe, DedupeOpts,
} from "graphql-requester"

<...>

const request = Requester<LoaderOpts & DedupeOpts>({
  middlewares: [ dedupe, dataExtract loaderMiddleware ]
})
```

## Licence

MIT
