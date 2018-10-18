const Dag = require('../dag');
const deepEqual = require('deep-equal');

describe('Paths Down Test', () => {
  describe('DAG(order=8, size=8)', () => {
    let dag;
    let E;
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
      dag = new Dag();

      E.push({from: 'a', to: 'b'});
      E.push({from: 'b', to: 'c'});
      E.push({from: 'a', to: 'd'});
      E.push({from: 'd', to: 'e'});
      E.push({from: 'e', to: 'f'});
      E.push({from: 'd', to: 'x'});
      E.push({from: 'x', to: 'y'});
      E.push({from: 'b', to: 'e'});
      E.push({from: 'b', to: 'z'});
      E.push({from: 'l', to: 'z'});
      E.forEach(e => dag.add(e.from, e.to));
    })
    it('should return paths', () => {
      Object.keys(paths).forEach((p) => {
        deepEqual(dag.findPathsDown(p).paths, paths[p]).should.equal(true)
      })
    });

    it('should return paths', () => {
      const _dag = new Dag()
      _dag.addVertex('g')
      _dag.addVertex('j')

      Object.keys(paths).forEach((p) => {
        deepEqual(dag.findPathsDown(p).paths, paths[p]).should.equal(true)
      })
    });
  })
})
