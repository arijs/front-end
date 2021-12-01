import promises from 'fs/promises';

const { readFile } = promises;

export default async function loadAjax(opt) {
	if ('string' === typeof opt) opt = { url: opt };
	let data = await readFile(
		opt.url,
		{ encoding: opt.encoding || 'utf8' }
	);
	if (opt.json) {
		data = JSON.parse(data);
	}
	return data;
}
