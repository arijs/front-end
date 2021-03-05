import url from 'url';
import fs from 'fs';
import dirFiles from 'dir-files';

function relPath(rel) {
	return url.fileURLToPath(new URL(rel, import.meta.url).href);
}

const reExt = /\.mjs$/i;
const reSlash = /[\\\/]+/g;
const reHyphenLetter = /-\w/g;
const globalMap = {};

// const srcPath = url.fileURLToPath(new URL('../src/', import.meta.url).href);

var dfp = dirFiles.plugins;
var pluginOpt = {};

dirFiles({
	path: relPath('../src/client'),
	plugins: [
		dfp.skip(function skipSpecial(file) {
			var name = file.name;
			// example of manual skipping
			var charZero = name.charAt(0);
			var skip = ('.' === charZero) ||
				('$' === charZero) ||
				('node_modules' === name)
			return skip;
		}),
		// statSyncPlugin(),
		dfp.statSync(),
		dfp.queueDir(pluginOpt),
		// readDirSyncPlugin(),
		dfp.readDirSync(),
		dfp.queueDirFiles(pluginOpt),
		dfp.skip(function skipEmptyNameOrDir(file) {
			return !file.name || file.stat.isDirectory() || !reExt.test(file.name);
		}),
		function printFile(file) {
			// console.log('~ ', file.dir.sub, file.name);
			var fileId = idList(file);
			switch (fileId[0]) {
				case 'client': fileId[0] = 'AriJS'; break;
				case 'isomorphic': fileId[0] = 'AriJSIso'; break;
				case 'server': fileId[0] = 'AriJSServer'; break;
				case '':
					fileId[0] = 'AriJSEnvs';
					if (2 === fileId.length && fileId[1] === 'index') fileId.splice(1, 1);
					break;
				default: throw new Error('Unknown environment '+JSON.stringify(fileId[0]));
			}
			globalMap[file.fullpath] = fileId.join('.');
		}
	],
	callback: function(err) {
		if (err) throw err;
		// console.log('  - dirFiles callback called', globalMap);
	}
});
