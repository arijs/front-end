import isomorphicPrefixMatcher from '../../isomorphic/loaders/comp-prefix.mjs';
import loadComponent from './component.mjs';

export default function prefixMatcher(optPrefix) {
	return isomorphicPrefixMatcher({
		loadComponent,
		...optPrefix
	});
}
