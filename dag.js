const CycleError = require('./cycle-error');
const DownPath = require('./downPath')
class Dag {
    constructor() {
        this.edges = [];
        this.storage = [];
    }
    readObj(v) {
        return this.storage[v]
    }
    saveObj(v, obj) {
        if (!this.V.includes(v))
            throw 'Undefined vertex'
        this.storage[v] = obj
    }
    removeObj(v) {
        if (this.storage[v])
            delete this.storage[v]
    }
    get tips() {
        let to = Object.keys(this.edges)
        return this.V.filter(t => { return to.indexOf(t) < 0 })
    }
    get V() {
        const verticies = Object.keys(this.edges).reduce((previous, key) => {
            if (this.edges[key].length > 0) {
                if (!previous.includes(key)) {
                    previous.push(key);
                }
                this.edges[key].forEach((e) => {
                    if (!previous.includes(e.from)) {
                        previous.push(e.from);
                    }
                });
            }
            return previous;
        }, []);
        return verticies;
    }
    get E() {
        const edges = [];
        Object.keys(this.edges).forEach((to) => {
            this.edges[to].forEach(edge => edges.push(this.edge(edge.from, to)));
        });
        return edges;
    }
    edge(from, to) {
        if (this.edges[to] !== undefined) {
            const edge = this.edges[to].find(e => e.from === from);
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
        if (this.testCycle(from, to)) {
            throw new CycleError();
        }

        // instantiate an edge
        const edge = {
            from: from
        };

        // register the edge
        if (this.edges[to] === undefined) {
            this.edges[to] = [];
        }
        this.edges[to].push(edge);

        return this;
    }

    /**
       * @param {string} start - starting point of reverse-BFS
       * @callback hitCondition - condition to stop traversal
       * @callback callback - task to do for each visit. The visit stopping the traversal is exclusive.
       */
    reverseBFS(start, hitCondition, callback) {
        const q = [start];
        while (q.length > 0) {
            const visit = q.shift();
            if (hitCondition !== undefined && hitCondition(visit)) {
                return visit;
            }
            if (callback !== undefined) {
                callback(visit);
            }
            if (this.edges[visit] !== undefined) {
                this.edges[visit].forEach(e => q.push(e.from));
            }
        }
        return undefined;
    }

    /**
    * @return {boolean}    true, if (@code{from}, @code{to}) makes a cycle. false, otherwise.
    */
    testCycle(from, to) {
        if (from === to) {
            return true;
        }
        const hit = this.reverseBFS(from, v => v === to);
        if (hit === undefined) {
            return false;
        }
        return true;
    }
    /**
   * Edges go to a vertex
   * @param {string} to       the vertex.
   * @returns {@type {Dag}}   deep cloned edges end at the vertex 'to'.
   *                          empty DAG, if the vertex does not exist or there is no edges heading
   *                          it.
   */
    edgesTo(to) {
        if (undefined === this.edges[to]) {
            return new Dag();
        }
        const dag = new Dag();
        this.edges[to].forEach((e) => {
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
        Object.keys(this.edges).forEach((key) => {
            this.edges[key].forEach((e) => {
                if (e.from === from) {
                    const cloned = { from: e.from, to: key };
                    dag.add(cloned.from, cloned.to);
                }
            });
        });
        return dag;
    }

    findPathsDown(from){
        let downPath = new DownPath()
        this.down(from, downPath)
        downPath.trim();
        return downPath
    }
    down(from, dp){
        let to = Object.keys(this.edgesFrom(from).edges)
        to.forEach((v) => {
            dp.add(v)
            if(Object.keys(this.edgesFrom(v).edges).length > 0) this.down(v, dp)
            else{
                dp.nextPath()
                return
            }
        })
    }

    removeVertex(vertex, callback) {
        // remove edges 'to' the verted
        let obj = this.readObj(vertex)
        this.removeObj(vertex)

        if (vertex in this.edges) {
            // arrange edges
            delete this.edges[vertex];
        }

        // remove edges 'from' the vertex
        Object.keys(this.edges).forEach((to) => {
            // arrnage edges
            //const tagsToRemove = [];
            this.edges[to] = this.edges[to].filter((e) => {
                return e.from !== vertex;
            });
            if (this.edges[to].length === 0) {
                delete this.edges[to];
            }


        });
        //return this;
        if (callback)
            callback.call(null, obj)
    }

    // remove
    removeEdge(from, to) {
        if (!(to in this.edges)) {
            return this;
        }

        // arrange edges
        const targetIndex = this.edges[to].findIndex(e => e.from === from);
        if (targetIndex === -1) {
            return this;
        }
        const removed = this.edges[to].splice(targetIndex, 1)[0];
        if (this.edges[to].length === 0) {
            delete this.edges[to];
        }
        return this;
    }
    /**
   * Deep copy
   * @return new DAG instance without references from the original pieces, at all.
   */
    deepClone() {
        const newDag = new Dag();
        Object.keys(this.edges).forEach((to) => {
            this.edges[to].forEach((e) => {
                // clone the edge
                //const tags = e.ts.reduce((previous, tagObj) => previous.concat([tagObj.name]), []);
                newDag.add(e.from, to);
            });
        });
        this.V.forEach((v) => { if (this.readObj(v)) newDag.saveObj(v, this.readObj(v))})
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
        Object.keys(this.edges).forEach((key) => { newDag.edges[key] = this.edges[key]; newDag.storage[key] = this.storage[key] });
        return newDag;
    }
    includes(from, to) {
        return this.edge(from, to) !== undefined;
    }
    get order() {
        const verticies = this.V;
        return verticies.length;
    }

    get size() {
        return Object.keys(this.edges).reduce((previous, key) => previous + this.edges[key].length, 0);
    }
}
//
module.exports = Dag;