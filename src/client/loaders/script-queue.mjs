import isomorphicScriptQueue from '../../isomorphic/loaders/script-queue';
import loadScript from './script';

export default async function loadScriptQueue(opt) {
	return isomorphicScriptQueue({
		loadScript,
		...opt
	});
}
