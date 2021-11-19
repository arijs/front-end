
const reFilePath = /^.*\//
function downloadLink(href, fileName) {
	const link = document.createElement('a');
	// create a blobURI pointing to our Blob
	link.href = href;
	link.download = fileName || href.replace(reFilePath, '');
	// some browser needs the anchor to be in the doc
	document.body.append(link);
	link.click();
	link.remove();
	// in case the Blob uses a lot of memory
	setTimeout(function() {
		return URL.revokeObjectURL(link.href);
	}, 7000);
}

export default downloadLink
