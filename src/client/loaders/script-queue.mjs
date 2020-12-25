import isomorphicScriptQueue from '../../isomorphic/loaders/script-queue.mjs';
import loadScript from './script.mjs';

export default function loadScriptQueue(opt) {
	return isomorphicScriptQueue({
		loadScript,
		...opt
	});
}
