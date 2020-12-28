
// more efficient but uglier
// import {printfParse, printfFill} from '../../../src/isomorphic/printf/index.mjs';
// import {default as Dynamic} from '../../../src/isomorphic/state/dictionary-dynamic.mjs';
// import {queryStringify} from '../../../src/isomorphic/utils/query-string.mjs';
// import {numberFormat} from '../../../src/isomorphic/utils/number-string.mjs';

// alternative
// import {printfParse, printfFill} from '@arijs/frontend/isomorphic/printf/index';
// import {default as Dynamic} from '@arijs/frontend/isomorphic/state/dictionary-dynamic';
// import {queryStringify} from '@arijs/frontend/isomorphic/utils/query-string';
// import {numberFormat} from '@arijs/frontend/isomorphic/utils/number-string';

// more elegant but less efficient
import {
	printf as printfModule,
	state as stateModule,
	utils as utilsModule,
//} from '../../../lib/server/index';
} from '@arijs/frontend/server/index';

const {printfParse, printfFill} = printfModule;
const {DictionaryDynamic} = stateModule;
const {
	numberString: {numberFormat},
	queryString: {queryStringify},
} = utilsModule;

function printf(str, vars, mods) {
	return printfFill( printfParse(str), vars, mods );
}
function compare(result, expected, name) {
	if (result === expected) {
		console.log(`Test ${name} - ok!`);
	} else {
		console.log(`Test ${name} - Error:`);
		console.log(`Result  : ${result}`);
		console.log(`Expected: ${expected}`);
	}
}

const store = new DictionaryDynamic({
	"( bar ) (key)": "value start - ( bar ) (key) - value end",
	"labelMain": Math.PI * 1e6,
	"labelSub": {a:1,b:2},
	"if-0": true,
	"if-0-timer": true,
}, 'AriJS TestPrefix Store');

const storeMods = new DictionaryDynamic({
	"(adv) ( foo )": function(val, params) {
		return JSON.stringify({val, params});
	},
	"nr": function(val, {dlen, dsep, gsep, glen} = {dlen: 2}) {
		return numberFormat(val, dlen, dsep, gsep, glen);
	},
	"fn": queryStringify,
	"not": v => !v,
}, 'AriJS TestPrefix StoreMods');


var s1 = "{ (adv) ( foo ) {js=var%20re%20%3D%20%2F%7Bs*(%3F%3A(%5B%5Es%7B%7D%5D%2B)(%3F%3As*%7B(%5B%5E%7B%7D%5D*)%7D)%3Fs*%3A)%3Fs*(%5B%5Es%7B%7D%5D%2B)s*%7D%2Fig%3B&template=%7B%20nr%20%7Bdlen%3D2%26dsep%3D%2C%26gsep%3D.%26glen%3D3%7D%20%3A%20labelMain%20%7D} : ( bar ) (key) }";

var s2 = "{ nr {dlen=3&dsep=,&gsep=.&glen=3} : labelMain }";

var s3 = "{ fn : labelSub }";

var result = {
	s1: printf(s1, store, storeMods),
	s2: printf(s2, store, storeMods),
	s3: printf(s3, store, storeMods),
};

var expected = {
	s1: "{\"val\":\"value start - ( bar ) (key) - value end\",\"params\":{\"js\":\"var re = /{s*(?:([^s{}]+)(?:s*{([^{}]*)})?s*:)?s*([^s{}]+)s*}/ig;\",\"template\":\"{ nr {dlen=2&dsep=,&gsep=.&glen=3} : labelMain }\"}}",
	s2: "3.141.592,654",
	s3: "a=1&b=2"
};

console.log('Test as ES Module');
compare(result.s1, expected.s1, 's1');
compare(result.s2, expected.s2, 's2');
compare(result.s3, expected.s3, 's3');
