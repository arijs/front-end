
export function callListeners(list, context, a1, a2, a3, a4) {
	for (var i = 0, ii = list.length; i < ii; i++) {
		list[i].call(context, a1, a2, a3, a4);
	}
}

export function applyListeners(list, args, context) {
	for (var i = 0, ii = list.length; i < ii; i++) {
		list[i].apply(context, args);
	}
}
