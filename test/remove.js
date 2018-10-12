const Dag = require('../dag');
const deepEqual = require('deep-equal');
const expect = require('chai').expect;

describe('Removal Test', () => {
  describe('DAG(order=8, size=8)', () => {
    let dag;
    let V;
    let E;
    let D = [];

    beforeEach(() => {
      dag = new Dag();
      V = ['a', 'b', 'c', 'd','e', 'f', 'x', 'y'];
      D['d'] = ['a']
      D['e'] = ['a','d','b']
      E = [];
      E.push({ from: 'a', to: 'b' });
      E.push({ from: 'b', to: 'c' });
      E.push({ from: 'a', to: 'd' });
      E.push({ from: 'd', to: 'e' });
      E.push({ from: 'e', to: 'f' });
      E.push({ from: 'd', to: 'x' });
      E.push({ from: 'x', to: 'y' });
      E.push({ from: 'b', to: 'e' });
      E.forEach(e => dag.add(e.from, e.to));
    });

    it('should remove each edge', () => {
      E.forEach((edge, index) => {
        const removedDag = dag._deepClone();
        const removedE = E.slice(0);
        removedDag.removeEdge(edge.from, edge.to);
        removedE.splice(index, 1);
        removedDag.size.should.equal(removedE.length);
        removedE.forEach(e => removedDag.includes(e.from, e.to).should.equal(true));
      });
    });

    it('should not remove an edge (e, b) with unknown vertex \'e\'', () => {
      const removedDag = dag._deepClone();
      removedDag.removeEdge('e', 'b');

      deepEqual(dag, removedDag).should.equal(true);
    });

    it('should not remove non-exist edge (d, a)', () => {
      const removedDag = dag._deepClone();
      removedDag.removeEdge('d', 'a');

      deepEqual(dag, removedDag).should.equal(true);
    });

    it('should remove each vertex', () => {
      Object.keys(D).forEach((deleted) =>{
        const removedDag = dag._deepClone();
        const removedV = [deleted];
        let removedE = E.slice(0);
        removedV.push(...D[deleted])
        const vx = V.filter(x=>{ return removedV.indexOf(x) < 0})
        removedDag.removeVertex(deleted);
        removedDag.V.forEach(v=>removedV.should.not.includes(v))
        removedDag.V.forEach(v=>vx.should.includes(v))

        removedE = removedE.filter(e => removedV.indexOf(e.from) < 0 && removedV.indexOf(e.to) < 0);
        removedE.forEach(e => removedDag.edge(e.from, e.to).should.deep.equal(e));
        removedDag.order.should.equal(vx.length);
        removedDag.size.should.equal(removedE.length);
      })
    });
    //
    it('should not remove unknown vertex', () => {
      expect(() => dag.removeVertex('t')).to.throw('Unknown vertex');;
    });
  });
});
