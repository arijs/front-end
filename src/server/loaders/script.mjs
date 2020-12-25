import loadAjax from './ajax.mjs';
import evalContext from '../../isomorphic/utils/eval-context.mjs';

export default async function loadScript(opt) {
	if ('string' === typeof opt) opt = { url: opt };
	var {jsContext, jsOnError, processData} = opt;
	// console.log(' +  load js', opt.url, jsContext);
	var data = await loadAjax(opt);
	if (processData instanceof Function) {
		data = processData(data, opt);
	}
	return evalContext(data, jsContext, onScriptError).run();
	function onScriptError(error, values) {
		jsOnError instanceof Function && jsOnError(error, opt, values);
	}
}
