export default class {
	constructor (file, directory) {
		this.directory = directory;
		this.file = file;
	}

	isDirectory () {
		return this.directory;
	}

	isFile () {
		return this.file;
	}
}