import fs from 'fs';

const readFile = (filepath, cb) => {
	fs.readFile(filepath, 'utf-8', (err, data) => { // eslint-disable-line
		console.log(data);
	});
};

const writeFile = (filepath, content, cb) => {
	fs.writeFile(filepath, content, 'utf-8', (err, data) => {
		if (err) {
			cb(err);
		}
		cb(null, data);
	});
};

export { readFile, writeFile };