import printfParse from './parse';
import printfFill from './fill';
import dictionary from '../state/dictionary';

export function printf(str, vars, mods, cbError, debug) {
	if (debug) debugger;
	return printfFill(
		printfParse(str),
		dictionary(vars),
		dictionary(mods),
		cbError
	);
}
