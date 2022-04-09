/*jshint esversion: 6 */

Element.prototype.fadeIn = function (speed, callback, display) {
  display = display || "block";
  let mainStyleProp = window.getComputedStyle(this).display,
    opacity = 0;
  this.style.opacity = 0;
  let x = setInterval(() => {
    if (opacity >= 1) {
      this.style.display = mainStyleProp != "none" ? mainStyleProp : display;
      this.style.opacity = 1;
      if (callback) {
        callback.call(this);
      }
      return clearInterval(x);
    }
    this.style.opacity = opacity;
    opacity += 50 / speed;
  }, 50);
  return this;
};
Element.prototype.fadeOut = function (speed, callback, display) {
  let opacity = 1;
  this.style.opacity = 1;
  let x = setInterval(() => {
    if (opacity <= 0) {
      this.style.opacity = 0;
      if (callback) {
        callback.call(this);
      }
      this.style.display = display;
      return clearInterval(x);
    }
    this.style.opacity = opacity;
    opacity -= 50 / speed;
  }, 50);
  return this;
};

Element.prototype.fadeToggle = function (speed, callback, display) {
  display = display || "block";
  let mainStyleProp = window.getComputedStyle(this).display,
    opacity = window.getComputedStyle(this).opacity;
  if (mainStyleProp == "none" || opacity <= 0) {
    this.fadeIn(speed, callback, display);
  } else {
    this.fadeOut(speed, callback);
  }
  return this;
};

Element.prototype.siblings = function () {
  return this.parentElement.children.removeElement(this);
};

Element.prototype.addClass = function (className) {
  this.classList.add(className);
  return this;
};

Element.prototype.remove = function (className) {
  this.classList.remove(className);
  return this;
};

Element.prototype.hasClass = function (className) {
  this.classList.contains(className);
};

Element.prototype.toggle = function (className) {
  if (this.hasClass(className)) return this.removeClass(className);
  return this.addClass(className);
};

/**
 *
 * remove Element
 *
 * @param {Element | string} elem
 *
 * @return {HTMLAllCollection}
 */

HTMLCollection.prototype.removeElement = function (elem) {
  if (typeof elem == "string") elem = s(elem);
  let filtered = [...this].filter((e) => {
    return e != elem;
  });
  filtered.__proto__ = this.__proto__;
  return filtered;
};

HTMLCollection.prototype.addClass = function (className) {
  for (let col of this) {
    col.addClass(className);
  }
  return this;
};

HTMLCollection.prototype.removeClass = function (className) {
  for (let col of this) {
    col.remove(className);
  }
  return this;
};

HTMLCollection.prototype.toggle = function (className) {
  for (let col of this) {
    col.toggle(className);
  }
  return this;
};

/**
 * short hand selector function
 *
 *
 * @param {String} elem
 * @param {Number} all
 * @returns {Element}
 */
function s(elem, all = 0) {
  if (all != 0) {
    return document.querySelectorAll(elem);
  }
  return document.querySelector(elem);
}
