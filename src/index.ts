import '@babel/polyfill'
import Requester from './requester'
import {
  dataExtract,
  errorExtract,
  loader, LoaderOpts,
  dedupe, DedupeOpts,
} from './middlewares'


export default Requester

export {
  dataExtract,
  errorExtract,
  loader, LoaderOpts,
  dedupe, DedupeOpts,
}
