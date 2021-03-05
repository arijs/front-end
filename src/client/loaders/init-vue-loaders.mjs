import isomorphicVueLoaders from '../../isomorphic/loaders/init-vue-loaders';
import prefixMatcher from './comp-prefix';

export default function initVueLoaders(comps, opt) {
	return isomorphicVueLoaders(comps, {
		prefixMatcher,
		...opt,
	});
}
