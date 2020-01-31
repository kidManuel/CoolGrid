/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./js/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./js/index.js":
/*!*********************!*\
  !*** ./js/index.js ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("const content = 'POSSIMADESIGNBOUTIQUEMODERNINTERACTIONIDENTITY';\nconst container = document.getElementById('visualContainer');\nconst modulePositions = document.getElementById('modulePositions');\nconst body = document.getElementsByTagName('body')[0];\nconst rowsAmmount = 3;\nlet columnsAmmount = 0;\nlet baseSpeed = 3;\nconst quadrants = {\n  bot: 'BOTTOM',\n  top: 'TOP',\n  left: 'LEFT',\n  right: 'RIGHT'\n};\nlet containerHeight = 0;\nlet containerWidth = 0;\nlet containerRatio = 0;\nlet moduleSize = 0;\nlet dynamicCss = '';\nlet shouldAnimate = false;\nlet force = {\n  position: null,\n  direction: null,\n  quadrant: null,\n  isVert: null,\n  axis: null,\n  inverse: null\n};\nlet modules = {\n  x: [],\n  y: []\n};\nlet horizontalForce = {\n  axis: 'x',\n  isVert: false,\n  position: 'left'\n};\nlet verticalForce = {\n  axis: 'y',\n  isVert: true,\n  position: 'top',\n  inverse: horizontalForce\n};\nhorizontalForce.inverse = verticalForce;\nlet allGhosts = [];\nlet allModules = []; //sanity\n\nlet hash = 0;\n\ngetNewHash = () => hash++;\n\nclass module {\n  constructor(x, y, isGhost = false) {\n    this.x = x;\n    this.y = y;\n    this.isGhost = isGhost;\n    this.id = `m${getNewHash()}${isGhost ? 'g' : ''}`;\n    this.top = y * moduleSize;\n    this.left = x * moduleSize;\n    this.domElement = this.createDomElement();\n  }\n\n  getRight() {\n    return this.left + moduleSize;\n  }\n\n  getBottom() {\n    return this.top + moduleSize;\n  }\n\n  createDomElement() {\n    const {\n      x,\n      y\n    } = this;\n    let newElement = document.createElement(\"div\");\n    newElement.className = \"module\";\n    newElement.id = this.id;\n    newElement.innerText = `\n        #${y * columnsAmmount + x}\n        x: ${x}, y:${y}\n        `;\n    return newElement;\n  }\n\n  getStyleString() {\n    return `#${this.id}{ top: ${this.top}px; left:${this.left}px; }`;\n  }\n\n}\n\nfunction updateForceTo(newForce, direction) {\n  const {\n    axis,\n    isVert,\n    position,\n    inverse\n  } = newForce;\n  force.axis = axis;\n  force.isVert = isVert;\n  force.position = position;\n  force.inverse = inverse;\n  force.direction = direction;\n}\n\nfunction prepContainer() {\n  containerHeight = Math.floor(container.offsetHeight / rowsAmmount) * rowsAmmount;\n  moduleSize = containerHeight / rowsAmmount;\n  columnsAmmount = Math.floor(container.offsetWidth / moduleSize);\n  containerWidth = columnsAmmount * moduleSize;\n  containerRatio = containerHeight / containerWidth;\n  container.style.height = `${containerHeight}px`;\n  container.style.width = `${containerWidth}px`;\n}\n\nfunction getColumns() {\n  let width = container.offsetWidth;\n  columnsAmmount = Math.floor(width * 1.1 / moduleSize);\n}\n\nfunction prepModules() {\n  const emptyLine = () => ({\n    contents: [],\n    isGhostActive: false,\n    ghost: null,\n    speed: 0,\n    debt: 0\n  }); //prep regualr modules\n\n\n  for (let i = 0; i < rowsAmmount; i++) {\n    modules.x[i] = emptyLine();\n\n    for (let e = 0; e < columnsAmmount; e++) {\n      if (i === 0) modules.y[e] = emptyLine();\n      let newElement = new module(e, i);\n      modules.x[i].contents[e] = newElement;\n      modules.y[e].contents[i] = newElement;\n      container.appendChild(newElement.domElement);\n      allModules.push(newElement);\n    }\n  } //prep ghosts\n\n\n  for (let i = 0; i < rowsAmmount; i++) {\n    const newGhost = new module(-1, i, true);\n    modules.x[i].ghost = newGhost;\n    container.appendChild(newGhost.domElement);\n    allGhosts.push(newGhost);\n  }\n\n  for (let e = 0; e < columnsAmmount; e++) {\n    const newGhost = new module(e, -1, true);\n    container.appendChild(newGhost.domElement);\n    modules.y[e].ghost = newGhost;\n    allGhosts.push(newGhost);\n  }\n}\n\nfunction createBaseCss() {\n  const baseCss = `\n    .module {\n        width: ${moduleSize}px;\n        height: ${moduleSize}px;\n    }`;\n  document.getElementById('baseCss').textContent = baseCss;\n}\n\nfunction setListeners() {\n  container.addEventListener('mouseenter', () => {\n    shouldAnimate = true;\n  });\n  container.addEventListener('mouseleave', () => {\n    shouldAnimate = false;\n    force.quadrant = null;\n    force.direction = null;\n    force.position = null;\n  });\n  container.addEventListener('mousemove', event => {\n    let mouseX = (event.clientX - container.offsetLeft) * containerRatio;\n    let mouseY = event.clientY - container.offsetTop;\n\n    if (mouseY > mouseX) {\n      if (mouseX > containerHeight - mouseY) {\n        updateForceTo(verticalForce, 1);\n        changeQuadrant(quadrants.bot);\n      } else {\n        updateForceTo(horizontalForce, -1);\n        changeQuadrant(quadrants.left);\n      }\n    } else {\n      if (mouseX < containerWidth * containerRatio - mouseY) {\n        updateForceTo(verticalForce, -1);\n        changeQuadrant(quadrants.top);\n      } else {\n        updateForceTo(horizontalForce, 1);\n        changeQuadrant(quadrants.right);\n      }\n    }\n  });\n}\n\nfunction changeQuadrant(newQuad) {\n  if (force.quadrant !== newQuad) {\n    force.quadrant = newQuad;\n  }\n}\n\nfunction animationFrame() {\n  if (shouldAnimate) {\n    collectCss(true);\n  }\n\n  animationId = requestAnimationFrame(animationFrame);\n}\n\nfunction initialModuleCssCollection() {\n  collectCss();\n}\n\nfunction collectCss(updatePosition = false) {\n  let newCss = '';\n  const all = [...allModules, ...allGhosts];\n  all.forEach(singleModule => {\n    if (updatePosition) setNewPosition(singleModule);\n    newCss += singleModule.getStyleString();\n  });\n  modulePositions.textContent = newCss;\n}\n\nfunction setNewPosition(element) {\n  const ammount = baseSpeed * force.direction;\n  element[force.position] += ammount;\n  const {\n    top,\n    left\n  } = element;\n  const bottom = top + moduleSize;\n  const right = left + moduleSize;\n\n  if (!element.isGhost) {\n    switch (force.quadrant) {\n      case quadrants.bot:\n        if (!modules.y[element.x].isGhostActive && // column doesn't already have an active ghost\n        bottom > containerHeight // module actually has gone too far\n        ) {\n            setGhost(element, modules.y[element.x]);\n            break;\n          }\n\n        if (top > containerHeight) {\n          shiftElement(element, modules.y[element.x]);\n          break;\n        }\n\n        break;\n\n      case quadrants.top:\n        if (!modules.y[element.x].isGhostActive && top < 0) {\n          setGhost(element, modules.y[element.x]);\n          break;\n        }\n\n        if (bottom < 0) {\n          shiftElement(element, modules.y[element.x]);\n          break;\n        }\n\n        break;\n\n      case quadrants.left:\n        if (!modules.x[element.y].isGhostActive && left < 0) {\n          setGhost(element, modules.x[element.y]);\n          break;\n        }\n\n        if (right < 0) {\n          shiftElement(element, modules.x[element.y]);\n          break;\n        }\n\n        break;\n\n      case quadrants.right:\n        if (!modules.x[element.y].isGhostActive && right > containerWidth) {\n          setGhost(element, modules.x[element.y]);\n          break;\n        }\n\n        if (left > containerWidth) {\n          shiftElement(element, modules.x[element.y]);\n          break;\n        }\n\n        break;\n\n      default:\n        break;\n    }\n  }\n}\n\nfunction setGhost(element, container) {\n  const {\n    ghost\n  } = container;\n\n  if (force.direction === 1) {\n    if (force.quadrant === quadrants.bot) {\n      ghost.top = 0 - (containerHeight - element.top + baseSpeed);\n    } else {\n      ghost.left = 0 - (containerWidth - element.left + baseSpeed);\n    }\n  } else {\n    if (force.quadrant === quadrants.top) {\n      ghost.top = containerHeight + element.top + baseSpeed;\n    } else {\n      ghost.left = containerWidth + element.left + baseSpeed;\n    }\n  } //ghost[force.position] = (force.isVert ? containerHeight : containerWidth) + (element[force.position] * force.direction * -1); \n\n\n  container.isGhostActive = true;\n  container.ghost.innerHTML = element.innerHTML; /////// CHECK THIS!!\n}\n\nfunction shiftElement(element, container) {\n  const oldGhost = container.ghost;\n  const {\n    contents\n  } = container;\n  const {\n    axis,\n    inverse\n  } = force;\n  const iAxis = inverse.axis;\n  container.isGhostActive = false;\n  container.ghost = element;\n  oldGhost.isGhost = false;\n  element.isGhost = true;\n  contents.splice(element[axis], 1); // remove old element from container since it is now a ghost\n\n  if (force.direction === 1) {\n    insertFirst(contents, oldGhost);\n  } else {\n    contents.push(oldGhost);\n  }\n\n  for (let i = 0; i < contents.length; i++) {\n    //debugger;\n    contents[i][axis] = i; // assign to each element of the container its new correct position\n\n    const xx = modules[iAxis][i];\n    if (xx === undefined) debugger;\n    xx.contents[oldGhost[iAxis]] = contents[i];\n  }\n}\n\nfunction getTargetLine(element) {\n  const axis = force.axisghostInv;\n  return modules[axis][element[axis]];\n}\n\nfunction insertFirst(moduleArray, moduleElement) {\n  moduleArray.splice(0, 0, moduleElement);\n}\n\n(() => {\n  prepContainer();\n  getColumns();\n  createBaseCss();\n  prepModules();\n  initialModuleCssCollection();\n  setListeners();\n  animationId = requestAnimationFrame(animationFrame);\n})(); // TODO:\n// \n// Set new \"active column\" var\n// general cleanup\n//\n//\n//\n//\n//\n//\n\n//# sourceURL=webpack:///./js/index.js?");

/***/ })

/******/ });