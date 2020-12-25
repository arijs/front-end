import each from '../utils/for-each';
import {arrayConcat} from '../utils/collection';

export default function replaceNodes(remove, insert, parent) {
	remove = arrayConcat(remove);
	insert = arrayConcat(insert);
	var first = remove[0];
	each(insert, (item) => parent.insertBefore(item, first));
	each(remove, (item) => parent.removeChild(item));
}
