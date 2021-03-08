import isomorphicComponent from '../../isomorphic/loaders/component.mjs';
import { loadAjaxPromise } from './ajax.mjs';
import { loadScriptPromise } from './script.mjs';
import { loadStylesheetPromise } from './stylesheet.mjs';

export default async function loadComponent(opt) {
	opt.loaders = {
		html: loadAjaxPromise,
		js: loadScriptPromise,
		css: loadStylesheetPromise,
		...opt.loaders,
	};
	return isomorphicComponent(opt);
}
