import forEach from '../utils/for-each.mjs';
import forEachProperty from '../utils/for-each-property.mjs';
// import inspectObj from '../utils/inspect.mjs';

function nop() {}

export default function initVueLoaders(comps, {
	onResolveDefined,
	onResolveFound,
	onResolveNotFound,
	Vue,
	compile,
	jsGlobal,
	jsContext,
	jsOnError,
	prefixMatcher,
}) {

forEach(comps, function(Comp, i) {
	jsGlobal[Comp.name] = comps[i] = Comp = prefixMatcher({
		map: {}, // the js file will save the component options here
		mapCss: {}, // this is used in the prerender to get all css files
		setCompHtml,
		jsContext,
		jsOnError,
		...Comp,
		onLoad: {
			js: function(_, {path}) {
				// here we get the saved js options to assemble the component
				return Comp.map[path];
			},
			css: function(data, match) {
				Comp.mapCss[match.path] = {
					opt: match,
					data: Comp.storeCssData ? data : null
				};
			},
			...Comp.onLoad
		}
	});
});

onResolveDefined =
	onResolveDefined instanceof Function
	? onResolveDefined : nop;
onResolveFound =
	onResolveFound instanceof Function
	? onResolveFound : nop;
onResolveNotFound =
	onResolveNotFound instanceof Function
	? onResolveNotFound : nop;

return {
	resolveUserCompLoader,
	resolveUserComponent,
	resolveAsyncComponent,
	getCompsCss,
	getCompsLoad,
	destroy,
};

async function setCompHtml(js, html) {
	if (compile instanceof Function) {
		html = compile(html, {prefixIdentifiers: true}).code;
		html = Function.call(null, 'Vue', html);
		js.render = html(Vue);
		js.render._rc = true;
			// Reason for this flag _rc :
			// https://github.com/vuejs/vue-next/pull/2910#issuecomment-752980088
			// https://jsfiddle.net/Linusborg/3tkae0jd/
	} else {
		js.template = html;
	}
	return js;
}

function resolveUserCompLoader(name) {
	return forEach(comps, function(comp) {
		const loader = comp.loader(name);
		if (loader) {
			this.result = loader;
			return this._break;
		}
	});
}

function resolveUserComponent(name) {
	var defined, loader, match;
	forEach(comps, function(comp) {
		defined = comp.mapCache[name];
		loader = comp.loader(name);
		if (loader) {
			match = comp;
			return this._break;
		}
	});
	if (defined) {
		// console.log('/** user component predefined **/', match.name, name);
		onResolveDefined(match, name);
		return loader;
	} else if (loader) {
		// console.log('/** user component found **/', match.name, name);
		onResolveFound(match, name);
		// console.log(' +  attempt to load', name);
		// var t = Date.now();
		// Promise.race([
		// 	loader(),
		// 	rejectTimeout(5000)
		// ]).then(function(comp) {
		// 	console.log(' +  comp loaded in '+(Date.now()-t), name, inspectObj(comp, 1));
		// }).catch(function() {
		// 	console.log(' +  comp load failed in '+(Date.now()-t), name);
		// });
		return loader;
	} else {
		// console.log('/** user component NOT found **/', name);
		onResolveNotFound(name);
	}
}

// function rejectTimeout(time) {
// 	return new Promise(function(resolve, reject) {
// 		setTimeout(reject, time || 0);
// 	});
// }

function resolveAsyncComponent(name) {
	var loader = resolveUserComponent(name);
	return loader instanceof Function
		? Vue.defineAsyncComponent({
			loader: function () {
				return loader().then(function(load) {
					return load.comp.data;
				});
			},
			name: 'loader--'+name,
		})
		: undefined;
}

function getCompsCss() {
	var list = [];
	forEach(comps, function(comp) {
		forEachProperty(comp.mapCss, function(item, k) {
			// if (!item) {
			// 	console.error(
			// 		'  <!> Empty mapCss val in '+JSON.stringify(comp.name)+
			// 		' key '+JSON.stringify(k)+
			// 		' origin '+JSON.stringify(jsGlobal.originRoute)
			// 	);
			// }
			item.comp = comp.name;
			list.push(item);
		});
	});
	return list;
}

function getCompsLoad() {
	var list = [];
	forEach(comps, function(comp) {
		forEachProperty(comp.mapCache, function(load) {
			load.comp = comp.name;
			list.push(load);
		});
	});
	return list;
}

function destroy() {
	forEach(comps, function(comp) {
		comp.map = undefined;
		comp.mapCss = undefined;
		comp.mapCache = undefined;
		comp.mapLoading = undefined;
		return this._remove;
	});
}

}
