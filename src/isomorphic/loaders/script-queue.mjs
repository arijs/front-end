
function processItemDefault(x) {
	return x;
}

function processResultDefault(x) {
	// nop
}

export default async function loadScriptQueue({queue, processItem, processResult, loadScript}) {
	var next, res;
	processItem = processItem instanceof Function
		? processItem
		: processItemDefault;
	processResult = processResult instanceof Function
		? processResult
		: processResultDefault;
	while (queue.length && !next) {
		next = queue.shift();
		if (!next) continue;
		next = processItem(next);
		res = await loadScript(next);
		processResult(next, res);
	}
}
/*
import loadScriptDefault from './script';
	loadScript = loadScript instanceof Function
		? loadScript
		: loadScriptDefault;
*/
