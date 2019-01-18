const Dag = require('../dag')
const expect = require('chai').expect
require('chai').should();
const deepEqual = require('deep-equal')
const util = require('util')


describe('Addition Test', () => {
  describe('DAG(order=4, size=4)', () => {
    let dag
    let V = []
    let E = []

    beforeEach(() => {
      dag = new Dag()
      V = ['a', 'b', 'c', 'd']
      E = []
      E.push({from: 'a', to: 'b'})
      E.push({from: 'b', to: 'c'})
      E.push({from: 'd', to: 'b'})
      E.push({from: 'a', to: 'd'})
      E.forEach(e => dag.add(e.from, e.to))
    })

   
    it('should add single vertices', () => {
      let _dag = new Dag()
      V.forEach(v => _dag.addVertex(v))
      _dag.order.should.equal(V.length)
      _dag.V.length.should.equal(V.length)
      _dag.V.forEach(v => V.should.include(v))
      _dag.size.should.equal(0)
      _dag.E.length.should.equal(0)
    })

    it('should add edges between vertices single vertices', () => {
      let _dag = new Dag()
      V.forEach(v => _dag.addVertex(v))
      E.forEach(e => _dag.add(e.from, e.to))
      _dag.order.should.equal(V.length)
      _dag.V.length.should.equal(V.length)
      _dag.V.forEach(v => V.should.include(v))

      _dag.size.should.equal(E.length)
      _dag.E.length.should.equal(E.length)

      dag.E.forEach((e) => {
        _dag.includes(e.from, e.to).should.equal(true)
      })
      //***deepEqual(dag, _dag).should.equal(true)
    })

    it('should have 4 vertices', () => {
      dag.order.should.equal(V.length)
      dag.V.length.should.equal(V.length)
      dag.V.forEach(v => V.should.include(v))
    })

    it('shoud have 4 edges', () => {
      dag.size.should.equal(E.length)
      dag.E.length.should.equal(E.length)
      dag.E.reduce((outterFlag, actualEdge) => {
        const edgeInclusion = E.reduce((innerFlag, edgeToInclude) =>
          innerFlag || deepEqual(actualEdge, edgeToInclude), false)
        return outterFlag && edgeInclusion
      }, true)
    })

    it('should include the edges', () => {
      E.forEach(e => dag.includes(e.from, e.to).should.equal(true))
    })

    it('should have the edges', () => {
      E.forEach((e) => {
        const actual = dag.edge(e.from, e.to)
        actual.should.deep.equal(e)
      })
    })

    it('should not have an edge(c, a)', () => expect(dag.edge('c', 'a')).to.be.undefined)

    it('should reject a self-loop edge', () => {
      expect(() => dag.add('a', 'a')).to.throw('DAG has cycle(s)')
      dag.order.should.equal(V.length)
      dag.size.should.equal(E.length)
    })

    it('should reject a triangular edge', () => {
      expect(() => dag.add('d', 'a')).to.throw('DAG has cycle(s)')
      dag.order.should.equal(V.length)
      dag.size.should.equal(E.length)
    })

    it('should reject a cyclic edge', () => {
      expect(() => dag.add('c', 'a')).to.throw('DAG has cycle(s)')
      dag.order.should.equal(V.length)
      dag.size.should.equal(E.length)
    })
  })
})
