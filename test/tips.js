const Dag = require('../dag');
const deepEqual = require('deep-equal');

describe('Tips Test', () => {
  describe('DAG(order=4, size=4)', () => {
    let dag;
    let tips = [];
    let E = [];

    beforeEach(() => {
      dag = new Dag();
      E = []
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

      it('should return single vertex', () => {
          const singleDag = new Dag();
          singleDag.addVertex('test');
          deepEqual(singleDag.tips, ['test']).should.equal(true);
      });

      it('should return 2 unlinked vertex', () => {
          dag = new Dag();
          dag.addVertex('test1');
          dag.addVertex('test2');
          deepEqual(dag.tips, ['test1', 'test2']).should.equal(true);
      });
  });
});
