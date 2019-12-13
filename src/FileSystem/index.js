import path from 'path';
import Tree from './Tree';

import Dir from './Dir';
import File from './File';

const getPathParts = (filepath) => filepath.split(path.sep).filter((part) => part !== '');

class FileSystem {
	constructor () {
		this.tree = new Tree('\\', new Dir('\\'));
	}

	statSync (filepath) {
		const current = this.findNode(filepath);
		if (!current) return false;
		return current.getMeta().getStats();
	}

	mkdirSync (filepath) {
		const { dir, base } = path.parse(filepath);
		if (!this.statSync(dir) || !this.statSync(dir).isDirectory()) {
			return false;
		}
		return this.findNode(dir).addChild(base, new Dir(base));
	}

	touchSync (filepath) {
		const { dir, base } = path.parse(filepath);
		if (!this.statSync(dir) || !this.statSync(dir).isDirectory()) {
			return false;
		}
		return this.findNode(dir).addChild(base, new File(base));
	}

	findNode (filepath) {
		const parts = getPathParts(filepath);
		return parts.length === 0 ? this.tree : this.tree.getDeepChild(parts);
	}
}

export default FileSystem;