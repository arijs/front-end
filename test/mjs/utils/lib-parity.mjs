
// Assertion test: pins bytesSize / printTime / cutTimeDaysArray to the
// known-good behavior of the (tested) transfer-speed project (core/lib.js).
// transfer-speed's bytesSize == bytesSize(b, { extraDecimals: 1 }).
import assert from 'node:assert/strict';
import {
	utils,
	date,
//} from '../../../lib/server/index';
} from '@arijs/frontend/server/index';

const { bytesSize } = utils;
const { printTime, cutTimeDaysArray } = date;

const BYTES = [0, 500, 1024, 2048, 1536, 1048576, 5242880, 1073741824, 1099511627776];
const TIMES = [0, 999, 1000, 1001, 60000, 3661001, 86400000, 123456789];

const EXPECTED = {"bytesDefault":[["0","B"],["500","B"],["1","kB"],["2","kB"],["2","kB"],["1.0","MB"],["5.0","MB"],["1.00","GB"],["1.000","TB"]],"bytesExtra1":[["0","B"],["500","B"],["1.0","kB"],["2.0","kB"],["1.5","kB"],["1.00","MB"],["5.00","MB"],["1.000","GB"],["1.0000","TB"]],"printTime":["0:00.000","0:00.999","0:01.000","0:01.001","1:00.000","01:01:01.001","1, 0:00.000","1, 10:17:36.789"],"cutTimeDaysArray":[[0,0,0,0,0],[0,0,0,0,999],[0,0,0,1,0],[0,0,0,1,1],[0,0,1,0,0],[0,1,1,1,1],[1,0,0,0,0],[1,10,17,36,789]]};

const actual = {
	bytesDefault: BYTES.map((b) => bytesSize(b)),
	bytesExtra1: BYTES.map((b) => bytesSize(b, { extraDecimals: 1 })),
	printTime: TIMES.map((n) => printTime(n)),
	cutTimeDaysArray: TIMES.map((n) => cutTimeDaysArray(n)),
};

for (const key of Object.keys(EXPECTED)) {
	assert.deepStrictEqual(actual[key], EXPECTED[key], `lib-util parity mismatch: ${key}`);
}

console.log('lib-util parity: OK (4 checks)');
