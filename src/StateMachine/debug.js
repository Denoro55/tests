export default (machine) => {
	if (machine.can('debug')) {
		machine.debug();
	}
};
