const Dag = require('../dag-new')
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
    let _V = [];
    let _E = [];
    for (let i = 0; i < vCount; i++) {
      let key = hash();
      _V.push(key)
    }
    for (let i = 0; i < vCount - 1; i++) {
      _E.push({from: _V[i], to: _V[i + 1]})
    }
    beforeEach(() => {
     
    })

    it('should create very large dag', async function() {
      this.timeout(100000);
      let _dag = new Dag();
      _dag.testForCyclic = false;
      // let _V = [];
      // let _E = [];
      // for (let i = 0; i < vCount; i++) {
      //   let key = hash();
      //   _V.push(key)
      // }
      // for (let i = 0; i < vCount - 1; i++) {
      //   _E.push({from: _V[i], to: _V[i + 1]})
      // }
     
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

      console.time('Save obj')
      _V.forEach(v =>  _dag.saveObj(v, {v}));
      console.timeEnd('Save obj')

      console.time('Remove Obj')
      _V.forEach(v =>  _dag.removeObj(v));
      console.timeEnd('Remove Obj')

      console.time('Remove vertex')
      _dag.removeEdge(_V[0], _V[1]);
      console.timeEnd('Remove vertex')
      /* msecBefore = Date.now();
      let s = Object.keys(_dag._edges);//.includes(_E[5].from)
      msecAfter = Date.now();
      console.log(`average includes took ${msecAfter-msecBefore} msec:${s.length}`);
      _dag.removeEdge(_E[5].from,_E[5].to)
      console.log(_dag.edge(_E[5].from,_E[5].to)) */
    });
   
    /* it('test duration', async function() {
      this.timeout(100000);
      let _dag = new Dag();
      _dag.testForCyclic = false;
      _E.forEach(e => _dag.add(e.from, e.to));
      let _edges = _dag._edges;
      //console.log(_edges)
      let _map = new Map(Object.entries(_edges));
      //console.log(_map)
      let msecBefore = Date.now();
      let s = Object.keys(_dag._edges).includes(_E[5].from)
      let msecAfter = Date.now();
      console.log(`average Object.keys took ${msecAfter-msecBefore} msec`);
      //
      //msecBefore = Date.now();
      console.time('Map keys')
      s =[..._map.keys()].includes(_E[5].from)
      //msecAfter = Date.now();
      //console.log(`average map.keys took ${msecAfter-msecBefore} msec`);
      console.timeEnd('Map keys')

    }); */
    
  })
})
