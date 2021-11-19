
export function calcDigitMod11(digitos, posicoes, soma_digitos) {
	soma_digitos = soma_digitos || 0;
	digitos = String(digitos);
	if (null == posicoes || isNaN(posicoes) || !isFinite(posicoes) || !(posicoes >= 2)) {
		throw new Error(`Initial position must be a number >= 2, got ${typeof posicoes} ${String(posicoes).substr(0, 64)}`)
	}
	for (var i = 0; i < digitos.length; i++) {
		const digitAt = parseInt(digitos[i], 10);
		if (isNaN(digitAt)) {
			throw new Error(`calcDigitMod11: char at pos ${i} is not a number ${JSON.stringify(digitAt)}`)
		}
		soma_digitos += digitAt * posicoes;
		soma_digitos %= 11;
		posicoes--;
		if (posicoes < 2) {
			posicoes = 9;
		}
	}
	return soma_digitos;
}

export function finalizeMod11(soma_digitos) {
	if (soma_digitos < 2) {
		soma_digitos = 0;
	} else {
		soma_digitos = 11 - soma_digitos;
	}
	return soma_digitos;
}

function getInitialSum(lastValue, index) {
	return 0;
}

export function getDigitsMod11(digitos, qt, posicoes, soma_digitos, finalize = finalizeMod11, initialSum = getInitialSum) {
	let result = [];
	for (let i = 0; i < qt; i++) {
		soma_digitos = finalize(calcDigitMod11(digitos, posicoes + i, initialSum(soma_digitos, i)));
		result.push(soma_digitos);
		digitos += String(soma_digitos);
	}
	return result;
}

export function getDigitsCPFManual(valor) {
	valor = String(valor).replace(/[^0-9]/g, '');
	var digitos = valor.substr(0, 9);
	var dv1 = finalizeMod11(calcDigitMod11(digitos, 10));
	var dv2 = finalizeMod11(calcDigitMod11(digitos + dv1, 11));
	return `${dv1}${dv2}`;
}

export function getDigitsCPF(valor) {
	valor = String(valor).replace(/[^0-9]/g, '').substr(0, 9);
	return getDigitsMod11(valor, 2, 10).join('');
}

export function checkCPF(valor) {
	valor = String(valor).replace(/[^0-9]/g, '');
	var digitos = valor.substr(0, 9);
	var dv = getDigitsCPFManual(digitos);
	return (digitos + dv) === valor;
}

export function getDigitsCNPJManual(valor) {
	valor = String(valor).replace(/[^0-9]/g, '');
	var digitos = valor.substr(0, 12);
	var dv1 = finalizeMod11(calcDigitMod11(digitos, 5));
	var dv2 = finalizeMod11(calcDigitMod11(digitos + dv1, 6));
	return `${dv1}${dv2}`;
}

export function getDigitsCNPJ(valor) {
	valor = String(valor).replace(/[^0-9]/g, '').substr(0, 12);
	return getDigitsMod11(valor, 2, 5).join('');
}

export function checkCNPJ(valor) {
	valor = String(valor).replace(/[^0-9]/g, '');
	var digitos = valor.substr(0, 12);
	var dv = getDigitsCNPJManual(digitos);
	return (digitos + dv) === valor;
}
