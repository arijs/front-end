
export default function forEachProperty(obj, cb) {
	var _break = 1 << 0;
	var i = 0;
	var ctx = {
		_break: _break
	};
	var ret;
	for ( var k in obj ) {
		if ( !hop.call(obj, k) ) continue;
		ret = cb.call(ctx, obj[k], k, i);
		if (_break & ret) {
			break;
		}
		i++;
	}
};
