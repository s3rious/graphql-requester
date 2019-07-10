# graphql-requester

Axios-based library used to request data from grapql (now with middlewares!)

# Usage

Call `request` with two or three parameters:
* 1st — Name of the query, used to name the query in requests tab of inspector. Also used in dedupe middleware in cacheKey
* 2nd — Graphql query
* 3rd — Options, used by middlewares

```
import requester, { dedupe } from 'graphql-requester'

const request = requester({
  url: 'https://countries.trevorblades.com/',
  middlewares: [ dedupe ],
})

request('countries', `{
  {
    countries {
      name
    }
  }
}`)
```
