import mockAxios from 'jest-mock-axios'
import Requester from '../requester'
import errorExtract from './errorExtract'


const ENDPOINT = 'https://example.com/graphql'
const request = Requester({
  url: ENDPOINT,
  middlewares: [ errorExtract ],
})

describe('sb-request-new/errorExtract', () => {

  beforeEach(() => {
    mockAxios.reset()
  })

  it('should extract errors from errors', (done) => {
    const params = [ 'test', '' ]
    const expectedError = [
      {
        'message': 'Field "name" must not have a selection since type "String!" has no subfields.',
        'locations': [ { 'line': 4, 'column': 10 } ],
      },
    ]
    const response = {
      data: null,
      errors: [
        {
          'message': 'Field "name" must not have a selection since type "String!" has no subfields.',
          'locations': [ { 'line': 4, 'column': 10 } ],
        },
      ],
    }

    request(params[0], params[1]).then(() => {}, (errors) => {
      expect(errors).toEqual(expectedError)
      done()
    })

    setTimeout(() => {
      mockAxios.mockError(response)
    })
  })

  it('should return errors as is if no data/data present', (done) => {
    const params = [ 'test', '' ]
    const expectedError = { damn: 'Error' }
    const response = { damn: 'Error' }

    request(params[0], params[1]).then(() => {}, (errors) => {
      expect(errors).toEqual(expectedError)
      done()
    })

    setTimeout(() => {
      mockAxios.mockError(response)
    })
  })
})
