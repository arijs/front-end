
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
	// console.log(' +  call loadComp prefix for', match.prefix, match.path);
	var promise = match.loadComponent(match).then(function(load) {
		// console.log(' +  resolve loadComp prefix', match.prefix, match.path);
		var {onLoadComponent} = match;
		var loadMod;
		if (onLoadComponent instanceof Function) {
			loadMod = onLoadComponent(match, load);
		}
		return mapCache[path] = loadMod || load;
	}).catch(function(load) {
		// console.log(' +  reject loadComp prefix', match.prefix, match.path, load);
		var {onLoadError} = match;
		if (onLoadError instanceof Function) {
			onLoadError(match, load);
		}
		throw load;
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
