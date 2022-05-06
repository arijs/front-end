import { createReadStream, createWriteStream } from 'fs'
import { Transform } from 'stream'

const nop = () => {}

export class TransformObject extends Transform {
	process
	constructor(opts) {
		super({
			...opts,
			readableObjectMode: true,
			writableObjectMode: true,
		})
		this.process = opts.process
	}

	_transform(obj, _, callback) {
		Promise.resolve(this.process(obj, this.push.bind(this))).then(
			() => callback(),
			(err) => callback(err),
		)
	}
}

export class StringToLines extends Transform {
	strBuf
	numRows
	rowSeparator
	// colSeparator
	onChunkStart
	onChunkEnd
	constructor(opts) {
		super({ ...opts, readableObjectMode: true })
		this.strBuf = ''
		this.numRows = 0
		this.rowSeparator = opts?.rowSeparator ?? '\n'
		// this.colSeparator = opts.colSeparator ?? '\t'
		this.onChunkStart = opts?.onChunkStart ?? nop
		this.onChunkEnd = opts?.onChunkEnd ?? nop
	}

	_transform(chunk, _, callback) {
		try {
			const rsep = this.rowSeparator
			// const csep = this.colSeparator
			let c = this.strBuf + chunk
			let rowIndex = this.numRows
			this.onChunkStart(chunk, rowIndex)
			for(let nlIndex; nlIndex = c.indexOf(rsep), nlIndex != -1;) {
				const row = c.substr(0, nlIndex)
				this.push({row, rowIndex})
				rowIndex++
				c = c.substr(nlIndex + 1)
			}
			this.onChunkEnd(chunk, rowIndex)
			this.strBuf = c
			this.numRows = rowIndex
		} catch (e) {
			callback(e)
			return
		}
		callback()
	}
}

export function tryReadStreamEnd(rs) {
	return new Promise((resolve, reject) => {
		// https://github.com/nodejs/node/issues/40116
		rs.pause()
		rs.on('end', resolve)
		rs.on('error', reject)
		rs.resume()
	})
}

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

export function tryCloseStream(ws) {
	return new Promise((resolve, reject) => {
		ws.on('close', resolve)
		ws.on('error', reject)
	})
}
