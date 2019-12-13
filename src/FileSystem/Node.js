import Stats from './Stats';

export default class {
	constructor (name) {
		this.name = name;
	}

	getStats () {
		return new Stats(this.isFile(), this.isDirectory());
	}

	getName () {
		return this.name;
	}
}