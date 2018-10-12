const Dag = require('../dag');
const deepEqual = require('deep-equal');

describe('Tips Test', () => {
  describe('DAG(order=4, size=4)', () => {
    let dag;
    let V = [];
    let tips = [];
    let E = [];

    beforeEach(() => {
      dag = new Dag();
      tips = ['a'];
      E.push({ from: 'a', to: 'b' });
      E.push({ from: 'b', to: 'c' });
      E.push({ from: 'd', to: 'b' });
      E.push({ from: 'a', to: 'd' });
      E.forEach(e => dag.add(e.from, e.to));
    });

    it('should return tips', () => {
      deepEqual(dag.tips, tips).should.equal(true);
    });
  });
});