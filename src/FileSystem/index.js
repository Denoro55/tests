import path from 'path';
import Tree from './Tree';

const getPathParts = (filepath) => filepath.split(path.sep).filter((part) => part !== '');

class FileSystem {
	constructor () {
		this.tree = new Tree('/', { type: 'dir' });
	}

	mkdirSync (filepath) {
		const { dir, base } = path.parse(filepath);
		if (!this.isDirectory(dir)) {
			return false;
		}
		const parent = this.findNode(dir);
		parent.addChild(base, { type: 'dir' });
	}

	touchSync (filepath) {
		const { dir, base } = path.parse(filepath);
		if (!this.isDirectory(dir)) {
			return false;
		}
		const parent = this.findNode(dir);
		parent.addChild(base, { type: 'file' });
	}

	isDirectory (filepath) {
		const current = this.findNode(filepath);
		return !!current && current.getMeta().type === 'dir';
	}

	isFile (filepath) {
		const current = this.findNode(filepath);
		return !!current && current.getMeta().type === 'file';
	}

	findNode (filepath) {
		const parts = getPathParts(filepath);
		return parts.length === 0 ? this.tree : this.tree.getDeepChild(parts);
	}
}

export default FileSystem;