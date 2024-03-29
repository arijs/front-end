import { simpleSliderHorizontal, simpleSliderVertical } from "/src/client/dom/slider.mjs";

// SLIDER_HORIZONTAL

simpleSliderHorizontal(
	document.querySelector('.slider-1-cont .slider-actual-track'),
).addHandle(
	document.querySelector('.slider-1-cont .slider-bt'),
).onEnd.on(v => console.log(`Slider 1 cont pos`, v))

simpleSliderHorizontal(
	document.querySelector('.slider-1-tick-20 .slider-actual-track'),
	0,
	20,
	20,
).addHandle(
	document.querySelector('.slider-1-tick-20 .slider-bt'),
).onEnd.on(v => console.log(`Slider 1 tick 20 pos`, v))

const s2Cont = simpleSliderHorizontal(
	document.querySelector('.slider-2-cont .slider-actual-track'),
).addRange(
	document.querySelector('.slider-2-cont .slider-bt-min'),
	document.querySelector('.slider-2-cont .slider-bt-max'),
)
s2Cont.min.onEnd.on(v => console.log(`Slider 2 cont range min`, v))
s2Cont.max.onEnd.on(v => console.log(`Slider 2 cont range max`, v))

const s2Tick = simpleSliderHorizontal(
	document.querySelector('.slider-2-tick-20 .slider-actual-track'),
	0,
	20,
	20,
).addRange(
	document.querySelector('.slider-2-tick-20 .slider-bt-min'),
	document.querySelector('.slider-2-tick-20 .slider-bt-max'),
)
s2Tick.min.onEnd.on(v => console.log(`Slider 2 tick 20 range min`, v))
s2Tick.max.onEnd.on(v => console.log(`Slider 2 tick 20 range max`, v))

// SLIDER_VERTICAL

simpleSliderVertical(
	document.querySelector('.slider-v1-cont .slider-actual-track'),
).addHandle(
	document.querySelector('.slider-v1-cont .slider-bt'),
).onEnd.on(v => console.log(`Slider v1 cont pos`, v))

simpleSliderVertical(
	document.querySelector('.slider-v1-tick-20 .slider-actual-track'),
	0,
	20,
	20,
).addHandle(
	document.querySelector('.slider-v1-tick-20 .slider-bt'),
).onEnd.on(v => console.log(`Slider v1 tick 20 pos`, v))

const sv2Cont = simpleSliderVertical(
	document.querySelector('.slider-v2-cont .slider-actual-track'),
).addRange(
	document.querySelector('.slider-v2-cont .slider-bt-min'),
	document.querySelector('.slider-v2-cont .slider-bt-max'),
)
sv2Cont.min.onEnd.on(v => console.log(`Slider v2 cont range min`, v))
sv2Cont.max.onEnd.on(v => console.log(`Slider v2 cont range max`, v))

const sv2Tick = simpleSliderVertical(
	document.querySelector('.slider-v2-tick-20 .slider-actual-track'),
	0,
	20,
	20,
).addRange(
	document.querySelector('.slider-v2-tick-20 .slider-bt-min'),
	document.querySelector('.slider-v2-tick-20 .slider-bt-max'),
)
sv2Tick.min.onEnd.on(v => console.log(`Slider v2 tick 20 range min`, v))
sv2Tick.max.onEnd.on(v => console.log(`Slider v2 tick 20 range max`, v))
