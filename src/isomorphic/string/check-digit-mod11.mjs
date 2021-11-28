
const noop = () => {};
const echo = x => x;

export const mod11Methods = {
	init(state) {
		state.sum = state.sum || 0;
		state.charCount = state.charCount || 0;
		const {factor} = state;
		if (null == factor || isNaN(factor) || !isFinite(factor) || !(factor >= 2)) {
			throw new Error(`Initial factor must be a number >= 2, got ${typeof factor} ${String(factor).substr(0, 64)}`);
		}
	},
	calcChar(state, char, index, text) {
		char = parseInt(char, 10);
		if (isNaN(char)) {
			throw new Error(`Mod11: char at pos ${index} is not a number ${JSON.stringify(char)} ${JSON.stringify(text)}`);
		}
		let {factor, sum} = state;
		state.factorLast = factor;
		state.sumLast = sum;
		state.charLast = char;
		state.charCount += 1;
		sum += char * factor;
		sum %= 11;
		state.sum = sum;
		state.sumFin = (sum < 2) ? 0 : 11 - sum;
		state.factor = factor < 3 ? 9 : factor - 1;
	},
	finalize: state => state.sumFin,
};

export function calcDigitSum(state, {init, calcChar, finalize} = mod11Methods) {
	init(state);
	const { fnDebugItem } = state;
	const debugItem = fnDebugItem instanceof Function
		? fnDebugItem(state)
		: noop;
	const api = {
		state,
		addChar,
		addText,
		finalize: () => finalize(state),
	};
	return api;
	function addChar(char, index, text) {
		calcChar(state, char, index, text);
		debugItem(state, char, index, text);
		return api;
	}
	function addText(text) {
		const len = text.length;
		for (var i = 0; i < len; i++) addChar(text[i], i, text)
		return api;
	}
}

export function listCreateFactorCount(count, factor) {
	const list = [];
	for (let i = 0; i < count; i++) {
		list.push({ factor: factor + i, digitIndex: i });
	}
	return list;
}

export function listFinalizeSumPreviousDigits(cdList) {
	const finList = [];
	for (const cd of cdList) {
		cd.addText(finList);
		const sumFin = cd.finalize();
		finList.push(sumFin);
	}
	return finList;
}

export function calcDigitList(
	calcMethods = mod11Methods,
	listCreate = listCreateFactorCount,
	listFinalize = listFinalizeSumPreviousDigits,
	listInitState = echo,
) {
	let cdList;
	const api = {
		cdList,
		init,
		each,
		addChar,
		addText,
		finalize,
	};
	return api;
	function init() {
		const lis = listInitState instanceof Function ? listInitState : echo;
		cdList = listCreate.apply(this, arguments).map(lis).map(state => calcDigitSum(state, calcMethods));
		return api;
	}
	function each(h) {
		const count = cdList.length;
		for (let i = 0; i < count; i++) h(cdList[i], i, cdList);
		return api;
	}
	function addChar(char, index, text) {
		for (const cd of cdList) cd.addChar(char, index, text);
		return api;
	}
	function addText(text) {
		for (const cd of cdList) cd.addText(text);
		return api;
	}
	function finalize() {
		return listFinalize(cdList);
	}
}

export const fnCalcDigitMod11Lis = lis => calcDigitList(mod11Methods, listCreateFactorCount, listFinalizeSumPreviousDigits, lis);

export const calcDigitCPF = d => fnCalcDigitMod11Lis(s => (s.fnDebugItem = d, s)).init(2, 10);

export const calcDigitCNPJ = d => fnCalcDigitMod11Lis(s => (s.fnDebugItem = d, s)).init(2, 5);

export function fnFnDebugItem(name) {
	return ({factor, sum, digitIndex}) => {
		console.log(name, factor, sum, null == digitIndex ? `` : `d${digitIndex}`);
		return ({charLast, charCount, factor, sum, sumFin, digitIndex}) =>
			console.log(`    `, charLast, factor, sum, sumFin, `${null == digitIndex ? `` : `d${digitIndex}.`}${charCount}`);
			// [digitAt, posicoes, soma, finalize(soma), index]
	};
}

export function getDigitsCPFManual(valor) {
	valor = String(valor).replace(/[^0-9]/g, '');
	var digitos = valor.substr(0, 9);
	const fnDebugItem = undefined; // fnFnDebugItem(`getDigitsCPFManual debugItem`); // 
	var dv1 = calcDigitSum({factor: 10, digitIndex: 0, fnDebugItem}).addText(digitos).finalize();
	var dv2 = calcDigitSum({factor: 11, digitIndex: 1, fnDebugItem}).addText(digitos + dv1).finalize();
	return `${dv1}${dv2}`;
}

export function getDigitsCPF(digits) {
	digits = String(digits).replace(/[^0-9]/g, '').substr(0, 9);
	const fnDebugItem = undefined; // fnFnDebugItem(`getDigitsCPF debugItem`); // 
	return calcDigitCPF(fnDebugItem).addText(digits).finalize().join('');
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
	const fnDebugItem = undefined; // fnFnDebugItem(`getDigitsCNPJManual debugItem`); // 
	var dv1 = calcDigitSum({factor: 5, digitIndex: 0, fnDebugItem}).addText(digitos).finalize();
	var dv2 = calcDigitSum({factor: 6, digitIndex: 1, fnDebugItem}).addText(digitos + dv1).finalize();
	return `${dv1}${dv2}`;
}

export function getDigitsCNPJ(digits) {
	digits = String(digits).replace(/[^0-9]/g, '').substr(0, 12);
	const fnDebugItem = undefined; // fnFnDebugItem(`getDigitsCNPJ debugItem`); // 
	return calcDigitCNPJ(fnDebugItem).addText(digits).finalize().join('');
}

export function checkCNPJ(valor) {
	valor = String(valor).replace(/[^0-9]/g, '');
	var digitos = valor.substr(0, 12);
	var dv = getDigitsCNPJManual(digitos);
	return (digitos + dv) === valor;
}
