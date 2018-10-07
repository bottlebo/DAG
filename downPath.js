class DownPath {
    constructor() {
        this.index = 0
        this.paths = []
        this.paths[0] = []
    }
    nextPath() {
        this.index++
        this.paths[this.index] = []
    }
    add(v) {
        this.paths[this.index].push(v)
    }
    trim(){
        this.paths.splice(this.paths.length -1,1)
    }
    [Symbol.iterator]() {
        var index = -1;
        var data = this.paths;

        return {
            next: () => ({ value: data[++index], done: !(index in data) })
        };
    };
}

module.exports = DownPath;