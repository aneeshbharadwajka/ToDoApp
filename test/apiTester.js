const chai = require('chai')
const expect = chai.expect
const chaiHttp = require('chai-http')
const server = require('/Users/aneeshbharadwajka/Documents/projects/ToDoApp/server.js')
chai.use(chaiHttp)

describe('Check GET api call which', () => {
  it(' should  return 200 status on success', (done) => {
    chai.request(server)
            .get('/read')
            .end((err, res) => {
              expect(res.status).to.be.eqls(200)
              done()
            })
  })
})
describe('Check POST api call which', () => {
  it(' should  return 200 status on success', (done) => {
    const dat = 'hello'
    chai.request(server)
            .post('/write/' + dat)
            .end((err, res) => {
              expect(res.status).to.be.eqls(200)
              done()
            })
  })

  it(' should  return 200 status on success', (done) => {
    chai.request(server)
            .post('/write/')
            .end((err, res) => {
              expect(res.status).to.be.eqls(404)
              done()
            })
  })
})

describe('Check PUT call when status is given', () => {
    it(' should return 200 status and updating status if id is present else 501', (done) => {
      const id = 821 
      chai.request(server)
          .put('/update/' + id)
          .send({ status: false })
          .end((err, res) => {
            if (err) {
              expect(res.status).to.be.eqls(500)
            }
            else {
              expect(res.body.message).to.be.eqls(`{ Updated task for returnn id = ${id} }`)
              expect(res.status).to.be.eqls(200)
            }
            
            done()
          })
    })
})