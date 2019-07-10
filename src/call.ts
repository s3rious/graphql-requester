import { AxiosInstance } from 'axios'
import { Context, Url, Name, Query } from './requester'


type ControllablePromise<T> = { fire: () => Promise<T> } & Promise<T>

const Call = (
  ctx: Context<{}>,
  fetcher: AxiosInstance,
  url: Url,
  name: Name,
  query: Query,
) => {
  let _resolve: (value?: {}) => void
  let _reject: (reason?: any) => void

  const promise = new Promise((resolve, reject) => {
    _resolve = resolve
    _reject = reject
  }) as ControllablePromise<{}>

  promise.fire = async () => {
    const post = fetcher.post(`${url}?name=${name}`, { query })

    try {
      let response = await post
      if (ctx.preprocessors && ctx.preprocessors.length) {
        response = ctx.preprocessors.reduce((val, processor) => (processor(val)), response)
      }
      _resolve(response)

      return promise
    }
    catch (err) {
      let error = err
      if (ctx.errorHandlers && ctx.errorHandlers.length) {
        error = ctx.errorHandlers.reduce((val, handler) => (handler(val)), error)
      }
      _reject(error)

      return promise
    }
  }

  return promise
}


export default Call
