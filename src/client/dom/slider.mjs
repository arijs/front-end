import { makeDrag } from "./pointer-drag.mjs";
import eventSingle from "../../isomorphic/utils/event-single.mjs";

export function sliderValueContinuous(value) {
	return value
}

export function fnSliderValueRoundToTickUniform(tickCount) {
	return function (value, min, max) {
		const totalLen = max - min
		const tickLen = totalLen / tickCount
		const result = Math.round((value - min) / tickLen) * tickLen + min
		// console.log(`slider value tick`, tickCount, value, min, max, result)
		return result
	}
}

function numberDomainToFactor(v, min, max) {
	const d = max - min
	return d ? (v - min) / d : undefined
}

function numberDomainFromFactor(f, min, max, fallback = min) {
	const d = max - min
	return null == f ? fallback : f * d + min
}

export const sliderResizeHorizontal = {
	fromElement(el) {
		return [0, el.scrollWidth]
	},
	fromResizeObserver(entries) {
		return [0, entries[0].contentBoxSize[0].inlineSize]
	},
}

export const sliderResizeVertical = {
	fromElement(el) {
		return [0, el.scrollHeight]
	},
	fromResizeObserver(entries) {
		return [0, entries[0].contentBoxSize[0].blockSize]
	},
}

export const sliderHandlePosLeft = (el, px) => {
	el.style.left = `${px}px`
}

export const sliderHandlePosTop = (el, px) => {
	el.style.top = `${px}px`
}

export const sliderHandleDragHorizontal = {
	getPos(drag) {
		return drag.horizontal.getPos()
	},
	start(drag, p) {
		return drag.horizontal.start(p)
	},
	move(drag, p) {
		return drag.horizontal.move(p)
	},
}

export const sliderHandleDragVertical = {
	getPos(drag) {
		return drag.vertical.getPos()
	},
	start(drag, p) {
		return drag.vertical.start(p)
	},
	move(drag, p) {
		return drag.vertical.move(p)
	},
}

export function sliderHandleDragAdapter({
	handle,
	dragDirection,
	reusePixelPos = false,
}) {
	makeDrag({
		el: handle.getElement(),
		onStart(drag) {
			// this may look useless but it calculates
			// the pixel position
			handle.setValue()
			dragDirection.start(drag, handle.getPixel())
			handle.onStart.fire(handle.getValue())
		},
		onMove(drag) {
			const pixel = Math.max(handle.getPixelMin(),
				Math.min(handle.getPixelMax(),
					dragDirection.getPos(drag)
				)
			)
			dragDirection.move(drag, pixel)
			const value = handle.getSlider().pixelToValue(pixel)
			handle.setValue(value, reusePixelPos ? pixel : undefined)
			handle.onMove.fire(handle.getValue(), value)
		},
		onEnd() {
			handle.onEnd.fire(handle.getValue())
		},
	})
}

export function sliderResizeObserve({
	sliderResizeAdapter = sliderResizeHorizontal,
} = {}) {
	const onResize = eventSingle('resize')
	const ro = new ResizeObserver(entries => {
		onResize.fire(sliderResizeAdapter.fromResizeObserver(entries))
	})
	const api = {
		elementAdd,
		elementRemove,
		onResize,
	}
	return api
	function elementAdd(el) {
		ro.observe(el)
		onResize.fire(sliderResizeAdapter.fromElement(el))
	}
	function elementRemove(el) {
		ro.unobserve(el)
	}
}

export function sliderManager({
	range,
	pixelRange,
	disabled = false,
	sliderValue = sliderValueContinuous,
} = {}) {
	const handles = []
	const api = {
		getRange,
		setRange,
		getPixelRange,
		setPixelRange,
		getDisabled,
		setDisabled,
		sliderValue,
		valueToPixel,
		pixelToValue,
		handleAdd,
		handleRemove,
	}
	return api
	function getRange() {
		return [...range]
	}
	function setRange(r) {
		range = r
		renderHandles()
		return api
	}
	function getPixelRange() {
		return [...pixelRange]
	}
	function setPixelRange(pr) {
		pixelRange = pr
		renderHandles()
		return api
	}
	function getDisabled() {
		return disabled
	}
	function setDisabled(d) {
		disabled = Boolean(d)
		return api
	}
	function renderHandles() {
		for (const h of handles) {
			h.updatePixelRange().renderValue()
		}
	}
	function valueToPixel(v) {
		const pr = pixelRange
		const f = numberDomainToFactor(v, range[0], range[1])
		const p = numberDomainFromFactor(f, pr[0], pr[1], pr[0])
		const r = Math.round(p)
		return r
	}
	function pixelToValue(p) {
		const pr = pixelRange
		const f = numberDomainToFactor(p, pr[0], pr[1])
		const v = numberDomainFromFactor(f, range[0], range[1], range[0])
		return v
	}
	function handleAdd(h) {
		const i = handles.indexOf(h)
		if (-1 === i) handles.push(h.setSlider(api))
	}
	function handleRemove(h) {
		const i = handles.indexOf(h)
		if (-1 !== i) {
			handles.splice(i, 1)
			h.setSlider(undefined)
		}
	}
}

