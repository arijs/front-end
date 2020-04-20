
export default function fnRenderVarsMods(vars, mods, cbError, name = 'renderVarsMods') {
	return renderVarsMods;
	function renderVarsMods(valKey, modKey, params, onUpdate) {
		var val, mod, valOld, modOld;
		if (!vars.has(valKey)) cbError(new Error(
			name+': value with key '+
			JSON.stringify(valKey)+' not found'
		));
		val = vars.get(valKey, function(valNew) {
			valOld = val;
			val = valNew;
			onUpdate(withValueMod(), withOld());
		});
		if (modKey) {
			if (!mods.has(modKey)) cbError(new Error(
				name+': printf mod with key '+
				JSON.stringify(modKey)+' not found'
			));
			mod = mods.get(modKey, function(modNew) {
				modOld = mod;
				mod = modNew;
				onUpdate(withValueMod(), withOld());
			});
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
