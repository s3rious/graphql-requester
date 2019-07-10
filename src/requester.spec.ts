import mockAxios from 'jest-mock-axios'
import Requester, { Middleware } from './requester'


const ENDPOINT = 'https://example.com/graphql'
const request = Requester({ url: ENDPOINT })

describe('sb-request-new', () => {

  beforeEach(() => {
    mockAxios.reset()
  })

  it('should make request', (done) => {
    const params = [ 'test', '' ]
    const expectedData = 'test'
    const response = { data: 'test' }

    request(params[0], params[1]).then(({ data }) => {
      expect(mockAxios.post).toBeCalledTimes(1)
      expect(data).toEqual(expectedData)

      done()
    })

    mockAxios.mockResponse(response)
  })

  it('should make request to proper endpoint', (done) => {
    const params = [ 'test', '' ]
    const expectedParams = [ `${ENDPOINT}?name=test`, { query: '' } ]
    const expectedData = 'test'
    const response = { data: 'test' }

    request(params[0], params[1]).then(({ data }) => {
      expect(mockAxios.post).toBeCalledWith(expectedParams[0], expectedParams[1])
      expect(data).toEqual(expectedData)

      done()
    })

    mockAxios.mockResponse(response)
  })

  it('should pass proper params to middleware', (done) => {
    const params = [ 'test', '' ]

    const middleware1: Middleware<{}> = (ctx) => {
      const { name, query } = ctx
      expect([ name, query ]).toEqual(params)

      done()
    }

    const localRequest = Requester({
      url: ENDPOINT,
      middlewares: [ middleware1 ],
    })

    localRequest(params[0], params[1])
  })

  it('should call middlware in right order', (done) => {
    const params = [ 'test', '' ]
    const expectedParams = [ `${ENDPOINT}?name=test`, { query: '' } ]
    const expectedData = 'test'
    const response = { data: 'test' }

    const fnToCall1 = jest.fn()
    const fnToCall2 = jest.fn()
    const fnToCall3 = jest.fn()
    let fn1Call: Date
    let fn2Call: Date
    let fn3Call: Date

    const middleware1: Middleware<{}> = () => {
      fnToCall1()
      fn1Call = new Date()

      return new Promise((resolve) => {
        setTimeout(() =>  {
          resolve()
        }, 5)
      })
    }

    const middleware2: Middleware<{}> = () => {
      fnToCall2()
      fn2Call = new Date()

      return new Promise((resolve) => {
        setTimeout(() =>  {
          resolve()
        }, 5)
      })
    }

    const middleware3: Middleware<{}> = () => {
      fnToCall3()
      fn3Call = new Date()

      return new Promise((resolve) => {
        setTimeout(() =>  {
          resolve()
        }, 5)
      })
    }

    const localRequest = Requester({
      url: ENDPOINT,
      middlewares: [ middleware1, middleware2, middleware3 ],
    })

    localRequest(params[0], params[1]).then(({ data }) => {
      expect(fnToCall1).toBeCalled()
      expect(fnToCall2).toBeCalled()
      expect(fnToCall3).toBeCalled()
      expect(
        (fn1Call.getTime() < fn2Call.getTime())
        && (fn2Call.getTime() < fn3Call.getTime())
      ).toBeTruthy()
      expect(mockAxios.post).toBeCalledWith(expectedParams[0], expectedParams[1])
      expect(data).toEqual(expectedData)

      done()
    })

    setTimeout(() => {
      mockAxios.mockResponse(response)
    }, 20)
  })

  it('should reject if there was an error in a middleware', (done) => {
    const params = [ 'test', '' ]
    const expectedError = 'error'
    const actualError = 'error'

    const middleware1: Middleware<{}> = () => {
      throw new Error(actualError)
    }

    const localRequest = Requester({
      url: ENDPOINT,
      middlewares: [ middleware1 ],
    })

    const request = localRequest(params[0], params[1]).then(() => {}, (error) => {
      expect(mockAxios.post).not.toBeCalled()
      expect(error.message).toEqual(expectedError)

      done()
    })
  })

})
