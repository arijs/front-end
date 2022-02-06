
export function pointerDrag() {
	var dragItem;
	var api = {
		setDragObject: function(obj) {
			dragItem = obj;
		},
		getEventPos: function(ev) {
			var x, y;
			var touch = ev.touches && ev.touches[0]
				|| ev.changedTouches && ev.changedTouches[0];
			if (touch) {
				x = touch.pageX;
				y = touch.pageY;
			} else {
				x = ev.pageX;
				y = ev.pageY;
			}
			return { x, y };
		},
		dragMove: function (ev) {
			if (dragItem) dragItem.fnMove(api.getEventPos(ev), ev);
		},
		dragEnd: function (ev) {
			if (dragItem) dragItem.fnEnd(api.getEventPos(ev), ev);
			dragItem = void 0;
		},
		listenerAdd: function (el) {
			var dragMove = api.dragMove;
			var dragEnd = api.dragEnd;
			el = el || document.documentElement;
			el.addEventListener('touchmove', dragMove, false);
			el.addEventListener('mousemove', dragMove, false);
			el.addEventListener('touchend', dragEnd, false);
			el.addEventListener('mouseup', dragEnd, false);
		},
		listenerRemove: function(el) {
			var dragMove = api.dragMove;
			var dragEnd = api.dragEnd;
			el = el || document.documentElement;
			el.removeEventListener('touchmove', dragMove, false);
			el.removeEventListener('mousemove', dragMove, false);
			el.removeEventListener('touchend', dragEnd, false);
			el.removeEventListener('mouseup', dragEnd, false);
		},
		listenerStartAdd: function (fnStart, el) {
			el = el || document.documentElement;
			el.addEventListener('touchstart', fnStart, false);
			el.addEventListener('mousedown', fnStart, false);
		},
		listenerStartRemove: function(fnStart, el) {
			el = el || document.documentElement;
			el.removeEventListener('touchstart', fnStart, false);
			el.removeEventListener('mousedown', fnStart, false);
		},
	};
	return api;
}

let pdi = undefined
export function getPointerDragInstance() {
	return pdi || (pdi = pointerDrag());
}

export function makeDragSlides(name, apiDrag = getPointerDragInstance()) {
	return {
		active: false,
		start: 0,
		posStart: 0,
		pos: 0,
		posSel: 0,
		widthFrame: 1,
		widthList: 1,
		elList: null,
		timeStart: null,
		timeEnd: null,
		timeDuration: null,
		fnPos: function(pos) {
			this.pos = pos;
			var elList = this.elList;
			if (elList) {
				elList.style.left = pos+'px';
			} else {
				console.error(name+' elList not found to set position '+pos);
			}
		},
		fnStart: function(ev, elFrame, elList) {
			this.fnAnimStop();
			this.timeStart = new Date();
			ev = apiDrag.getEventPos(ev);
			this.active = true;
			this.start = ev.x;
			this.posStart = this.pos;
			this.pos = elList.offsetLeft;
			this.widthFrame = elFrame.offsetWidth;
			this.widthList = elList.offsetWidth;
			this.elList = elList;
			apiDrag.setDragObject(this);
		},
		fnMove: function(ev) {
			if (!this.active) return;
			var p = ev.x - this.start;
			this.lastPos = p;
			this.fnPos(this.posStart + p);
		},
		fnEnd: function(ev) {
			this.active = false;
			this.timeEnd = new Date();
			this.timeDuration = this.timeEnd.getTime() - this.timeStart.getTime();
			var self = this;
			var pos = this.pos;
			var stop = false;
			var time = 750;
			var target = Math.max(this.widthFrame - this.widthList, Math.min(0, pos));
			// var target = fnLimit(this.widthFrame - this.widthList, 0, pos);
			this.posSel = target;
			if (target === pos) return;
			this.fnAnimStop();
			this.fnAnimStop = function() { stop = true; };
			animate(pos, target, time, easing.cubic, easing.out, function(val, pos) {
				if (!stop) self.fnPos(val);
				if (pos >= time) {
					self.elList = null;
					return true;
				}
				return stop;
			});
		},
		fnAnimStop: function(){}
	};
}

export function makeDrag({
	onMove,
	onStart,
	onEnd,
	el: elDefault,
	apiDrag,
}) {
	apiDrag = (apiDrag || getPointerDragInstance())
	const drag = {
		active: false,
		apiDrag,
		xstart: 0,
		xposStart: 0,
		xpos: 0,
		xmoveStart: 0,
		xmoveLast: 0,
		ystart: 0,
		yposStart: 0,
		ypos: 0,
		ymoveStart: 0,
		ymoveLast: 0,
		listenerAdd: function(elOther) {
			const el = elOther || elDefault;
			el && apiDrag.listenerStartAdd(drag.fnStart, el);
		},
		listenerRemove: function(elOther) {
			const el = elOther || elDefault;
			el && apiDrag.listenerStartRemove(drag.fnStart, el);
		},
		horizontal: {
			getPos: function() {
				return drag.xpos
			},
			start: function(p) {
				drag.xposStart = drag.xpos = p
				drag.yposStart = drag.ypos = 0
			},
			move: function(p) {
				drag.xpos = p
			}
		},
		vertical: {
			getPos: function() {
				return drag.ypos
			},
			start: function(p) {
				drag.xposStart = drag.xpos = 0
				drag.yposStart = drag.ypos = p
			},
			move: function(p) {
				drag.ypos = p
			}
		},
		fnStart: function(ev) {
			ev.preventDefault();
			ev = apiDrag.getEventPos(ev);
			drag.active = true;
			drag.xstart = ev.x;
			drag.ystart = ev.y;
			drag.xposStart = drag.xpos;
			drag.yposStart = drag.ypos;
			drag.xmoveLast = 0;
			drag.ymoveLast = 0;
			drag.xmoveStart = 0;
			drag.ymoveStart = 0;
			apiDrag.setDragObject(drag);
			apiDrag.listenerAdd();
			if ('function' === typeof onStart) {
				onStart(drag);
			}
		},
		fnMove: function(ev) {
			if (!drag.active) return;
			var px = ev.x - drag.xstart;
			var py = ev.y - drag.ystart;
			drag.xmoveLast = px - drag.xmoveStart;
			drag.ymoveLast = py - drag.ymoveStart;
			drag.xmoveStart = px;
			drag.ymoveStart = py;
			drag.xpos = drag.xposStart + px;
			drag.ypos = drag.yposStart + py;
			if ('function' === typeof onMove) {
				onMove(drag);
			}
		},
		fnEnd: function() {
			drag.active = false;
			apiDrag.setDragObject();
			apiDrag.listenerRemove();
			if ('function' === typeof onEnd) {
				onEnd(drag);
			}
		}
	};
	drag.listenerAdd();
	return drag;
}

/** @deprecated */
export default pointerDrag;
