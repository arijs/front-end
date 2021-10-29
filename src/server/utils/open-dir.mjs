import fs from 'fs';
import path from 'path';

export function testaDir(dir, cb) {
	fs.stat(dir, function(err, stat) {
		if (err) {
			if ( 'ENOENT' === err.code ) {
				return cb(null, false);
			} else {
				return cb(err);
			}
		} else if (stat.isDirectory()) {
			return cb(null, true);
		} else {
			err = new Error('path exists but is not a directory: '+dir);
			err.code = err.errno = 'ENOTDIR';
			return cb(err);
		}
	});
}

export function testaDirPromise(dir) {
	return new Promise((resolve, reject) => {
		testaDir(dir, (error, found) => error ? reject({error, found}) : resolve(found))
	})
}

export function openDir(dir, cb) {
	testaDir(dir, function(err, exists) {
		if (err) {
			return cb(err);
		} else if (exists) {
			return cb();
		} else {
			fs.mkdir(dir, function(err) {
				if (err) {
					if ( 'EEXIST' === err.code ) {
						// but I just checked...
						return openDir(dir, cb);
					} else {
						return cb(err);
					}
				} else {
					return cb();
				}
			});
		}
	});
}

export function openDirPromise(dir) {
	return new Promise((resolve, reject) => {
		openDir(dir, (err) => err ? reject(err) : resolve())
	})
}

export function openDirSub(base, sub, cb) {
	return openDir(path.join(base, sub), cb);
}

export function openDirSubPromise(base, sub) {
	return new Promise((resolve, reject) => {
		openDirSub(base, sub, (err) => err ? reject(err) : resolve())
	})
}

export function openDirArray(base, arr, cb) {
	if ( arr.length ) {
		var dir = arr.shift();
		base = base
			? path.join(base, dir)
			: dir;
		return openDir(base, function(err) {
			if (err) {
				return cb(err);
			} else {
				openDirArray(base, arr, cb);
			}
		});
	} else {
		return cb();
	}
}

export function openDirArrayPromise(base, arr) {
	return new Promise((resolve, reject) => {
		openDirArray(base, arr, (err) => err ? reject(err) : resolve())
	})
}

export function testaFile(file, cb) {
	fs.open(file, 'r', function(err, fd) {
		if (err) {
			if ( 'ENOENT' === err.code ) {
				return cb(null, false);
			} else {
				return cb(err);
			}
		} else {
			fs.close(fd, function(err) {
				if (err) {
					return cb(err);
				} else {
					return cb(null, true);
				}
			});
		}
	});
}

export function testaFilePromise(file) {
	return new Promise((resolve, reject) => {
		testaFile(file, (error, found) => error ? reject({error, found}) : resolve(found))
	})
}

openDir.sub = openDirSub;
openDir.array = openDirArray;
openDir.test = testaDir;
openDir.testFile = testaFile;

openDir.promise = openDirPromise;
openDir.promise.sub = openDirSubPromise;
openDir.promise.array = openDirArrayPromise;
openDir.promise.test = testaDirPromise;
openDir.promise.testFile = testaFilePromise;

export default openDir;
