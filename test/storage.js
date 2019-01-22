const Dag = require('../dag-new')
const deepEqual = require('deep-equal')
const expect = require('chai').expect
require('chai').should();

describe('Obj Test', () => {
  describe('DAG(order=4, size=4)', () => {
    let dag
    let V = []
    let obj = {}
    let E = []
    let objs = []

    beforeEach(() => {
      dag = new Dag()
      E = []
      V = ['a', 'b', 'c', 'd', 'e', 'f', 'x', 'y']
      obj = {t: ['a'], f: {r: [1, 2, 3]}}
      objs['a'] = obj
      objs['b'] = {t: ['b']}
      E.push({from: 'a', to: 'b'})
      E.push({from: 'b', to: 'c'})
      E.push({from: 'a', to: 'd'})
      E.push({from: 'd', to: 'e'})
      E.push({from: 'e', to: 'f'})
      E.push({from: 'd', to: 'x'})
      E.push({from: 'x', to: 'y'})
      E.push({from: 'b', to: 'e'})
      E.forEach(e => dag.add(e.from, e.to))
    })

    it('should save obj in each vertex', () => {
      V.forEach((v) => {
        dag.saveObj(v, obj)
        deepEqual(dag.readObj(v), obj).should.equal(true)
      })
    })

    it('should read obj for non existed vertex', () => {
      expect(dag.readObj('unknown')).to.be.undefined
    })

    it('should remove obj ', () => {
      dag.saveObj('b', obj)
      dag.removeObj('b')
      expect(dag.readObj('b')).to.be.undefined
    })
    it('should remove obj if vertex removed', () => {
      dag.saveObj('b', obj)
      dag.removeVertex('b')
      expect(dag.readObj('b')).to.be.undefined
    })

    it('should return obj in callback if vertex removed', () => {
      dag.saveObj('b', objs['b'])
      dag.saveObj('a', objs['a'])
      dag.removeVertex('b', (v, o) => {
        deepEqual(o, objs[v]).should.equal(true)
      })
    })
  })
})
