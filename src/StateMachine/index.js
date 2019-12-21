import StateMachine from 'javascript-state-machine';

export default class Order {
	constructor () {
		this.history = [];
		this._fsm();
	}
}

StateMachine.factory(Order, {
	init: 'idle',
	transitions: [
		{ name: 'sleep', from: 'idle', to: 'sleeping' },
		{ name: 'wake', from: ['sleeping', 'working', 'debugging'], to: 'idle' },
		{ name: 'work', from: 'idle', to: 'working' },
		{ name: 'debug', from: 'idle', to: 'debugging' }
	],
	methods: {
		onTransition: function (lifecycle, arg1, arg2) {
			if (lifecycle.from !== 'none') {
				this.history.push({ name: lifecycle.from });
			}
		}
	}
});