const Dag = require('../dag');
const util = require('util')
const deepEqual = require('deep-equal');

describe('Removal Test', () => {
  describe('DAG(order=4, size=4)', () => {
    let dag;
    let V;
    let E;

    beforeEach(() => {
      dag = new Dag();
      V = ['a', 'b', 'c', 'd'];
      E = [];
      E.push({ from: 'a', to: 'b'});
      E.push({ from: 'b', to: 'c' });
      E.push({ from: 'd', to: 'b' });
      E.push({ from: 'a', to: 'd' });
      E.forEach(e => dag.add(e.from, e.to));
    });

    it('should remove each edge', () => {
      E.forEach((edge, index) => {
        // clone dag and E
        const removedDag = dag.deepClone();
        const removedE = E.slice(0);

        // remove from clones
        removedDag.removeEdge(edge.from, edge.to);
        removedE.splice(index, 1);

        // check the removal
        removedDag.size.should.equal(removedE.length);
        removedE.forEach(e => removedDag.includes(e.from, e.to).should.equal(true));
      });
    });

    it('should not remove an edge (e, b) with unknown vertex \'e\'', () => {
      const removedDag = dag.deepClone();
      removedDag.removeEdge('e', 'b');

      deepEqual(dag, removedDag).should.equal(true);
    });

    it('should not remove non-exist edge (d, a)', () => {
      const removedDag = dag.deepClone();
      removedDag.removeEdge('d', 'a');

      deepEqual(dag, removedDag).should.equal(true);
    });

    it('should remove each vertex', () => {
      V.forEach((vertex) => {
        // clone dag and E
        const removedDag = dag.deepClone();
        const removedV = [];
        let removedE = E.slice(0);

        // remove from clones
        removedDag.removeVertex(vertex);
        removedE = removedE.filter(e => e.from !== vertex && e.to !== vertex);
        removedE.forEach((e) => {
          if (!removedV.includes(e.from)) {
            removedV.push(e.from);
          }
          if (!removedV.includes(e.to)) {
            removedV.push(e.to);
          }
        });

        // check the removal
        removedDag.order.should.equal(removedV.length);
        removedDag.V.forEach(v => removedV.should.includes(v));
        removedDag.size.should.equal(removedE.length);
        removedE.forEach(e => removedDag.edge(e.from, e.to).should.deep.equal(e));
      });
    });

  });
});
