import deaccentize from './deaccentize.mjs';

const reExcessSpaces = /^\s*|\s+(?=\s)|\s*$/g;

export default function getViews(raw) {
	const trim = String(raw).replace(reExcessSpaces, '');
	const lower = trim.toLowerCase();
	const noacc = deaccentize(lower);
	return {
		raw,
		trim,
		lower,
		noacc,
	};
}
