import Node from './Node';

export default class extends Node {
	isFile () {
		return true;
	}

	isDirectory () {
		return false;
	}
}