import fs from 'fs';
import _ from 'lodash';
import path from 'path';

const readFile = (filepath, cb) => {
	fs.readFile(filepath, 'utf-8', (err, data) => { // eslint-disable-line
		console.log(data);
	});
};

const writeFile = (filepath, content, cb) => {
	fs.writeFile(filepath, content, 'utf-8', (err, data) => {
		if (err) {
			cb(err);
			return;
		}
		cb(null, data);
	});
};

const compareFileSizes = (filepath, filepath2, cb) => {
	fs.stat(filepath, (err, { size: size1 }) => {
		if (err) {
			cb(err);
			return;
		}
		fs.stat(filepath2, (err, { size: size2 }) => {
			if (err) {
				cb(err);
				return;
			}
			cb(null, Math.sign(size1 - size2));
		});
	});
};

const move = (from, to, cb) => {
	fs.readFile(from, 'utf-8', (err, content) => {
		if (err) {
			cb(err);
			return;
		}
		fs.writeFile(to, content, 'utf-8', (err2) => {
			if (err2) {
				cb(err2);
				return;
			}
			fs.unlink(from, cb);
		});
	});
};

const watch = (filepath, period, cb) => {
	let now = Date.now();

	const checkFile = (timer) => {
		fs.stat(filepath, (err, stat) => {
			if (err) {
				clearInterval(timer);
				cb(err);
				return;
			}
			if (stat.mtimeMs.toFixed(0) > now) {
				cb(null);
			}
			now = Date.now();
		});
	};

	const timer = setInterval(() => checkFile(timer), period);
	return timer;
};

const reverseLines = (lines) => lines.split('\n').reverse().join('\n');

const reverse = (filepath) => {
	return fs.promises.readFile(filepath, 'utf-8').then((content) => fs.promises.writeFile(filepath, reverseLines(content))).catch(e => { throw e; });
};

const getTypeName = (stat) => (stat.isDirectory() ? 'directory' : 'file');

const getTypes = ([firstPath, ...rest]) => {
	const result = [];

	const processPath = (filepath) => fs.promises.stat(filepath)
		.then((data) => result.push(getTypeName(data)))
		.catch(() => result.push(null));

	const initPromise = processPath(firstPath);
	const resultPromise = rest.reduce(
		(promise, filepath) => promise.then(() => processPath(filepath)), initPromise
	);

	return resultPromise.then(() => result);
};

const getDirectorySize = (dirpath) => {
	return fs.promises.readdir(dirpath)
		.then((files) => {
			const filepaths = files.map(name => path.join(dirpath, name));
			const promises = filepaths.map(p => fs.promises.stat(p));
			const promise = Promise.all(promises);
			return promise.then(result => _.sumBy(result.filter(e => e.isFile()), 'size')).catch(e => { throw e; });
		})
		.catch(e => { throw e; });
};

export { readFile, writeFile, compareFileSizes, move, watch, reverse, getTypes, getDirectorySize };