import printfParse from './parse.mjs';
import printfFill from './fill.mjs';
import dictionary from '../state/dictionary-static.mjs';

function printf(str, vars, mods, cbError, debug) {
	if (debug) debugger;
	return printfFill(
		printfParse(str),
		dictionary(vars),
		dictionary(mods),
		cbError
	);
}

export {
	printf,
	printfParse,
	printfFill,
};

export default printf;