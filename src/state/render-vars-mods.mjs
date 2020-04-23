
export function cbErrorDefault(e) {
	return console.warn(e);
}

export default function fnRenderVarsMods(vars, mods, cbError = cbErrorDefault, name = 'renderVarsMods') {
	return renderVarsMods;
	function renderVarsMods(valKey, modKey, params, onUpdate) {
		var val, mod, valOld, modOld;
		if (vars.has(valKey)) {
			val = vars.get(valKey, function(valNew) {
				valOld = val;
				val = valNew;
				onUpdate(withValueMod(), withOld());
			}, cbError);
		} else {
			cbError(new Error(
				name+': value with key '+
				JSON.stringify(valKey)+' not found'
			));
		}
		if (modKey) {
			if (mods.has(modKey)) {
				mod = mods.get(modKey, function(modNew) {
					modOld = mod;
					mod = modNew;
					onUpdate(withValueMod(), withOld());
				}, cbError);
			} else {
				cbError(new Error(
					name+': printf mod with key '+
					JSON.stringify(modKey)+' not found'
				));
			}
		}
		return withValueMod();
		function withValueMod() {
			return mod ? mod(val, params, vars, mods, valKey) : val;
		}
		function withOld() {
			return modOld ? modOld(valOld, params, vars, mods, valKey) : valOld;
		}
	}
}
