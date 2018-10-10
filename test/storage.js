const Dag = require('../dag');
const deepEqual = require('deep-equal');
const expect = require('chai').expect;

describe('Obj Test', () => {
    describe('DAG(order=4, size=4)', () => {
        let dag;
        let V = [];
        let obj = {};
        let E = [];

        beforeEach(() => {
            dag = new Dag();
            V = ['a', 'b', 'c', 'd'];
            obj = { t: ['a'], f: { r: [1, 2, 3] } };
            E.push({ from: 'a', to: 'b' });
            E.push({ from: 'b', to: 'c' });
            E.push({ from: 'd', to: 'b' });
            E.push({ from: 'a', to: 'd' });
            E.forEach(e => dag.add(e.from, e.to));
        });

        it('should save obj in each vertex', () => {
            V.forEach((v) => {
                dag.saveObj(v, obj)
                deepEqual(dag.readObj(v), obj).should.equal(true)
            })
        });

        it('should remove obj ', () => {
            dag.saveObj('b', obj);
            dag.removeObj('b');
            expect(dag.readObj('b')).to.be.undefined
        });
        // it('should not remove obj from unknown vertex', () => {
        //     expect(() => dag.removeObj('f')).to.throw('Unknown vertex');;
        // });
        it('should remove obj if vertex removed', () => {
            dag.saveObj('b', obj);
            dag.removeVertex('b');
            expect(dag.readObj('b')).to.be.undefined
        });
        
        it('should return obj in callback if vertex removed', () => {
            dag.saveObj('b', obj);
            dag.removeVertex('b',(o) =>{
                deepEqual(o,obj).should.equal(true)
            });
        });
    });
});