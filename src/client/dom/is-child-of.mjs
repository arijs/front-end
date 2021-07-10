
export default function isChildOf(element, parent) {
	do {
		if (element === parent) return true;
		element = element && element.parentNode;
	} while (element);
	return false;
}
