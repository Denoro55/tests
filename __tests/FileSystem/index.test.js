import FileSystem from '../../src/FileSystem';

describe('FileSystem', () => {
	let tree;

	beforeEach(() => {
		tree = new FileSystem();
	});

	it('#mkdirSync', () => {
		expect(() => tree.statSync('etc')).toThrow(/ENOENT/);

		tree.mkdirSync('etc');
		expect(tree.statSync('etc').isDirectory()).toBe(true);
	});

	it('#mkdirSync2', () => {
		expect(() => tree.statSync('//etc//one')).toThrow(/ENOENT/);

		expect(() => tree.mkdirSync('//etc//one')).toThrow(/ENOTDIR/);
	});

	it('#mkdirSync3', () => {
		expect(() => tree.statSync('//etc')).toThrow(/ENOENT/);

		tree.mkdirSync('////etc');
		expect(tree.statSync('//etc//').isDirectory()).toBe(true);

		tree.mkdirSync('//////etc//nginx');
		expect(tree.statSync('//etc////nginx').isDirectory()).toBe(true);

		expect(() => tree.statSync('//etc////nginx//two')).toThrow(/ENOENT/);

		tree.mkdirSync('//////etc////nginx//two');
		expect(tree.statSync('//etc//nginx//two').isDirectory()).toBe(true);
	});

	it('#touchSync', () => {
		expect(() => tree.statSync('file.txt')).toThrow(/ENOENT/);
		tree.touchSync('file.txt');

		expect(tree.statSync('file.txt').isFile()).toBe(true);

		expect(() => tree.statSync('src//file')).toThrow(/ENOENT/);
		expect(() => tree.touchSync('src//file')).toThrow(/ENOENT/);

		expect(() => tree.statSync('file.txt//package')).toThrow(/ENOENT/);
		expect(() => tree.touchSync('file.txt//package')).toThrow(/ENOTDIR/);
	});
});

describe('FileSystem2', () => {
	let files;

	beforeEach(() => {
		files = new FileSystem();
		files.mkdirSync('/etc');
		files.mkdirSync('/opt');
		files.mkdirSync('/etc/nginx');
	});

	it('#sync', () => {
		expect(() => files.mkdirSync('/opt/folder/inner')).toThrow(/ENOTDIR/);
		expect(files.statSync('/opt').isDirectory()).toBe(true);
		expect(() => files.statSync('/etc/unknown')).toThrow(/ENOENT/);

		files.touchSync('/opt/file.txt');
		files.touchSync('/etc/nginx/nginx.conf');
		expect(files.statSync('/etc/nginx').isDirectory()).toBe(true);

		expect(files.statSync('/etc/nginx').isFile()).toBe(false);
		expect(files.statSync('/etc/nginx/nginx.conf').isDirectory()).toBe(false);
		expect(files.statSync('/etc/nginx/nginx.conf').isFile()).toBe(true);
		expect(() => files.mkdirSync('/etc/nginx/nginx.conf/wrong')).toThrow(/ENOTDIR/);

		expect(() => files.touchSync('/etc/nginx/nginx.conf/wrong')).toThrow(/ENOTDIR/);
		expect(() => files.touchSync('/opt/folder/inner')).toThrow(/ENOENT/);
		expect(files.statSync('/opt/file.txt').isFile()).toBe(true);

		files.mkdirpSync('/etc/nginx/conf.d');
		files.mkdirpSync('/usr/admin/docs');
		expect(files.readdirSync('/usr/admin/docs')).toEqual([]);
		expect(files.statSync('/etc/nginx/conf.d').isDirectory()).toBe(true);
		expect(() => files.mkdirpSync('/etc/nginx/nginx.conf/wrong')).toThrow(/ENOTDIR/);

		expect(files.readdirSync('/etc/nginx')).toEqual(['nginx.conf', 'conf.d']);
		expect(files.readdirSync('/')).toEqual(['etc', 'opt', 'usr']);
		expect(() => files.readdirSync('/etc/nginx/undefined')).toThrow(/ENOENT/);
		expect(() => files.readdirSync('/etc/nginx/nginx.conf')).toThrow(/ENOTDIR/);

		files.rmdirSync('/etc/nginx/conf.d');
		expect(files.readdirSync('/etc/nginx')).toEqual(['nginx.conf']);

		expect(() => files.rmdirSync('/etc/unknown')).toThrow(/ENOENT/);
		expect(() => files.rmdirSync('/etc/nginx')).toThrow(/EISDIR/);

		expect(() => files.rmdirSync('/etc/nginx/nginx.conf')).toThrow(/ENOTDIR/);

		files.rmdirSync('/usr/admin/docs');
		expect(() => files.readdirSync('/usr/admin/docs')).toThrow(/ENOENT/);
	});
});

