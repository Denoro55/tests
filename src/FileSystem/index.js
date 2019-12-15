import path from 'path';
import Tree from './Tree';
import FsError from './FsError';
import Dir from './Dir';
import File from './File';

// libs
import errors from 'errno';

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
		if (!current) {
			throw new FsError(errors.code.ENOENT, filepath);
		}
		return current.getMeta().getStats();
	}

	unlinkSync (filepath) {
		const current = this.findNode(filepath);
		if (!current) {
			throw new FsError(errors.code.ENOENT, filepath);
		}
		if (current.getMeta().isDirectory()) {
			throw new FsError(errors.code.EPERM, filepath);
		}
		return [current.getParent().removeChild(current.getKey()), null];
	}

	writeFileSync (filepath, body) {
		const { dir, base } = path.parse(filepath);
		const parent = this.findNode(dir);
		if (!parent || parent.getMeta().isFile()) {
			throw new FsError(errors.code.ENOENT, filepath);
		}
		const current = parent.getChild(base);
		if (current && current.getMeta().isDirectory()) {
			throw new FsError(errors.code.EISDIR, filepath);
		}
		return parent.addChild(base, new File(base, body));
	}

	readFileSync (filepath) {
		const current = this.findNode(filepath);
		if (!current) {
			throw new FsError(errors.code.ENOENT, filepath);
		}
		if (current.getMeta().isDirectory()) {
			throw new FsError(errors.code.EISDIR, filepath);
		}
		return current.getMeta().getBody();
	}

	mkdirSync (filepath) {
		const current = this.findNode(filepath);
		if (current) {
			throw new FsError(errors.code.ENOENT, filepath);
		}
		const { base, dir } = path.parse(filepath);
		const parent = this.findNode(dir);
		if (!parent || parent.getMeta().isFile()) {
			throw new FsError(errors.code.ENOTDIR, filepath);
		}
		parent.addChild(base, new Dir(base));
		return true;
	}

	rmdirSync (filepath) {
		const { base } = path.parse(filepath);
		const current = this.findNode(filepath);
		if (!current) {
			throw new FsError(errors.code.ENOENT, filepath);
		}
		if (current.getMeta().isFile()) {
			throw new FsError(errors.code.ENOTDIR, filepath);
		}
		if (current.hasChildren()) {
			throw new FsError(errors.code.EISDIR, filepath);
		}
		current.getParent().removeChild(base);
		return true;
	}

	touchSync (filepath) {
		const { dir, base } = path.parse(filepath);
		const parent = this.findNode(dir);
		if (!parent) {
			throw new FsError(errors.code.ENOENT, filepath);
		}
		if (parent.getMeta().isFile()) {
			throw new FsError(errors.code.ENOTDIR, filepath);
		}
		return parent.addChild(base, new File(base, ''));
	}

	mkdirpSync (filepath) {
		getPathParts(filepath).reduce((subtree, part) => {
			const current = subtree.getChild(part);
			if (!current) {
				return subtree.addChild(part, new Dir(part));
			}
			if (current.getMeta().isFile()) {
				throw new FsError(errors.code.ENOTDIR, filepath);
			}

			return current;
		}, this.tree);
	}

	readdirSync (filepath) {
		const dir = this.findNode(filepath);
		if (!dir) {
			throw new FsError(errors.code.ENOENT, filepath);
		}
		if (dir.getMeta().isFile()) {
			throw new FsError(errors.code.ENOTDIR, filepath);
		}
		return dir.getChildren().map((child) => child.getKey());
	}

	copySync (src, dest) {
		const data = this.readFileSync(src);
		const destNode = this.findNode(dest);
		if (destNode && destNode.getMeta().isDirectory()) {
			const { base } = path.parse(src);
			const fullDest = path.join(dest, base);
			return this.writeFileSync(fullDest, data);
		}
		return this.writeFileSync(dest, data);
	}

	findNode (filepath) {
		const parts = getPathParts(filepath);
		return parts.length === 0 ? this.tree : this.tree.getDeepChild(parts);
	}
}

export default FileSystem;