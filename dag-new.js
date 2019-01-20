const Path = require('./path')

class Dag {
  constructor() {
    this._edges = {};
    this._edges_m = new Map();
    this._storage = new Map();
    this._testForCyclic = true;
    this._vertex = new Set();
  }

  get testForCyclic() {
    return this._testForCyclic;
  }
  set testForCyclic(value) {
    this._testForCyclic = value;
  }
  /**
   * @returns length of dag vertices
   */
  get order() {
    //const vertices = this.V;
    return this.V.length;
  }

  /**
   * @returns length of dag edges
   */
  get size() {
    // return Object.keys(this._edges)
    //   .reduce((previous, key) => previous + this._edges[key].length, 0);
    //+
    return [...this._edges_m.keys()]
      .reduce((previous, key) => previous + this._edges_m.get(key).length, 0);
    //-
  }

  /**
   * @returns  dag tips
   */
  get tips() {
    return this.V.filter(t => this.edgesTo(t)._edges[t] === undefined)
  }

  /**
   * @returns  dag vertices
   */
  get V() {
    return [...this._vertex];
  }

  /**
   * @returns  dag edges
   */
  get E() {
    /* const edges = [];
    Object.keys(this._edges).forEach((to) => {
      this._edges[to].forEach(edge => edges.push(this.edge(edge.from, to)));
    });
    return edges; */
    const edges = [];
    //[...this._edges_m.keys()].forEach((to) => {
    for(const to of this._edges_m.keys()) {
      this._edges_m.get(to).forEach(edge => edges.push(this.edge(edge.from, to)));
    }
    return edges;
  }

  /**
   * Read object from vertex
   * @param {string} v  the vertex.
   * @returns  object stored at the vertex
   */
  readObj(v) {
    return this._storage.get(v);
  }

  /**
   * Save object to vertex
   * @param {string} v  the vertex.
   * @param {object} obj - object stored at the vertex
   * @param {boolean} checkVertex - should we check vertex existence
   *                (dramatically decrease performance on big graphs)
   *
   */
  saveObj(v, obj, checkVertex = true) {
    if (checkVertex && !this._vertex.has(v)) throw 'Unknown vertex'
    this._storage.set(v, obj);
  }

  /**
   * Remove object from vertex
   * @param {string} v  the vertex.
   */
  removeObj(v) {
    if (this._storage.has(v))
      this._storage.delete(v);
  }

  /**
   * @param {string} from  the edge from.
   * @param {string} to  the edge to.
   * @returns  edge or undefined if edge non-exist
   */
  edge(from, to) {
    // if (this._edges[to] !== undefined) {
    //   const edge = this._edges[to].find(e => e.from === from);
    //   if (edge !== undefined) {
    //     return {
    //       from: edge.from,
    //       to
    //     };
    //   }
    // }
    //+
    if(this._edges_m.get(to) !== undefined) {
      const edge = this._edges_m.get(to).find(e => e.from === from);
      if (edge !== undefined) {
        return {
          from: edge.from,
          to
        };
      }
    }
    //-
    return undefined;
  }


  /**
   * Add edge to dag
   * @param {string} from  the edge from.
   * @param {string} to  the edge to.
   * @returns  dag
   */
  add(from, to) {
    if (this._testForCyclic && this._testCycle(from, to)) {
      throw 'DAG has cycle(s)'
    }
    const edge = {
      from: from
    }


    if (!this._vertex.has(to))
      this._vertex.add(to);
    if (!this._vertex.has(from))
      this._vertex.add(from);

  /*   if (this._edges[to] === undefined) {
      this._edges[to] = [];
    } */
    //+      
    if (this._edges_m.get(to) === undefined)
      this._edges_m.set(to, [])
    //- 
   /*  if (this._edges[to].find(e => e.from === from) === undefined)
      this._edges[to].push(edge); */
    //+
    let _to = this._edges_m.get(to);
    if (_to.find(e => e.from === from) === undefined)
      _to.push(edge);
    //-    
    /* if (this._edges[from] !== undefined && this._edges[from].length == 0)
      delete this._edges[from] */
    //+
    if (this._edges_m.get(from) !== undefined && this._edges_m.get(from).length == 0)
      this._edges_m.delete(from);
    //-
    return this;
  }

  /**
   * Edges go to a vertex
   * @param {string} to       the vertex.
   * @returns {@type {Dag}}   deep cloned edges end at the vertex 'to'.
   *                          empty DAG, if the vertex does not exist or there is no edges heading
   *                          it.
   */
  edgesTo(to) {
    if (undefined === this._edges_m.get(to)) {
      return new Dag();
    }
    const dag = new Dag();
    this._edges_m.get(to).forEach((e) => {
      const cloned = {from: e.from, to}
      dag.add(cloned.from, cloned.to);
    });
    return dag;
  }

