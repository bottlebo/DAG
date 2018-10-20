Usage
-----
```javascript
let Dag = require('dag');

let dag = new Dag();
// ...

dag.V                               // return vertices
dag.E                               // return edges

dag.add(from, to)                   // add edge
dad.addVertex(v)                    // add vertex

dag.saveObj(v, obj)                 // Save object in vertex
dag.readObj(v)                      // Read object from vertex
dag.removeObj(v)                    // Remove object from vertex

dag.tips                            // Return tips

dag.edgesTo(to)                     // Edges go to a vertex
dag.edgesFrom(from)                 // Edges comes from a vertex

let p = dag.findPathsDown(v)        // Return array of down paths from v as p.paths
                                    // or iterator for(let s of p)
let p = dag.findPathsUp(v)          // Return array of up paths from v as p.paths
                                    // or iterator for(let s of p)

dag.removeVertex(vertex, callback)  // Remove vertex. callback(v, obj)
                                    // v = removed vertex, obj = object stored in vertex
dag.removeEdge(from, to)            // Remove edge

dag.order                           // Verticies length
dag.size                            // Edges length
```
