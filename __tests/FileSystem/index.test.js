import FileSystem from '../../src/FileSystem';
import path from 'path';

// describe('FileSystem', () => {
// 	let tree;

// 	beforeEach(() => {
// 		tree = new FileSystem();
// 	});

// 	it('#mkdirSync', () => {
// 		expect(tree.isDirectory('etc')).toBe(false);

// 		tree.mkdirSync('etc');
// 		expect(tree.isDirectory('etc')).toBe(true);
// 	});

// 	it('#mkdirSync2', () => {
// 		expect(tree.isDirectory('//etc//one')).toBe(false);

// 		tree.mkdirSync('//etc//one');
// 		expect(tree.isDirectory('//etc//one')).toBe(false);
// 	});

// 	it('#mkdirSync3', () => {
// 		expect(tree.isDirectory('//etc')).toBe(false);

// 		tree.mkdirSync('////etc');
// 		expect(tree.isDirectory('//etc//')).toBe(true);

// 		tree.mkdirSync('//////etc//nginx');
// 		expect(tree.isDirectory('//etc////nginx')).toBe(true);
// 		expect(tree.isDirectory('//etc////nginx//two')).toBe(false);

// 		tree.mkdirSync('//////etc//nginx//two');
// 		expect(tree.isDirectory('//etc//nginx//two')).toBe(true);
// 	});

// 	it('#touchSync', () => {
// 		expect(tree.isFile('file.txt')).toBe(false);
// 		tree.touchSync('file.txt');
// 		expect(tree.isFile('file.txt')).toBe(true);

// 		expect(tree.isFile('src//file')).toBe(false);
// 		tree.touchSync('src//file');
// 		expect(tree.isFile('src//file')).toBe(false);

// 		expect(tree.isFile('file.txt//package')).toBe(false);
// 		tree.touchSync('file.txt//package');
// 		expect(tree.isFile('file.txt//package')).toBe(false);
// 	});

// 	it('#mkdirSync', () => {
// 		tree.mkdirSync('//etc');
// 		expect(tree.statSync('//etc').isDirectory()).toBeTruthy();

// 		tree.mkdirSync('//etc//nginx');
// 		expect(tree.statSync('//etc//nginx').isDirectory()).toBeTruthy();
// 	});

// 	it('#mkdirSync2', () => {
// 		tree.mkdirSync('/var/');
// 		expect(tree.statSync('//var/').isDirectory()).toBeTruthy();
// 		expect(tree.statSync('//var').isDirectory()).toBeTruthy();

// 		tree.mkdirSync('//var//log//');
// 		expect(tree.statSync('//var//log').isDirectory()).toBeTruthy();
// 		expect(tree.statSync('//var//////log').isDirectory()).toBeTruthy();
// 	});

// 	it('#touchSync', () => {
// 		tree.touchSync('//file.txt');
// 		expect(tree.statSync('//file.txt').isFile()).toBeTruthy();

// 		tree.mkdirSync('//etc');
// 		tree.touchSync('//etc//bashrc');
// 		expect(tree.statSync('//etc//bashrc').isFile()).toBeTruthy();
// 	});

// 	it('#touchSync2', () => {
// 		tree.touchSync('//modernfile//modernfile');
// 	});
// });

describe('FileSystem2', () => {
	let tree;

	beforeEach(() => {
		tree = new FileSystem();
	});

	it('#mkdirSync', () => {
		expect(tree.statSync('etc')).toBe(null);
		tree.mkdirSync('etc');
		expect(tree.statSync('/etc').isDirectory()).toBe(true);
	});
});

describe('FileSystem3', () => {
	let files;

	beforeEach(() => {
		files = new FileSystem();
		files.mkdirSync('/etc');
		files.mkdirSync('/opt');
		files.mkdirSync('/etc/nginx');
	});

	it('hexletFs', () => {
		expect(files.mkdirSync('/opt/folder/inner')).toBe(false);
		expect(files.statSync('/opt').isDirectory()).toBe(true);
		expect(files.statSync('/etc/unknown')).toBe(null);

		files.touchSync('/opt/file.txt');
		files.touchSync('/etc/nginx/nginx.conf');
		expect(files.statSync('/etc/nginx').isDirectory()).toBe(true);
		expect(files.statSync('/etc/nginx').isFile()).toBe(false);
		expect(files.statSync('/etc/nginx/nginx.conf').isDirectory()).toBe(false);
		expect(files.statSync('/etc/nginx/nginx.conf').isFile()).toBe(true);
		expect(files.mkdirSync('/etc/nginx/nginx.conf/wrong')).toBe(false);

		expect(files.touchSync('/etc/nginx/nginx.conf/wrong')).toBe(false);
		expect(files.touchSync('/opt/folder/inner')).toBe(false);
		expect(files.statSync('/opt/file.txt').isFile()).toBe(true);

		files.mkdirpSync('/etc/nginx/conf.d');
		files.mkdirpSync('/usr/admin/docs');
		expect(files.readdirSync('/usr/admin/docs')).toEqual([]);
		expect(files.statSync('/etc/nginx/conf.d').isDirectory()).toBe(true);
		expect(files.mkdirpSync('/etc/nginx/nginx.conf/wrong')).toBe(false);

		expect(files.readdirSync('/etc/nginx')).toEqual(['nginx.conf', 'conf.d']);
		expect(files.readdirSync('/')).toEqual(['etc', 'opt', 'usr']);
		expect(files.readdirSync('/etc/nginx/undefined')).toBe(false);
		expect(files.readdirSync('/etc/nginx/nginx.conf')).toBe(false);

		files.rmdirSync('/etc/nginx/conf.d');
		expect(files.readdirSync('/etc/nginx')).toEqual(['nginx.conf']);

		expect(files.rmdirSync('/etc/unknown')).toBe(false);
		expect(files.rmdirSync('/etc/nginx')).toBe(false);

		expect(files.rmdirSync('/etc/nginx/nginx.conf')).toBe(false);

		files.rmdirSync('/usr/admin/docs');
		expect(files.readdirSync('/usr/admin/docs')).toBe(false);
	});
});