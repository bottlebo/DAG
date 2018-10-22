const Dag = require('../dag')
const deepEqual = require('deep-equal')

describe('Paths Down Test', () => {
  describe('DAG(order=8, size=8)', () => {
    let dag
    let E
    let paths = []

    beforeEach(() => {
      E = []
      paths['a'] = [
        ['a', 'b', 'c'],
        ['a', 'd', 'e', 'f'],
        ['a', 'b', 'e', 'f'],
        ['a', 'b', 'z'],
        ['a', 'd', 'x', 'y']
      ]
      paths['b'] = [
        ['b', 'c'], ['b', 'e', 'f'], ['b', 'z']
      ]
      paths['c'] = [['c']]
      paths['d'] = [['d', 'e', 'f'], ['d', 'x', 'y']]
      dag = new Dag()

      E.push({from: 'a', to: 'b'})
      E.push({from: 'b', to: 'c'})
      E.push({from: 'a', to: 'd'})
      E.push({from: 'd', to: 'e'})
      E.push({from: 'e', to: 'f'})
      E.push({from: 'd', to: 'x'})
      E.push({from: 'x', to: 'y'})
      E.push({from: 'b', to: 'e'})
      E.push({from: 'b', to: 'z'})
      E.push({from: 'l', to: 'z'})
      E.forEach(e => dag.add(e.from, e.to))
    })
    it('should return paths', () => {
      Object.keys(paths).forEach((p) => {
        deepEqual(dag.findPathsDown(p).paths, paths[p]).should.equal(true)
      })
    })

    it('should return paths', () => {
      const _dag = new Dag()
      _dag.addVertex('g')
      _dag.addVertex('j')

      Object.keys(paths).forEach((p) => {
        deepEqual(dag.findPathsDown(p).paths, paths[p]).should.equal(true)
      })
    })

    it('should get all vertices from path', async () => {
      const sample = ['a', 'b', 'c', 'd', 'e', 'f', 'z', 'x', 'y']
      deepEqual(Array.from(dag.findPathsDown('a').vertices()), sample).should.equal(true)
    })

    it('should get all vertices from path', async () => {
      const sample = ['b', 'c', 'e', 'f', 'z']
      deepEqual(Array.from(dag.findPathsDown('b').vertices()), sample).should.equal(true)
    })

    it('should return longest path length (from unknown vertex)', async () => {
      dag.findPathsDown('unknown').getLongestPathLength().should.equal(0)
    })

    it('should return longest path length (only 1 path)', async () => {
      dag.findPathsDown('z').getLongestPathLength().should.equal(1)
    })

    it('should return longest path length (3 different path)', async () => {
      dag.findPathsDown('b').getLongestPathLength().should.equal(3)
    })
  })
})
