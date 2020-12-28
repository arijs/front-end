
// more efficient but uglier
// var {printfParse, printfFill} = require('../../../lib/isomorphic/printf/index');
// var {default: Dynamic} = require('../../../lib/isomorphic/state/dictionary-dynamic');
// var {queryStringify} = require('../../../lib/isomorphic/utils/query-string');
// var {numberFormat} = require('../../../lib/isomorphic/utils/number-string');

// alternative
// var {printfParse, printfFill} = require('@arijs/frontend/isomorphic/printf/index');
// var {default: Dynamic} = require('@arijs/frontend/isomorphic/state/dictionary-dynamic');
// var {queryStringify} = require('@arijs/frontend/isomorphic/utils/query-string');
// var {numberFormat} = require('@arijs/frontend/isomorphic/utils/number-string');

// more elegant but less efficient
var {
	printf: {printfParse, printfFill},
	state: {DictionaryDynamic: Dynamic},
	utils: {
		numberString: {numberFormat},
		queryString: {queryStringify},
	},
// } = require('../../../lib/isomorphic/index');
} = require('@arijs/frontend/isomorphic/index');

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

const store = new Dynamic({
	"( bar ) (key)": "value start - ( bar ) (key) - value end",
	"labelMain": Math.PI * 1e6,
	"labelSub": {a:1,b:2},
	"if-0": true,
	"if-0-timer": true,
}, 'AriJS TestPrefix Store');

const storeMods = new Dynamic({
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

console.log('Test as Common JS');
compare(result.s1, expected.s1, 's1');
compare(result.s2, expected.s2, 's2');
compare(result.s3, expected.s3, 's3');
