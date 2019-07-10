import axios, { AxiosRequestConfig } from 'axios'
import Call from './call'


// Remove after ts 3.5
// https://devblogs.microsoft.com/typescript/announcing-typescript-3-5-rc/#the-omit-helper-type
type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

export type Url       = string
export type Name      = string
export type Query     = string
export type Opts<T>   = T & {}
export type Params<T> = [ Name, Query, Opts<T> ]

export type Context<T> = {
  name: Name,
  query: Query,
  opts: Opts<T>,
  cancelled: boolean
  preprocessors: (<T>(response: T & any) => T)[],
  errorHandlers: (<T>(error: T & any) => T)[],

  call?: Promise<any>
}

export type Middleware<T> = (ctx: Context<T>) => void

export type RequesterType = {
  url: Url
  options?: Omit<AxiosRequestConfig, 'url' | 'baseURL'>
  middlewares?: Middleware<{}>[]
}

export type Request<T> = (name: Name, query: Query, opts?: T & Opts<{}>) => Promise<any>


/**
 * Factory of requests. generates and returns request fuction
 *
 * @param opts Options of factory
 * @param opts.url Base graphql endpoint, e.g. https://example.com/graphql
 * @param opts.options Object of axios options
 * @param opts.middlewares Array of middlewares
 */
const Requester = <T>(opts: RequesterType): Request<T> => {
  type Ctx = Context<T>
  const { url, options = {}, middlewares = [] } = opts
  const fetcher = axios.create({ ...options })

  /**
   * Request function, fires a request to endpoint with middlewares and options
   *
   * @param name Name of the query, used to name the query in requests tab of inspector (also used in dedupe middleware in cachekey)
   * @param query Graphql query
   * @param opts Options, used by middlewares
   */
  return (name, query, opts) => {
    let ctx: Ctx = {
      name,
      query,
      opts,
      cancelled: false,
      preprocessors: [],
      errorHandlers: [],
    }

    const call = Call(ctx, fetcher, url, name, query)
    ctx.call = call

    if (middlewares.length < 1) {
      return call.fire()
    }

    const chain: Promise<Ctx> = new Promise((resolve, reject) => {
      [ ...middlewares ].reduce(
        async (chainLink, middleware): Promise<Ctx | void> => {
          try {
            await chainLink

            if (ctx.cancelled) {
              return resolve(ctx)
            }

            await middleware(ctx)

            return ctx
          }
          catch (error) {
            return Promise.reject(error)
          }
        },
        Promise.resolve()
      )
        .then(
          () => resolve(ctx),
          (error) => reject(error)
        )
    })

    let result = chain.then((ctx) => {
      if (ctx && ctx.cancelled) {
        return ctx.call
      }

      return call.fire()
    })

    return result
  }
}


export default Requester
