
const noop = () => {}

export const mod11Methods = {
	init(state) {
		state.sum = state.sum || 0;
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
		sum += char * factor;
		sum %= 11;
		state.sum = sum;
		state.sumFin = (sum < 2) ? 0 : 11 - sum;
		state.factor = factor < 3 ? 9 : factor - 1;
	},
	finalize: state => state.sumFin,
}

export function calcDigitSum(state, {init, calcChar, finalize} = mod11Methods) {
	init(state);
	const { fnDebugItem } = state;
	const debugItem = fnDebugItem instanceof Function
		? fnDebugItem(state)
		: noop;
	const api = {
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

export function calcDigitList(list, calcMethods = mod11Methods) {
	let cdList = [];
	for (const state of list) cdList.push(calcDigitSum(state, calcMethods));
	const api = {
		each,
		setDebug,
		addChar,
		addText,
		finalize,
	};
	return api;
	function each(h) {
		const count = list.length;
		for (let i = 0; i < count; i++) h(list[i], i, list);
		return api;
	}
	function setDebug(d) {
		each(item => item.fnDebugItem = d);
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
		const finList = [];
		for (const cd of cdList) {
			cd.addText(finList);
			const sumFin = cd.finalize();
			finList.push(sumFin);
		}
		return finList;
	}
}

export function initFactorCountList(factor, count) {
	const list = [];
	for (let i = 0; i < count; i++) {
		list.push({ factor, digitIndex: i });
		factor++;
	}
	return list;
}

export function fnInitCalcDigitList(calcMethods = mod11Methods, initList = initFactorCountList) {
	return function initCalcDigitList() {
		const list = initList.apply(this, arguments);
		return calcDigitList(list, calcMethods);
	}
}

export const initCalcDigitMod11 = fnInitCalcDigitList(mod11Methods, initFactorCountList);

export const calcDigitCPF = () => initCalcDigitMod11(10, 2);

export const calcDigitCNPJ = () => initCalcDigitMod11(5, 2);

export function fnFnDebugItem(name) {
	return ({digits, factor, sum}) => {
		console.log(name, digits, factor, sum);
		return ({char, factor, sum, sumFin}, i) => console.log(`    `, char, factor, sum, sumFin, i);
	};
}

export function getDigitsCPFManual(valor) {
	valor = String(valor).replace(/[^0-9]/g, '');
	var digitos = valor.substr(0, 9);
	const fnDebugItem = undefined;// fnFnDebugItem(`getDigitsCPFManual debugItem`);
	var dv1 = calcDigitSum({factor: 10, fnDebugItem}).addText(digitos).finalize();
	var dv2 = calcDigitSum({factor: 11, fnDebugItem}).addText(digitos + dv1).finalize();
	return `${dv1}${dv2}`;
}

export function getDigitsCPF(digits) {
	digits = String(digits).replace(/[^0-9]/g, '').substr(0, 9);
	const fnDebugItem = undefined;// fnFnDebugItem(`getDigitsCPF debugItem`);
	return calcDigitCPF().setDebug(fnDebugItem).addText(digits).finalize().join('');
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
	const fnDebugItem = undefined;// fnFnDebugItem(`getDigitsCNPJManual debugItem`);
	var dv1 = calcDigitSum({factor: 5, fnDebugItem}).addText(digitos).finalize();
	var dv2 = calcDigitSum({factor: 6, fnDebugItem}).addText(digitos + dv1).finalize();
	return `${dv1}${dv2}`;
}

export function getDigitsCNPJ(digits) {
	digits = String(digits).replace(/[^0-9]/g, '').substr(0, 12);
	const fnDebugItem = undefined;// fnFnDebugItem(`getDigitsCNPJ debugItem`);
	return calcDigitCNPJ().setDebug(fnDebugItem).addText(digits).finalize().join('');
}

export function checkCNPJ(valor) {
	valor = String(valor).replace(/[^0-9]/g, '');
	var digitos = valor.substr(0, 12);
	var dv = getDigitsCNPJManual(digitos);
	return (digitos + dv) === valor;
}
