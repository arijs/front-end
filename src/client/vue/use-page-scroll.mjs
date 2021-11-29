
export default function usePageScroll (Vue, refRoot) {
	function updateScrollPos() {
		var root = refRoot?.value;
		state.scrollX = window.scrollX + (root ? root.scrollLeft : 0);
		state.scrollY = window.scrollY + (root ? root.scrollTop : 0);
	}
	function evScrollOn(el) {
		return el.addEventListener('scroll', updateScrollPos, false);
	}
	function evScrollOff(el) {
		return el.removeEventListener('scroll', updateScrollPos, false);
	}
	function evScrollRootOn() {
		var root = refRoot?.value;
		if (root) {
			evScrollOn(root);
			state.mounted = root;
		}
	}
	function evScrollRootOff() {
		var root = state.mounted;
		if (root) {
			evScrollOff(root);
			state.mounted = null;
		}
	}
	function listenStart() {
		evScrollOn(window);
		evScrollRootOn();
		state.active = true;
	}
	function listenStop() {
		evScrollOff(window);
		evScrollRootOff();
		state.active = false;
	}
	function useMounted() {
		Vue.onMounted(listenStart);
		Vue.onUnmounted(listenStop);
	}
	var state = Vue.reactive({
		mounted: null,
		active: false,
		scrollX: 0,
		scrollY: 0,
		listenStart,
		listenStop,
		useMounted,
	});
	updateScrollPos();
	Vue.watchEffect(function() {
		var root = refRoot?.value;
		var mted = state.mounted;
		if (!state.active) {
			evScrollRootOff();
		} else if (root != mted) {
			evScrollRootOff();
			evScrollRootOn();
			updateScrollPos();
		}
	});
	return Vue.computed(function() {
		return state;
	});
};
