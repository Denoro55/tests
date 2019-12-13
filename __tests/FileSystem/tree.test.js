import Tree from '../../src/FileSystem/Tree';

describe('Tree', () => {
	let tree;

	beforeEach(() => {
		tree = new Tree('/');
		tree.addChild('var')
			.addChild('lib')
			.addChild('run');
		tree.addChild('etc');
		tree.addChild('home');
	});

	it('#addChild', () => {
		expect(tree.getChild('root')).toBeUndefined();
		tree.addChild('root');
		expect(tree.getChild('root').getKey()).toBe('root');
	});

	it('#getChild', () => {
		const subtree = tree.getChild('var');
		expect(subtree.getKey()).toBe('var');
	});

	it('#hasChild', () => {
		expect(tree.hasChild('etc')).toBe(true);
		expect(tree.hasChild('home')).toBe(true);
	});

	it('#getParent', () => {
		const subtree = tree.getChild('etc');
		expect(subtree.getParent()).toEqual(tree);
	});

	it('#removeChild', () => {
		const subtree = tree.getChild('var');
		expect(subtree.hasChild('lib')).toBe(true);
		subtree.removeChild('lib');
		expect(subtree.hasChild('lib')).toBe(false);
	});

	it('#hasChildren', () => {
		expect(tree.hasChildren()).toBe(true);
		const emptyTree = new Tree('/');
		expect(emptyTree.hasChildren()).toBe(false);
	});

	it('#getDeepChild', () => {
		const path = ['var', 'lib'];
		const subtree = tree.getDeepChild(path);
		expect(subtree.getKey()).toBe('lib');
		const parent = subtree.getParent();
		expect(parent.getKey()).toBe('var');
	});

	it('#getDeepChild undefined', () => {
		const path = ['var', 'lib', 'page', 'one'];
		const subtree = tree.getDeepChild(path);
		expect(subtree).toBeUndefined();
		const subtree2 = tree.getDeepChild([]);
		expect(subtree2).toBeUndefined();
	});

	it('#getChildren', () => {
		const dirs = tree.getChildren().map((child) => child.getKey());
		expect(dirs).toEqual(['var', 'etc', 'home']);
	});
});