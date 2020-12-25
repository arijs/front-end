
export default function loadStylesheet(url, cb, timeout, cbLog) {
	var link = document.createElement('link');
	var head = document.getElementsByTagName('head')[0];
	var done = false;
	link.setAttribute('rel', 'stylesheet');
	link.addEventListener('load', function() {
		if (done) {
			if (cbLog) cbLog('load stylesheet too late', url);
			return;
		}
		done = true;
		cb();
	});
	link.addEventListener('error', function(err) {
		if (done) {
			if (cbLog) cbLog('error stylesheet too late', url, err);
			return;
		}
		done = true;
		cb(err);
	});
	if (timeout == null) timeout = 30000;
	if (timeout > 0) {
		setTimeout(function() {
			if (done) return;
			cb(new Error('load stylesheet timeout: '+url));
		}, timeout);
	}
	link.href = url;
	head.appendChild(link);
}