export function sliderHandleManager({
	el,
	value,
	valueMin,
	valueMax,
	slider,
	disabled = false,
	sliderValue,
	renderHandlePos = sliderHandlePosLeft,
} = {}) {
	let pixel = undefined
	let pixelMin = undefined
	let pixelMax = undefined
	const onStart = eventSingle('start')
	const onMove = eventSingle('move')
	const onEnd = eventSingle('end')
	const api = {
		getElement,
		getValue,
		setValue,
		setValueMin,
		setValueMax,
		getPixel,
		getPixelMin,
		getPixelMax,
		getSlider,
		setSlider,
		getDisabled,
		setDisabled,
		renderValue,
		updatePixelRange,
		onStart,
		onMove,
		onEnd,
	}
	initValueRange()
	return api
	function getElement() {
		return el
	}
	function getValue() {
		return value
	}
	function setValue(v, p) {
		const [vMin, vMax] = null == slider
			? [valueMin, valueMax]
			: slider.getRange()
		const sv = sliderValue || slider.sliderValue
		value = sv(v == null ? value : v, vMin, vMax)
		renderValue(p)
		return api
	}
	function setValueMin(v) {
		valueMin = null == v && slider
			? slider.getRange()[0]
			: v
		updatePixelMin()
		return api
	}
	function updatePixelMin() {
		slider && (pixelMin = Math.round(slider.valueToPixel(valueMin)))
		return api
	}
	function setValueMax(v) {
		valueMax = null == v && slider
			? slider.getRange()[1]
			: v
		updatePixelMax()
		return api
	}
	function updatePixelMax() {
		slider && (pixelMax = Math.round(slider.valueToPixel(valueMax)))
		return api
	}
	function updatePixelRange() {
		updatePixelMin()
		updatePixelMax()
		return api
	}
	function initValueRange() {
		setValueMin(valueMin)
		setValueMax(valueMax)
		if (value == null && null != valueMin) setValue(valueMin)
	}
	function getPixel() {
		return pixel
	}
	function getPixelMin() {
		return pixelMin
	}
	function getPixelMax() {
		return pixelMax
	}
	function getSlider() {
		return slider
	}
	function setSlider(s) {
		slider = s
		initValueRange()
		return api
	}
	function renderValue(p) {
		pixel = null == p && slider
			? slider.valueToPixel(value)
			: p
		if (null != pixel) renderHandlePos(el, pixel)
		return api
	}
	function getDisabled() {
		return disabled
	}
	function setDisabled(d) {
		disabled = Boolean(d)
		return api
	}
}

export function sliderHandleNotCross(hLow, hHigh) {
	updateLimits()
	listen()
	return unlisten
	function updateLimits() {
		hLow.setValueMax(hHigh.getValue())
		hHigh.setValueMin(hLow.getValue())
	}
	function listen() {
		hLow.onMove.on(updateLimits)
		hHigh.onMove.on(updateLimits)
	}
	function unlisten() {
		hLow.onMove.off(updateLimits)
		hHigh.onMove.off(updateLimits)
	}
}

export const SLIDER_HORIZONTAL = 1
export const SLIDER_VERTICAL = 2

export function simpleSlider(
	direction,
	elTrack,
	vMin = 0,
	vMax = 100,
	ticks,
) {
	let sliderResizeAdapter = undefined
	switch (direction) {
		case SLIDER_HORIZONTAL:
			sliderResizeAdapter = sliderResizeHorizontal
			break
		case SLIDER_VERTICAL:
			sliderResizeAdapter = sliderResizeVertical
			break
		default:
			throw new Error(`Invalid slider direction ${JSON.stringify(direction)}`)
	}
	const sliderValue = null == ticks
		? sliderValueContinuous
		: fnSliderValueRoundToTickUniform(ticks)
	const slider = sliderManager({
		range: [vMin, vMax],
		sliderValue,
	})
	const sliderRO = sliderResizeObserve({
		sliderResizeAdapter,
	})
	sliderRO.onResize.on(slider.setPixelRange)
	sliderRO.elementAdd(elTrack)
	return {
		slider,
		addHandle: (el) => simpleSliderHandle(
			el,
			direction,
			slider,
			ticks,
		),
		addRange: (elMin, elMax) => simpleSliderRange(
			elMin,
			elMax,
			direction,
			slider,
			ticks,
		),
	}
}

function simpleSliderHandle(
	el,
	direction,
	slider,
	ticks,
) {
	let dragDirection = undefined
	let renderHandlePos = undefined
	switch (direction) {
		case SLIDER_HORIZONTAL:
			dragDirection = sliderHandleDragHorizontal
			renderHandlePos = sliderHandlePosLeft
			break
		case SLIDER_VERTICAL:
			dragDirection = sliderHandleDragVertical
			renderHandlePos = sliderHandlePosTop
			break
		default:
			throw new Error(`Invalid slider handle direction ${JSON.stringify(direction)}`)
	}
	const handle = sliderHandleManager({
		el,
		renderHandlePos,
	})
	slider.handleAdd(handle)
	sliderHandleDragAdapter({
		handle, 
		dragDirection,
		reusePixelPos: null == ticks,
	})
	return handle
}

function simpleSliderRange(
	elMin,
	elMax,
	direction,
	slider,
	ticks,
) {
	const min = simpleSliderHandle(
		elMin,
		direction,
		slider,
		ticks,
	)
	const max = simpleSliderHandle(
		elMax,
		direction,
		slider,
		ticks,
	)
	sliderHandleNotCross(min, max)
	return { min, max }
}