describe('FS', () => {
	let files;

	beforeEach(() => {
		files = new FileSystem();
		files.mkdirpSync('/etc');
		files.mkdirpSync('/opt');
		files.touchSync('/opt/file.txt');
		files.mkdirpSync('/etc/nginx/conf.d');
	});

	it('#writeFileSync', () => {
		expect(() => files.writeFileSync('/etc/unknown/file', 'body')).toThrow(/ENOENT/);
		expect(() => files.writeFileSync('/etc', 'body')).toThrow(/EISDIR/);
		expect(() => files.writeFileSync('/opt/file.txt/wrong', 'body')).toThrow(/ENOENT/);
	});

	it('#readFileSync', () => {
		files.writeFileSync('/etc/nginx/nginx.conf', 'directives');

		expect(files.readFileSync('/etc/nginx/nginx.conf')).toBe('directives');
		expect(() => files.readFileSync('/etc/nginx')).toThrow(/EISDIR/);
		expect(() => files.readFileSync('/etc/unknown')).toThrow(/ENOENT/);
	});

	it('#unlinkSync', () => {
		files.writeFileSync('/etc/nginx/nginx.conf', 'directives');
		files.unlinkSync('/etc/nginx/nginx.conf');

		expect(files.readdirSync('/etc/nginx')).toEqual(['conf.d']);
		expect(() => files.unlinkSync('/etc/nginx')).toThrow(/EPERM/);
		expect(() => files.unlinkSync('/etc/nginx/unexist.file')).toThrow(/ENOENT/);
	});

	it('#writeFileSync&readFileSync', () => {
		expect(files.writeFileSync('/opt/another-file.txt', 'body').getMeta().getName()).toBe('another-file.txt');
		expect(files.readFileSync('/opt/another-file.txt')).toBe('body');
	});
});

describe('FS2', () => {
	let files;

	beforeEach(() => {
		files = new FileSystem();
		files.mkdirpSync('/etc/nginx');
		files.mkdirpSync('/opt');
		files.touchSync('/opt/file.txt');
		files.mkdirpSync('/etc/nginx/conf.d');
		files.touchSync('/etc/nginx/nginx.conf');
	});

	it('#copySync', () => {
		expect(() => files.copySync('undefined', '/etc'))
			.toThrow(/ENOENT/);

		expect(() => files.copySync('/opt', '/etc')).toThrow(/EISDIR/);

		expect(() => files.copySync('/op/file.txt', '/etc/file.txt/inner'))
			.toThrow(/ENOENT/);

		expect(() => files.copySync('/opt/file.txt', '/etc/undefined/inner'))
			.toThrow(/ENOENT/);

		files.copySync('/opt/file.txt', '/etc');
		expect(files.statSync('/etc/file.txt').isFile()).toBeTruthy();

		files.copySync('/opt/file.txt', '/etc/nginx/nginx.conf');
		expect(files.readFileSync('/etc/nginx/nginx.conf')).toBe('');
	});

	it('#copySync2', () => {
		files.writeFileSync('/opt/file.txt', 'body');
		files.copySync('/opt/file.txt', '/etc/nginx/nginx.conf');
		expect(files.readFileSync('/etc/nginx/nginx.conf')).toBe('body');

		files.copySync('/opt/file.txt', '/etc');
		expect(files.readFileSync('/etc/file.txt')).toBe('body');

		files.copySync('/opt/file.txt', '/opt/newfile');
		expect(files.readFileSync('/opt/newfile')).toBe('body');
	});

	it('#copySync3', () => {
		files.mkdirpSync('/etc/nginx/conf.d');
		files.touchSync('/etc/nginx/nginx.conf');
		files.writeFileSync('/opt/file.txt', 'body');
		expect(() => files.copySync('/opt/file.txt', '/etc/nginx/nginx.conf/testFile'))
			.toThrow(/ENOENT/);
	});
});
