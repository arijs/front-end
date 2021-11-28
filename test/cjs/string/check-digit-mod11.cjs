
// more elegant but less efficient
const {
	string: {
		checkDigitMod11: {
			fnFnDebugItem,
			getDigitsCPF,
			getDigitsCPFManual,
			getDigitsCNPJ,
			getDigitsCNPJManual,
		},
	},
} = require('@arijs/frontend/server/index');;

function compare(result, expected, name) {
	if (result === expected) {
		console.log(`Test ${name} - ok!`);
	} else {
		console.log(`Test ${name} - Error:`);
		console.log(`Result  : ${result}`);
		console.log(`Expected: ${expected}`);
	}
}

const debugItem = name => undefined; // fnFnDebugItem(name);

var result = {
	cpf: getDigitsCPF('350446208', debugItem(`getDigitsCPF debugItem`)),
	cpfManual: getDigitsCPFManual('350446208', debugItem(`getDigitsCPFManual debugItem`)),
	cnpj: getDigitsCNPJ('031722230001', debugItem(`getDigitsCNPJ debugItem`)),
	cnpjManual: getDigitsCNPJManual('031722230001', debugItem(`getDigitsCNPJManual debugItem`)),
};

var expected = {
	cpf: '66',
	cpfManual: '66',
	cnpj: '24',
	cnpjManual: '24',
};

console.log('String / Check Digit Mod11 - Test as Common JS');
compare(result.cpf, expected.cpf, 'cpf');
compare(result.cpfManual, expected.cpfManual, 'cpfManual');
compare(result.cnpj, expected.cnpj, 'cnpj');
compare(result.cnpjManual, expected.cnpjManual, 'cnpjManual');
