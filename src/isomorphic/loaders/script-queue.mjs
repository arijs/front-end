
function processItemDefault(x) {
	return x;
}

function processResultDefault(x) {
	// nop
}

function addJsContext(item, jsContext, jsOnError) {
	return {
		jsContext,
		jsOnError,
		...('string' === typeof item
			? {url: item}
			: item)
	};
}

export default async function loadScriptQueue({queue, jsContext, jsOnError, processItem, processResult, loadScript}) {
	var next, res;
	processItem = processItem instanceof Function
		? processItem
		: processItemDefault;
	processResult = processResult instanceof Function
		? processResult
		: processResultDefault;
	while (queue.length) {
		next = queue.shift();
		// console.log('  ~ load script queue', typeof next, queue.length, 'remaining');
		if (!next) continue;
		next = processItem(addJsContext(next, jsContext, jsOnError));
		res = await loadScript(next);
		processResult(next, res);
	}
	// console.log('  ~ load script queue', typeof next, queue.length, 'remaining');
}
/*
import loadScriptDefault from './script';
	loadScript = loadScript instanceof Function
		? loadScript
		: loadScriptDefault;
*/
