import forEach from '../utils/for-each.mjs';
import forEachProperty from '../utils/for-each-property.mjs';

function echo(x) {
	return x;
}

function prepareObjLoad(src, name, opt) {
	var obj;
	switch (typeof src) {
		case 'string': obj = { url: src }; break;
		case 'object': obj = { ...src }; break;
		default: obj = {};
	}
	return {
		name,
		...obj,
		loader: obj.loader instanceof Function
			? obj.loader
			: opt.loaders?.[name],
		onLoad: obj.onLoad instanceof Function
			? obj.onLoad
			: opt.onLoad?.[name] || echo,
		done: false,
		error: null,
		data: null,
	};
}

async function callObjLoader(opt, obj, arg) {
	try {
		var data = await obj.loader(arg || obj);
		obj.error = null;
		obj.data = obj.onLoad(data, opt, obj);
	} catch (error) {
		obj.error = error;
	}
}

async function compLoader(load) {
	var js = load.js.data;
	var html = load.html.data;
	var err = [];
	var setCompHtml = load.opt.setCompHtml || defaultSetCompHtml;
	if (!js) err.push('javascript');
	if (!html) err.push('html');
	if (err.length) {
		throw new Error(
			err.join(', ')+' not found'
		);
	} else {
		js.name = load.opt.id;
		setCompHtml(js, html, load);
		return js;
	}
}

export default function loadComponent(opt) {
	return new Promise(function(resolve, reject) {
		var {
			html,
			js,
			css,
			comp
		} = opt;
		var order = [];
		var load = {
			opt,
			order,
			html: null,
			js: null,
			css: null,
			comp: null,
			error: null,
		};
		var done = false;
		comp = load.comp = prepareObjLoad(comp, comp?.name || 'comp', opt);
		comp.loader = comp.loader instanceof Function
			? comp.loader
			: compLoader;
		forEachProperty({html, js, css}, function(src, name) {
			var obj = load[name] = prepareObjLoad(src, name, opt);
			callObjLoader(opt, obj).then(function() {
				obj.done = true;
				order.push(obj);
				itemLoad();
			});
		});
		function anyError() {
			var list = [];
			forEach([html, js, css, comp], function(item) {
				if (item.error) {
					list.push(
						'('+item.name+': '+
						String(item.error.message || item.error)+')'
					);
				}
			});
			if (list.length) {
				load.error = new Error(
					'Component '+opt.name+': '+opt.id+': '+
					list.join(', ')
				);
			}
		}
		function itemLoad() {
			if (done) {
				// done already called
			} else if (html.done && js.done && (css.done || false === opt.waitCss)) {
				if (comp.done) {
					anyError();
					done = true;
					if (load.error) {
						reject(load);
					} else {
						resolve(load);
					}
				} else {
					callObjLoader(opt, comp, load).then(function() {
						comp.done = true;
						order.push(comp);
						itemLoad();
					});
				}
			}
		}
	});
}
