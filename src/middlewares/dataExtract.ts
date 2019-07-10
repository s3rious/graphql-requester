import { Middleware } from '../requester'


const dataExtract: Middleware<never> = (ctx) => {
  ctx.preprocessors = ctx.preprocessors
  ctx.preprocessors.push((response) => {
    if (response && response.data && response.data.data) {
      return response.data.data
    }

    return response
  })
}


export default dataExtract
