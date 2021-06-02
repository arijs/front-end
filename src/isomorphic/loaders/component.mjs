import inspectObj from '../utils/inspect.mjs';

function echo(x) {
	return x;
}

function prepareObjLoad(src, name, opt) {
	var obj;
	switch (typeof src) {
		case 'string': obj = { url: src }; break;
		case 'object': obj = { ...src }; break;
	}
	return {
		name,
		...obj,
		loader: obj && obj.loader instanceof Function
			? obj.loader
			: opt.loaders && opt.loaders[name],
		onLoad: obj && obj.onLoad instanceof Function
			? obj.onLoad
			: opt.onLoad && opt.onLoad[name] || echo,
		done: false,
		error: null,
		data: null,
	};
}

async function callObjLoader(opt, obj, fname, order, itemLoad, arg) {
	// console.log(' +  comp load', obj.name || '!'+fname, 'for', opt.prefix, opt.path, !obj.name && obj);
	try {
		var data = await obj.loader(arg || obj);
		obj.error = null;
		obj.data = obj.onLoad(data, opt, obj);
		// console.log(' +  O done load', obj.name, 'for', opt.prefix, opt.path, inspectObj(data, 1, 32));
	} catch (error) {
		obj.error = error;
		// console.log(' +  X fail load', obj.name, 'for', opt.prefix, opt.path, error);
	}
	obj.done = true;
	order.push(obj);
	itemLoad();
}

let defaultSetCompHtml = (js, html) => {
	js.template = html;
	return js;
};

export function setDefaultSetCompHtml(sch) {
	defaultSetCompHtml = sch;
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
		js.name = load.opt.name;
		js = await setCompHtml(js, html, load);
		return js;
	}
}

export default function loadComponent(opt) {
	return new Promise(function(resolve, reject) {
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
		initComp(opt.comp);
		initAsset(opt.html, 'html');
		initAsset(opt.js  , 'js'  );
		initAsset(opt.css , 'css' );
		function initComp(comp) {
			load.comp = comp = prepareObjLoad(comp, comp && comp.name || 'comp', opt);
			comp.loader = comp.loader instanceof Function
				? comp.loader
				: compLoader;
		}
		function initAsset(src, name) {
			var obj = load[name] = prepareObjLoad(src, name, opt);
			if (src === opt.js) {
				obj.jsContext = obj.jsContext || opt.jsContext;
				obj.jsOnError = obj.jsOnError || opt.jsOnError;
				// console.log(' +  load comp js', obj);
			}
			callObjLoader(opt, obj, name, order, itemLoad);
		}
		function anyError() {
			var list = [];
			testErrorItem(load.html, list);
			testErrorItem(load.js  , list);
			testErrorItem(load.css , list);
			testErrorItem(load.comp, list);
			if (list.length) {
				load.error = new Error(
					'Component '+opt.name+': '+
					list.join(', ')
				);
			}
		}
		function testErrorItem(item, list) {
			if (item.error) {
				list.push(
					'('+item.name+': '+
					String(item.error.message || item.error)+')'
				);
			}
		}
		function itemLoad() {
			var html = load.html.done;
			var js   = load.js  .done;
			var css  = load.css .done;
			var comp = load.comp.done;
			// console.log(
			// 	' +  item load for', opt.prefix, opt.path,
			// 	html ? 'O' : 'X', 'html,',
			// 	js   ? 'O' : 'X', 'js,',
			// 	css  ? 'O' : 'X', 'css,',
			// 	comp ? 'O' : 'X', 'comp,',
			// 	done ? 'O' : 'X', 'final'
			// );
			if (done) {
				// done already called
			} else if (html && js && (css || false === opt.waitCss)) {
				if (comp) {
					anyError();
					done = true;
					if (load.error) {
						reject(load);
					} else {
						resolve(load);
					}
				} else {
					callObjLoader(opt, load.comp, 'comp', order, itemLoad, load);
				}
			}
		}
	});
}
