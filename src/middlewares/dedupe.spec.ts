import mockAxios from 'jest-mock-axios'
import Requester, { Middleware } from '../requester'
import dedupe from './dedupe'


const ENDPOINT = 'https://example.com/graphql'
const request = Requester({
  url: ENDPOINT,
  middlewares: [ dedupe ],
})

describe('graphql-requester/dedupe', () => {

  beforeEach(() => {
    mockAxios.reset()
  })

  it('should make request once', (done) => {
    const params: any  = [ 'test', '' ]
    const expectedData = 'test'
    const response = { data: 'test' }

    Promise.all([
      request(params[0], params[1]).then(({ data }) => {
        expect(data).toEqual(expectedData)
      }),
      request(params[0], params[1]).then(({ data }) => {
        expect(data).toEqual(expectedData)
      }),
      request(params[0], params[1]).then(({ data }) => {
        expect(data).toEqual(expectedData)
      }),
    ])
      .then(() => {
        expect(mockAxios.post).toBeCalledTimes(1)
        done()
      })


    setTimeout(() => {
      mockAxios.mockResponse(response)
    })
  })

  it('should make multiple requests if options passed', (done) => {
    const params: any  = [ 'test', '', { multiple: true } ]
    const expectedData = (number: number) => `test${number}`
    const response = (number: number) => ({ data: `test${number}` })

    request(params[0], params[1], params[2]).then(({ data }) => {
      expect(data).toEqual(expectedData(1))
    })

    request(params[0], params[1], params[2]).then(({ data }) => {
      expect(data).toEqual(expectedData(2))
    })

    request(params[0], params[1], params[2]).then(({ data }) => {
      expect(data).toEqual(expectedData(3))
      expect(mockAxios.post).toBeCalledTimes(3)
      done()
    })

    setTimeout(() => {
      mockAxios.mockResponse(response(1))
      mockAxios.mockResponse(response(2))
      mockAxios.mockResponse(response(3))
    })
  })

  it('should be able to handle new request after request is finished', (done) => {
    const params: any  = [ 'test', '' ]
    const expectedData = (number: number) => `test${number}`
    const response = (number: number) => ({ data: `test${number}` })

    request(params[0], params[1]).then(({ data }) => {
      expect(data).toEqual(expectedData(1))

      request(params[0], params[1]).then(({ data }) => {
        expect(data).toEqual(expectedData(2))
        done()
      })
    })

    setTimeout(() => {
      mockAxios.mockResponse(response(1))
      setTimeout(() => {
        mockAxios.mockResponse(response(2))
      })
    })
  })

  it('should not call middleware next to dedupe if request was deduped', (done) => {
    const params: any  = [ 'test', '' ]
    const fnToCall1 = jest.fn()
    const fnToCall2 = jest.fn()
    const expectedData = 'test'
    const response = { data: 'test' }

    const middleware1: Middleware<{}> = () => {
      fnToCall1()
    }

    const middleware2: Middleware<{}> = () => {
      fnToCall2()
    }

    const localRequest = Requester({
      url: ENDPOINT,
      middlewares: [ middleware1, dedupe, middleware2 ],
    })

    Promise.all([
      localRequest(params[0], params[1]).then(({ data }) => {
        expect(data).toEqual(expectedData)
      }),
      localRequest(params[0], params[1]).then(({ data }) => {
        expect(data).toEqual(expectedData)
      }),
      localRequest(params[0], params[1]).then(({ data }) => {
        expect(data).toEqual(expectedData)
      }),
    ])
      .then(() => {
        expect(mockAxios.post).toBeCalledTimes(1)
        expect(fnToCall1).toBeCalledTimes(3)
        expect(fnToCall2).toBeCalledTimes(1)
        done()
      })


    setTimeout(() => {
      mockAxios.mockResponse(response)
    })
  })
})
