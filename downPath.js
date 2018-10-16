class DownPath {
	constructor() {
		this.paths = []
		this._index = 0
		this.paths[0] = []
	}
	_nextPath() {
		this._index++
		this.paths[this._index] = []
	}
	_add(v) {
		this.paths[this._index].push(v)
	}
	_trim(){
		this.paths.splice(this.paths.length -1, 1)
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