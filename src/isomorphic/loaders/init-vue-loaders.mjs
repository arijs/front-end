import forEach from '../utils/for-each.mjs';

function nop() {}

export default function initVueLoaders(comps, {
	onResolveDefined,
	onResolveFound,
	onResolveNotFound,
	Vue,
	compile,
	jsGlobal,
	prefixMatcher,
}) {

forEach(comps, function(Comp, i) {
	if (!jsGlobal) {
		console.log('iso:initVueLoaders', compOpt);
	}
	jsGlobal[Comp.name] = comps[i] = Comp = prefixMatcher({
		map: {}, // the js file will save the component options here
		mapCss: {}, // this is used in the prerender to get all css files
		setCompHtml,
		...Comp,
		onLoad: {
			js: function(_, {path}) {
				// here we get the saved js options to assemble the component
				return Comp.map[path];
			},
			css: function(data, match) {
				Comp.mapCss[match.path] = {
					match,
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
};

function setCompHtml(js, html) {
	if (compile instanceof Function) {
		html = compile(html).code;
		html = Function.call(null, 'Vue', html);
		js.render = html(Vue);
	} else {
		js.template = html;
	}
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
		return loader;
	} else {
		// console.log('/** user component NOT found **/', name);
		onResolveNotFound(name);
	}
}

function resolveAsyncComponent(name) {
	var loader = resolveUserComponent(name);
	return loader instanceof Function
		? Vue.defineAsyncComponent({
			loader,
			name: 'loader--'+name,
		})
		: undefined;
}

function getCompsCss() {
	var list = [];
	forEach(comps, function(comp) {
		forEachProperty(comp.mapCss, function(item, k) {
			if (!item) {
				console.error(
					'  <!> Empty mapCss val in '+JSON.stringify(comp.name)+
					' key '+JSON.stringify(k)+
					' origin '+JSON.stringify(jsGlobal.originRoute)
				);
			}
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

}
