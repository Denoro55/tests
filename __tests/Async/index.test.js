import os from 'os';
import fs from 'fs';
import path from 'path';

import { readFile, writeFile } from '../../src/Async';

describe('Async', () => {
	it('#readFile', (done) => {
		const results = [];
		const { log } = console;
		console.log = jest.fn((...args) => {
			results.push(...args);
			log(...args);
		});

		readFile(`${__dirname}/files/hello.txt`);

		setTimeout(() => {
			const expected = [fs.readFileSync(`${__dirname}/files/hello.txt`, 'utf-8')];
			expect(results).toEqual(expected);
			done();
		}, 1000);
	});

	it('#writeFile', (done) => {
		const filename = 'test';
		const content = 'new text';
		const tmpDir = fs.mkdtempSync(`${os.tmpdir()}/`);
		const filepath = path.join(tmpDir, filename);

		// console.log(os.tmpdir());

		writeFile(filepath, content, (err) => { // eslint-disable-line
			const data = fs.readFileSync(filepath, 'utf-8');
			expect(data).toEqual(content);
			done();
		});
	});
});
