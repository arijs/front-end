import isomorphicVueLoaders from '../../isomorphic/loaders/init-vue-loaders.mjs';
import prefixMatcher from './comp-prefix.mjs';

export default function initVueLoaders(comps, opt) {
	const newOpt = {
		prefixMatcher,
		...opt,
	};
	// console.log('server:initVueLoaders', opt, newOpt);
	return isomorphicVueLoaders(comps, newOpt);
}
