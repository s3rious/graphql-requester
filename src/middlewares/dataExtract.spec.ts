import mockAxios from 'jest-mock-axios'
import Requester from '../requester'
import dataExtract from './dataExtract'


const ENDPOINT = 'https://example.com/graphql'
const request = Requester({
  url: ENDPOINT,
  middlewares: [ dataExtract ],
})

describe('graphql-requester/dataExtract', () => {

  beforeEach(() => {
    mockAxios.reset()
  })

  it('should extract data from data/data', (done) => {
    const params  = [ 'test', '' ]
    const expectedData = { products: [ 'test1', 'test2' ] }
    const reponse = { data: { data: { products: [ 'test1', 'test2' ] } } }

    request(params[0], params[1]).then((data) => {
      expect(data).toEqual(expectedData)
      done()
    })

    setTimeout(() => {
      mockAxios.mockResponse(reponse)
    })
  })

  it('should return data as is if no data/data present', (done) => {
    const params  = [ 'test', '' ]
    const expectedData = { products: [ 'test1', 'test2' ] }
    const reponse = { data: { products: [ 'test1', 'test2' ] } }

    request(params[0], params[1]).then(({ data }) => {
      expect(data).toEqual(expectedData)
      done()
    })

    setTimeout(() => {
      mockAxios.mockResponse(reponse)
    })
  })
})
