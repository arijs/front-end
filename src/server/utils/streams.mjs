import { createReadStream, createWriteStream } from 'fs'

export function tryOpenReadPromise(path, rsOpt) {
	return new Promise((resolve, reject) => {
		const stream = createReadStream(path, rsOpt)
		stream.on('open', () => resolve(stream))
		stream.on('error', error => reject({stream, path, error}))
	})
}

export function tryOpenWritePromise(path, wsOpt) {
	return new Promise((resolve, reject) => {
		const stream = createWriteStream(path, wsOpt)
		stream.on('open', () => resolve(stream))
		stream.on('error', error => reject({stream, path, error}))
	})
}

export function tryOpenWritePromiseAll(pathList, wsOpt) {
	return Promise.all(pathList.map(path => tryOpenWritePromise(path, wsOpt)))
}

export function tryCopyPromise(rs, ws) {
	return new Promise((resolve, reject) => {
		ws.on('finish', resolve)
		ws.on('error', reject)
		rs.pipe(ws)
	})
}

export function tryCopyPromiseAll(rs, wsList) {
	return Promise.all(wsList.map(ws => tryCopyPromise(rs, ws)))
}

export function tryWriteStreamEnd(ws, data) {
	return new Promise((resolve, reject) => {
		ws.on('finish', resolve)
		ws.on('error', reject)
		ws.end(data)
	})
}
