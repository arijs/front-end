
var reDash = /--/g;

function testNamePrefix(name, prefix) {
	var plen = prefix.length;
	if (name.substr(0, plen) === prefix) {
		prefix = prefix.replace(reDash,'/');
		var path = name.substr(plen).replace(reDash,'/');
		return { name, prefix, path };
	}
}
function compPathBase(param, match) {
	return param instanceof Function ? param(match) : match.href;
}
function compPathResource(param, url, extension, match) {
	return param === false ? null :
		param instanceof Function ? param(url, extension, match) :
		url + extension;
}

function compRelPathResource(relPath, path, lastName, ext) {
	relPath = 'string' === typeof relPath ? relPath : '';
	return relPath + path + '/' + lastName + ext;
}

// function defaultSetCompHtml(js, html) {
// 	js.template = html;
// }

function getPrefixPaths(optPrefix, match) {
	var { path } = match;
	var {
		basePath = '',
		extHtml = '.html',
		extJs = '.js',
		extCss = '.css',
		inputHtml,
		inputJs,
		inputCss,
		relPath,
	} = optPrefix;
	var lastIndex = path.lastIndexOf('/');
	var lastName = path.substr(lastIndex+1);
	var href = basePath+path+'/'+lastName;
	match = {
		...optPrefix,
		...match,
		path,
		lastName,
		href,
	};
	var url = compPathBase(optPrefix.getUrl, match);
	var html = compPathResource(inputHtml, url, extHtml, match);
	var js   = compPathResource(inputJs  , url, extJs  , match);
	var css  = compPathResource(inputCss , url, extCss , match);
	var htmlRel = compRelPathResource(relPath, path, lastName, extHtml);
	var jsRel   = compRelPathResource(relPath, path, lastName, extJs);
	var cssRel  = compRelPathResource(relPath, path, lastName, extCss);
	return {
		...match,
		url,
		html,
		js,
		css,
		htmlRel,
		jsRel,
		cssRel,
	};
}

function prefixLoader(match) {
	var {
		path,
		mapCache,
		mapLoading,
	} = match;
	var isCached = mapCache[path];
	if (isCached) return Promise.resolve(isCached);
	var isLoading = mapLoading[path];
	if (isLoading) return isLoading;
	// var def = deferredPromise(match);
	var promise = new Promise(function(resolve, reject) {
		var {onLoad, onLoadError} = match;
		match.onLoad = function(load) {
			mapLoading[path] = undefined;
			if (load.error) {
				if (onLoadError instanceof Function) {
					onLoadError(match, load);
				}
				reject(load.error);//def.
				// console.log('/** prefix comp reject **/', load.error);
			} else {
				var loadMod;
				if (onLoad instanceof Function) {
					loadMod = onLoad(match, load);
				}
				mapCache[path] = load = loadMod || load;//def.
				resolve(load);//def.
			}
		};
		match.loadComponent(match);
		// return def.promise;
	});
	return mapLoading[path] = promise;//def.
}

export default function prefixMatcher(optPrefix) {
	optPrefix.loader = prefixMatchName;
	optPrefix.testName = testMatchName;
	optPrefix.mapCache = optPrefix.mapCache || {};
	optPrefix.mapLoading = optPrefix.mapLoading || {};
	return optPrefix;
	function testMatchName(name) {
		return testNamePrefix(name, optPrefix.prefix);
	}
	function prefixMatchName(name) {
		var match = testNamePrefix(name, optPrefix.prefix);
		if (match) {
			var { onMatch } = optPrefix;
			match = getPrefixPaths(optPrefix, match);
			if (onMatch instanceof Function) onMatch(name, match);
			return function() {
				var { onMatchLoad } = optPrefix;
				if (onMatchLoad instanceof Function) onMatchLoad(name, match);
				return prefixLoader(match);
			};
		}
	}
}