  /**
   * Edges comes from a vertex
   * @param {string} from     the vertex.
   * @returns {@type {Dag}}   deep cloned edges start at the vertex 'from'.
   *                          empty DAG, if the vertex does not exist
   *                          or there is no edges from it.
   */
  edgesFrom(from) {
    const dag = new Dag();
    [...this._edges_m.keys()].forEach((key) => {
      this._edges_m.get(key).forEach((e) => {
        if (e.from === from) {
          const cloned = {from: e.from, to: key}
          dag.add(cloned.from, cloned.to);
        }
      });
    });
    return dag;
  }

  /**
   * Find paths down
   * @param {string} from  the vertex.
   * @returns  Return array of down paths from vertex
   */
  findPathsDown(from) {
    const downPath = new Path()
    if (this._vertex.has(from)) {
      downPath._add(from)
      this._down(from, downPath)
    }
    return downPath
  }

  /**
   * Find paths up
   * @param {string} from  the vertex.
   * @returns  Return array of up paths from vertex
   */
  findPathsUp(from) {
    const upPath = new Path()
    if (this._vertex.has(from)) {
      upPath._add(from)
      this._up(upPath)
    }
    //downPath._trim();
    return upPath
  }

  /**
   *
   * @param v
   * @returns {*}
   */
  hasVertex(v) {
    return this._vertex.has(v)
  }

  /**
   * Add single vertex
   * @param {string} v the vertex
   */
  addVertex(v) {
    if (!this._vertex.has(v)) {
      //this._edges[v] = [];
      this._edges_m.set(v,[]);
      this._vertex.add(v);
    }
    else throw 'Already exist'
  }

  /**
   * Remove vertex
   * @param {string} vertex  the vertex.
   * @callback callback return object, stored in vertex
   */
  removeVertex(vertex, callback) {
    /*
    if (this._vertex.has(vertex)) {
      const obj = this.readObj(vertex)
      this.removeObj(vertex)
      if (vertex in this._edges) {
        for (const v of this._edges[vertex]) {
          if (!Object.keys(this._edges).includes(v.from)) {
            this._edges[v.from] = []
          }
        }
        delete this._edges[vertex];
      }
      Object.keys(this._edges).forEach((to) => {
        this._edges[to] = this._edges[to].filter((e) => {
          return e.from !== vertex;
        });
      });
      this._vertex.delete(vertex)
      if (callback)
        callback.call(null, vertex, obj)
    }
    else throw 'Unknown vertex'
    */
    //+
    if (this._vertex.has(vertex)) {
      const obj = this.readObj(vertex)
      this.removeObj(vertex);
      const keys = [...this._edges_m.keys()];
      if (keys.includes(vertex)) {
        for (const v of this._edges_m.get(vertex)) {
          if (!keys.includes(v.from)) {
            this._edges_m.set(v.from, []);
          }
        }
        this._edges_m.delete(vertex);
      }

      //[...this._edges_m.keys()].forEach((to) => {
      for(const to of this._edges_m.keys()){
        this._edges_m.set(to, this._edges_m.get(to).filter((e) => {
          return e.from !== vertex;
        }));
      }
      //});
      this._vertex.delete(vertex)
      if (callback)
        callback.call(null, vertex, obj)
    }
    else throw 'Unknown vertex'
    //-
  }

  /**
   * Remove edge
   * @param {string} from  the vertex.
   * @param {string} to  the vertex.
   * @returns dag
   */
  removeEdge(from, to) {
    
   /*  if (!(to in this._edges)) {
      return this;
    }
    const _targetIndex = this._edges[to].findIndex(e => e.from === from);
    if (_targetIndex === -1) {
      return this;
    }
    if (!Object.keys(this._edges).includes(from)) {
      this._edges[from] = []
    }
    this._edges[to].splice(_targetIndex, 1)[0]
    return this; */
    //+
    if (!([...this._edges_m.keys()].includes(to))) {
      return this;
    }
    const targetIndex = this._edges_m.get(to).findIndex(e => e.from === from);
    if (targetIndex === -1) {
      return this;
    }
    if (![...this._edges_m.keys()].includes(from)) {
      this._edges_m.set(from, []);
    }
    this._edges_m.get(to).splice(targetIndex, 1)[0]
    return this;
    //-
  }

