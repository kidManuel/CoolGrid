// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"js/state.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.state = void 0;
var state = {
  rowsAmmount: 3,
  columnsAmmount: 0,
  centerTolerance: 0.2,
  minSpeed: 1,
  maxSpeed: 22,
  containerHeight: 0,
  containerWidth: 0,
  containerRatio: 0,
  moduleSize: 0,
  center: {
    X: null,
    Y: null
  },
  maxPossibleDistance: Infinity,
  shouldAnimate: false,
  force: {},
  prevForce: {},
  modules: {
    x: [],
    y: []
  },
  allModules: []
};
exports.state = state;
},{}],"js/module.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _state = require("./state");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var hash = 0;

var getNewHash = function getNewHash() {
  return hash++;
};

var _module =
/*#__PURE__*/
function () {
  function module(x, y) {
    var isGhost = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    var content = arguments.length > 3 ? arguments[3] : undefined;
    var getHorizontalSpeed = arguments.length > 4 ? arguments[4] : undefined;
    var getVerticalSpeed = arguments.length > 5 ? arguments[5] : undefined;

    _classCallCheck(this, module);

    var moduleSize = _state.state.moduleSize;
    this.x = x;
    this.y = y;
    this.number = getNewHash();
    this.id = "x".concat(this.x, "y").concat(this.y).concat(isGhost ? 'g' : '');
    this.top = y * moduleSize;
    this.left = x * moduleSize;
    this.linkedTo = null;
    this.domElement = this.createDomElement();
    this.setAsGhost(isGhost);
    this.offset = {
      top: 0,
      left: 0,
      null: 0
    };
    this.frameMovementVector = {
      top: 0,
      left: 0
    };
    this.content = content;
    this.getHorizontalSpeed = getHorizontalSpeed;
    this.getVerticalSpeed = getVerticalSpeed;
  }

  _createClass(module, [{
    key: "getRight",
    value: function getRight() {
      var moduleSize = _state.state.moduleSize;
      return this.left + moduleSize;
    }
  }, {
    key: "getBottom",
    value: function getBottom() {
      var moduleSize = _state.state.moduleSize;
      return this.top + moduleSize;
    }
  }, {
    key: "setForce",
    value: function setForce(position, ammount) {
      this.frameMovementVector[position] = ammount;
    }
  }, {
    key: "resetMovementVector",
    value: function resetMovementVector() {
      this.setForce('top', 0);
      this.setForce('left', 0);
    }
  }, {
    key: "applyOffset",
    value: function applyOffset(position, ammount) {
      var offset = this.offset;

      if (ammount) {
        offset[position] = ammount;
      } else {
        offset[position] = 0;
      }
    }
  }, {
    key: "calculateCurrentFrameOffset",
    value: function calculateCurrentFrameOffset() {
      var offset = this.offset;

      if (offset.top) {
        var top = offset.top; // This is setup for next frame
        // decide wether to move the full ammount, or all that remains, whichever is lower

        var absoluteAmmount = Math.min(Math.abs(top), _state.state.maxSpeed);
        var signedAmmount = absoluteAmmount * Math.sign(top);
        this.setForce('top', signedAmmount); // Reduce outstanding offset by ammount

        offset.top -= signedAmmount;
      }

      if (offset.left) {
        var left = offset.left;

        var _absoluteAmmount = Math.min(Math.abs(left), _state.state.maxSpeed);

        var _signedAmmount = _absoluteAmmount * Math.sign(left);

        this.setForce('left', _signedAmmount);
        offset.left -= _signedAmmount;
      }
    }
  }, {
    key: "compileFrameMovementVector",
    value: function compileFrameMovementVector() {
      // Make element calculate any outstanding offsets to move
      this.calculateCurrentFrameOffset(); // Aka if we are not on nullforce

      if (_state.state.force.axis) {
        var position = _state.state.force.position;
        var forceAmmount = _state.state.force.isVert ? this.getVerticalSpeed() : this.getHorizontalSpeed();
        this.setForce(position, forceAmmount);
      }
    }
  }, {
    key: "setAsGhost",
    value: function setAsGhost(isGhost, linkTo) {
      this.isGhost = isGhost;
      this.linkedTo = isGhost && linkTo ? linkTo : null;
      this.domElement.classList.toggle('ghost', isGhost);
    }
  }, {
    key: "createDomElement",
    value: function createDomElement() {
      var newElement = document.createElement("div");
      newElement.className = "module";
      newElement.id = this.id;
      return newElement;
    }
  }, {
    key: "getContent",
    value: function getContent() {
      switch (_typeof(this.content)) {
        case 'string':
          return this.getStringContent();

        default:
          return '';
      }
    }
  }, {
    key: "getStringContent",
    value: function getStringContent() {
      var content = this.content;
      return "} #".concat(this.id, ":after {content: '").concat(content, "'");
    }
  }, {
    key: "getStyleString",
    value: function getStyleString() {
      this.top += this.frameMovementVector.top;
      this.left += this.frameMovementVector.left;
      this.resetMovementVector();
      return "#".concat(this.id, "{ top: ").concat(this.top, "px; left:").concat(this.left, "px; ").concat(this.getContent(), "}");
    }
  }]);

  return module;
}();

