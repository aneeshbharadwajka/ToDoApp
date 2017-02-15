const chai = require('chai')
const expect = chai.expect
const chaiHttp = require('chai-http')
const server = require('../server')
chai.use(chaiHttp)

describe('Compare Numbers', function () {
  it('1 should equal 1', function () {
    expect(1).to.equal(1)
  })
  it('2 should be greater than 1', function () {
    expect(2).to.be.greaterThan(1)
  })
})

describe('/GET ', () => {
  it(' should  return 200 status', (done) => {
        chai.request(server)
            .get('/read')
            .end((err, res) => {
              expect(res.status).to.be.eqls(200)
              done()
            })
      })
})
