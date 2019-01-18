const Dag = require('../dag')
const expect = require('chai').expect
require('chai').should();
const deepEqual = require('deep-equal')
const util = require('util')
function hash() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 32; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}
const vCount = 1000000;
describe('XXXL Test', () => {
  describe('DAG(order=4, size=4)', () => {
    let dag
    let V = []
    let E = []

    beforeEach(() => {
      dag = new Dag()
      V = ['a', 'b', 'c', 'd']
      E = []
      E.push({from: 'a', to: 'b'})
      E.push({from: 'b', to: 'c'})
      E.push({from: 'd', to: 'b'})
      E.push({from: 'a', to: 'd'})
      E.forEach(e => dag.add(e.from, e.to))
    })

    it('should create very large dag', async function() {
      this.timeout(100000);
      let _dag = new Dag();
      _dag.testForCyclic = false;
      let _V = [];
      let _E = [];
      for (let i = 0; i < vCount; i++) {
        let key = hash();
        _V.push(key)
      }
      for (let i = 0; i < vCount - 1; i++) {
        _E.push({from: _V[i], to: _V[i + 1]})
      }
     
      let msecBefore = Date.now();
      _E.forEach(e => _dag.add(e.from, e.to));
      let msecAfter = Date.now();
      let avgDuration = (msecAfter - msecBefore) / vCount;
      console.log(`average insertion took ${avgDuration} msec`);

      msecBefore = Date.now();
      _V.forEach(v => _dag.hasVertex(v));
      msecAfter = Date.now();
      avgDuration = (msecAfter - msecBefore) / vCount;
      console.log(`average hasVertex took ${avgDuration} msec`);

      msecBefore = Date.now();
      _V.forEach(v => _dag.saveObj(v, {v}));
      msecAfter = Date.now();
      avgDuration = (msecAfter - msecBefore) / vCount;
      console.log(`average saveObj took ${avgDuration} msec`);

    });

    
  })
})
