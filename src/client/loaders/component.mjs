import isomorphicComponent from '../../isomorphic/loaders/component';
import loadAjax from './ajax';
import loadScript from './script';
import loadStylesheet from './stylesheet';

export default async function loadComponent(opt) {
	opt.loaders = {
		html: loadAjax,
		js: loadScript,
		css: loadStylesheet,
		...(opt.loaders || null),
	};
	return isomorphicComponent(opt);
}
