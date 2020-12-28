import each from '../../isomorphic/utils/for-each.mjs';
import {arrayConcat} from '../../isomorphic/utils/collection.mjs';

export default function replaceNodes(remove, insert, parent) {
	remove = arrayConcat(remove);
	insert = arrayConcat(insert);
	var first = remove[0];
	each(insert, (item) => parent.insertBefore(item, first));
	each(remove, (item) => parent.removeChild(item));
}
