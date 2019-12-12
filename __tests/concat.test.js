import { concat } from '../src';

test('test concat arrays', () => {
	expect(concat([1, 2], [7, 8])).toEqual([1, 2, 7, 8]);
});