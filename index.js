
/**
 * Module dependencies.
 */

var SelectionRect = require('selection-rect');
var Emitter = require('emitter');
var classes = require('classes');
var events = require('events');
var query = require('query');

/**
 * Expose `Selectable.
 */

module.exports = Selectable;

/**
 * Check if rects intersect.
 *
 * TODO: use Rect#intersects()
 */

function rectsIntersect(a, b) {
  return !(a.left > (b.x + b.w)
    || (a.left + a.width) < b.x
    || a.top > (b.y + b.h)
    || (a.top + a.height) < b.y);
}

/**
 * Check if `els` are within the given `rect`.
 *
 * TODO: separate component
 */

function withinRect(els, rect) {
  var within = [];

  for (var i = 0; i < els.length; i++) {
    var r = els[i].getBoundingClientRect();
    if (rectsIntersect(r, rect)) {
      within.push(els[i]);
    }
  }

  return within;
}

/**
 * Initialize a new `Selectable` with `selector`
 * and optional `el` defaulting to the document
 * element.
 *
 * @param {String} selector
 * @param {Element} el
 * @api public
 */

function Selectable(selector, el) {
  if (!(this instanceof Selectable)) return new Selectable(selector, el);
  this.el = el || document.documentElement;
  this.selector = selector;
  this.events = events(this.el, this);
  this.rect = new SelectionRect;
  this.events.bind('mousedown');
  this.events.bind('mousemove');
  this.events.bind('mouseup');
}

/**
 * Mixin emitter.
 */

Emitter(Selectable.prototype);

/**
 * Handle mousedown.
 */

Selectable.prototype.onmousedown = function(e){
  this.down = e;
  this.el.appendChild(this.rect.el);
  this.rect.moveTo(e.pageX, e.pageY);
};

/**
 * Handle mousemove.
 */

Selectable.prototype.onmousemove = function(e){
  if (!this.down) return;
  this.rect.to(e.pageX, e.pageY);
  var els = query.all(this.selector, this.el);
  this.selectover(els, withinRect(els, this.rect));
};

/**
 * Handle mouseup.
 */

Selectable.prototype.onmouseup = function(e){
  this.down = null;
  var els = query.all(this.selector, this.el);
  this.select(els, withinRect(els, this.rect));
  this.rect.size(0, 0);
  var el = this.rect.el;
  if (el.parentNode) el.parentNode.removeChild(el)
};

/**
 * Apply "selectover" classes.
 *
 * TODO: cache ClassLists
 */

Selectable.prototype.selectover = function(a, b){
  for (var i = 0; i < a.length; i++) {
    classes(a[i]).remove('selectover');
  }

  for (var i = 0; i < b.length; i++) {
    classes(b[i]).add('selectover');
  }
};

/**
 * Apply "selected" classes.
 *
 * TODO: cache ClassLists
 */

Selectable.prototype.select = function(a, b){
  for (var i = 0; i < a.length; i++) {
    classes(a[i]).remove('selected');
  }

  for (var i = 0; i < b.length; i++) {
    classes(b[i])
      .add('selected')
      .remove('selectover');
  }

  this.change(a, b);
};

/**
 * Emit "change".
 */

Selectable.prototype.change = function(a, b){
  var e = {};
  e.elements = a;
  e.selected = b;
  this.emit('change', e);
};
