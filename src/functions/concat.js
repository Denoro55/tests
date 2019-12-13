const concat = (...arrs) => {
	return arrs.reduce((acc, arr) => {
		return [...acc, ...arr];
	});
};

export default concat;