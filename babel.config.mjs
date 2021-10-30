import path from "path";
import url from "url";
import dirFiles from "dir-files";

const dirSrc = url.fileURLToPath(new URL('./src', import.meta.url));

var dfp = dirFiles.plugins;
var pluginOpt = {};
var rePathSep = /[\\\/]+/g;
var dfResult;

dirFiles({
	result: {},
	path: dirSrc,
	plugins: [
		dfp.skip(function skipSpecial(file) {
			var name = file.name;
			// example of manual skipping
			var charZero = name.charAt(0);
			var skip = ('.' === charZero) ||
				('$' === charZero) ||
				('node_modules' === name);
			return skip;
		}),
		dfp.statSync(pluginOpt),
		dfp.queueDir(pluginOpt),
		dfp.readDirSync(pluginOpt),
		dfp.queueDirFiles(pluginOpt),
		dfp.skip(function skipEmptyNameOrDir(file) {
			return !file.name || file.stat.isDirectory();
		}),
		function printFile(file) {
			const d = file.dir;
			const ds = d.sub;
			const fb = path.basename(file.name, path.extname(file.name));
			const p = [].concat(
				ds ? ds.split(rePathSep) : [],
				[fb]
			);
			const pp = ['AriJS'].concat(p);
			const rp = [d.root].concat(p);
			const pps = pp.join('/');
			const rps = rp.join('/');
			this.result[pps] = this.result[rps] = pp.join('.');
			// console.log('~ '+pps);
		}
	],
	callback: function(err, result) {
		if (err) throw err;
		dfResult = result;
	}
});

// for debugging
// console.log('++ ', JSON.stringify(Object.entries(dfResult).slice(0, 5), null, 2));

const reExt = /\.mjs$/i;
const reModulePath = /^(?:\.\/)?(client|isomorphic|server)\//i;

export default {
	"presets": [
		[
			"@babel/preset-env",
			{
				"modules": false //"umd"
			}
		]
	],
	"plugins": [
		[
			"module-resolver",
			{
				resolvePath(sourcePath) {
					return sourcePath.replace(reExt, '');
				}
			}
		],
		[
			"@arijs/babel-plugin-transform-modules-umd",
			{
				"globals": dfResult,
				"exactGlobals": true,
				"importFileExt": ".js"
			}
		],
		[
			"@babel/plugin-proposal-class-properties"
		]
	],
	moduleIds: true,
	getModuleId(name) {
		const rel = path.relative(dirSrc, name);
		// console.log(` - rel    "${rel}"`);
		if (reModulePath.test(rel)) return `AriJS/${rel}`;
		console.log(` - other    "${name}"`);
	}
}
