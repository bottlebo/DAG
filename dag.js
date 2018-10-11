const CycleError = require('./cycle-error');
const DownPath = require('./downPath')
class Dag {
    constructor() {
        this._edges = [];
        this._storage = [];
    }
    get order() {
        const verticies = this.V;
        return verticies.length;
    }
    get size() {
        return Object.keys(this._edges).reduce((previous, key) => previous + this._edges[key].length, 0);
    }
    get tips() {
        let to = Object.keys(this._edges)
        return this.V.filter(t => {
            return this.edgesTo(t)._edges[t] === undefined
        })
    }
    get V() {
        const verticies = Object.keys(this._edges).reduce((previous, key) => {
            //if (this._edges[key].length > 0) {
            if (!previous.includes(key)) {
                previous.push(key);
            }
            this._edges[key].forEach((e) => {
                if (!previous.includes(e.from)) {
                    previous.push(e.from);
                }
            });
            //}
            return previous;
        }, []);
        return verticies;
    }
    get E() {
        const edges = [];
        Object.keys(this._edges).forEach((to) => {
            this._edges[to].forEach(edge => edges.push(this.edge(edge.from, to)));
        });
        return edges;
    }
    readObj(v) {
        return this._storage[v]
    }
    saveObj(v, obj) {
        if (!this.V.includes(v))
            throw 'Unknown vertex'
        this._storage[v] = obj
    }
    removeObj(v) {
        if (this._storage[v])
            delete this._storage[v]
        // else
        //     throw 'Unknown vertex'
    }
    edge(from, to) {
        if (this._edges[to] !== undefined) {
            const edge = this._edges[to].find(e => e.from === from);
            if (edge !== undefined) {
                return {
                    from: edge.from,
                    to
                };
            }
        }
        return undefined;
    }
    /**
    *
    */
    add(from, to) {
        // test cycle
        if (this._testCycle(from, to)) {
            throw new CycleError();
        }
        // instantiate an edge
        const edge = {
            from: from
        };
        // register the edge
        if (this._edges[to] === undefined) {
            this._edges[to] = [];
        }
        this._edges[to].push(edge);
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
        if (undefined === this._edges[to]) {
            return new Dag();
        }
        const dag = new Dag();
        this._edges[to].forEach((e) => {
            const cloned = { from: e.from, to };
            dag.add(cloned.from, cloned.to);
        });
        return dag;
    }
    /**
     * Edges comes from a vertex
     * @param {string} from     the vertex.
     * @returns {@type {Dag}}   deep cloned edges start at the vertex 'from'.
     *                          empty DAG, if the vertex does not exist or there is no edges from it.
     */
    edgesFrom(from) {
        const dag = new Dag();
        Object.keys(this._edges).forEach((key) => {
            this._edges[key].forEach((e) => {
                if (e.from === from) {
                    const cloned = { from: e.from, to: key };
                    dag.add(cloned.from, cloned.to);
                }
            });
        });
        return dag;
    }
    findPathsDown(from) {
        let downPath = new DownPath()
        this._down(from, downPath)
        downPath._trim();
        return downPath
    }
    removeVertex(v, callback) {
        // remove edges 'to' the verted
        if (this.V.includes(v)) {
            let obj = this.readObj(v)
            let vx = [v]
            for (let p of this.findPathsDown(v)) {
                vx.push(...p.filter(x => vx.indexOf(x) < 0))
            }
            for (let vertex of vx) {
                this.removeObj(vertex)
                if (vertex in this._edges) {
                    // arrange edges
                    delete this._edges[vertex];
                }
                // remove edges 'from' the vertex
                Object.keys(this._edges).forEach((to) => {
                    // arrnage edges
                    this._edges[to] = this._edges[to].filter((e) => {
                        return e.from !== vertex;
                    });
                    // if (this._edges[to].length === 0) {
                    //     delete this._edges[to];
                    // }
                });
            }
            if (callback)
            callback.call(null, obj)
        }
        else
            throw 'Unknown vertex'
    }

    // remove
    removeEdge(from, to) {
        if (!(to in this._edges)) {
            return this;
        }
        // arrange edges
        const targetIndex = this._edges[to].findIndex(e => e.from === from);
        if (targetIndex === -1) {
            return this;
        }
        this._edges[to].splice(targetIndex, 1)[0];
        // if (this._edges[to].length === 0) {
        //     delete this._edges[to];
        // }
        return this;
    }
    /**
   * Deep copy
   * @return new DAG instance without references from the original pieces, at all.
   */
    deepClone() {
        const newDag = new Dag();
        Object.keys(this._edges).forEach((to) => {
            this._edges[to].forEach((e) => {
                // clone the edge
                newDag.add(e.from, to);
            });
        });
        this.V.forEach((v) => { if (this.readObj(v)) newDag.saveObj(v, this.readObj(v)) })
        return newDag;
    }
    // clone
    /**
     * Shallow copy
     * @return new DAG instance which has new arrays (i.e., E, tagObjs, and tagInvertedIndex) but
     * their elements (i.e., E['a'], ... and tagObjs['friend'], ...).
     */
    clone() {
        const newDag = new Dag();
        Object.keys(this._edges).forEach((key) => { newDag._edges[key] = this._edges[key]; newDag._storage[key] = this._storage[key] });
        return newDag;
    }
    includes(from, to) {
        return this.edge(from, to) !== undefined;
    }

    _down(from, dp) {
        let to = []// Object.keys(this.edgesFrom(from)._edges)
        this._edges[from].forEach((f) => { to.push(f.from) })
        to.forEach((v) => {
            dp._add(v)
            if (Object.keys(this.edgesTo(v)._edges).length > 0) this._down(v, dp)
            else {
                dp._nextPath()
                return
            }
        })
    }
    /**
      * @param {string} start - starting point of reverse-BFS
      * @callback hitCondition - condition to stop traversal
      * @callback callback - task to do for each visit. The visit stopping the traversal is exclusive.
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
            if (this._edges[visit] !== undefined) {
                this._edges[visit].forEach(e => q.push(e.from));
            }
        }
        return undefined;
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
//
module.exports = Dag;