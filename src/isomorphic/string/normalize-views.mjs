import deaccentize from './deaccentize.mjs';

export default function getViews(raw) {
	var trim = String(raw).replace(reSpaces, '');
	var lower = trim.toLowerCase();
	var noacc = deaccentize(lower);
	return {
		raw,
		trim,
		lower,
		noacc,
	};
}
