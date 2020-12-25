
export default function loadScript({url, cb, timeout, cbLog}) {
	var script = document.createElement('script');
	var head = document.getElementsByTagName('head')[0];
	var done = false;
	script.addEventListener('load', function() {
		if (done) {
			if (cbLog) cbLog('load script too late', url);
			return;
		}
		done = true;
		cb();
	});
	script.addEventListener('error', function(err) {
		if (done) {
			if (cbLog) cbLog('error script too late', url, err);
			return;
		}
		done = true;
		cb(err);
	})
	if (timeout == null) timeout = 30000;
	if (timeout > 0) {
		setTimeout(function() {
			if (done) return;
			cb(new Error('load script timeout: '+url));
		}, timeout);
	}
	script.src = url;
	head.appendChild(script);
}
