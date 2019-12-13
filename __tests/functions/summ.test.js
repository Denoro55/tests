import summ from '../../src/functions/summ';

test('1 + 2 should return 3', () => {
	expect(summ(1, 2)).toBe(3);
});