import path from 'path';
import Tree from './Tree';
import errors from 'errno';

import Dir from './Dir';
import File from './File';

const getPathParts = (filepath) => {
	const crossPath = path.join(filepath);
	return crossPath.split(path.sep).filter((part) => part !== '' && part !== '.');
};

class FileSystem {
	constructor () {
		this.tree = new Tree('/', new Dir('/'));
	}

	statSync (filepath) {
		const current = this.findNode(filepath);
		if (!current) return null;
		return current.getMeta().getStats();
	}

	unlinkSync (filepath) {
		const current = this.findNode(filepath);
		if (!current) {
			return [null, errors.code.ENOENT];
		}
		if (current.getMeta().isDirectory()) {
			return [null, errors.code.EPERM];
		}
		return [current.getParent().removeChild(current.getKey()), null];
	}

	writeFileSync (filepath, body) {
		const { base, dir } = path.parse(filepath);
		const parent = this.findNode(dir);
		if (!parent) {
			return [null, errors.code.ENOENT];
		}
		if (parent.getMeta().isFile()) {
			return [null, errors.code.ENOTDIR];
		}
		const current = parent.getChild(base);
		if (current && current.getMeta().isDirectory()) {
			return [null, errors.code.EISDIR];
		}
		return [parent.addChild(base, new File(base, body)), null];
	}

	readFileSync (filepath) {
		const current = this.findNode(filepath);
		if (!current) {
			return [null, errors.code.ENOENT];
		}
		if (current.getMeta().isDirectory()) {
			return [null, errors.code.EISDIR];
		}
		return [current.getMeta().getBody(), null];
	}

	mkdirSync (filepath) {
		const current = this.findNode(filepath);
		if (current) {
			return false;
		}
		const { base, dir } = path.parse(filepath);
		const parent = this.findNode(dir);
		if (!parent || parent.getMeta().isFile()) {
			return false;
		}
		parent.addChild(base, new Dir(base));
		return true;
	}

	rmdirSync (filepath) {
		const { base } = path.parse(filepath);
		const current = this.findNode(filepath);
		if (!current) {
			return false;
		}
		if (current.getMeta().isFile() || current.hasChildren()) {
			return false;
		}
		current.getParent().removeChild(base);
		return true;
	}

	touchSync (filepath) {
		const { dir, base } = path.parse(filepath);
		if (!this.statSync(dir) || !this.statSync(dir).isDirectory()) {
			return false;
		}
		return this.findNode(dir).addChild(base, new File(base));
	}

	mkdirpSync (filepath) {
		const current = this.findNode(filepath);
		if (!current) {
			const { dir } = path.parse(filepath);
			this.mkdirpSync(dir);
		} else if (current.getMeta().isFile()) {
			return false;
		}
		return this.mkdirSync(filepath);
	}

	readdirSync (filepath) {
		const dir = this.findNode(filepath);
		if (!dir) {
			return [null, errors.code.ENOENT];
		}
		if (dir.getMeta().isFile()) {
			return [null, errors.code.ENOTDIR];
		}
		return [dir.getChildren().map((child) => child.getKey()), null];
	}

	// readdirSync (filepath) {
	// 	const current = this.findNode(filepath);
	// 	if (!current || current.getMeta().isFile()) {
	// 		return false;
	// 	}
	// 	return current.getChildren()
	// 		.map((child) => child.getKey());
	// }

	findNode (filepath) {
		const parts = getPathParts(filepath);
		return parts.length === 0 ? this.tree : this.tree.getDeepChild(parts);
	}
}

export default FileSystem;