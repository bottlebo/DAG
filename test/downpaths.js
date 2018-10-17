const Dag = require('../dag');
const deepEqual = require('deep-equal');

describe('Paths Down Test', () => {
	describe('DAG(order=8, size=8)', () => {
		let dag;
		let E;
		let paths = []

		beforeEach(() => {
			E = []
			paths['d'] = [['a']]
			paths['e'] = [['d', 'a'], ['b', 'a']]
			paths['y'] = [['x', 'd', 'a']]
			dag = new Dag();

			E.push({ from: 'a', to: 'b' });
			E.push({ from: 'b', to: 'c' });
			E.push({ from: 'a', to: 'd' });
			E.push({ from: 'd', to: 'e' });
			E.push({ from: 'e', to: 'f' });
			E.push({ from: 'd', to: 'x' });
			E.push({ from: 'x', to: 'y' });
			E.push({ from: 'b', to: 'e' });
			E.forEach(e => dag.add(e.from, e.to));
		})
		it('should return paths', () => {
			Object.keys(paths).forEach((p) => {
				deepEqual(dag.findPathsDown(p).paths, paths[p]).should.equal(true)
			})
		});
	})
})
