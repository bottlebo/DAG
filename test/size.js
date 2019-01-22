const Dag = require('../dag-new')
require('chai').should();

describe('Order and Size Test', () => {
  describe('DAG(order=8, size=8)', () => {
    let dag
    let E

    beforeEach(() => {
      dag = new Dag()
      E = []
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
    it('should order=8, size=8', () => {
      dag.size.should.equal(8)
      dag.order.should.equal(8)
    })
  })
})
