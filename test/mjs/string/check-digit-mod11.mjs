
// more elegant but less efficient
import {
	string as stringModule,
//} from '../../../lib/server/index';
} from '@arijs/frontend/server/index';

const {
	checkDigitMod11: {
		fnFnDebugItem,
		getDigitsCPF,
		getDigitsCPFManual,
		getDigitsCNPJ,
		getDigitsCNPJManual,
	},
} = stringModule;

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
	// Alphanumeric CNPJ from serpro.gov.br doc: 12.ABC.345/01DE-35
	cnpjAlpha: getDigitsCNPJ('12ABC34501DE', debugItem(`getDigitsCNPJ alpha`)),
	cnpjAlphaManual: getDigitsCNPJManual('12ABC34501DE', debugItem(`getDigitsCNPJManual alpha`)),
};

var expected = {
	cpf: '66',
	cpfManual: '66',
	cnpj: '24',
	cnpjManual: '24',
	cnpjAlpha: '35',
	cnpjAlphaManual: '35',
};

console.log('String / Check Digit Mod11 - Test as ES Module');
compare(result.cpf, expected.cpf, 'cpf');
compare(result.cpfManual, expected.cpfManual, 'cpfManual');
compare(result.cnpj, expected.cnpj, 'cnpj');
compare(result.cnpjManual, expected.cnpjManual, 'cnpjManual');
compare(result.cnpjAlpha, expected.cnpjAlpha, 'cnpjAlpha');
compare(result.cnpjAlphaManual, expected.cnpjAlphaManual, 'cnpjAlphaManual');
