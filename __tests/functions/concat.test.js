import concat from '../../src/functions/concat';

test('test concat arrays', () => {
	expect(concat([1, 2], [7, 8])).toEqual([1, 2, 7, 8]);
	expect(concat([1, 2], [7, 8], [1, 2])).toEqual([1, 2, 7, 8, 1, 2]);
	expect(concat([], [])).toEqual([]);
});