import FileSystem from '../../src/fileSystem';

describe('FileSystem', () => {
	let tree;

	beforeEach(() => {
		tree = new FileSystem();
	});

	// it('#mkdirSync', () => {
	// 	expect(tree.isDirectory('etc')).toBe(false);

	// 	tree.mkdirSync('etc');
	// 	expect(tree.isDirectory('etc')).toBe(true);
	// });

	// it('#mkdirSync2', () => {
	// 	expect(tree.isDirectory('\\etc\\one')).toBe(false);

	// 	tree.mkdirSync('\\etc\\one');
	// 	expect(tree.isDirectory('\\etc\\one')).toBe(false);
	// });

	// it('#mkdirSync3', () => {
	// 	expect(tree.isDirectory('\\etc')).toBe(false);

	// 	tree.mkdirSync('\\\\etc');
	// 	expect(tree.isDirectory('\\etc\\')).toBe(true);

	// 	tree.mkdirSync('\\\\\\etc\\nginx');
	// 	expect(tree.isDirectory('\\etc\\\\nginx')).toBe(true);
	// 	expect(tree.isDirectory('\\etc\\\\nginx\\two')).toBe(false);

	// 	tree.mkdirSync('\\\\\\etc\\nginx\\two');
	// 	expect(tree.isDirectory('\\etc\\nginx\\two')).toBe(true);
	// });

	// it('#touchSync', () => {
	// 	expect(tree.isFile('file.txt')).toBe(false);
	// 	tree.touchSync('file.txt');
	// 	expect(tree.isFile('file.txt')).toBe(true);

	// 	expect(tree.isFile('src\\file')).toBe(false);
	// 	tree.touchSync('src\\file');
	// 	expect(tree.isFile('src\\file')).toBe(false);

	// 	expect(tree.isFile('file.txt\\package')).toBe(false);
	// 	tree.touchSync('file.txt\\package');
	// 	expect(tree.isFile('file.txt\\package')).toBe(false);
	// });

	it('#mkdirSync', () => {
		tree.mkdirSync('\\etc');
		expect(tree.statSync('\\etc').isDirectory()).toBeTruthy();

		tree.mkdirSync('\\etc\\nginx');
		expect(tree.statSync('\\etc\\nginx').isDirectory()).toBeTruthy();
	});

	it('#mkdirSync2', () => {
		tree.mkdirSync('\\var\\');
		expect(tree.statSync('\\var\\\\').isDirectory()).toBeTruthy();
		expect(tree.statSync('\\var').isDirectory()).toBeTruthy();

		tree.mkdirSync('\\var\\log\\');
		expect(tree.statSync('\\var\\log').isDirectory()).toBeTruthy();
		expect(tree.statSync('\\var\\\\\\log').isDirectory()).toBeTruthy();
	});

	it('#touchSync', () => {
		tree.touchSync('\\file.txt');
		expect(tree.statSync('\\file.txt').isFile()).toBeTruthy();

		tree.mkdirSync('\\etc');
		tree.touchSync('\\etc\\bashrc');
		expect(tree.statSync('\\etc\\bashrc').isFile()).toBeTruthy();
	});

	it('#touchSync2', () => {
		tree.touchSync('\\modernfile\\modernfile');
	});
});