import os from 'os';
import fs from 'fs';
import path from 'path';

import { readFile, writeFile, compareFileSizes, move, watch, reverse, getTypes, getDirectorySize } from '../../src/Async';  // eslint-disable-line

describe('Async', () => {
	// it('#readFile', (done) => {
	// 	const results = [];
	// 	// const { log } = console;
	// 	console.log = jest.fn((...args) => {
	// 		results.push(...args);
	// 		// log(...args);
	// 	});

	// 	readFile(`${__dirname}/files/hello.txt`);

	// 	setTimeout(() => {
	// 		const expected = [fs.readFileSync(`${__dirname}/files/hello.txt`, 'utf-8')];
	// 		expect(results).toEqual(expected);
	// 		done();
	// 	}, 1000);
	// });

	it('#writeFile', (done) => {
		const filename = 'test';
		const content = 'new text';
		const tmpDir = fs.mkdtempSync(`${os.tmpdir()}/`);
		const filepath = path.join(tmpDir, filename);

		// console.log(os.tmpdir());

		writeFile(filepath, content, (err) => {
			if (err) {
				done.fail(err);
				return;
			}
			const data = fs.readFileSync(filepath, 'utf-8');
			expect(data).toEqual(content);
			done();
		});
	});
});

describe('FileSizes', () => {
	let filepath;

	beforeEach(() => {
		filepath = `${__dirname}/files`;
	});

	it('#compareFileSizes', (done) => {
		const filepath1 = `${filepath}/size1.txt`;
		const filepath2 = `${filepath}/size2.txt`;

		compareFileSizes(filepath1, filepath2, (err, result) => {
			if (err) {
				done.fail(err);
				return;
			}
			expect(result).toBe(-1);
			done();
		});
	});

	it('#compareFileSizes 2', (done) => {
		const filepath1 = `${filepath}/size3.txt`;
		const filepath2 = `${filepath}/size2.txt`;

		compareFileSizes(filepath1, filepath2, (err, result) => {
			if (err) {
				done.fail(err);
				return;
			}
			expect(result).toBe(1);
			done();
		});
	});

	it('#compareFileSizes 3', (done) => {
		const filepath1 = `${filepath}/size2.txt`;
		const filepath2 = `${filepath}/size2.txt`;

		compareFileSizes(filepath1, filepath2, (err, result) => {
			if (err) {
				done.fail(err);
				return;
			}
			expect(result).toBe(0);
			done();
		});
	});
});

describe('FileMove', () => {
	it('#move 1', (done) => {
		move('/undefined', '/undefined2', (error) => {
			expect(error).not.toBeNull();
			expect(error.syscall).toBe('open');
			expect(error.code).toBe('ENOENT');
			done();
		});
	});

	it('#move 2', (done) => {
		const dirname = fs.mkdtempSync(path.join(os.tmpdir(), 'move'));
		const from = path.join(dirname, 'source');
		fs.writeFileSync(from, 'move test');

		move(from, '/source/undefined', (error) => {
			expect(error).not.toBeNull();
			const exists1 = fs.existsSync(from);
			expect(exists1).toBe(true);
			done();
		});
	});

	it('#move 3', (done) => {
		const dirname = fs.mkdtempSync(path.join(os.tmpdir(), 'mover-'));
		const to = path.join(dirname, 'dest');
		move('/etc/passwd', to, (error) => {
			expect(error).not.toBeNull();
			done();
		});
	});

	it('#move 4', (done) => {
		const dirname = fs.mkdtempSync(path.join(os.tmpdir(), 'mover-'));
		const from = path.join(dirname, 'source');
		fs.writeFileSync(from, 'haha');
		const to = path.join(dirname, 'dest');
		move(from, to, (error) => {
			expect(error).toBeNull();
			const exists1 = fs.existsSync(from);
			expect(exists1).toBe(false);
			const exists2 = fs.existsSync(to);
			expect(exists2).toBe(true);
			const content = fs.readFileSync(to, 'utf-8');
			expect(content).toBe('haha');
			done();
		});
	});
});

describe('FileWatcher', () => {
	const filepath = path.join(os.tmpdir(), 'watcher');

	beforeEach(() => {
		fs.writeFileSync(filepath, '');
	});

	it('#watch 1', (done) => {
		const watcher = watch('/undefined', 4, (err) => {
			clearInterval(watcher);
			expect(err).not.toBeNull();
			done();
		});
	});

	it('#watch 2', (done) => {
		const watcher = watch(filepath, 300, (err) => {
			clearInterval(watcher);
			expect(err).toBeNull();
			done();
		});
		setTimeout(() => { fs.writeFileSync(filepath, 'changed'); }, 500);
	});

	it('#watch 3', (done) => {
		let counter = 0;

		const watcher = watch(filepath, 500, (err) => {
			counter++;

			if (counter === 2) {
				clearInterval(watcher);
				expect(err).toBeNull();
				done();
			}
		});

		setTimeout(() => { fs.writeFileSync(filepath, 'changed'); }, 700);
		setTimeout(() => { fs.writeFileSync(filepath, 'changed'); }, 1200);
	});

	it('#watch 4', (done) => {
		let count = 0;
		const watcher = watch(filepath, 500, () => {
			count += 1;
		});
		setTimeout(() => fs.appendFileSync(filepath, 'ehu'), 100);
		setTimeout(() => fs.appendFileSync(filepath, 'abc'), 300);
		setTimeout(() => {
			clearInterval(watcher);
			expect(count).toBe(1);
			done();
		}, 1100);
	});
});

const reverseLines = (data) => data.split('\n').reverse().join('\n');

it('#reverse', () => {
	const filepath = `${__dirname}/files/reverse`;
	const content = 'one\ntwo';

	const promise = fs.promises.writeFile(filepath, content)
		.then(() => reverse(filepath))
		.then(() => fs.readFileSync(filepath, 'utf-8'));

	return expect(promise).resolves.toBe(reverseLines(content));
});

it('#getTypes', () => {
	const promise = getTypes(['./Makefile', './src', './.babelrc']);
	return expect(promise).resolves.toEqual(['file', 'directory', 'file']);
});

describe('getDirectorySize', () => {
	it('#directory size 1', () => {
		const promise = getDirectorySize('./undefined');
		return expect(promise).rejects.toThrow();
	});

	it('#directory size 2', () => {
		const promise = getDirectorySize('./files');
		return expect(promise).resolves.toBe(98);
	});
});