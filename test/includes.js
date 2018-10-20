const Dag = require('../dag')
const expect = require('chai').expect
describe('Paths Down Test', () => {
  describe('DAG(order=8, size=8)', () => {
    let dag
    let E

    beforeEach(() => {
      E = []
      dag = new Dag()

      E.push({from: 'a', to: 'b'})
      E.push({from: 'b', to: 'c'})
      E.push({from: 'a', to: 'd'})
      E.push({from: 'd', to: 'e'})
      E.push({from: 'e', to: 'f'})
      E.push({from: 'd', to: 'x'})
      E.push({from: 'x', to: 'y'})
      E.push({from: 'b', to: 'e'})
      E.forEach(e => dag.add(e.from, e.to))
    })
    it('should find all edges', () => {
      E.forEach((e) => {
        dag.includes(e.from, e.to).should.equal(true)
      })
    })
  })
})
