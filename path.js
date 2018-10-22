class Path {
  constructor () {
    this.paths = []
    this._index = 0
    this.paths[0] = []
  }

  vertices () {
    if (this._setAllVertices) return this._setAllVertices.values()
    this._setAllVertices = new Set()
    for (let path of this.paths) {
      for (let vertix of path) {
        this._setAllVertices.add(vertix)
      }
    }
    return this._setAllVertices.values()
  }

  getLongestPathLength () {
    return this.paths.reduce(
      (longestLength, currentPath) =>
        currentPath.length > longestLength ? currentPath.length : longestLength,
      0)
  }

  _nextPath (v) {
    this._index++
    this.paths[this._index] = []
  }

  _add (v) {
    this.paths[this._index].push(v)
  }

  _trim () {
    this.paths.splice(this.paths.length - 1, 1)
  }

  [Symbol.iterator] () {
    var index = -1
    var data = this.paths

    return {
      next: () => ({value: data[++index], done: !(index in data)})
    }
  }

}

module.exports = Path