exports.default = _module;
},{"./state":"js/state.js"}],"js/line.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _state = require("./state");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var line =
/*#__PURE__*/
function () {
  function line(data, number) {
    _classCallCheck(this, line);

    this.data = data;
    this.number = number;
    this.contents = [];
    this.ghost = null;
    this.speed = 0;
  }

  _createClass(line, [{
    key: "linkGhostToElement",
    value: function linkGhostToElement(element) {
      var ghost = this.ghost;
      ghost.linkedTo = element;
    }
  }, {
    key: "setGhostPosition",
    value: function setGhostPosition() {
      var ghost = this.ghost;
      var linkedTo = ghost.linkedTo; // Here we calculate the position of the ghost, looks messy but
      //essentially the ghost has to be on the opposite side of the real module

      if (this.data.isVert) {
        var top = linkedTo.top,
            frameMovementVector = linkedTo.frameMovementVector;
        var containerHeight = _state.state.containerHeight; // We decide if we have to substract or add the height of the container
        // to the top value of the ghost. Use positive as a default for the first frame of animation.

        var operation = Math.sign(top) * -1 || 1; // And we add however much the real module is going to move this frame.

        var newPosition = top + containerHeight * operation + frameMovementVector.top;
        ghost.top = newPosition;
        ghost.left = ghost.linkedTo.left + frameMovementVector.left;
      } else {
        var _ghost$linkedTo = ghost.linkedTo,
            left = _ghost$linkedTo.left,
            _frameMovementVector = _ghost$linkedTo.frameMovementVector;
        var containerWidth = _state.state.containerWidth;

        var _operation = Math.sign(left) * -1 || 1;

        var _newPosition = left + containerWidth * _operation + _frameMovementVector.left;

        ghost.left = _newPosition;
        ghost.top = ghost.linkedTo.top + _frameMovementVector.top;
      }

      ghost.content = linkedTo.content;
    }
  }, {
    key: "shiftLine",
    value: function shiftLine(resetElement) {
      var ghost = this.ghost,
          contents = this.contents;
      var axis = this.data.axis;
      var isCurrentMovementPositive = resetElement.frameMovementVector[this.data.position] > 0; // Remove old element from container since it is now a ghost

      contents.splice(resetElement[this.data.axis], 1);

      if (isCurrentMovementPositive) {
        contents.unshift(resetElement);
      } else {
        contents.push(resetElement);
      } // Set correct axis number for each module in this line.


      contents.forEach(function (singleModule, order) {
        singleModule[axis] = order;
      });
      resetElement.top = ghost.top;
      resetElement.left = ghost.left;
      var elementToLink = isCurrentMovementPositive ? this.getLast() : this.getFirst();
      this.linkGhostToElement(elementToLink);
    }
  }, {
    key: "getFirst",
    value: function getFirst() {
      return this.contents[0];
    }
  }, {
    key: "getLast",
    value: function getLast() {
      return this.contents[this.contents.length - 1];
    }
  }, {
    key: "getSpeed",
    value: function getSpeed() {
      return this.speed;
    }
  }]);

  return line;
}();

