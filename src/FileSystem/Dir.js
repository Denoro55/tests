import Node from './Node';

export default class extends Node {
	isFile () {
		return false;
	}

	isDirectory () {
		return true;
	}
}