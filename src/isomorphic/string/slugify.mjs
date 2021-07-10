import getViews from "./normalize-views.mjs";

const reSpaces = /\s/g;

export default function slugify(raw) {
	return getViews(raw).noacc.replace(reSpaces, '-');
}