exports.default = line;
},{"./state":"js/state.js"}],"js/const.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.message = exports.forces = exports.verticalIdentity = exports.horizontalIdentity = exports.positions = exports.quadrants = exports.devModeToggle = exports.body = exports.modulePositions = exports.container = void 0;

var _forces;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var container = document.getElementById('visualContainer');
exports.container = container;
var modulePositions = document.getElementById('modulePositions');
exports.modulePositions = modulePositions;
var body = document.getElementsByTagName('body')[0];
exports.body = body;
var devModeToggle = document.getElementById('devModeToggle');
exports.devModeToggle = devModeToggle;
var quadrants = {
  bot: 'BOTTOM',
  top: 'TOP',
  left: 'LEFT',
  right: 'RIGHT'
};
exports.quadrants = quadrants;
var positions = {
  left: 'left',
  top: 'top'
};
exports.positions = positions;
var horizontalIdentity = {
  axis: 'x',
  isVert: false,
  position: 'left',
  inverseAxis: 'y'
};
exports.horizontalIdentity = horizontalIdentity;
var verticalIdentity = {
  axis: 'y',
  isVert: true,
  position: 'top',
  inverseAxis: 'x'
};
exports.verticalIdentity = verticalIdentity;
var forces = (_forces = {}, _defineProperty(_forces, quadrants.bot, _objectSpread({
  quadrantName: quadrants.bot
}, verticalIdentity, {
  direction: 1
})), _defineProperty(_forces, quadrants.top, _objectSpread({
  quadrantName: quadrants.top
}, verticalIdentity, {
  direction: -1
})), _defineProperty(_forces, quadrants.left, _objectSpread({
  quadrantName: quadrants.left
}, horizontalIdentity, {
  direction: -1
})), _defineProperty(_forces, quadrants.right, _objectSpread({
  quadrantName: quadrants.right
}, horizontalIdentity, {
  direction: 1
})), _defineProperty(_forces, "nullForce", {
  quadrantName: 'nullForce',
  axis: null,
  isVert: null,
  position: null,
  inverse: null,
  direction: null
}), _forces);
exports.forces = forces;
var message = ['COMING SOON ', 'COMING SOON ', 'COMING SOON ', 'COMING SOON ', 'COMING SOON ', 'COMING SOON '];
exports.message = message;
},{}],"js/cssHandler.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _state = require("./state");

var _const = require("./const");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var cssHandler =
/*#__PURE__*/
function () {
  function cssHandler() {
    _classCallCheck(this, cssHandler);

    this.modulesList = [];
    this.frameCss = '';
  }

  _createClass(cssHandler, [{
    key: "getModuleCss",
    value: function getModuleCss(moduleCss) {
      this.frameCss += moduleCss;
    }
  }, {
    key: "resetFrameCss",
    value: function resetFrameCss() {
      this.frameCss = '';
    }
  }, {
    key: "applyCssToDom",
    value: function applyCssToDom() {
      _const.modulePositions.textContent = this.frameCss;
    }
  }, {
    key: "getAllCss",
    value: function getAllCss() {
      var _this = this;

      _state.state.allModules.forEach(function (singleModule) {
        _this.getModuleCss(singleModule.getStyleString());
      });

      this.applyCssToDom();
      this.resetFrameCss();
    }
  }]);

  return cssHandler;
}();

var _default = new cssHandler();

exports.default = _default;
},{"./state":"js/state.js","./const":"js/const.js"}],"js/mathUtil.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.constrain = exports.map = exports.distance = exports.pyth = void 0;

var pyth = function pyth(a, b) {
  return Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
};

exports.pyth = pyth;

var distance = function distance(x1, y1, x2, y2) {
  return pyth(x1 - x2, y1 - y2);
}; // Pretty much ripped straight from p5's math helper.
// https://github.com/processing/p5.js/blob/1.0.0/src/math/calculation.js


exports.distance = distance;

