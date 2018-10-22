const Dag = require('../dag')
const deepEqual = require('deep-equal')
const expect = require('chai').expect

describe('Removal Test', () => {
  describe('DAG(order=8, size=8)', () => {
    let dag
    let V
    let E
    let D = []

    beforeEach(() => {
      dag = new Dag()
      V = ['a', 'b', 'c', 'd', 'e', 'f', 'x', 'y']
      // D['d'] = ['a']
      // D['e'] = ['a', 'd', 'b']
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

    it('should remove each edge', () => {
      E.forEach((edge, index) => {
        const removedDag = dag._deepClone()
        const removedE = E.slice(0)
        removedDag.removeEdge(edge.from, edge.to)
        removedE.splice(index, 1)
        removedDag.size.should.equal(removedE.length)
        removedE.forEach(e => removedDag.includes(e.from, e.to).should.equal(true))
      })
    })

    it('should not remove an edge (e, b) with unknown vertex \'e\'', () => {
      const removedDag = dag._deepClone()
      removedDag.removeEdge('e', 'b')

      deepEqual(dag, removedDag).should.equal(true)
    })

    it('should not remove non-exist edge (d, a)', () => {
      const removedDag = dag._deepClone()
      removedDag.removeEdge('d', 'a')

      deepEqual(dag, removedDag).should.equal(true)
    })

    it('should remove all vertex', () => {
      const removedDag = dag._deepClone()
      let removedE = E.slice(0)
      let removedV = V.slice(0)

      V.forEach((vertex) => {
        let target = removedV.findIndex(v => v == vertex)
        removedV.splice(target, 1)
        removedE = removedE.filter(e => e.from !== vertex && e.to !== vertex)
        removedDag.removeVertex(vertex)
        deepEqual(removedDag.V, removedV).should.equal(true)
        removedDag.size.should.equal(removedE.length)
        removedE.forEach(e => removedDag.edge(e.from, e.to).should.deep.equal(e))

      })
    })

    it('should remove each vertex', () => {
      V.forEach((vertex) => {
        // clone dag and E
        const removedDag = dag._deepClone()
        //const removedV = [];
        let removedE = E.slice(0)

        // remove from clones
        removedDag.removeVertex(vertex)
        const removedV = dag.V.filter(v => v != vertex)
        removedE = removedE.filter(e => e.from !== vertex && e.to !== vertex)

        // check the removal
        removedDag.order.should.equal(removedV.length)
        removedDag.V.forEach(v => removedV.should.includes(v))
        removedDag.V.should.not.includes(vertex)
        removedDag.size.should.equal(removedE.length)
        removedE.forEach(e => removedDag.edge(e.from, e.to).should.deep.equal(e))
      })
    })

    it('should not remove unknown vertex', () => {
      expect(() => dag.removeVertex('t')).to.throw('Unknown vertex')

    })

    it('should  remove single vertex ', () => {
      const removedDag = dag._deepClone()
      removedDag.addVertex('z')
      removedDag.removeVertex('z')

      deepEqual(dag, removedDag).should.equal(true)
    })

    it('should remove to vertex in DAG with only 2 vertices', () => {
      dag = new Dag()
      dag.add('a', 'b')
      dag.removeVertex('b')
      deepEqual(dag.V, ['a']).should.equal(true)
    })

    it('should remove from vertex in DAG with only 2 vertices', () => {
      dag = new Dag()
      dag.add('a', 'b')
      dag.removeVertex('a')
      deepEqual(dag.V, ['b']).should.equal(true)
    })

    it('should remove to edge in DAG with only 2 vertices', () => {
      dag = new Dag()
      const vertices = ['a', 'b']
      dag.add('a', 'b')
      dag.removeEdge('a', 'b')
      expect(dag.edge('a', 'b')).to.be.undefined
      vertices.forEach((v) => dag.V.includes(v).should.equal(true))
    })
    it('should  remove vertex in a middle', () => {
      dag.removeVertex('d')
      deepEqual(dag.V, ['b', 'a', 'c', 'e', 'f', 'x', 'y']).should.equal(true)
    })

  })
})