  /**
   * Deep copy
   * @return new DAG instance without references from the original pieces, at all.
   */
  _deepClone() {
    /* const newDag = new Dag();
    Object.keys(this._edges).forEach((to) => {
      this._edges[to].forEach((e) => {
        newDag.add(e.from, to);
      });
    });
    [...this._vertex].forEach((v) => {
      if (this.readObj(v)) newDag.saveObj(v, this.readObj(v))
    });
    newDag._testForCyclic = this._testForCyclic;
    return newDag */
    //+
    const newDag = new Dag();
    for(const to of this._edges_m.keys()) {
      this._edges_m.get(to).forEach((e) => {
        newDag.add(e.from, to);
      });
    }
    [...this._vertex].forEach((v) => {
      if (this.readObj(v)) newDag.saveObj(v, this.readObj(v))
    });
    newDag._testForCyclic = this._testForCyclic;
    return newDag
    //-
  }

  /**
   * Shallow copy
   * @return new DAG instance which has new arrays (i.e., E, tagObjs, and tagInvertedIndex) but
   * their elements (i.e., E['a'], ... and tagObjs['friend'], ...).
   */
  _clone() {
    //+
    const newDag = new Dag();
    [...this._edges_m.keys()].forEach((key) => {
      newDag._edges_m.set(key, this._edges_m.get(key));
      newDag._storage.set(key, this._storage.get(key))
    });
    return newDag;
    //-
    /* const newDag = new Dag();
    Object.keys(this._edges).forEach((key) => {
      newDag._edges[key] = this._edges[key];
      newDag._storage[key] = this._storage[key]
    });
    return newDag; */
  }

  /**
   * Checks if dag is contained in edge
   * @param {string} from
   * @param {string} to
   */
  includes(from, to) {
    return this.edge(from, to) !== undefined;
  }

  _down(from, dp) {
    let to = Object.keys(this.edgesFrom(from)._edges)
    if (to.length == 0) return
    let _dp = dp.paths.slice()
    for (let p of _dp) {
      let f = p[p.length - 1]
      let to = Object.keys(this.edgesFrom(f)._edges)
      if (to.length > 0) {
        for (let i = 1; i < to.length; i++) {
          dp._nextPath()
          dp.paths[dp._index].push(...p)
          dp._add(to[i])
        }
        p.push(to[0])
      }
    }
    for (let p of dp.paths) {
      let v = p[p.length - 1]
      if (Object.keys(this.edgesFrom(v)._edges).length == 0) continue
      this._down(v, dp)
    }
  }

  _up(dp) {
    let _dp = dp.paths.slice()
    for (let p of _dp) {
      let f = p[p.length - 1]
      if (this._edges[f] === undefined || this._edges[f].length == 0) continue
      let to = this._edges[f].reduce((p, v) => {
        p.push(v.from);
        return p
      }, [])
      if (to.length > 0) {
        for (let i = 1; i < to.length; i++) {
          dp._nextPath()
          dp.paths[dp._index].push(...p)
          dp._add(to[i])
        }
        p.push(to[0])
      }
    }
    for (let p of dp.paths) {
      let v = p[p.length - 1]
      if (this._edges[v] === undefined || this._edges[v].length == 0) continue
      this._up(dp)
    }
  }

  /**
   * @param {string} start - starting point of reverse-BFS
   * @callback hitCondition - condition to stop traversal
   * @callback callback - task to do for each visit.
   *  The visit stopping the traversal is exclusive.
   */
  _reverseBFS(start, hitCondition, callback) {
    const q = [start];
    while (q.length > 0) {
      const visit = q.shift();
      if (hitCondition !== undefined && hitCondition(visit)) {
        return visit;
      }
      if (callback !== undefined) {
        callback(visit);
      }
      if (this._edges_m.get(visit) !== undefined) {
        this._edges_m.get(visit).forEach(e => q.push(e.from));
      }
    }
    return undefined;
    /* const q = [start];
    while (q.length > 0) {
      const visit = q.shift();
      if (hitCondition !== undefined && hitCondition(visit)) {
        return visit;
      }
      if (callback !== undefined) {
        callback(visit);
      }
      if (this._edges[visit] !== undefined) {
        this._edges[visit].forEach(e => q.push(e.from));
      }
    }
    return undefined; */
  }

  /**
   * @return {boolean}    true, if (@code{from}, @code{to}) makes a cycle. false, otherwise.
   */
  _testCycle(from, to) {
    if (from === to) {
      return true;
    }
    const hit = this._reverseBFS(from, v => v === to);
    if (hit === undefined) {
      return false;
    }
    return true;
  }
}

module.exports = Dag;