var map = function map(n, start1, stop1, start2, stop2, withinBounds) {
  var newval = (n - start1) / (stop1 - start1) * (stop2 - start2) + start2;

  if (!withinBounds) {
    return newval;
  }

  if (start2 < stop2) {
    return constrain(newval, start2, stop2);
  } else {
    return constrain(newval, stop2, start2);
  }
};

exports.map = map;

var constrain = function constrain(n, low, high) {
  return Math.max(Math.min(n, high), low);
};

exports.constrain = constrain;
},{}],"js/index.js":[function(require,module,exports) {
"use strict";

var _module2 = _interopRequireDefault(require("./module"));

var _line3 = _interopRequireDefault(require("./line"));

var _cssHandler = _interopRequireDefault(require("./cssHandler"));

var constants = _interopRequireWildcard(require("./const"));

var _state = require("./state");

var _mathUtil = require("./mathUtil");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var body = constants.body,
    devModeToggle = constants.devModeToggle,
    container = constants.container,
    quadrants = constants.quadrants,
    forces = constants.forces,
    horizontalIdentity = constants.horizontalIdentity,
    verticalIdentity = constants.verticalIdentity,
    message = constants.message;

function setup() {
  _state.state.rowsAmmount = message.length;
  _state.state.columnsAmmount = message.reduce(function (acc, curr) {
    return Math.max(acc.length || acc, curr.length || curr);
  });
  _state.state.containerHeight = Math.floor(container.offsetHeight / _state.state.rowsAmmount) * _state.state.rowsAmmount;
  _state.state.moduleSize = _state.state.containerHeight / _state.state.rowsAmmount;
  _state.state.containerWidth = _state.state.columnsAmmount * _state.state.moduleSize;
  _state.state.center.X = _state.state.containerWidth / 2;
  _state.state.center.Y = _state.state.containerHeight / 2;
  _state.state.maxPossibleDistance = (0, _mathUtil.pyth)(_state.state.center.X, _state.state.center.Y);
  console.log(_state.state.maxPossibleDistance, 'MAX POSSIBLE DISTANCE');
  _state.state.containerRatio = _state.state.containerHeight / _state.state.containerWidth;
  container.style.height = "".concat(_state.state.containerHeight, "px");
  container.style.width = "".concat(_state.state.containerWidth, "px");
  var moduleSize = _state.state.moduleSize;
  var baseCss = "\n    .module {\n        width: ".concat(moduleSize, "px;\n        height: ").concat(moduleSize, "px;\n    }\n    .module:after {\n        font-size: ").concat(moduleSize, "px;\n    }\n    ");
  document.getElementById('baseCss').textContent = baseCss;
  _state.state.force = forces.nullForce;
  _state.state.prevForce = forces.nullForce;
  prepModules();

  _cssHandler.default.getAllCss();

  setListeners();
}

function prepModules() {
  // Prep regualr modules
  for (var i = 0; i < _state.state.rowsAmmount; i++) {
    var currentHorizontalLine = new _line3.default(horizontalIdentity, i);

    _state.state.modules.x.push(currentHorizontalLine);

    for (var e = 0; e < _state.state.columnsAmmount; e++) {
      if (i === 0) {
        _state.state.modules.y.push(new _line3.default(verticalIdentity, e));
      }

      var currentVerticalLine = _state.state.modules.y[e];
      var newElement = new _module2.default(e, i, false, message[i][e], currentHorizontalLine.getSpeed.bind(currentHorizontalLine), currentVerticalLine.getSpeed.bind(currentVerticalLine));
      currentHorizontalLine.contents.push(newElement);
      currentVerticalLine.contents.push(newElement);
      container.appendChild(newElement.domElement);

      _state.state.allModules.push(newElement);
    }
  } // Prep ghosts


  for (var _i = 0; _i < _state.state.rowsAmmount; _i++) {
    var newGhost = new _module2.default(-1, _i, true);
    var _line = _state.state.modules.x[_i];
    _line.ghost = newGhost;
    newGhost.linkedTo = _line.contents[0];
    container.appendChild(newGhost.domElement);

    _state.state.allModules.push(newGhost);
  }

  for (var _e = 0; _e < _state.state.columnsAmmount; _e++) {
    var _newGhost = new _module2.default(_e, -1, true);

    var _line2 = _state.state.modules.y[_e];
    _line2.ghost = _newGhost;
    _newGhost.linkedTo = _line2.contents[0];
    container.appendChild(_newGhost.domElement);

    _state.state.allModules.push(_newGhost);
  }
}

function toggleDevMode() {
  body.classList.toggle('devMode', devModeToggle.checked);
}

function setListeners() {
  devModeToggle.addEventListener('click', function () {
    toggleDevMode();
  });
  container.addEventListener('mouseenter', function () {
    _state.state.shouldAnimate = true;
    _state.state.inBounds = true;
  });
  container.addEventListener('mouseleave', function () {
    changeQuadrant(forces.nullForce);
    _state.state.inBounds = false;
  });
  container.addEventListener('mousemove', function (event) {
    var clientX = event.clientX,
        clientY = event.clientY;

    if (_state.state.inBounds) {
      calculateQuadrant(clientX, clientY);
      calculateLinesSpeed(clientX, clientY);
    }
  });
}

function changeQuadrant(newQuad) {
  var currentQuad = _state.state.force;

  if (currentQuad.quadrantName !== newQuad.quadrantName) {
    _state.state.prevForce = _state.state.force;
    _state.state.force = newQuad; // Dont calc offset on first enter

    if (!(_state.state.prevForce.quadrantName === 'nullForce')) {
      calculateOffset();
    }
  }
}

function calculateLinesSpeed(mouseX, mouseY) {
  var _container$getBoundin = container.getBoundingClientRect(),
      containerX = _container$getBoundin.x,
      containerY = _container$getBoundin.y;

  var localX = mouseX - containerX;
  var localY = mouseY - containerY;
  var linesToCalc = _state.state.modules[_state.state.force.axis];
  var currentDistanceToCenter = (0, _mathUtil.distance)(localX, localY, _state.state.center.X, _state.state.center.Y);
  var RatioFixedDistanceToCenter = currentDistanceToCenter * (_state.state.force.isVert ? 1 : _state.state.containerRatio);
  console.log(RatioFixedDistanceToCenter); //const minimumDistance = state.maxPossibleDistance * (1 - state.centerTolerance);

  var distanceToCenterModifier = (0, _mathUtil.map)(RatioFixedDistanceToCenter, 0, _state.state.maxPossibleDistance, 0, 1, true);
  linesToCalc.forEach(function (singleLine) {
    singleLine.speed = Math.round(_state.state.maxSpeed * distanceToCenterModifier * _state.state.force.direction);
  });
}

function calculateQuadrant(clientX, clientY) {
  var mouseX = (clientX - container.offsetLeft) * _state.state.containerRatio;
  var mouseY = clientY - container.offsetTop;

  if (mouseY > mouseX) {
    if (mouseX > _state.state.containerHeight - mouseY) {
      changeQuadrant(forces[quadrants.bot]);
    } else {
      changeQuadrant(forces[quadrants.left]);
    }
  } else {
    if (mouseX < _state.state.containerWidth * _state.state.containerRatio - mouseY) {
      changeQuadrant(forces[quadrants.top]);
    } else {
      changeQuadrant(forces[quadrants.right]);
    }
  }
}

function animationFrame() {
  if (_state.state.shouldAnimate) {
    setNewPositions(true);
  }

  _cssHandler.default.getAllCss();

  requestAnimationFrame(animationFrame);
}

function setNewPositions() {
  _state.state.allModules.forEach(function (singleModule) {
    if (!singleModule.isGhost) setModulePosition(singleModule);
  });

  _state.state.modules.x.forEach(function (singleLine) {
    singleLine.setGhostPosition();
  });

  _state.state.modules.y.forEach(function (singleLine) {
    singleLine.setGhostPosition();
  });
}

function setModulePosition(element) {
  var top = element.top,
      left = element.left;
  var bottom = element.getBottom();
  var right = element.getRight();
  var x = element.x,
      y = element.y;
  var outstandingAmmount = 0;
  element.compileFrameMovementVector(); // Bottoms

  if (element.frameMovementVector['top'] > 0) {
    outstandingAmmount = element.frameMovementVector['top'];

    if (top + outstandingAmmount >= _state.state.containerHeight) {
      shiftElement(getLine('y', x), element);
    } else if (bottom + outstandingAmmount > _state.state.containerHeight) {
      getLine('y', x).linkGhostToElement(element);
    }
  } // Top


  if (element.frameMovementVector['top'] < 0) {
    outstandingAmmount = element.frameMovementVector['top'];

    if (bottom + outstandingAmmount <= 0) {
      shiftElement(getLine('y', x), element);
    } else if (top + outstandingAmmount < 0) {
      getLine('y', x).linkGhostToElement(element);
    }
  } // Left


  if (element.frameMovementVector['left'] < 0) {
    outstandingAmmount = element.frameMovementVector['left'];

    if (right + outstandingAmmount <= 0) {
      shiftElement(getLine('x', y), element);
    } else if (left + outstandingAmmount < 0) {
      getLine('x', y).linkGhostToElement(element);
    }
  } // Right


  if (element.frameMovementVector['left'] > 0) {
    outstandingAmmount = element.frameMovementVector['left'];

    if (left + outstandingAmmount >= _state.state.containerWidth) {
      shiftElement(getLine('x', y), element);
    } else if (right + outstandingAmmount > _state.state.containerWidth) {
      getLine('x', y).linkGhostToElement(element);
    }
  }
}

function getLine(a, b) {
  return _state.state.modules[a][b];
}

function shiftElement(container, shiftedElement) {
  var ghost = container.ghost,
      contents = container.contents,
      _container$data = container.data,
      axis = _container$data.axis,
      inverseAxis = _container$data.inverseAxis;
  container.shiftLine(shiftedElement); // Assign to each element of the container its new correct position

  for (var i = 0; i < contents.length; i++) {
    contents[i][axis] = i;
    var inverseContainer = _state.state.modules[inverseAxis][i];
    inverseContainer.contents[ghost[inverseAxis]] = contents[i];
  }
}

function calculateOffset() {
  var axis = _state.state.prevForce.axis;
  var lines = _state.state.modules[axis];

  for (var e = 0; e < lines.length; e++) {
    var currentLine = lines[e];
    var moduleToCheck = currentLine.ghost;
    var negative = _state.state.prevForce.isVert ? moduleToCheck.top : moduleToCheck.left;
    var positive = _state.state.prevForce.isVert ? moduleToCheck.getBottom() : moduleToCheck.getRight();
    var containerSize = _state.state.prevForce.isVert ? _state.state.containerHeight : _state.state.containerWidth;
    var possibleValues = [0 - negative, 0 - positive, containerSize - negative, containerSize - positive]; // find smallest absolute size

    var ammount = possibleValues.sort(function (a, b) {
      return Math.abs(a) > Math.abs(b) ? 1 : -1;
    })[0];

    if (ammount) {
      for (var i = 0; i < currentLine.contents.length; i++) {
        var singleModule = currentLine.contents[i]; // Are we on a direction that has offset?

        singleModule.applyOffset(_state.state.force.position, 0);
        singleModule.applyOffset(_state.state.prevForce.position, ammount);
      }
    }
  }
}

(function () {
  window.modules = _state.state.modules;
  window.state = _state.state;
  setup();
  toggleDevMode();
  requestAnimationFrame(animationFrame);
})(); // TODO:
// 
// use getBoundingClientRect!!!!!!!!!!!
// Set new "active column" var
// general cleanup
// use foreachs whenever possible
//
//
//
//
//
},{"./module":"js/module.js","./line":"js/line.js","./cssHandler":"js/cssHandler.js","./const":"js/const.js","./state":"js/state.js","./mathUtil":"js/mathUtil.js"}],"C:/Users/Manuel/AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "50412" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["C:/Users/Manuel/AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","js/index.js"], null)
//# sourceMappingURL=/js.00a46daa.js.map