import isomorphicComponent from '../../isomorphic/loaders/component.mjs';
import loadAjax from './ajax-fs.mjs';
import loadScript from './script.mjs';
import loadStylesheet from './stylesheet.mjs';

export default async function loadComponent(opt) {
	opt.loaders = {
		html: loadAjax,
		js: loadScript,
		css: loadStylesheet,
		...opt.loaders,
	};
	return isomorphicComponent(opt);
}
