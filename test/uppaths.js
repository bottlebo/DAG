const Dag = require('../dag');
const deepEqual = require('deep-equal');

describe('Paths Up Test', () => {
  describe('DAG(order=13, size=14)', () => {
    let dag;
    let E;
    let paths = []

    beforeEach(() => {
      E = []
      paths['y'] = [
        ['y', 'x', 'd', 'a', 'n', 'l', 'k'],
        ['y', 'x', 'd', 'g']
      ]
      paths['f'] = [
        ['f', 'e', 'd', 'a', 'n', 'l', 'k'],
        ['f', 'e', 'b', 'a', 'n', 'l', 'k'],
        ['f', 'e', 'd', 'g'],
        ['f', 'e', 'b', 'z', 'l', 'k']
      ]
      paths['g'] = [['g']]
      paths['c'] = [
        ['c', 'b', 'a', 'n', 'l', 'k'],
        ['c', 'b', 'z', 'l', 'k']
      ]
      dag = new Dag();

      E.push({ from: 'a', to: 'b' });
      E.push({ from: 'b', to: 'c' });
      E.push({ from: 'a', to: 'd' });
      E.push({ from: 'd', to: 'e' });
      E.push({ from: 'e', to: 'f' });
      E.push({ from: 'd', to: 'x' });
      E.push({ from: 'x', to: 'y' });
      E.push({ from: 'b', to: 'e' });
      E.push({ from: 'z', to: 'b' });
      E.push({ from: 'l', to: 'z' });

      E.push({ from: 'k', to: 'l' });
      E.push({ from: 'n', to: 'a' });
      E.push({ from: 'g', to: 'd' });
      E.push({ from: 'l', to: 'n' });
      E.forEach(e => dag.add(e.from, e.to));
    })
    it('should return paths', () => {
      Object.keys(paths).forEach((p) => {
        deepEqual(dag.findPathsUp(p).paths, paths[p]).should.equal(true)
      })
    });

    /* it('should return paths', () => {
      const _dag = new Dag()
      _dag.addVertex('g')
      _dag.addVertex('j')

      Object.keys(paths).forEach((p) => {
        deepEqual(dag.findPathsDown(p).paths, paths[p]).should.equal(true)
      }) */
    //});
  })
})