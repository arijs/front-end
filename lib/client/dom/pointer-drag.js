"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = pointerDrag;

function pointerDrag() {
  var dragItem;
  var api = {
    setDragObject: function setDragObject(obj) {
      dragItem = obj;
    },
    getEventPos: function getEventPos(ev) {
      var x, y;
      var touch = ev.touches && ev.touches[0] || ev.changedTouches && ev.changedTouches[0];

      if (touch) {
        x = touch.pageX;
        y = touch.pageY;
      } else {
        x = ev.pageX;
        y = ev.pageY;
      }

      return {
        x: x,
        y: y
      };
    },
    dragMove: function dragMove(ev) {
      if (dragItem) dragItem.fnMove(api.getEventPos(ev), ev);
    },
    dragEnd: function dragEnd(ev) {
      if (dragItem) dragItem.fnEnd(api.getEventPos(ev), ev);
      dragItem = void 0;
    },
    listenerAdd: function listenerAdd(el) {
      var dragMove = api.dragMove;
      var dragEnd = api.dragEnd;
      el = el || document.documentElement;
      el.addEventListener('touchmove', dragMove, false);
      el.addEventListener('mousemove', dragMove, false);
      el.addEventListener('touchend', dragEnd, false);
      el.addEventListener('mouseup', dragEnd, false);
    },
    listenerRemove: function listenerRemove(el) {
      var dragMove = api.dragMove;
      var dragEnd = api.dragEnd;
      el = el || document.documentElement;
      el.removeEventListener('touchmove', dragMove, false);
      el.removeEventListener('mousemove', dragMove, false);
      el.removeEventListener('touchend', dragEnd, false);
      el.removeEventListener('mouseup', dragEnd, false);
    }
  };
  return api;
}