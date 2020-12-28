import printfParse from './parse.mjs';
import printfFill from './fill.mjs';
import dictionary from '../state/dictionary-static.mjs';

export function printf(str, vars, mods, cbError) {
	return printfDict(
		str,
		dictionary(vars),
		dictionary(mods),
		cbError
	);
}

export function printfDict(str, vars, mods, cbError) {
	return printfFill(
		printfParse(str),
		vars,
		mods,
		cbError
	);
}

export {
	printfParse,
	printfFill,
};

export default printf;