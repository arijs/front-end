import isomorphicPrefixMatcher from '../../isomorphic/loaders/comp-prefix';
import loadComponent from './component';

export default function prefixMatcher(optPrefix) {
	return isomorphicPrefixMatcher({
		loadComponent,
		...optPrefix
	});
}
