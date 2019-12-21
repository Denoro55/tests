import StateMachine from '../../src/StateMachine';
import tryDebug from '../../src/StateMachine/debug';

describe('StateMachine', () => {
	it('#states', () => {
		const machine = new StateMachine();
		expect(machine.state).toBe('idle');

		machine.sleep();
		expect(machine.state).toBe('sleeping');
		expect(machine.history).toHaveLength(1);

		expect(machine.can('work')).toBe(false);

		expect(() => machine.work()).toThrow();

		machine.wake();
		machine.work();

		expect(machine.state).toBe('working');
		expect(machine.history).toHaveLength(3);

		expect(() => tryDebug(machine)).not.toThrow();
		expect(machine.history).toHaveLength(3);

		machine.wake();
		tryDebug(machine);
		expect(machine.is('debugging')).toBeTruthy();
		expect(machine.history).toHaveLength(5);
	});
});
