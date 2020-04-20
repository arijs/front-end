import printfParse from './parse';
import printfFill from './fill';
import dictionary from '../state/dictionary';

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