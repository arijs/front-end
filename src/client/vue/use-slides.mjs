import useDrag from "./use-drag.mjs";
import throttle from "../../isomorphic/utils/throttle.mjs";

export default function useSlides(Vue, opt) {
	var carFrame = Vue.ref(null);
	var carList = Vue.ref([]);
	var carPageWidth = Vue.ref(null);
	var carListCopy = Vue.markRaw([]);
	Vue.onBeforeUpdate(function() {
		carList.value = [];
	});
	var drag = useDrag(opt.name, opt.apiDrag);
	var dragResize = throttle(function() {
		drag.fnResize(
			carFrame.value,
			carList.value,
			carPageWidth.value
		);
	}, 500);
	var dragAuto;
	var dragUpdateElements = function() {
		drag.fnResize(
			carFrame.value,
			// carList.value,
			carListCopy,
			carPageWidth.value,
			null
		);
	}
	Vue.onMounted(function() {
		drag.fnInit(
			carFrame.value,
			// carList.value,
			carListCopy,
			carPageWidth.value,
			0,
			false,
			dragUpdateElements
		);
		// console.log('page/home/block/slides drag initialized');
		var as = opt.autoSlide;
		if (as) {
			dragAuto = drag.fnAutoSlide(as.timeWait, as.timeAnim, as.timeManual);
			dragAuto.reset();
		}
		window.addEventListener('resize', dragResize, false);
	});
	Vue.onUnmounted(function() {
		if (dragAuto) dragAuto.stop();
		window.removeEventListener('resize', dragResize, false);
	});
	Vue.watchEffect(function() {
		var v = carList.value;
		var c = v && v.length || 0;
		carListCopy.splice(c);
		for (var i = 0; i < c; i++) {
			carListCopy.splice(i, 1, v[i]);
		}
		if (drag.fnInitialized()) {
			dragUpdateElements();
		} else {
			// console.warn('carListCopy updated but drag not initialized');
		}
	});
	return {
		carFrame: carFrame,
		carList: carList,
		carPageWidth: carPageWidth,
		drag: drag
	};
};
