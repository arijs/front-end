import isomorphicVueLoaders from '../../isomorphic/loaders/init-vue-loaders.mjs';
import prefixMatcher from './comp-prefix.mjs';

export default function initVueLoaders(comps, opt) {
	return isomorphicVueLoaders(comps, {
		prefixMatcher,
		...opt,
	});
}
